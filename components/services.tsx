import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Smartphone, Cpu, MapPin, Lock, CheckSquare, ArrowRight } from "lucide-react";

export function Services() {
  const services = [
    {
      title: "Voicemail Reporting",
      icon: Phone,
      description: "Report incidents via a simple phone call, analyzed by AI for quick response.",
      bgColor: "bg-[#F3F3F3]",
      textColor: "text-[#191A23]",
    },
    {
      title: "App-Based Reporting",
      icon: Smartphone,
      description: "Submit complaints directly through our user-friendly mobile app.",
      bgColor: "bg-green-300/60",
      textColor: "text-[#191A23]",
    },
    {
      title: "AI-Powered Analysis",
      icon: Cpu,
      description: "Advanced AI analyzes complaints to prioritize and categorize for efficient handling.",
      bgColor: "bg-[#F3F3F3]",
      textColor: "text-black",
    },
    {
      title: "Real-Time Deployment",
      icon: MapPin,
      description: "Swift deployment of police resources based on complaint severity and location.",
      bgColor: "bg-green-300/60",
      textColor: "text-[#191A23]",
    },
    {
      title: "Blockchain Security",
      icon: Lock,
      description: "Secure and transparent record-keeping of all complaints and FIRs using blockchain.",
      bgColor: "bg-[#F3F3F3]",
      textColor: "text-[#191A23]",
    },
    {
      title: "Task Management",
      icon: CheckSquare,
      description: "Efficient tools for police to monitor, manage, and resolve tasks and FIRs.",
      bgColor: "bg-green-300/60",
      textColor: "text-white",
    },
  ];

  return (
    <section className="py-16 mt-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <div className="inline-block px-4 py-2  rounded-full mb-4">
            <h2 className="text-[#191A23] font-bold">Features</h2>
          </div>
          <p className="text-[#191A23]/80 max-w-2xl">
            Our police complaint management system offers a range of features to ensure efficient and secure handling of public complaints. These include:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className={`border-none  ${service.bgColor} overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <service.icon className={`h-10 w-10 ${service.textColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${service.textColor}`}>{service.title}</h3>
                  <p className={`${service.textColor} opacity-80 mb-6`}>{service.description}</p>
                 
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}