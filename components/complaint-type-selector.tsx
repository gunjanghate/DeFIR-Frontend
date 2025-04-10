"use client"

import { FileText, Volume2, Car, AlertTriangle, UserX, Trash2, Siren, Fingerprint, Landmark, Flame } from "lucide-react"

interface ComplaintTypeSelectorProps {
  selectedType: string
  onSelect: (type: string) => void
}

export function ComplaintTypeSelector({ selectedType, onSelect }: ComplaintTypeSelectorProps) {
  const complaintTypes = [
    { id: "noise", label: "Noise Complaint", icon: Volume2 },
    { id: "traffic", label: "Traffic Violation", icon: Car },
    { id: "suspicious", label: "Suspicious Activity", icon: AlertTriangle },
    { id: "harassment", label: "Harassment", icon: UserX },
    { id: "vandalism", label: "Vandalism", icon: Trash2 },
    { id: "domestic", label: "Domestic Dispute", icon: Siren },
    { id: "theft", label: "Theft", icon: Fingerprint },
    { id: "fraud", label: "Fraud", icon: Landmark },
    { id: "fire", label: "Fire Emergency", icon: Flame },
    { id: "other", label: "Other", icon: FileText },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {complaintTypes.map((type) => {
        const Icon = type.icon
        return (
          <div
            key={type.id}
            className={`border rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              selectedType === type.id ? "bg-green-100 border-primary" : "hover:bg-muted/50"
            }`}
            onClick={() => onSelect(type.id)}
          >
            <Icon className={`h-8 w-8 mb-2 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-sm">{type.label}</span>
          </div>
        )
      })}
    </div>
  )
}

