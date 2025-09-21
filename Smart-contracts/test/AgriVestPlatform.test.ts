import { expect } from "chai";
import hre from "hardhat";
const hreAny: any = hre;
import { parseEther } from "viem";

describe("AgriVestPlatform", function () {
  it("deploys and sets config", async function () {
  const [wallet] = await hreAny.viem.getWalletClients();
    const feeReceiver = wallet.account.address;
    const feeBps = 500n;
    const minInvestment = parseEther("10");

  const platform = await hreAny.viem.deployContract("AgriVestPlatform", [
      feeReceiver,
      feeBps,
      minInvestment,
    ]);

    const cfg = await platform.read.platformConfig();
  const chainId = await (await hreAny.viem.getPublicClient()).getChainId();

    // Tuple access fallback for older ABIs
    const platformFee = (cfg as any).platformFeePercentage ?? (cfg as any)[0];
    const minimumInvestmentRead = (cfg as any).minimumInvestment ?? (cfg as any)[1];

  expect(platform.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    expect(platformFee).to.equal(feeBps);
    expect(minimumInvestmentRead).to.equal(minInvestment);
    expect(chainId).to.be.a("number");
  });
});
