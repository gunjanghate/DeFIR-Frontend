import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export function CaseStudies() {
  const caseStudies = [
    {
      title: "For a B2B software company, we",
      description:
        "Developed a targeted SEO strategy that resulted in a 200% increase in organic traffic and a 150% increase in qualified leads.",
      bgColor: "bg-[#191A23]",
      textColor: "text-white",
    },
    {
      title: "For a national retail chain, we",
      description:
        "Created a comprehensive social media marketing campaign that increased customer engagement by 80% and drove a 40% increase in online sales.",
      bgColor: "bg-[#191A23]",
      textColor: "text-white",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-[#F3F3F3]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#191A23] mb-4">
            Examples of Our Proven Digital Marketing
          </h2>
          <p className="text-[#191A23]/80">Our Case Studies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((study, index) => (
            <Card key={index} className={`border-none ${study.bgColor} overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className={`text-xl font-bold mb-3 ${study.textColor}`}>{study.title}</h3>
                  <p className={`${study.textColor} opacity-80 mb-6`}>{study.description}</p>
                  <div className="mt-auto">
                    <Button variant="ghost" className={`${study.textColor} p-0 hover:bg-transparent hover:opacity-70`}>
                      <span className="flex items-center">
                        Learn more <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-[#191A23] mb-4">Step-by-Step Guide to Achieving Your Business Goals</h3>
          <Button className="bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] transition-colors mt-4">
            Get your free proposal
          </Button>
        </div>
      </div>
    </section>
  )
}

