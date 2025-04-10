'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import RotatingText from "@/RotatingText/RotatingText";
import Spline from '@splinetool/react-spline'; // ✅ client-safe
import { RainbowButton } from "./magicui/rainbow-button";
import { useEffect } from "react";
import { AnimatedBeamDemo } from "./ui/AnimatedBeamDemo";
import { ButtonColorful } from "@/components/ui/button-colorful"
import { LucideIcon } from "lucide-react"

export function Hero() {
  return (
    <section className="py-16 md:py-0 relative overflow-hidden">
      <div className="container mx-auto pt-12 md:pt-40 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <div>
              <div className="text-4xl md:text-5xl lg:text-5xl font-bold bg-gradient-to-r from-green-900 via-black to-green-800 text-transparent bg-clip-text">
              Raise Your Complaint — Trust the Chain to Tell the Truth.
              </div>
              <RotatingText
                texts={['Secure.', 'Transparent.', 'Decentralized.', 'Tamperproof']}
                mainClassName="px-2 sm:px-2 md:px-3 md:mt-4 mb-4 bg-gradient-to-r from-green-600 to-black/80 font-bold w-64 text-4xl text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.005}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
            </div>
            <p className="text-lg text-[#191A23]/80 mb-8 font-medium">
              Take control of your rights by filing complaints on a platform built for fairness and accountability.
              Track every step with confidence — no corruption, no manipulation, just truth on the chain.
            </p>
            <Link href="/complaints/new">
              <button className="bg-transparent text-black hover:bg-green-700 hover:text-white text-xl border-2 hover:scale-105 transition-all duration-300 border-green-800 font-bold p-2 rounded-lg" >
                File a Complaint
              </button>
             {/* <ButtonColorful /> */}
            </Link>
          </div>

          <div className="flex-1 relative">
                <AnimatedBeamDemo 
                             />
          </div>
        </div>
      </div>
    </section>
  );
}
