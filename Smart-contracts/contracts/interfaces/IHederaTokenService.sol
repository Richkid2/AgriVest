// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

/**
 * @title IHederaTokenService
 * @dev Interface for Hedera Token Service precompiled contract
 * @notice This interface provides access to HTS functionality on Hedera
 */
interface IHederaTokenService {

    /**
     * @dev Associates the provided account with the provided tokens
     * @param account The account to be associated with the provided tokens
     * @param tokens The tokens to be associated with the provided account
     * @return responseCode The response code for the operation
     */
    function associateTokens(address account, address[] memory tokens) external returns (int256 responseCode);

    /**
     * @dev Associates the provided account with the provided token
     * @param account The account to be associated with the provided token
     * @param token The token to be associated with the provided account
     * @return responseCode The response code for the operation
     */
    function associateToken(address account, address token) external returns (int256 responseCode);

    /**
     * @dev Dissociates the provided account from the provided token
     * @param account The account to be dissociated from the provided token
     * @param token The token to be dissociated from the provided account
     * @return responseCode The response code for the operation
     */
    function dissociateToken(address account, address token) external returns (int256 responseCode);

    /**
     * @dev Dissociates the provided account from the provided tokens
     * @param account The account to be dissociated from the provided tokens
     * @param tokens The tokens to be dissociated from the provided account
     * @return responseCode The response code for the operation
     */
    function dissociateTokens(address account, address[] memory tokens) external returns (int256 responseCode);

    /**
     * @dev Creates a new token
     * @param token The token to be created
     * @return responseCode The response code for the operation
     * @return tokenAddress The address of the created token
     */
    function createFungibleToken(
        HederaToken memory token,
        uint256 initialTotalSupply,
        uint256 decimals
    ) external payable returns (int256 responseCode, address tokenAddress);

    /**
     * @dev Mints tokens to the treasury account
     * @param token The token for which to mint tokens
     * @param amount The amount of tokens to mint
     * @param metadata Metadata associated with the mint operation
     * @return responseCode The response code for the operation
     * @return newTotalSupply The new total supply of the token
     * @return serialNumbers The serial numbers of the minted tokens (for NFTs)
     */
    function mintToken(
        address token,
        uint256 amount,
        bytes[] memory metadata
    ) external returns (int256 responseCode, uint256 newTotalSupply, int64[] memory serialNumbers);

    /**
     * @dev Burns tokens from the treasury account
     * @param token The token for which to burn tokens
     * @param amount The amount of tokens to burn
     * @param serialNumbers The serial numbers of the tokens to burn (for NFTs)
     * @return responseCode The response code for the operation
     * @return newTotalSupply The new total supply of the token
     */
    function burnToken(
        address token,
        uint256 amount,
        int64[] memory serialNumbers
    ) external returns (int256 responseCode, uint256 newTotalSupply);

    /**
     * @dev Transfers tokens from one account to another
     * @param token The token to transfer
     * @param sender The account to transfer from
     * @param receiver The account to transfer to
     * @param amount The amount to transfer
     * @return responseCode The response code for the operation
     */
    function transferToken(
        address token,
        address sender,
        address receiver,
        uint256 amount
    ) external returns (int256 responseCode);

    /**
     * @dev Transfers tokens from one account to another using an allowance
     * @param token The token to transfer
     * @param sender The account to transfer from
     * @param receiver The account to transfer to
     * @param amount The amount to transfer
     * @return responseCode The response code for the operation
     */
    function transferFrom(
        address token,
        address sender,
        address receiver,
        uint256 amount
    ) external returns (int256 responseCode);

    /**
     * @dev Approves an allowance for a spender
     * @param token The token for which to approve an allowance
     * @param spender The account to approve the allowance for
     * @param amount The amount of the allowance
     * @return responseCode The response code for the operation
     */
    function approve(
        address token,
        address spender,
        uint256 amount
    ) external returns (int256 responseCode);

    /**
     * @dev Gets the allowance for a spender
     * @param token The token to check the allowance for
     * @param owner The owner of the tokens
     * @param spender The spender to check the allowance for
     * @return responseCode The response code for the operation
     * @return allowance The allowance amount
     */
    function allowance(
        address token,
        address owner,
        address spender
    ) external view returns (int256 responseCode, uint256 allowance);

    /**
     * @dev Gets the balance of an account for a token
     * @param token The token to check the balance for
     * @param account The account to check the balance for
     * @return responseCode The response code for the operation
     * @return balance The balance of the account
     */
    function getTokenBalance(
        address token,
        address account
    ) external view returns (int256 responseCode, uint256 balance);

    /**
     * @dev Gets information about a token
     * @param token The token to get information for
     * @return responseCode The response code for the operation
     * @return tokenInfo The information about the token
     */
    function getTokenInfo(address token) external view returns (int256 responseCode, TokenInfo memory tokenInfo);

    /**
     * @dev Struct representing a Hedera token
     */
    struct HederaToken {
        string name;
        string symbol;
        address treasury;
        string memo;
        bool tokenSupplyType; // true for INFINITE, false for FINITE
        uint256 maxSupply;
        bool freezeDefault;
        TokenKey[] tokenKeys;
        Expiry expiry;
    }

    /**
     * @dev Struct representing token information
     */
    struct TokenInfo {
        HederaToken token;
        uint256 totalSupply;
        bool deleted;
        bool defaultKycStatus;
        bool pauseStatus;
        FixedFee[] fixedFees;
        FractionalFee[] fractionalFees;
        RoyaltyFee[] royaltyFees;
        string ledgerId;
    }

    /**
     * @dev Struct representing a token key
     */
    struct TokenKey {
        uint256 keyType;
        bytes key;
    }

    /**
     * @dev Struct representing token expiry
     */
    struct Expiry {
        uint256 second;
        address autoRenewAccount;
        uint256 autoRenewPeriod;
    }

    /**
     * @dev Struct representing a fixed fee
     */
    struct FixedFee {
        uint256 amount;
        address tokenId;
        bool useHbarsForPayment;
        bool useCurrentTokenForPayment;
        address feeCollector;
    }

    /**
     * @dev Struct representing a fractional fee
     */
    struct FractionalFee {
        uint256 numerator;
        uint256 denominator;
        uint256 minimumAmount;
        uint256 maximumAmount;
        bool netOfTransfers;
        address feeCollector;
    }

    /**
     * @dev Struct representing a royalty fee
     */
    struct RoyaltyFee {
        uint256 numerator;
        uint256 denominator;
        uint256 amount;
        address tokenId;
        bool useHbarsForPayment;
        address feeCollector;
    }
}