import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function TeamSection() {
  const team = [
    {
      name: "Jane Doe",
      title: "Director of Operations",
      photo: "/placeholder.svg",
      bio: "7+ years of experience in project management and team leadership. Focused on improving processes and communication skills.",
    },
    {
      name: "Michael Brown",
      title: "Senior SEO Specialist",
      photo: "/placeholder.svg",
      bio: "5+ years of experience in SEO and content creation. Dedicated to improving search rankings and optimization.",
    },
    {
      name: "Brian Williams",
      title: "Social Media Specialist",
      photo: "/placeholder.svg",
      bio: "4+ years of experience in social media management. Expert in creating content, measuring metrics, and building engagement.",
    },
    {
      name: "Sarah Kim",
      title: "Content Creator",
      photo: "/placeholder.svg",
      bio: "3+ years of experience in writing. Skilled in creating compelling, SEO-optimized content for various industries.",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#191A23] mb-4">Meet Our Team</h2>
          <p className="text-[#191A23]/80">The experts behind our digital marketing success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="border border-[#F3F3F3] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 bg-[#B9FF66]">
                    <AvatarImage src={member.photo} alt={member.name} className="mix-blend-multiply" />
                    <AvatarFallback className="bg-[#B9FF66] text-[#191A23]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-[#191A23] mb-1">{member.name}</h3>
                  <p className="text-[#191A23]/60 mb-4">{member.title}</p>
                  <p className="text-sm text-[#191A23]/80">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button className="bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] transition-colors">
            See all team
          </Button>
        </div>
      </div>
    </section>
  )
}

