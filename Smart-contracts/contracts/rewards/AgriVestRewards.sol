// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IHederaTokenService.sol";

/**
 * @title AgriVestRewards
 * @dev Manages reward distribution for AgriVest platform using HTS tokens
 * @notice Handles loyalty rewards, staking, and yield farming for investors
 */
contract AgriVestRewards is AccessControl, ReentrancyGuard {
    using SafeMath for uint256;

    IHederaTokenService constant HTS = IHederaTokenService(address(uint160(0x167)));
    
    bytes32 public constant REWARD_ADMIN = keccak256("REWARD_ADMIN");
    bytes32 public constant PLATFORM_CONTRACT = keccak256("PLATFORM_CONTRACT");

    // Reward token configuration
    struct RewardToken {
        address tokenAddress;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 rewardRate; // Tokens per HBAR per second
        bool isActive;
        uint256 createdAt;
    }

    // Staking pool for investors
    struct StakingPool {
        uint256 poolId;
        address rewardToken;
        uint256 stakingDuration; // Minimum staking period
        uint256 apy; // Annual percentage yield in basis points
        uint256 totalStaked;
        uint256 totalRewards;
        bool isActive;
        uint256 createdAt;
    }

    // User stake information
    struct UserStake {
        uint256 amount;
        uint256 stakingTimestamp;
        uint256 poolId;
        uint256 accumulatedRewards;
        bool isActive;
    }

    // Reward distribution tracking
    struct RewardDistribution {
        uint256 projectId;
        address investor;
        uint256 investmentAmount;
        uint256 rewardAmount;
        uint256 distributedAt;
        address rewardToken;
    }

    // Storage
    RewardToken public agrivestToken;
    mapping(uint256 => StakingPool) public stakingPools;
    mapping(address => mapping(uint256 => UserStake)) public userStakes; // user => poolId => stake
    mapping(address => uint256[]) public userStakingPools; // user => poolIds
    mapping(address => uint256) public userRewardBalance; // user => accumulated rewards
    mapping(uint256 => RewardDistribution[]) public projectRewards; // projectId => distributions
    
    uint256 public totalStakingPools;
    uint256 public totalRewardsDistributed;
    bool public rewardsEnabled;

    // Events
    event RewardTokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 totalSupply
    );

    event StakingPoolCreated(
        uint256 indexed poolId,
        address indexed rewardToken,
        uint256 stakingDuration,
        uint256 apy
    );

    event TokensStaked(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount,
        uint256 timestamp
    );

    event TokensUnstaked(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount,
        uint256 rewards
    );

    event RewardsDistributed(
        uint256 indexed projectId,
        address indexed investor,
        uint256 rewardAmount,
        address rewardToken
    );

    event RewardsClaimed(
        address indexed user,
        uint256 amount,
        address rewardToken
    );

    constructor(address _platformContract) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REWARD_ADMIN, msg.sender);
        _grantRole(PLATFORM_CONTRACT, _platformContract);
        
        rewardsEnabled = true;
    }

    /**
     * @dev Create AgriVest reward token using HTS
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _initialSupply Initial token supply
     * @param _memo Token memo/description
     */
    function createRewardToken(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        string memory _memo
    ) external onlyRole(REWARD_ADMIN) returns (address) {
        require(agrivestToken.tokenAddress == address(0), "Reward token already exists");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_symbol).length > 0, "Symbol required");
        require(_initialSupply > 0, "Initial supply required");

        // Prepare token keys (empty for simplicity)
        IHederaTokenService.TokenKey[] memory tokenKeys;

        // Prepare token expiry (no expiry)
        IHederaTokenService.Expiry memory expiry = IHederaTokenService.Expiry({
            second: 0,
            autoRenewAccount: address(0),
            autoRenewPeriod: 0
        });

        // Create HTS token
        IHederaTokenService.HederaToken memory token = IHederaTokenService.HederaToken({
            name: _name,
            symbol: _symbol,
            treasury: address(this),
            memo: _memo,
            tokenSupplyType: true, // INFINITE
            maxSupply: 0,
            freezeDefault: false,
            tokenKeys: tokenKeys,
            expiry: expiry
        });

        (int256 responseCode, address tokenAddress) = HTS.createFungibleToken(
            token,
            _initialSupply,
            8 // 8 decimals
        );

        require(responseCode == 22, "Token creation failed");

        // Store token information
        agrivestToken = RewardToken({
            tokenAddress: tokenAddress,
            name: _name,
            symbol: _symbol,
            totalSupply: _initialSupply,
            rewardRate: 1e15, // Default: 0.001 tokens per HBAR per second
            isActive: true,
            createdAt: block.timestamp
        });

        emit RewardTokenCreated(tokenAddress, _name, _symbol, _initialSupply);
        return tokenAddress;
    }

    /**
     * @dev Create a new staking pool
     * @param _stakingDuration Minimum staking duration in seconds
     * @param _apy Annual percentage yield in basis points
     */
    function createStakingPool(
        uint256 _stakingDuration,
        uint256 _apy
    ) external onlyRole(REWARD_ADMIN) returns (uint256) {
        require(agrivestToken.tokenAddress != address(0), "Reward token not created");
        require(_stakingDuration >= 1 days, "Minimum 1 day staking");
        require(_apy <= 50000, "APY too high"); // Max 500%

        uint256 poolId = totalStakingPools;
        totalStakingPools = totalStakingPools.add(1);

        stakingPools[poolId] = StakingPool({
            poolId: poolId,
            rewardToken: agrivestToken.tokenAddress,
            stakingDuration: _stakingDuration,
            apy: _apy,
            totalStaked: 0,
            totalRewards: 0,
            isActive: true,
            createdAt: block.timestamp
        });

        emit StakingPoolCreated(
            poolId,
            agrivestToken.tokenAddress,
            _stakingDuration,
            _apy
        );

        return poolId;
    }

    /**
     * @dev Stake HBAR in a staking pool
     * @param _poolId Staking pool ID
     */
    function stakeHBAR(uint256 _poolId) external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_poolId < totalStakingPools, "Invalid pool");
        require(rewardsEnabled, "Rewards disabled");

        StakingPool storage pool = stakingPools[_poolId];
        require(pool.isActive, "Pool not active");

        UserStake storage userStake = userStakes[msg.sender][_poolId];
        
        if (userStake.amount == 0) {
            userStakingPools[msg.sender].push(_poolId);
            userStake.poolId = _poolId;
            userStake.stakingTimestamp = block.timestamp;
        } else {
            // Calculate and add pending rewards
            uint256 pendingRewards = calculateStakingRewards(msg.sender, _poolId);
            userStake.accumulatedRewards = userStake.accumulatedRewards.add(pendingRewards);
        }

        userStake.amount = userStake.amount.add(msg.value);
        userStake.isActive = true;
        userStake.stakingTimestamp = block.timestamp; // Reset staking timer

        pool.totalStaked = pool.totalStaked.add(msg.value);

        emit TokensStaked(msg.sender, _poolId, msg.value, block.timestamp);
    }

    /**
     * @dev Unstake HBAR from a staking pool
     * @param _poolId Staking pool ID
     * @param _amount Amount to unstake
     */
    function unstakeHBAR(uint256 _poolId, uint256 _amount) external nonReentrant {
        require(_poolId < totalStakingPools, "Invalid pool");
        require(_amount > 0, "Amount must be greater than 0");

        StakingPool storage pool = stakingPools[_poolId];
        UserStake storage userStake = userStakes[msg.sender][_poolId];

        require(userStake.amount >= _amount, "Insufficient staked amount");
        require(
            block.timestamp >= userStake.stakingTimestamp.add(pool.stakingDuration),
            "Staking period not completed"
        );

        // Calculate rewards
        uint256 stakingRewards = calculateStakingRewards(msg.sender, _poolId);
        uint256 totalRewards = userStake.accumulatedRewards.add(stakingRewards);

        // Update balances
        userStake.amount = userStake.amount.sub(_amount);
        userStake.accumulatedRewards = 0;
        pool.totalStaked = pool.totalStaked.sub(_amount);
        
        if (userStake.amount == 0) {
            userStake.isActive = false;
        }

        // Transfer staked HBAR back to user
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "HBAR transfer failed");

        // Distribute reward tokens
        if (totalRewards > 0) {
            _distributeRewardTokens(msg.sender, totalRewards);
        }

        emit TokensUnstaked(msg.sender, _poolId, _amount, totalRewards);
    }

    /**
     * @dev Distribute rewards to investor for project investment
     * @param _projectId Project ID
     * @param _investor Investor address
     * @param _investmentAmount Investment amount in HBAR
     */
    function distributeInvestmentRewards(
        uint256 _projectId,
        address _investor,
        uint256 _investmentAmount
    ) external onlyRole(PLATFORM_CONTRACT) {
        require(rewardsEnabled, "Rewards disabled");
        require(_investor != address(0), "Invalid investor");
        require(_investmentAmount > 0, "Invalid investment amount");

        if (agrivestToken.tokenAddress == address(0)) {
            return; // No reward token created yet
        }

        // Calculate reward amount based on investment
        uint256 rewardAmount = _investmentAmount
            .mul(agrivestToken.rewardRate)
            .div(1e18); // Convert from wei to standard units

        if (rewardAmount > 0) {
            // Mint reward tokens to investor
            _mintRewardTokens(_investor, rewardAmount);

            // Record distribution
            projectRewards[_projectId].push(RewardDistribution({
                projectId: _projectId,
                investor: _investor,
                investmentAmount: _investmentAmount,
                rewardAmount: rewardAmount,
                distributedAt: block.timestamp,
                rewardToken: agrivestToken.tokenAddress
            }));

            userRewardBalance[_investor] = userRewardBalance[_investor].add(rewardAmount);
            totalRewardsDistributed = totalRewardsDistributed.add(rewardAmount);

            emit RewardsDistributed(_projectId, _investor, rewardAmount, agrivestToken.tokenAddress);
        }
    }

    /**
     * @dev Calculate staking rewards for a user
     * @param _user User address
     * @param _poolId Pool ID
     * @return Calculated rewards
     */
    function calculateStakingRewards(address _user, uint256 _poolId) public view returns (uint256) {
        UserStake memory userStake = userStakes[_user][_poolId];
        if (!userStake.isActive || userStake.amount == 0) {
            return 0;
        }

        StakingPool memory pool = stakingPools[_poolId];
        uint256 stakingDuration = block.timestamp.sub(userStake.stakingTimestamp);
        
        // Calculate rewards based on APY
        uint256 annualRewards = userStake.amount.mul(pool.apy).div(10000);
        uint256 rewards = annualRewards.mul(stakingDuration).div(365 days);

        return rewards;
    }

    /**
     * @dev Mint reward tokens to a user
     * @param _to Recipient address
     * @param _amount Amount to mint
     */
    function _mintRewardTokens(address _to, uint256 _amount) internal {
        require(agrivestToken.tokenAddress != address(0), "Reward token not created");
        
        // Associate token with recipient if not already associated
        HTS.associateToken(_to, agrivestToken.tokenAddress);
        
        // Mint tokens
        bytes[] memory metadata;
        (int256 responseCode, , ) = HTS.mintToken(
            agrivestToken.tokenAddress,
            _amount,
            metadata
        );
        
        require(responseCode == 22, "Token minting failed");
        
        // Transfer tokens to recipient
        int256 transferResponse = HTS.transferToken(
            agrivestToken.tokenAddress,
            address(this),
            _to,
            _amount
        );
        
        require(transferResponse == 22, "Token transfer failed");
    }

    /**
     * @dev Distribute reward tokens to user
     * @param _to Recipient address
     * @param _amount Amount to distribute
     */
    function _distributeRewardTokens(address _to, uint256 _amount) internal {
        if (_amount > 0 && agrivestToken.tokenAddress != address(0)) {
            _mintRewardTokens(_to, _amount);
            emit RewardsClaimed(_to, _amount, agrivestToken.tokenAddress);
        }
    }

    /**
     * @dev Update reward rate
     * @param _newRate New reward rate
     */
    function updateRewardRate(uint256 _newRate) external onlyRole(REWARD_ADMIN) {
        require(_newRate > 0, "Invalid reward rate");
        agrivestToken.rewardRate = _newRate;
    }

    /**
     * @dev Enable/disable rewards
     * @param _enabled Whether rewards are enabled
     */
    function setRewardsEnabled(bool _enabled) external onlyRole(REWARD_ADMIN) {
        rewardsEnabled = _enabled;
    }

    // View functions
    function getUserStakingPools(address _user) external view returns (uint256[] memory) {
        return userStakingPools[_user];
    }

    function getProjectRewards(uint256 _projectId) external view returns (RewardDistribution[] memory) {
        return projectRewards[_projectId];
    }

    function getUserRewardBalance(address _user) external view returns (uint256) {
        return userRewardBalance[_user];
    }

    function getStakingPool(uint256 _poolId) external view returns (StakingPool memory) {
        return stakingPools[_poolId];
    }

    function getUserStake(address _user, uint256 _poolId) external view returns (UserStake memory) {
        return userStakes[_user][_poolId];
    }
}