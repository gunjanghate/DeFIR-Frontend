"use client"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Services } from "@/components/services"
import RotatingText from "@/RotatingText/RotatingText";
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { useEffect } from "react"
import { useComplaintStore } from '../lib/stores/complaintStore'
import ClickSpark from "@/ClickSpark/ClickSpark";

export default function Home() {
  const fetchComplaints = useComplaintStore((state: { fetchComplaints: () => void }) => state.fetchComplaints)

  useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])
  return (
    <div className="min-h-screen min-w-screen font-poppins bg-gradient-to-bl from-green-200 via-white to-green-600">
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.5}
          duration={2}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
            <ClickSpark
              sparkColor='#28f118'
              sparkSize={20}
              sparkRadius={25}
              sparkCount={10}
              duration={500}
            >
        {/* <Navbar /> */}
        <main className="pb-20">
          <Hero />
          <Services />
          <ContactSection />
        </main>
        {/* <Footer /> */}
    </ClickSpark>
      </div>
  )
}

