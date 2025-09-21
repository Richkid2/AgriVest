import hre from "hardhat";
import { JsonRpcProvider, Contract } from "ethers";

async function main() {
  const rpc = process.env.HEDERA_TESTNET_RPC_URL || "https://testnet.hashio.io/api";
  const platformAddr = process.env.PLATFORM_ADDRESS || "0xA55C1617bDe31d17743434D19cf44D8cFe0E2FB4";

  const provider = new JsonRpcProvider(rpc);
  const artifact = await hre.artifacts.readArtifact("AgriVestPlatform");
  const platform = new Contract(platformAddr, artifact.abi, provider);

  const totalProjects = await platform.getTotalProjects();
  const cfg = await platform.platformConfig();
  const feeBps = (cfg as any).platformFeePercentage?.toString?.() ?? (cfg as any)[0]?.toString?.();
  const minInvest = (cfg as any).minimumInvestment?.toString?.() ?? (cfg as any)[1]?.toString?.();

  console.log("Platform:", platformAddr);
  console.log("Total projects:", totalProjects.toString());
  console.log("Fee BPS:", feeBps);
  console.log("Min Investment:", minInvest);
}

main().catch((e) => { console.error(e); process.exit(1); });
