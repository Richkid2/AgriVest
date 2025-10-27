// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IHederaTokenService.sol";

/**
 * @title AgriVestPlatform
 * @dev Main platform contract for AgriVest - Hedera Hashgraph optimized
 * @notice Handles farm project creation, investments, escrow, and milestone management
 * @dev Uses HBAR for payments and HTS for potential token rewards
 */
contract AgriVestPlatform is AccessControl, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    IHederaTokenService constant HTS = IHederaTokenService(address(uint160(0x167)));

    bytes32 public constant PLATFORM_ADMIN = keccak256("PLATFORM_ADMIN");
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    Counters.Counter private _projectIds;

    struct PlatformConfig {
        uint256 platformFeePercentage;
        uint256 minimumInvestment;
        uint256 maximumProjectDuration;
        address payable feeReceiver;
        bool emergencyMode;
    }

    PlatformConfig public platformConfig;

    enum ProjectStatus {
        Draft,
        Active,
        Funded,
        InProgress,
        Completed,
        Failed,
        Cancelled
    }

    enum MilestoneStatus {
        Pending,
        Completed,
        Approved,
        Rejected
    }
    
    struct FarmProject {
        uint256 id;
        address payable farmer;
        string metadataURI;
        uint256 fundingGoal;
        uint256 totalRaised;
        uint256 deadline;
        uint256 projectDuration;
        uint256 expectedROI;
        ProjectStatus status;
        uint256 createdAt;
        uint256 fundedAt;
        bool isHederaVerified;
        address htsRewardToken;
    }

    struct Milestone {
        uint256 id;
        uint256 projectId;
        string description;
        uint256 fundingPercentage;
        uint256 targetDate;
        MilestoneStatus status;
        string evidenceURI;
        uint256 approvedAt;
        address approvedBy;
    }

    struct Investment {
        address investor;
        uint256 projectId;
        uint256 amount;
        uint256 timestamp;
        bool refunded;
        uint256 rewardsEarned;
    }

    mapping(uint256 => FarmProject) public projects;
    mapping(uint256 => Milestone[]) public projectMilestones;
    mapping(uint256 => mapping(address => uint256)) public investorBalances;
    mapping(uint256 => address[]) public projectInvestors;
    mapping(address => uint256[]) public userInvestments;
    mapping(uint256 => uint256) public projectEscrowBalance;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed farmer,
        uint256 fundingGoal,
        uint256 deadline,
        string metadataURI
    );

    event InvestmentMade(
        uint256 indexed projectId,
        address indexed investor,
        uint256 amount,
        uint256 totalRaised
    );

    event ProjectFunded(
        uint256 indexed projectId,
        uint256 totalAmount,
        uint256 timestamp
    );

    event MilestoneCreated(
        uint256 indexed projectId,
        uint256 indexed milestoneId,
        string description,
        uint256 fundingPercentage
    );

    event MilestoneCompleted(
        uint256 indexed projectId,
        uint256 indexed milestoneId,
        address indexed approver,
        uint256 fundsReleased
    );

    event FundsReleased(
        uint256 indexed projectId,
        address indexed farmer,
        uint256 amount,
        uint256 platformFee
    );

    event RefundProcessed(
        uint256 indexed projectId,
        address indexed investor,
        uint256 amount
    );

    event PlatformConfigUpdated(
        uint256 newFeePercentage,
        uint256 newMinInvestment,
        address newFeeReceiver
    );

    event HederaTokenAssociated(
        uint256 indexed projectId,
        address indexed tokenAddress,
        address indexed farmer
    );

    constructor(
        address payable _feeReceiver,
        uint256 _platformFeePercentage,
        uint256 _minimumInvestment
    ) {
        require(_feeReceiver != address(0), "Invalid fee receiver");
        require(_platformFeePercentage <= 2000, "Fee too high");
        require(_minimumInvestment > 0, "Invalid minimum investment");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PLATFORM_ADMIN, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);

        platformConfig = PlatformConfig({
            platformFeePercentage: _platformFeePercentage,
            minimumInvestment: _minimumInvestment,
            maximumProjectDuration: 365 days * 2,
            feeReceiver: _feeReceiver,
            emergencyMode: false
        });
    }

    function createProject(
        string memory _metadataURI,
        uint256 _fundingGoal,
        uint256 _duration,
        uint256 _expectedROI,
        address _htsRewardToken
    ) external whenNotPaused returns (uint256) {
        require(bytes(_metadataURI).length > 0, "Metadata URI required");
        require(_fundingGoal >= platformConfig.minimumInvestment.mul(10), "Funding goal too low");
        require(_duration <= platformConfig.maximumProjectDuration, "Duration too long");
        require(_expectedROI <= 10000, "ROI too high");

        _projectIds.increment();
        uint256 newProjectId = _projectIds.current();

        projects[newProjectId] = FarmProject({
            id: newProjectId,
            farmer: payable(msg.sender),
            metadataURI: _metadataURI,
            fundingGoal: _fundingGoal,
            totalRaised: 0,
            deadline: block.timestamp + 30 days,
            projectDuration: _duration,
            expectedROI: _expectedROI,
            status: ProjectStatus.Active,
            createdAt: block.timestamp,
            fundedAt: 0,
            isHederaVerified: false,
            htsRewardToken: _htsRewardToken
        });

        if (!hasRole(FARMER_ROLE, msg.sender)) {
            _grantRole(FARMER_ROLE, msg.sender);
        }

        if (_htsRewardToken != address(0)) {
            _associateHederaToken(newProjectId, _htsRewardToken);
        }

        emit ProjectCreated(
            newProjectId,
            msg.sender,
            _fundingGoal,
            block.timestamp + 30 days,
            _metadataURI
        );

        return newProjectId;
    }

    /**
     * @dev Invest in a farm project with HBAR - Hedera native payment
     * @param _projectId Project to invest in
     */
    function investInProject(uint256 _projectId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(msg.value >= platformConfig.minimumInvestment, "Investment too low");
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        
        FarmProject storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        require(block.timestamp <= project.deadline, "Funding deadline passed");
        require(
            project.totalRaised.add(msg.value) <= project.fundingGoal.mul(120).div(100),
            "Exceeds 120% of funding goal"
        );
        
        // Record investment
        if (investorBalances[_projectId][msg.sender] == 0) {
            projectInvestors[_projectId].push(msg.sender);
            userInvestments[msg.sender].push(_projectId);
        }
        
        investorBalances[_projectId][msg.sender] = investorBalances[_projectId][msg.sender].add(msg.value);
        project.totalRaised = project.totalRaised.add(msg.value);
        projectEscrowBalance[_projectId] = projectEscrowBalance[_projectId].add(msg.value);
        
        emit InvestmentMade(_projectId, msg.sender, msg.value, project.totalRaised);
        
        // Check if funding goal reached
        if (project.totalRaised >= project.fundingGoal) {
            project.status = ProjectStatus.Funded;
            project.fundedAt = block.timestamp;
            emit ProjectFunded(_projectId, project.totalRaised, block.timestamp);
        }
    }

    /**
     * @dev Create milestone for funded project
     * @param _projectId Project ID
     * @param _description Milestone description
     * @param _fundingPercentage Percentage of funds to release (basis points)
     * @param _targetDate Target completion date
     */
    function createMilestone(
        uint256 _projectId,
        string memory _description,
        uint256 _fundingPercentage,
        uint256 _targetDate
    ) external {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        FarmProject storage project = projects[_projectId];
        require(msg.sender == project.farmer || hasRole(PLATFORM_ADMIN, msg.sender), "Unauthorized");
        require(project.status == ProjectStatus.Funded || project.status == ProjectStatus.InProgress, "Invalid status");
        require(_fundingPercentage <= 10000, "Invalid percentage");
        require(_targetDate > block.timestamp, "Invalid target date");
        require(bytes(_description).length > 0, "Description required");
        
        uint256 milestoneId = projectMilestones[_projectId].length;
        
        projectMilestones[_projectId].push(Milestone({
            id: milestoneId,
            projectId: _projectId,
            description: _description,
            fundingPercentage: _fundingPercentage,
            targetDate: _targetDate,
            status: MilestoneStatus.Pending,
            evidenceURI: "",
            approvedAt: 0,
            approvedBy: address(0)
        }));
        
        if (project.status == ProjectStatus.Funded) {
            project.status = ProjectStatus.InProgress;
        }
        
        emit MilestoneCreated(_projectId, milestoneId, _description, _fundingPercentage);
    }

    /**
     * @dev Submit milestone completion evidence
     * @param _projectId Project ID
     * @param _milestoneId Milestone ID
     * @param _evidenceURI IPFS hash of completion evidence
     */
    function submitMilestoneEvidence(
        uint256 _projectId,
        uint256 _milestoneId,
        string memory _evidenceURI
    ) external {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        FarmProject storage project = projects[_projectId];
        require(msg.sender == project.farmer, "Only farmer can submit");
        require(_milestoneId < projectMilestones[_projectId].length, "Invalid milestone");
        require(bytes(_evidenceURI).length > 0, "Evidence URI required");
        
        Milestone storage milestone = projectMilestones[_projectId][_milestoneId];
        require(milestone.status == MilestoneStatus.Pending, "Milestone not pending");
        
        milestone.evidenceURI = _evidenceURI;
        milestone.status = MilestoneStatus.Completed;
    }

    /**
     * @dev Approve milestone and release funds - Admin function
     * @param _projectId Project ID
     * @param _milestoneId Milestone ID
     */
    function approveMilestone(uint256 _projectId, uint256 _milestoneId) 
        external 
        onlyRole(PLATFORM_ADMIN)
        nonReentrant 
    {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        require(_milestoneId < projectMilestones[_projectId].length, "Invalid milestone");
        
        FarmProject storage project = projects[_projectId];
        Milestone storage milestone = projectMilestones[_projectId][_milestoneId];
        
        require(milestone.status == MilestoneStatus.Completed, "Milestone not completed");
        require(projectEscrowBalance[_projectId] > 0, "No funds in escrow");
        
        // Calculate funds to release
        uint256 releaseAmount = project.totalRaised.mul(milestone.fundingPercentage).div(10000);
        uint256 platformFee = releaseAmount.mul(platformConfig.platformFeePercentage).div(10000);
        uint256 farmerAmount = releaseAmount.sub(platformFee);
        
        require(projectEscrowBalance[_projectId] >= releaseAmount, "Insufficient escrow balance");
        
        // Update balances
        projectEscrowBalance[_projectId] = projectEscrowBalance[_projectId].sub(releaseAmount);
        milestone.status = MilestoneStatus.Approved;
        milestone.approvedAt = block.timestamp;
        milestone.approvedBy = msg.sender;
        
        // Transfer funds using Hedera native transfers
        (bool farmerSuccess, ) = project.farmer.call{value: farmerAmount}("");
        require(farmerSuccess, "Farmer transfer failed");
        
        if (platformFee > 0) {
            (bool feeSuccess, ) = platformConfig.feeReceiver.call{value: platformFee}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        emit MilestoneCompleted(_projectId, _milestoneId, msg.sender, releaseAmount);
        emit FundsReleased(_projectId, project.farmer, farmerAmount, platformFee);
        
        // Check if all milestones completed
        _checkProjectCompletion(_projectId);
    }

    /**
     * @dev Process refund for failed or cancelled project
     * @param _projectId Project ID to refund
     */
    function processRefund(uint256 _projectId) external nonReentrant {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        FarmProject storage project = projects[_projectId];
        
        require(
            project.status == ProjectStatus.Failed || 
            project.status == ProjectStatus.Cancelled ||
            (project.status == ProjectStatus.Active && block.timestamp > project.deadline),
            "Project not eligible for refund"
        );
        
        uint256 investmentAmount = investorBalances[_projectId][msg.sender];
        require(investmentAmount > 0, "No investment to refund");
        require(projectEscrowBalance[_projectId] >= investmentAmount, "Insufficient escrow balance");
        
        // Reset investment balance
        investorBalances[_projectId][msg.sender] = 0;
        projectEscrowBalance[_projectId] = projectEscrowBalance[_projectId].sub(investmentAmount);
        
        // Process refund
        (bool success, ) = payable(msg.sender).call{value: investmentAmount}("");
        require(success, "Refund transfer failed");
        
        emit RefundProcessed(_projectId, msg.sender, investmentAmount);
    }

    /**
     * @dev Associate HTS token with project - Hedera specific
     * @param _projectId Project ID
     * @param _tokenAddress HTS token address
     */
    function _associateHederaToken(uint256 _projectId, address _tokenAddress) internal {
        FarmProject storage project = projects[_projectId];
        
        // Call Hedera Token Service to associate token
        int256 response = HTS.associateToken(project.farmer, _tokenAddress);
        require(response == 22, "Token association failed"); // SUCCESS response code
        
        emit HederaTokenAssociated(_projectId, _tokenAddress, project.farmer);
    }

    /**
     * @dev Check if project is completed and update status
     * @param _projectId Project ID to check
     */
    function _checkProjectCompletion(uint256 _projectId) internal {
        Milestone[] storage milestones = projectMilestones[_projectId];
        bool allApproved = true;
        
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].status != MilestoneStatus.Approved) {
                allApproved = false;
                break;
            }
        }
        
        if (allApproved && milestones.length > 0) {
            projects[_projectId].status = ProjectStatus.Completed;
        }
    }

    /**
     * @dev Update platform configuration - Admin only
     * @param _newFeePercentage New platform fee percentage
     * @param _newMinInvestment New minimum investment amount
     * @param _newFeeReceiver New fee receiver address
     */
    function updatePlatformConfig(
        uint256 _newFeePercentage,
        uint256 _newMinInvestment,
        address payable _newFeeReceiver
    ) external onlyRole(PLATFORM_ADMIN) {
        require(_newFeePercentage <= 2000, "Fee too high");
        require(_newMinInvestment > 0, "Invalid minimum investment");
        require(_newFeeReceiver != address(0), "Invalid fee receiver");
        
        platformConfig.platformFeePercentage = _newFeePercentage;
        platformConfig.minimumInvestment = _newMinInvestment;
        platformConfig.feeReceiver = _newFeeReceiver;
        
        emit PlatformConfigUpdated(_newFeePercentage, _newMinInvestment, _newFeeReceiver);
    }

    /**
     * @dev Emergency pause - Emergency role only
     */
    function emergencyPause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
        platformConfig.emergencyMode = true;
    }

    /**
     * @dev Emergency unpause - Emergency role only
     */
    function emergencyUnpause() external onlyRole(EMERGENCY_ROLE) {
        _unpause();
        platformConfig.emergencyMode = false;
    }

    // View functions for frontend integration

    /**
     * @dev Get project details
     * @param _projectId Project ID
     * @return Full project details
     */
    function getProject(uint256 _projectId) external view returns (FarmProject memory) {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        return projects[_projectId];
    }

    /**
     * @dev Get project milestones
     * @param _projectId Project ID
     * @return Array of milestones
     */
    function getProjectMilestones(uint256 _projectId) external view returns (Milestone[] memory) {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        return projectMilestones[_projectId];
    }

    /**
     * @dev Get investor balance for project
     * @param _projectId Project ID
     * @param _investor Investor address
     * @return Investment amount
     */
    function getInvestorBalance(uint256 _projectId, address _investor) external view returns (uint256) {
        return investorBalances[_projectId][_investor];
    }

    /**
     * @dev Get total number of projects
     * @return Total project count
     */
    function getTotalProjects() external view returns (uint256) {
        return _projectIds.current();
    }

    /**
     * @dev Get project investors
     * @param _projectId Project ID
     * @return Array of investor addresses
     */
    function getProjectInvestors(uint256 _projectId) external view returns (address[] memory) {
        require(_projectId > 0 && _projectId <= _projectIds.current(), "Invalid project");
        return projectInvestors[_projectId];
    }

    /**
     * @dev Get user investments
     * @param _user User address
     * @return Array of project IDs user invested in
     */
    function getUserInvestments(address _user) external view returns (uint256[] memory) {
        return userInvestments[_user];
    }

    /**
     * @dev Get project escrow balance
     * @param _projectId Project ID
     * @return Current escrow balance
     */
    function getProjectEscrowBalance(uint256 _projectId) external view returns (uint256) {
        return projectEscrowBalance[_projectId];
    }

    /**
     * @dev Receive function to handle direct HBAR transfers
     */
    receive() external payable {
        revert("Use investInProject function");
    }

  
    fallback() external payable {
        revert("Function not found");
    }
}