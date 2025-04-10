import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Complaint {
  id: string
  trackingId: string
  description: string
  locationAddress: string
  evidenceFiles: string[] // Just CIDs now
  evidenceDescription: string
  contactName: string
  contactEmail: string
  createdAt: Date
  voicemailReceived: boolean
  AIProcessingCompleted: boolean
  PoliceAssigned: boolean
  PoliceDispatched: boolean
  PoliceArrived: boolean
  ActionTaken: boolean
  Resolved: boolean
}

interface ComplaintState {
  complaints: Complaint[]
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => void
  fetchComplaints: () => Promise<void>
  getComplaintByTrackingId: (trackingId: string) => Complaint | null
}


export const useComplaintStore = create<ComplaintState>()(
  persist(
    (set, get) => ({
      complaints: [],

      addComplaint: (newComplaint) => {
        const complaintWithId: Complaint = {
          ...newComplaint,
          id: `COMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          createdAt: new Date(),
        }
        set((state) => ({
          complaints: [...state.complaints, complaintWithId]
        }))
      },

      fetchComplaints: async () => {
        try {
          const response = await fetch('https://lavish-cooperation-production.up.railway.app/getComplaints').catch(err => {
            console.error("Network error:", err)
            throw new Error("Failed to fetch complaints due to network error")
          })
          if (!response || !response.ok) throw new Error(`HTTP error! status: ${response?.status || 'unknown'}`)

          const { cids } = await response.json()
          if (!Array.isArray(cids)) throw new Error('Invalid CID array')

          const allFIRs = await Promise.all(
            cids.map(async (cid: string) => {
              try {
                const res = await fetch(`https://${cid}.ipfs.dweb.link`)
                if (!res.ok) throw new Error('Failed to fetch IPFS data')
                const data = await res.json()
                console.log("Fetched data:", data)

                const evidenceFiles: string[] = Array.isArray(data.evidenceFiles)
                  ? data.evidenceFiles
                  : []

                return {
                  ...data,
                  id: data.trackingId,
                  evidenceFiles, // Save as array of CIDs
                  createdAt: new Date(data.createdAt || Date.now())
                } as Complaint
              } catch (err) {
                console.error("Error loading from CID:", cid, err)
                return null
              }
            })
          )

          const filtered = allFIRs.filter(Boolean) as Complaint[]

          set((state) => ({
            complaints: [
              ...filtered.filter(fc => !state.complaints.find(sc => sc.trackingId === fc.trackingId)),
              ...state.complaints
            ]
          }))
        } catch (err) {
          console.error("Failed to fetch FIRs from Pinata:", err)
        }
      },

      getComplaintByTrackingId: (trackingId: string) => {
        return get().complaints.find(c => c.trackingId === trackingId) || null
      }
    }),
    {
      name: 'complaint-storage'
    }
  )
)