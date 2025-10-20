import Link from "next/link";

import Pagination from "@/components/pagination";

import { FaBook, FaChartLine, FaTractor } from "react-icons/fa6";
import { MdEditDocument } from "react-icons/md";
import FundAllocation from "@/components/fund-allocation";
import MonthlyPayouts from "@/components/monthly-payouts";

function LiveBlockchainExplorerPage() {
  const faqs = {
    securityAndTransparent: [
      {
        question: "How are my funds secured on the platform",
        answer:
          "All funds are managed through audited smart contracts that operate on the Ethereum blockchain. These contracts have undergone rigorous security audits by Certik and ChainSecurity. Funds are only released according to predefined milestones that both farmers and investors agree upon.",
      },
      {
        question: "Can I verify transactions myself?",
        answer:
          "Yes, all transacrions are publicly visible on the blockchain. You can use our explorer above or check directy on Etherscan using the contract addresss. Every investment, milestone completion, and payout is recorded transparently.",
      },
      {
        question: "What happens if a farming project fails?",
        answer:
          "Our smart contracts include contingency measures. if predefined miestones aren't met, remaining funds can be returned to investors proportionally. Each project also maintains a reserve fund to mitigate risks from natural disasters or unexpected events.",
      },
    ],
    smartContractModel: [
      {
        question: "How does the smart contract distribute returns?",
        answer:
          "Our smart contracts automatically distribute returns based on predefined ratios: 65% to farmers, 24% to investors, 7% as platform fees, and 3% to our community development fund. These distibutions happen when harvest milestones are verified and confirmed.",
      },
      {
        question: "Who verifies the real-world farming progress?",
        answer:
          "We use a combination of IoT devices, satelite imagery, and local verification partners to confirm farming milestones. This data is fed into our oracle system which then triggers the appropriate smart contract functions.",
      },
      {
        question: "Can the smart contract code be modified?",
        answer:
          "The core functionality of deployed contracts cannot be modified, ensuring that the terms agreed upon at investment time remain unchanged. However, we use a proxy pattern that alows us to fix critical bugs while maintaining all balances and state information.",
      },
    ],
  };

  return (
    <main className="flex flex-col gap-y-10 px-16 py-8">
      <div className="w-[60%]">
        <h2 className="text-2xl w-fit">smart contract transparency</h2>
        <p className="text-lg">
          Real-time blockchain explorer showing how our platform ensures
          security, transparency, and fair distribution of funds between farmers
          and investors.
        </p>
      </div>
      <section className="grid grid-cols-[1fr_25rem] gap-x-5">
        <div>
          <div>
            <div className="flex flex-col justify-center gap-y-5">
              <div className="bg-card-background p-6 rounded-lg space-y-5">
                <h3 className="text-xl">Live transaction explorer</h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-stone-500 space-x-10">
                      <th className="text-start">transaction hash</th>
                      <th className="text-start">block</th>
                      <th className="text-start">from</th>
                      <th className="text-start">to</th>
                      <th className="text-start">value</th>
                      <th className="text-start">time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-4 divide-btn-secondary">
                    {Array.from("agrvst", (_, i) => (
                      <tr
                        key={i}
                        className="pt-2.5 last-of-type:border-b-4 last-of-type:border-btn-secondary"
                      >
                        <td className="pt-3 pb-1.5">
                          lorem ipsum dolor sit amet
                        </td>
                        <td className="pt-3 pb-1.5">lorem ipsum dolor</td>
                        <td className="pt-3 pb-1.5">lorem ipsum</td>
                        <td className="pt-3 pb-1.5">lorem</td>
                        <td className="text-primary-background font-semibold pt-3 pb-1.5">
                          lorem
                        </td>
                        <td className="pt-3 pb-1.5">2 mins ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between">
                  <p className="text-stone-500">
                    Showing latest 5 transactions of 10543 total
                  </p>
                  <Pagination />
                </div>
              </div>
              <div className="flex justify-between items-center gap-x-5">
                <div
                  role="presentation"
                  className="bg-card-background py-6 rounded-lg w-full"
                >
                  <FundAllocation />
                </div>
                <div
                  role="presentation"
                  className="bg-card-background py-6 rounded-lg w-full"
                >
                  <MonthlyPayouts />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="bg-card-background p-5 rounded-lg space-y-5">
            <h3 className="text-primary-background text-lg">
              smart contract details
            </h3>
            <div className="text-md">
              <p className="capitalize font-medium">contract address:</p>
              <p className="text-primary-background">
                Lorem ipsum dolor sit amet consectetur
              </p>
            </div>
            <div className="text-md">
              <p className="capitalize font-medium">network:</p>
              <p className="text-primary-background">Ethereum Market</p>
            </div>
            <div className="text-md">
              <p className="capitalize font-medium">total value locked</p>
              <p className="text-primary-background">$43325678.45</p>
            </div>
            <div className="text-md">
              <p className="capitalize font-medium">last audit:</p>
              <p className="text-primary-background">June 15, 2023 by Certik</p>
            </div>
            <Link href={""} className="text-primary-background font-semibold">
              View Contract on Etherscan
            </Link>
          </div>
          <div className="bg-card-background p-5 rounded-lg space-y-5">
            <h3>quick links</h3>
            <Link
              href="/investor-dashboard"
              className="flex items-center gap-x-4 px-4"
            >
              <FaChartLine className="text-primary" />
              <div className="">
                <p className="capitalize font-medium">Investor dashboard</p>
                <p>Track your investments and returns</p>
              </div>
            </Link>
            <Link
              href="/farmer-dashboard"
              className="flex items-center gap-x-4 px-4"
            >
              <FaTractor className="text-primary" />
              <div className="">
                <p className="capitalize font-medium">Farmer dashboard</p>
                <p>Manage your farm projects and funding</p>
              </div>
            </Link>
            <Link
              href="/audit-reports"
              className="flex items-center gap-x-4 px-4"
            >
              <MdEditDocument className="text-primary" />
              <div className="">
                <p className="capitalize font-medium">audit reports</p>
                <p>Security audits by third parties</p>
              </div>
            </Link>
            <Link
              href="/documentation"
              className="flex items-center gap-x-4 px-4"
            >
              <FaBook className="text-primary" />
              <div className="">
                <p className="capitalize font-medium">Documentation</p>
                <p>Technical details and API references</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl w-fit">frequently asked questions</h2>
        <div className="flex justify-between items-center gap-x-8 mt-5">
          <div className="bg-card-background space-y-2 p-4 rounded-md">
            <h3 className="capitalize text-xl">security & transparency</h3>
            <div className="space-y-5">
              {faqs.securityAndTransparent.map((security) => (
                <div key={security.question} className="space-y-1.5">
                  <p className="font-medium text-md">{security.question}</p>
                  <p>{security.answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card-background space-y-2 p-4 rounded-md">
            <h3 className="capitalize text-xl">smart contract model</h3>
            <div className="space-y-5">
              {faqs.smartContractModel.map((smart) => (
                <div key={smart.question} className="space-y-1.5">
                  <p className="font-medium text-md">{smart.question}</p>
                  <p>{smart.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LiveBlockchainExplorerPage;
