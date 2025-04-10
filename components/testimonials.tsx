"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote:
        "We have been working with Positivus for the past year and have seen a significant increase in traffic and sales. The team is very professional and responsive to our needs.",
      author: "John Smith",
      position: "Marketing Director at XYZ Corp",
    },
    {
      quote:
        "Positivus has been a great partner for our business. They helped us improve our online presence and increase our revenue through targeted digital marketing campaigns.",
      author: "Sarah Johnson",
      position: "CEO at ABC Company",
    },
    {
      quote:
        "The team at Positivus is exceptional. They took the time to understand our business and created a customized strategy that delivered real results.",
      author: "Michael Williams",
      position: "Founder of Tech Startup",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-24 bg-[#191A23] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say About Our Digital Marketing Services
          </h2>
        </div>

        <div className="relative">
          <Card className="border-none bg-[#191A23] text-white">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#B9FF66] text-[#B9FF66]" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl mb-6">"{testimonials[activeIndex].quote}"</blockquote>
                  <div>
                    <p className="font-bold">{testimonials[activeIndex].author}</p>
                    <p className="text-white/60">{testimonials[activeIndex].position}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-white/20 hover:border-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-[#B9FF66]" : "bg-white/20"}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-white/20 hover:border-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

