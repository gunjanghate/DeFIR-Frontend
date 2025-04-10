"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import axios from "axios";
import {
  Shield,
  ArrowLeft,
  MapPin,
  Phone,
  MessageSquare,
  AlertTriangle,
  Camera,
  Upload,
  Mic,
  FileText,
  Send,
  Ambulance,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ComplaintTimeline } from "@/components/complaint-timeline"
import { useComplaintStore } from "@/lib/stores/complaintStore"
import { Complaint } from "@/lib/stores/complaintStore"
import SecureFIRSystem from "@/abis/Contract1.json"
import { ethers } from "ethers"

const STATUS_MAP = {
  new: { label: "New", color: "blue" },
  urgent: { label: "Urgent", color: "red" },
  in_progress: { label: "In Progress", color: "indigo" },
  pending: { label: "Pending", color: "yellow" },
  resolved: { label: "Resolved", color: "green" }
}

const TIMELINE_STEPS = [
  { id: 1, status: "received", title: "Complaint Received" },
  { id: 2, status: "processing", title: "AI Processing Completed" },
  { id: 3, status: "assigned", title: "Officer Assigned" },
  { id: 4, status: "arrived", title: "Officer Arrived" },
  { id: 5, status: "action", title: "Action Taken" },
  { id: 6, status: "resolved", title: "Resolved" }
]

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { complaints } = useComplaintStore()
  const [task, setTask] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [activityNote, setActivityNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firData, setFirData] = useState<any[]>([])
  const [evidenceUrls, setEvidenceUrls] = useState<Record<string, string>>({})

  // Fixed function to fetch evidence URLs
  const getEvidenceImageByTrackingId = async (trackingId: string): Promise<string | null> => {
    try {
      // Step 1: Get array of CIDs from your backend
      const cidRes = await axios.get("https://lavish-cooperation-production.up.railway.app/getComplaints");
      const { cids } = cidRes.data;
  
      for (const cid of cids) {
        // Fixed template string syntax
        const metadataRes = await axios.get(`https://${cid}.ipfs.dweb.link`);
        const data = metadataRes.data;
  
        if (data.trackingId === trackingId) {
          const evidenceCID = data.evidenceFiles?.[0];
          if (!evidenceCID) return null;
  
          // Return full image URL with fixed template string
          return `https://${evidenceCID}.ipfs.dweb.link`;
        }
      }
  
      return null;
    } catch (err) {
      console.error("Error fetching evidence image:", err);
      return null;
    }
  };

  // Function to fetch FIR data
  const fetchFIRData = async () => {
    try {
      const response = await axios.get("https://lavish-cooperation-production.up.railway.app/getComplaints")
      const cids = response.data.cids

      const firDetails = await Promise.all(
        cids.map(async (cid: string) => {
          // Fixed template string syntax
          const ipfsResponse = await axios.get(`https://ipfs.io/ipfs/${cid}`)
          const fir = ipfsResponse.data

          // Convert evidence CIDs to full IPFS URLs
          const evidenceLinks = Array.isArray(fir.evidenceFiles)
            ? fir.evidenceFiles.map((evidenceCid: string) => `https://ipfs.io/ipfs/${evidenceCid}`)
            : []

          return {
            ...fir,
            evidenceLinks, // Add this to use in rendering
          }
        })
      )

      setFirData(firDetails)
    } catch (error) {
      console.error("Error fetching FIR data:", error)
    }
  }

  // Load evidence URLs for the current complaint
  const loadEvidenceUrls = async (complaint: Complaint) => {
    if (!complaint || !complaint.evidenceFiles || complaint.evidenceFiles.length === 0) {
      return;
    }
    
    const urls: Record<string, string> = {};
    
    for (const cid of complaint.evidenceFiles) {
      // Fixed template string syntax
      urls[cid] = `https://ipfs.io/ipfs/${cid}`;
    }
    
    setEvidenceUrls(urls);
  };

  useEffect(() => {
    const foundComplaint = complaints.find(c => c.trackingId === params.id)
    if (foundComplaint) {
      setTask(foundComplaint)
      // Load evidence URLs when complaint is found
      loadEvidenceUrls(foundComplaint);
      setLoading(false)
    } else {
      setLoading(false)
    }
    
    // Fetch FIR data
    fetchFIRData();
  }, [params.id, complaints])
  
  const CONTRACT_ADDRESS = "0x61604bBC1D27D8C2a3646A6B11bd7E82a78dA5f0";
  
  const getTaskStatus = (complaint: Complaint) => {
    if (complaint.Resolved) return 'resolved'
    if (complaint.ActionTaken) return 'pending'
    if (complaint.PoliceAssigned || complaint.PoliceDispatched || complaint.PoliceArrived) return 'in_progress'
    const isNewUrgent = complaint.voicemailReceived || 
      (Date.now() - new Date(complaint.createdAt).getTime() < 3600000)
    return isNewUrgent ? 'urgent' : 'new'
  }

  const getTimeline = (complaint: Complaint) => {
    return TIMELINE_STEPS.map(step => {
      let completed = false
      let timestamp: string | null = null
      let description = ""

      switch (step.status) {
        case 'received':
          completed = true
          timestamp = typeof complaint.createdAt === 'object' 
            ? complaint.createdAt.toISOString()
            : new Date(complaint.createdAt).toISOString()
          description = "Complaint was received and logged in the system"
          break
        case 'processing':
          completed = complaint.AIProcessingCompleted
          description = "AI system analyzed the complaint"
          break
        case 'assigned':
          completed = complaint.PoliceAssigned
          description = "Officer assigned to investigate"
          break
        case 'arrived':
          completed = complaint.PoliceArrived
          description = "Officer arrived at the scene"
          break
        case 'action':
          completed = complaint.ActionTaken
          description = "Action was taken regarding the complaint"
          break
        case 'resolved':
          completed = complaint.Resolved
          description = "Case was resolved successfully"
          break
      }

      return { ...step, completed, timestamp, description }
    })
  }

  const handleStatusUpdate = (newStatus: string) => {
    if (!task) return

    const updates: Partial<Complaint> = {}
    switch (newStatus) {
      case 'resolved':
        updates.AIProcessingCompleted = true
        updates.PoliceArrived = true
        updates.voicemailReceived = true
        updates.PoliceAssigned = true
        updates.ActionTaken = true
        updates.Resolved = true
        break
      case 'pending':
        updates.ActionTaken = true
        break
      case 'in_progress':
        updates.PoliceAssigned = true
        break
      case 'urgent':
        updates.voicemailReceived = true
        break
    }

    setTask({ ...task, ...updates })
  }

  const handleReportArrival = () => {
    if (!task) return
    setTask({ ...task, PoliceArrived: true })
  }

  const handleSubmitActivityNote = () => {
    if (!activityNote.trim() || !task) return;
    
    // In a real app, you would save this note to your backend
    console.log(`Activity note submitted for ${task.trackingId}: ${activityNote}`);
    
    // Clear the input after submission
    setActivityNote("");
  }

  const getSeverity = (complaint: Complaint) => {
    return complaint.voicemailReceived ? 'high' : 'medium'
  }

  async function fileFIR(trackingId: string, complaint: Complaint): Promise<void> {
    try {
      // Connect to the blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
  
      // Get the list of accounts directly from the provider
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner(accounts[0]);
      
      // Create contract instance with explicit address handling
      // Avoid any automatic ENS resolution
      const contractAddress = CONTRACT_ADDRESS;
      const contract = new ethers.Contract(
        contractAddress,
        SecureFIRSystem.abi,
        signer
      );
      
      // Prepare FIR data (use dummy data where necessary)
      const firData = {
        title: complaint.description.substring(0, 50) || "Untitled FIR",
        description: complaint.description,
        complainantName: complaint.contactName || "Anonymous",
        complainantContact: complaint.contactEmail || "N/A",
        incidentDate: Math.floor(new Date(complaint.createdAt).getTime() / 1000),
        incidentLocation: complaint.locationAddress || "Location not specified",
        category: "General Complaint", // Default category
        includeComplainantAccess: !!complaint.contactEmail,
        evidenceCids: complaint.evidenceFiles
      };
  
      // Disable ENS name resolution by using options parameter
      const options = {
        // Add any transaction options if needed
      };
  
      // Execute the contract call
      const tx = await contract.createFIR(
        firData.title,
        firData.description,
        firData.complainantName,
        firData.complainantContact,
        firData.incidentDate,
        firData.incidentLocation,
        firData.category,
        firData.includeComplainantAccess,
        firData.evidenceCids,
        options
      );
  
      // Wait for transaction confirmation
      await tx.wait();
      
      console.log(`FIR created successfully for tracking ID: ${trackingId}`);
      alert("FIR successfully filed on blockchain");
  
    } catch (error) {
      console.error("Error filing FIR:", error);
      alert("Failed to file FIR. Please check console for details.");
      throw error;
    }
  }
  
  const handleFileFIR = async () => {
    if (!task) return;
  
    try {
      setIsSubmitting(true);
      await fileFIR(task.trackingId, task);
      setTask(prev => prev ? { ...prev, Resolved: true } : null);
    } catch (error) {
      console.error("Error filing FIR:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (loading) {
    return <LoadingState />
  }

  if (!task) {
    return <ErrorState taskId={params.id as string} />
  }

  const timeline = getTimeline(task)
  const severity = getSeverity(task)
  const currentStatus = getTaskStatus(task)

  return (
    <div className="min-h-screen min-w-screen font-poppins bg-gradient-to-bl from-green-200 via-white to-green-600">


<main className="container  px-4 md:px-6 pt-32 py-8 ">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6 md:pl-24 items-center">
            <Card className="bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {task.description.substring(0, 40)}...
                      <SeverityBadge severity={severity} />
                    </CardTitle>
                    <CardDescription>Tracking ID: <span className="text-green-600">{task.trackingId}</span> </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={currentStatus as keyof typeof STATUS_MAP} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-xl">
                  <DetailSection title="Description" content={task.description} />
                  
                  <DetailSection title="Location">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{task.locationAddress}</span>
                    </div>
                  </DetailSection>

                  <DetailSection title="Complainant Information">
                    <div className="space-y-1">
                      <p>{task.contactName || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">{task.contactEmail}</p>
                    </div>
                  </DetailSection>

                    <DetailSection title="Evidence">
                    <div className="grid grid-cols-2 gap-4">
                      {task.evidenceFiles && task.evidenceFiles.length > 0 ? (
                      task.evidenceFiles.map((cid: string) => {
                        // Use the precalculated evidence URL from state
                        const evidenceUrl = evidenceUrls[cid];
                        const isVideo = cid.toLowerCase().endsWith(".mp4");
                        
                        return (
                        <div key={cid} className="relative group">
                          {!isVideo && (
                          <a href={evidenceUrl} target="_blank" rel="noopener noreferrer">
                            <img
                            src={evidenceUrl}
                            alt={`Evidence ${cid.substring(0, 6)}`}
                            className="rounded-md object-cover h-40 w-full"
                            />
                          </a>
                          )}
                          {isVideo && (
                          <a href={evidenceUrl} target="_blank" rel="noopener noreferrer">
                            <video
                            controls
                            className="rounded-md object-cover h-40 w-full"
                            >
                            <source src={evidenceUrl} type="video/mp4" />
                            </video>
                          </a>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm">
                          {`Evidence File ${cid.substring(0, 6)}`}
                          </div>
                        </div>
                        )
                      })
                      ) : (
                      <p className="text-sm text-muted-foreground col-span-2">No evidence files submitted</p>
                      )}
                    </div>
                    </DetailSection>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 pt-0">
                <Separator className="w-full my-4" />
                <div className="flex flex-col w-full gap-4">
                  <h3 className="text-sm font-medium">Officer Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <StatusSelect 
                      currentStatus={currentStatus} 
                      onUpdate={handleStatusUpdate} 
                    />
                    
                    {!task.PoliceArrived && (
                      <Button 
                        variant="outline" 
                        onClick={handleReportArrival}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Report Arrival
                      </Button>
                    )}
                    
                    <Button 
                      variant="default" 
                      onClick={handleFileFIR}
                      disabled={isSubmitting}
                      className="flex items-center bg-green-600 hover:bg-green-700 gap-2 ml-auto"
                    >
                      <FileText className="h-4 w-4" />
                      {isSubmitting ? "Filing FIR..." : "File FIR"}
                    </Button>
                 

                  </div>
                  
                  <div className="flex flex-col w-full mt-4">
                    <Textarea
                      placeholder="Add activity notes..."
                      className="min-h-24 mb-2"
                      value={activityNote}
                      onChange={(e) => setActivityNote(e.target.value)}
                    />
                    <Button 
                      className="self-end flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      onClick={handleSubmitActivityNote}
                      disabled={!activityNote.trim()}
                    >
                      <Send className="h-4 w-4" />
                      Submit Note
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ComplaintTimeline timeline={timeline} />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full flex items-center gap-2" variant="outline">
                  <Phone className="h-4 w-4" />
                  Contact Complainant
                </Button>
                <Button className="w-full flex items-center gap-2" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  Send Update
                </Button>
                <Button className="w-full flex items-center gap-2" variant="outline">
                  <Ambulance className="h-4 w-4" />
                  Request Support
                </Button>
              </CardContent>
            </Card> */}
            
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{STATUS_MAP[currentStatus as keyof typeof STATUS_MAP].label}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <p className="font-medium">{severity === 'high' ? 'High' : 'Medium'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">FIR Status</p>
                  <p className="font-medium">{task.Resolved ? 'Filed' : 'Pending'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' }) {
  const { label, color } = {
    low: { label: "Low", color: "green" },
    medium: { label: "Medium", color: "yellow" },
    high: { label: "High", color: "red" }
  }[severity]

  return (
    <Badge variant="outline" className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-500`}>
      {label}
    </Badge>
  )
}

function StatusBadge({ status }: { status: keyof typeof STATUS_MAP }) {
  const { label, color } = STATUS_MAP[status]
  return (
    <Badge variant="outline" className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-500`}>
      {label}
    </Badge>
  )
}

function StatusSelect({ currentStatus, onUpdate }: { 
  currentStatus: string
  onUpdate: (status: string) => void 
}) {
  return (
    <Select value={currentStatus} onValueChange={onUpdate}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Update Status" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_MAP).map(([value, { label }]) => (
          <SelectItem key={value} value={value} disabled={value === 'new' || value === 'urgent'}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DetailSection({ title, content, children }: { 
  title: string
  content?: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      {content ? <p>{content}</p> : children}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">DeFIR</span>
      </div>
      <Card className="w-full max-w-3xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading task information...</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorState({ taskId }: { taskId: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">DeFIR</span>
      </div>
      <Card className="w-full max-w-3xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Task Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find a task with the ID: {taskId}</p>
          <Button asChild>
            <Link href="/police/dashboard">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}