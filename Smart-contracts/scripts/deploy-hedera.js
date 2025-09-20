const { ethers } = require("hardhat");
const { Client, AccountId, PrivateKey, ContractCreateTransaction, FileCreateTransaction, Hbar } = require("@hashgraph/sdk");

/**
 * Deployment script for AgriVest platform on Hedera Hashgraph
 * This script handles both testnet and mainnet deployments
 */

async function main() {
    console.log(" Starting AgriVest Platform deployment on Hedera...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    // Check if we're on Hedera network
    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId);
    
    if (network.chainId !== 296 && network.chainId !== 295) {
        console.warn("⚠️  Warning: Not deploying on Hedera network!");
        console.log("Hedera Testnet Chain ID: 296");
        console.log("Hedera Mainnet Chain ID: 295");
    }

    // Platform configuration for Hedera
    const platformConfig = {
        feeReceiver: deployer.address, // Platform fee receiver
        platformFeePercentage: 500, // 5% platform fee
        minimumInvestment: ethers.utils.parseEther("10"), // 10 HBAR minimum
    };

    console.log("📋 Platform Configuration:");
    console.log("- Fee Receiver:", platformConfig.feeReceiver);
    console.log("- Platform Fee:", platformConfig.platformFeePercentage / 100, "%");
    console.log("- Minimum Investment:", ethers.utils.formatEther(platformConfig.minimumInvestment), "HBAR");

    // Deploy main platform contract
    console.log("\n🚀 Deploying AgriVestPlatform...");
    const AgriVestPlatform = await ethers.getContractFactory("AgriVestPlatform");
    
    const platform = await AgriVestPlatform.deploy(
        platformConfig.feeReceiver,
        platformConfig.platformFeePercentage,
        platformConfig.minimumInvestment,
        {
            gasLimit: 3000000 // Hedera gas limit
        }
    );

    await platform.deployed();
    console.log("✅ AgriVestPlatform deployed to:", platform.address);

    // Deploy rewards contract
    console.log("\n🎁 Deploying AgriVestRewards...");
    const AgriVestRewards = await ethers.getContractFactory("AgriVestRewards");
    
    const rewards = await AgriVestRewards.deploy(platform.address, {
        gasLimit: 2500000
    });

    await rewards.deployed();
    console.log("✅ AgriVestRewards deployed to:", platform.address);

    // Setup roles and permissions
    console.log("\n🔐 Setting up roles and permissions...");
    
    // Grant PLATFORM_CONTRACT role to rewards contract
    const PLATFORM_CONTRACT_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PLATFORM_CONTRACT"));
    await rewards.grantRole(PLATFORM_CONTRACT_ROLE, platform.address);
    console.log("✅ Granted PLATFORM_CONTRACT role to platform");

    // Create reward token
    console.log("\n🪙 Creating AgriVest reward token...");
    try {
        const createTokenTx = await rewards.createRewardToken(
            "AgriVest Token",
            "AGRI",
            ethers.utils.parseUnits("1000000", 8), // 1M tokens with 8 decimals
            "AgriVest platform reward token",
            {
                gasLimit: 1000000
            }
        );
        await createTokenTx.wait();
        console.log("✅ AgriVest reward token created");
    } catch (error) {
        console.log("⚠️  Reward token creation failed (this is normal on some networks):", error.message);
    }

    // Create initial staking pools
    console.log("\n💰 Creating staking pools...");
    try {
        // 30-day pool with 10% APY
        const pool1Tx = await rewards.createStakingPool(
            30 * 24 * 60 * 60, // 30 days
            1000, // 10% APY
            {
                gasLimit: 500000
            }
        );
        await pool1Tx.wait();
        console.log("✅ Created 30-day staking pool (10% APY)");

        // 90-day pool with 25% APY
        const pool2Tx = await rewards.createStakingPool(
            90 * 24 * 60 * 60, // 90 days
            2500, // 25% APY
            {
                gasLimit: 500000
            }
        );
        await pool2Tx.wait();
        console.log("✅ Created 90-day staking pool (25% APY)");

        // 365-day pool with 50% APY
        const pool3Tx = await rewards.createStakingPool(
            365 * 24 * 60 * 60, // 365 days
            5000, // 50% APY
            {
                gasLimit: 500000
            }
        );
        await pool3Tx.wait();
        console.log("✅ Created 365-day staking pool (50% APY)");
    } catch (error) {
        console.log("⚠️  Staking pool creation failed:", error.message);
    }

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    
    const totalProjects = await platform.getTotalProjects();
    const platformConfigResult = await platform.platformConfig();
    const rewardsEnabled = await rewards.rewardsEnabled();
    
    console.log("- Total projects:", totalProjects.toString());
    console.log("- Platform fee percentage:", platformConfigResult.platformFeePercentage.toString());
    console.log("- Minimum investment:", ethers.utils.formatEther(platformConfigResult.minimumInvestment), "HBAR");
    console.log("- Rewards enabled:", rewardsEnabled);

    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: network.chainId,
        deployer: deployer.address,
        contracts: {
            AgriVestPlatform: platform.address,
            AgriVestRewards: rewards.address
        },
        configuration: {
            feeReceiver: platformConfig.feeReceiver,
            platformFeePercentage: platformConfig.platformFeePercentage,
            minimumInvestment: platformConfig.minimumInvestment.toString()
        },
        deployedAt: new Date().toISOString(),
        gasUsed: {
            platform: "~3,000,000",
            rewards: "~2,500,000"
        }
    };

    console.log("\n📄 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Save to file
    const fs = require('fs');
    const deploymentPath = `deployments/${network.name}-${Date.now()}.json`;
    
    if (!fs.existsSync('deployments')) {
        fs.mkdirSync('deployments');
    }
    
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);

    // Hedera-specific instructions
    console.log("\n🔗 Hedera Integration Instructions:");
    console.log("1. Use HashConnect wallet for frontend integration");
    console.log("2. Implement @hashgraph/sdk for HTS token operations");
    console.log("3. Use Hedera Mirror Node API for transaction history");
    console.log("4. Consider implementing Hedera Consensus Service for audit trails");
    
    console.log("\n🎉 AgriVest Platform successfully deployed on Hedera!");
    console.log("Platform Address:", platform.address);
    console.log("Rewards Address:", rewards.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });