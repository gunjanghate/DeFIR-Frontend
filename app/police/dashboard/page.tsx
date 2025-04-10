"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import {
  ShieldAlert,
  FileText,
  AlertCircle,
  MapPin,
  Calendar,
  MessageSquare,
  User,
  Mail,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Search,
  Clock,
  Bookmark,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useComplaintStore } from "../../../lib/stores/complaintStore"
import {useRouter} from "next/navigation"

// Define the Complaint interface based on the properties being used
interface Complaint {
  id: string
  description: string
  locationAddress: string
  createdAt: Date | string
  Resolved?: boolean
  ActionTaken?: boolean
  PoliceAssigned?: boolean
  PoliceDispatched?: boolean
  PoliceArrived?: boolean
  voicemailReceived?: boolean
  trackingId?: string
  complaintType?: string
  contactName?: string
  contactEmail?: string
  evidenceFiles?: string[]
  evidenceDescription?: string
  AIProcessingCompleted?: boolean
}

export default function PoliceDashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { complaints } = useComplaintStore()
  const [firData, setFirData] = useState<any[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter() ;

  // Fetch FIR data from the API
  const fetchFIRData = async () => {
   
    setIsLoading(true)
    try {
      const response = await axios.get("https://lavish-cooperation-production.up.railway.app/getComplaints")
      const cids = response.data.cids
      // Fetch details for each CID from IPFS
      const firDetails = await Promise.all(
        cids.map(async (cid: string) => {
          const ipfsResponse = await axios.get(`https://ipfs.io/ipfs/${cid}`)
          return ipfsResponse.data
        })
      )
      setFirData(firDetails)
    } catch (error) {
      console.error("Error fetching FIR data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get status badge
  const getStatusBadge = (fir: any) => {
    if (fir.Resolved) {
      return <Badge className="text-base font-medium px-3 py-1 bg-green-500 text-white">Resolved</Badge>
    } else if (fir.ActionTaken) {
      return <Badge className="text-base font-medium px-3 py-1 bg-blue-500 text-white">Action Taken</Badge>
    } else if (fir.PoliceArrived) {
      return <Badge className="text-base font-medium px-3 py-1 bg-yellow-500 text-black">Police On Scene</Badge>
    } else if (fir.PoliceDispatched) {
      return <Badge className="text-base font-medium px-3 py-1 bg-orange-500 text-white">Police Dispatched</Badge>
    } else if (fir.PoliceAssigned) {
      return <Badge className="text-base font-medium px-3 py-1 bg-purple-500 text-white">Police Assigned</Badge>
    } else {
      return <Badge className="text-base font-medium px-3 py-1 bg-red-500 text-white">New</Badge>
    }
  }

  // Filter FIRs based on active tab
  const filteredFIRs = () => {
    let filtered = [...firData]
    
    if (searchQuery) {
      filtered = filtered.filter(fir => 
        fir.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.trackingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.locationAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.complaintType?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    switch (activeTab) {
      case "urgent":
        return filtered.filter(fir => !fir.ActionTaken && !fir.Resolved)
      case "inProgress":
        return filtered.filter(fir => (fir.PoliceAssigned || fir.PoliceDispatched || fir.PoliceArrived) && !fir.Resolved)
      case "resolved":
        return filtered.filter(fir => fir.Resolved)
      default:
        return filtered
    }
  }

  useEffect(() => {
    fetchFIRData()
  }, [])

  return (
    <div className="min-h-screen bg-green-50">
      <main className="container px-4 md:px-6 mx-12 pt-36 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-900">Police Dashboard</h1>
            <p className="text-xl text-gray-600 mt-2">Monitor and manage FIRs </p>
          </div>
          <Button onClick={() => fetchFIRData()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-lg font-medium flex items-center gap-2">
            <RefreshCw size={20} />
            Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-xl font-bold text-blue-800">Total FIRs</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-3xl font-bold text-gray-800">{firData.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-2 border-orange-100">
            <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-xl font-bold text-orange-800">Pending Action</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <span className="text-3xl font-bold text-gray-800">
                  {firData.filter(fir => !fir.ActionTaken && !fir.Resolved).length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-2 border-green-100">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-xl font-bold text-green-800">Resolved Cases</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold text-gray-800">
                  {firData.filter(fir => fir.Resolved).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid grid-cols-4 w-full max-w-md p-1 bg-gray-100 rounded-xl">
                <TabsTrigger value="all" className="text-lg font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md">All</TabsTrigger>
                <TabsTrigger value="urgent" className="text-lg font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md">Urgent</TabsTrigger>
                <TabsTrigger value="inProgress" className="text-lg font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md">In Progress</TabsTrigger>
                <TabsTrigger value="resolved" className="text-lg font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative max-w-md w-full">
              <Input
                type="text"
                placeholder="Search FIRs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-1 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
              <Search className="absolute left-4 top-2.5 h-5 w-6 text-gray-500" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="flex flex-col items-center">
              <Clock className="animate-spin h-16 w-16 text-blue-600 mb-4" />
              <span className="text-2xl font-medium text-gray-700">Loading FIR data...</span>
            </div>
          </div>
        ) : filteredFIRs().length === 0 ? (
          <Card className="py-12 border-2 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-24 w-24 text-orange-500 mb-6" />
              <h3 className="text-3xl font-bold mb-3 text-gray-800">No FIRs Found</h3>
              <p className="text-xl text-gray-600">
                {searchQuery ? "No FIRs match your search criteria" : "There are no FIRs in this category"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {filteredFIRs().map((fir, index) => (
              <Card key={index} className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="h-10 w-10 text-blue-600" />
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-800" onClick={()=>{
                          router.push(`/police/tasks/${fir.trackingId}`)
                        }} style={{ cursor: "pointer"
          
                        }}>{fir.trackingId}</CardTitle>
                        <CardDescription className="text-base text-gray-600 mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(fir.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                      {getStatusBadge(fir)}
                      <Badge variant="outline" className="text-base font-medium px-3 py-1 border-2 border-gray-300">
                        {fir.complaintType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="font-bold text-2xl mb-4 text-blue-800 flex items-center gap-2">
                        <Bookmark className="h-6 w-6" />
                        Complaint Details
                      </h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                          <div>
                            <p className="font-bold text-lg text-gray-700">Description</p>
                            <p className="text-xl mt-1 text-gray-800">{fir.description}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                          <div>
                            <p className="font-bold text-lg text-gray-700">Location</p>
                            <p className="text-xl mt-1 text-gray-800">{fir.locationAddress}</p>
                          </div>
                        </div>
                        {fir.evidenceDescription && (
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
                            <div>
                              <p className="font-bold text-lg text-gray-700">Evidence Description</p>
                              <p className="text-xl mt-1 text-gray-800">{fir.evidenceDescription}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                      <h3 className="font-bold text-2xl mb-4 text-green-800 flex items-center gap-2">
                        <User className="h-6 w-6" />
                        Contact Information
                      </h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-3">
                          <User className="h-6 w-6 text-purple-500 mt-1" />
                          <div>
                            <p className="font-bold text-lg text-gray-700">Name</p>
                            <p className="text-xl mt-1 text-gray-800">{fir.contactName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="h-6 w-6 text-indigo-500 mt-1" />
                          <div>
                            <p className="font-bold text-lg text-gray-700">Email</p>
                            <p className="text-xl mt-1 text-gray-800">{fir.contactEmail}</p>
                          </div>
                        </div>
                      </div>
                      
                      {fir.evidenceFiles && fir.evidenceFiles.length > 0 && (
                        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-bold text-lg mb-3 text-gray-800">Evidence Files</h4>
                          <div className="space-y-2">
                            {fir.evidenceFiles.map((file: string, idx: number) => (
                              <Link 
                                key={idx} 
                                href={`https://ipfs.io/ipfs/${file}`} 
                                target="_blank"
                                className="flex items-center gap-2 text-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                              >
                                <FileText className="h-5 w-5" />
                                <span className="truncate flex-1">{file.substring(0, 20)}...</span>
                                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-100 border-t-2 border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                    <StatusIndicator 
                      label="AI Processing" 
                      completed={fir.AIProcessingCompleted}
                    />
                    <StatusIndicator 
                      label="Police Assigned" 
                      completed={fir.PoliceAssigned}
                    />
                    <StatusIndicator 
                      label="Police Dispatched" 
                      completed={fir.PoliceDispatched}
                    />
                    <StatusIndicator 
                      label="Police Arrived" 
                      completed={fir.PoliceArrived}
                    />
                    <StatusIndicator 
                      label="Action Taken" 
                      completed={fir.ActionTaken}
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// Component for status indicators in the footer
const StatusIndicator = ({ label, completed }: { label: string, completed?: boolean }) => {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${completed ? 'bg-green-100' : 'bg-red-100'}`}>
      <span className="text-base font-medium text-gray-700">{label}:</span>
      {completed ? 
        <CheckCircle className="h-6 w-6 text-green-600" /> : 
        <XCircle className="h-6 w-6 text-red-600" />
      }
    </div>
  );
};