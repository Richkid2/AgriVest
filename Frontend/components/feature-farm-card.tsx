import Image from "next/image";

import Button from "./cta-button";
import { FaLeaf, FaLocationArrow, FaRegCalendarTimes } from "react-icons/fa";
import { Progress } from "./ui/progress";

type FeatureFarmCardProps = {
  image?: string;
  farm: string;
  bio: string;
  location: string;
  duration: string;
  cropType: string;
  expectedReturns: number;
  fundingProgress: number;
};

function FeatureFarmCard({
  // image,
  farm,
  bio,
  location,
  duration,
  cropType,
  expectedReturns,
  fundingProgress,
}: FeatureFarmCardProps) {
  return (
    <div key={cropType} className="bg-card-background rounded-md">
      <Image
        src={"/hero-image.png"}
        alt={`${farm},${location}`}
        width={300}
        height={200}
        priority
        className="object-cover rounded-md"
      />
      <div className="p-5 flex flex-col gap-y-8">
        <div className="">
          <div className="flex justify-between items-center">
            <h3 className="text-lg capitalize">{farm}</h3>
            <span className="text-primary-background font-semibold">
              {expectedReturns}% ROI
            </span>
          </div>
          <p className="text-stone-600 mt-5">{bio}</p>
        </div>
        <div className="flex justify-between items-center text-stone-600">
          <div className="flex justify-between items-center gap-x-2">
            <span>
              <FaRegCalendarTimes />
            </span>
            <span>{duration}</span>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            <span>
              <FaLocationArrow />
            </span>
            <span>{location}</span>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            <span>
              <FaLeaf />
            </span>
            <span>{cropType}</span>
          </div>
        </div>
        <div className="">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-stone-600 capitalize ">funding progress</p>
            <p className="text-btn-primary font-semibold">{fundingProgress}%</p>
          </div>
          <Progress value={fundingProgress} />
          <Button
            href="/farm"
            style="py-2 mt-4 w-full inline-block text-center"
          >
            view farm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FeatureFarmCard;
