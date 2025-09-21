import hre from "hardhat";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import {
  JsonRpcProvider,
  Wallet,
  ContractFactory,
  parseEther,
  parseUnits,
} from "ethers";

async function main() {
  const argv = process.argv;
  const idx = argv.indexOf("--network");
  const cliNetwork = idx !== -1 && argv[idx + 1] ? argv[idx + 1] : undefined;
  const networkName = cliNetwork || process.env.HARDHAT_NETWORK || "hardhat";
  const netCfg: any = (hre as any).config?.networks?.[networkName];
  const rpcUrl = (
    networkName === "hederaTestnet"
      ? (process.env.HEDERA_TESTNET_RPC_URL || "https://testnet.hashio.io/api")
      : networkName === "hederaMainnet"
      ? (process.env.HEDERA_MAINNET_RPC_URL || "https://mainnet.hashio.io/api")
      : (typeof netCfg?.url === "string" ? (netCfg.url as string) : "http://127.0.0.1:8545")
  );
  if (!rpcUrl) {
    throw new Error(
      `No RPC URL for network '${networkName}'. Use --network hederaTestnet or configure a network with 'url'.`
    );
  }
  const provider = new JsonRpcProvider(rpcUrl);
  const net = await provider.getNetwork();
  const chainId = Number(net.chainId);
  console.log("RPC:", rpcUrl);
  console.log("Chain ID:", chainId);
  if (chainId !== 296 && chainId !== 295) {
    console.warn("Warning: Not deploying on Hedera (295/296)");
  }

  const platformFeePercentage = BigInt(process.env.PLATFORM_FEE_BPS || "500");
  const minimumInvestment = parseEther(process.env.MIN_INVESTMENT_HBAR || "10");
  // Load private key from env based on network
  const pickKey = () => {
    if (networkName === "hederaTestnet") return process.env.HEDERA_TESTNET_PRIVATE_KEY || "";
    if (networkName === "hederaMainnet") return process.env.HEDERA_MAINNET_PRIVATE_KEY || "";
    return process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY || "";
  };
  const rawKey = pickKey().trim();
  const pk = rawKey.startsWith("0x") ? rawKey : (rawKey ? `0x${rawKey}` : "");
  if (!/^0x[0-9a-fA-F]{64}$/.test(pk)) {
    throw new Error("Missing/invalid private key in env. Provide 0x + 64 hex characters.");
  }
  const wallet = new Wallet(pk, provider);
  const feeReceiver = (process.env.FEE_RECEIVER && process.env.FEE_RECEIVER !== "")
    ? process.env.FEE_RECEIVER
    : wallet.address;

  console.log("Platform config:", {
    feeReceiver,
    platformFeePercentage: Number(platformFeePercentage) / 100,
    minimumInvestment: minimumInvestment.toString(),
  });

  console.log("\nDeploying AgriVestPlatform...");
  const platArtifact = await hre.artifacts.readArtifact("AgriVestPlatform");
  const PlatformFactory = new ContractFactory(platArtifact.abi, platArtifact.bytecode, wallet);
  const platform = await PlatformFactory.deploy(feeReceiver, platformFeePercentage, minimumInvestment);
  const platformAddress = await platform.getAddress();
  await platform.deploymentTransaction()?.wait();
  console.log("AgriVestPlatform:", platformAddress);

  console.log("\nDeploying AgriVestRewards...");
  const rewArtifact = await hre.artifacts.readArtifact("AgriVestRewards");
  const RewardsFactory = new ContractFactory(rewArtifact.abi, rewArtifact.bytecode, wallet);
  const rewards = await RewardsFactory.deploy(platformAddress);
  const rewardsAddress = await rewards.getAddress();
  await rewards.deploymentTransaction()?.wait();
  console.log("AgriVestRewards:", rewardsAddress);

  console.log("\nCreating reward token (optional)...");
  try {
  const tx = await (rewards as any).createRewardToken(
      "AgriVest Token",
      "AGRI",
      parseUnits("1000000", 8),
      "AgriVest platform reward token"
    );
    await tx.wait();
    console.log("Reward token created");
  } catch (e: any) {
    console.warn("Skipping reward token creation:", e?.message ?? e);
  }

  console.log("\nCreating sample staking pools (optional)...");
  try {
    const poolParams: Array<[bigint, bigint]> = [
      [30n * 24n * 60n * 60n, 1000n],
      [90n * 24n * 60n * 60n, 2500n],
      [365n * 24n * 60n * 60n, 5000n],
    ];
    for (const [dur, apy] of poolParams) {
  const tx = await (rewards as any).createStakingPool(dur, apy);
      await tx.wait();
      console.log("Pool created:", { durationDays: Number(dur / 86400n), apy: Number(apy) / 100 });
    }
  } catch (e: any) {
    console.warn("Skipping pool creation:", e?.message ?? e);
  }

  const totalProjects = await (platform as any).getTotalProjects();
  const cfg = await (platform as any).platformConfig();
  console.log("\nVerification:", {
    totalProjects: totalProjects.toString(),
    platformFeePercentage: (cfg as any).platformFeePercentage?.toString?.() ?? (cfg as any)[0]?.toString?.(),
    minimumInvestment: (cfg as any).minimumInvestment?.toString?.() ?? (cfg as any)[1]?.toString?.(),
  });

  const summary = {
    chainId,
    deployer: wallet.address,
    contracts: {
      AgriVestPlatform: platformAddress,
      AgriVestRewards: rewardsAddress,
    },
    config: {
      feeReceiver,
      platformFeePercentage: platformFeePercentage.toString(),
      minimumInvestment: minimumInvestment.toString(),
    },
    timestamp: new Date().toISOString(),
  };

  if (!existsSync("deployments")) mkdirSync("deployments");
  const file = `deployments/hedera-${chainId}-${Date.now()}.json`;
  writeFileSync(file, JSON.stringify(summary, null, 2));
  console.log("\nSaved deployment:", file);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
