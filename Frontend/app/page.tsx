import Link from "next/link";
import Image from "next/image";

import Button from "@/components/cta-button";
import Card from "@/components/card";
import FeatureFarmCard from "@/components/feature-farm-card";
import ImpactMetricCard from "@/components/impact-metric-card";

import {
  FaBriefcase,
  FaChartLine,
  FaCoins,
  FaPeopleGroup,
  FaTractor,
} from "react-icons/fa6";

const cards = [
  {
    icon: <FaCoins />,
    title: "Fund Farms with Crypto",
    summary:
      "Invest your cryptocurrency in vetted agricultural projects. Choose farms based on location, crop type, and expected returns.",
  },
  {
    icon: <FaTractor />,
    title: "Farmers use capital",
    summary:
      "Farmers recieve fnding to purchase seeds, equipment, and resources needed for successful crop production.",
  },
  {
    icon: <FaChartLine />,
    title: "track progress & earn",
    summary:
      "Monitor farm progress through regular updates and blockchain verification. Receive returns after successful harvest.",
  },
];

const featuredFarms = [
  {
    image: "",
    farm: "colombian coffee farm",
    bio: "Sustainable coffee production in the highlands of Colombia. Funding equipment upgrades and organic certification.",
    location: "Colombia",
    duration: "8 months",
    cropType: "coffee",
    expectedReturns: 12,
    fundingProgress: 75,
  },
  {
    image: "",
    farm: "hydroponic vegetable farm",
    bio: "Tech-forward hydroponic farm producing leafy greens year-round with 90% less water usage than traditional farming.",
    location: "Netherlands",
    duration: "6 months",
    cropType: "vegetables",
    expectedReturns: 15,
    fundingProgress: 92,
  },
  {
    image: "",
    farm: "regenerative grain farm",
    bio: "Large-scale regenerative agriculture project focusing on soil health and sustainable grain production.",
    location: "USA",
    duration: "12 months",
    cropType: "grains",
    expectedReturns: 10,
    fundingProgress: 45,
  },
];

const impactMetrics = [
  { icon: <FaPeopleGroup />, title: "farmers funded", value: "1,250+" },
  { icon: <FaBriefcase />, title: "jobs created", value: "3,800+" },
  { icon: <FaCoins />, title: "total capital invested", value: "$12.5M" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col divide-btn-secondary divide-y-2">
      <section className="flex flex-col gap-y-10">
        <div className="flex gap-x-20 py-16 pl-16 pr-24">
          <div className="flex flex-col gap-y-16">
            <div>
              <h1 className="text-[3rem]">
                Invest in Farming with Crypto. Earn Real-World Returns.
              </h1>
              <p className="text-[1.2rem]">
                Connect traditional agriculture with blockchain technology. Fund
                sustainable farming projects and track your investment from seed
                to harvest.
              </p>
            </div>
            <div className="space-x-5">
              <Button href="/farms" style="px-6 py-4">
                explore farms
              </Button>

              <Button variant="secondary" href="/get-started" style="px-7 py-4">
                Get started
              </Button>
            </div>
          </div>
          <Image
            src="/hero-image.png"
            alt="Agrivest Hero"
            height={500}
            width={500}
            className="bg-[#566f36]"
            priority
          />
        </div>
        <div id="how-it-works">
          <div className="p-16 pb-10 w-full mx-auto text-center">
            <div className="w-[50%] mx-auto">
              <p className="text-[1rem]">
                Our platform conects crypto investors with real-world farming
                projects through a transparent, blockchain-based system.
              </p>
              <h2 className="capitalize text-[1.5rem] mt-0.5">how it works</h2>
            </div>
            <div className="mt-5 flex justify-center items-center gap-x-5">
              {cards.map((card, index) => (
                <Card
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  index={index}
                  summary={card.summary}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="p-16 pt-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="capitalize text-[1.5rem]">Featured Farms</h2>
          <Link href="/farms" className="capitalize text-btn-primary">
            View all farms
          </Link>
        </div>
        <div className="mt-5 flex justify-center items-center gap-x-5">
          {featuredFarms.map((farm) => (
            <FeatureFarmCard
              key={farm.cropType}
              image={farm.image}
              farm={farm.farm}
              bio={farm.bio}
              location={farm.location}
              duration={farm.duration}
              cropType={farm.cropType}
              expectedReturns={farm.expectedReturns}
              fundingProgress={farm.fundingProgress}
            />
          ))}
        </div>
      </section>
      <section className="p-16">
        <h2 className="capitalize text-[1.5rem] w-fit mx-auto text-center">
          our impact
        </h2>
        <div className="mt-5 flex justify-between items-center gap-x-5">
          {impactMetrics.map((metric) => (
            <ImpactMetricCard
              key={metric.title}
              icon={metric.icon}
              title={metric.title}
              value={metric.value}
            />
          ))}
        </div>
        <div className="flex gap-x-20 py-16 pr-10">
          <div className="flex flex-col gap-y-24">
            <div className="flex flex-col gap-y-8">
              <h2 className="capitalize text-[1.8rem]">
                Ready to grow your crypto while supporting sustainable
                agriculture?
              </h2>
              <p className="text-lg">
                Join thousands of investors who are making a difference in
                global food systems while earning competitive returns.
              </p>
            </div>
            <div className="space-x-5 ">
              <Button href="/farms" style="p-4">
                browse farms
              </Button>

              <Button variant="secondary" href="/get-started" style="p-4">
                Learn more
              </Button>
            </div>
          </div>
          <Image
            src="/hero-image.png"
            alt="Agrivest Hero"
            height={500}
            width={500}
            className="bg-[#566f36]"
            priority
          />
        </div>
      </section>
    </main>
  );
}
