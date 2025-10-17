"use client";

import Image from "next/image";
import Button from "@/components/cta-button";
import { FaCheck, FaLocationArrow } from "react-icons/fa6";

function LiveBlockchinExplorerPage() {
  return (
    <main className="flex flex-col gap-y-5 p-5 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">farmer dashboard</h2>
          <p className="text-btn-secondary">
            Manage your farm profile, projects, and investor updates
          </p>
        </div>
        <div className="space-x-5">
          <Button variant="secondary" cta={() => {}} style="px-6 py-2">
            Notifications
          </Button>

          <Button cta={() => {}} style="px-4 py-2">
            view smart contracts
          </Button>
        </div>
      </div>
      <section className="bg-card-background py-2 px-16">
        <div className="border-2 border-blue-500">
          <h3>farm profile</h3>
          <div className="flex items-center gap-x-40 py-5">
            {/* <Image src={""} alt="" /> */}
            <div className="w-20 h-20 rounded-full bg-red-500"></div>
            <div className="flex justify-center gap-x-8">
              <div className="flex items-end">
                <div className="text-btn-secondary bg-primary px-2 py-1 rounded-full border-[1.5px] border-btn-secondary">
                  <FaCheck />
                </div>
              </div>
              <div className="capitalize text-stone-500 font-medium">
                <h2 className="text-black">Miguel Rogriguez</h2>
                <p className="text-sm">organic coffee plantation</p>
                <div className="flex items-center gap-x-2.5 text-sm ">
                  <FaLocationArrow className="text-btn-primary" />
                  <span>chiapas, mexico</span>
                </div>
                <div className="capitalize text-primary-background space-x-10 text-sm">
                  <span>verified</span>
                  <span>Organic certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 border-blue-500 py-2.5">
          <h4 className="">verification status</h4>
          <div className="flex items-center justify-between capitalize text-sm">
            <div className="flex flex-col gap-y-.5 text-stone-500 font-medium">
              <p>KYC verification</p>
              <p>farm documentation</p>
              <p>bank account</p>
            </div>
            <div className="flex flex-col gap-y-.5 text-btn-primary">
              <p>completed</p>
              <p>verified</p>
              <p>connected</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-card-background py-2 px-16">
        <h3>farm details</h3>
        <div className="">
          <div className="">
            <p className="capitalize text-sm font-medium">farm type</p>
            <div className="bg-btn-secondary w-full rounded-[1.5rem] px-5 py-2.5 text-card-background h-3.5"></div>
          </div>
          <div className="">
            <p className="capitalize text-sm font-medium">farm size</p>
            <div className=""></div>
          </div>
          <div className="">
            <p className="capitalize text-sm font-medium">farming experience</p>
            <div className=""></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LiveBlockchinExplorerPage;
