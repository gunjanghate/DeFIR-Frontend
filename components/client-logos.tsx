export function ClientLogos() {
  const clients = [
    { name: "Amazon", logo: "amazon" },
    { name: "Dribbble", logo: "dribbble" },
    { name: "HubSpot", logo: "hubspot" },
    { name: "Notion", logo: "notion" },
    { name: "Netflix", logo: "netflix" },
    { name: "Zoom", logo: "zoom" },
  ]

  return (
    <section className="py-12 border-t border-b border-[#F3F3F3]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12">
          {clients.map((client) => (
            <div key={client.name} className="grayscale hover:grayscale-0 transition-all duration-300">
              <span className="text-xl font-bold text-[#191A23]">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

