"use client"
import { useState } from "react"
import Link from "next/link"
import {
  Shield, Bell, User, LogOut, FileText, Search, Clock, CheckCircle,
  AlertTriangle, Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
  from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Mock data for demonstration
const MOCK_COMPLAINTS = [
  {
    id: "ABC12345",
    type: "Noise Complaint",
    description: "Loud music playing after hours from neighboring apartment",
    location: "123 Main Street, Cityville",
    status: "in_progress",
    date: "2025-03-20T18:30:00Z",
  },
  {
    id: "DEF67890",
    type: "Theft",
    description: "Bicycle stolen from front yard",
    location: "456 Oak Avenue, Townsville",
    status: "assigned",
    date: "2025-03-18T14:15:00Z",
  },
  {
    id: "GHI10111",
    type: "Suspicious Activity",
    description: "Unknown person loitering around the neighborhood",
    location: "789 Pine Road, Villageton",
    status: "resolved",
    date: "2025-03-15T09:45:00Z",
  },
  {
    id: "JKL12131",
    type: "Traffic Violation",
    description: "Cars speeding in residential area",
    location: "101 Elm Street, Hamletville",
    status: "escalated",
    date: "2025-03-10T16:20:00Z",
  },
]
export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const filteredComplaints = MOCK_COMPLAINTS.filter((complaint) => {
    if (activeTab === "active" && complaint.status === "resolved") {
      return false
    }
    if (activeTab === "resolved" && complaint.status !== "resolved") {
      return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        complaint.id.toLowerCase().includes(query) ||
        complaint.type.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query) ||
        complaint.location.toLowerCase().includes(query)
      )
    }
    return true
  })
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 
dark:bg-yellow-900/30 dark:text-yellow-500">
            Pending
          </Badge>
        )
      case "assigned":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 
dark:bg-blue-900/30 dark:text-blue-500">
            Assigned
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 
dark:bg-indigo-900/30 dark:text-indigo-500">
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 
dark:bg-green-900/30 dark:text-green-500">
            Resolved
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 
dark:bg-red-900/30 dark:text-red-500">
            Escalated
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DeFIR</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  My Complaints
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center 
justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John Doe</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <Button asChild className="gap-2">
              <Link href="/complaints/new">
                <FileText className="h-4 w-4" />
                Register New Complaint
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/complaints/track">
                <Search className="h-4 w-4" />
                Track Complaint
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total
                  Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{MOCK_COMPLAINTS.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active
                  Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {MOCK_COMPLAINTS.filter((c) => c.status !== "resolved").length}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolved
                  Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {MOCK_COMPLAINTS.filter((c) => c.status === "resolved").length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>My Complaints</CardTitle>
              <CardDescription>View and manage all your registered
                complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 
text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search complaints..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {filteredComplaints.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground 
mx-auto mb-2" />
                      <p className="text-muted-foreground">No complaints found</p>
                    </div>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <Link
                            href={`/complaints/status/${complaint.id}`}
                            className="block p-6 hover:bg-muted/50 
transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row 
sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3
                                    className="font-semibold">{complaint.type}</h3>
                                  {getStatusBadge(complaint.status)}
                                </div>
                                <p className="text-sm text-muted-foreground 
line-clamp-1">{complaint.description}</p>
                              </div>
                              <div className="flex flex-col sm:items-end gap-1">
                                <div className="text-sm font-medium">ID:
                                  {complaint.id}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(complaint.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                  {/* Active complaints will be filtered by the filteredComplaints 
logic */}
                  {filteredComplaints.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto 
mb-2" />
                      <p className="text-muted-foreground">No active complaints</p>
                    </div>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <Link
                            href={`/complaints/status/${complaint.id}`}
                            className="block p-6 hover:bg-muted/50 
transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row 
sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3
                                    className="font-semibold">{complaint.type}</h3>
                                  {getStatusBadge(complaint.status)}
                                </div>
                                <p className="text-sm text-muted-foreground 
line-clamp-1">{complaint.description}</p>
                              </div>
                              <div className="flex flex-col sm:items-end gap-1">
                                <div className="text-sm font-medium">ID:
                                  {complaint.id}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(complaint.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="resolved" className="space-y-4">
                  {/* Resolved complaints will be filtered by the filteredComplaints
 logic */}
                  {filteredComplaints.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground 
mx-auto mb-2" />
                      <p className="text-muted-foreground">No resolved
                        complaints</p>
                    </div>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <Link
                            href={`/complaints/status/${complaint.id}`}
                            className="block p-6 hover:bg-muted/50 
transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row 
sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3
                                    className="font-semibold">{complaint.type}</h3>
                                  {getStatusBadge(complaint.status)}
                                </div>
                                <p className="text-sm text-muted-foreground 
line-clamp-1">{complaint.description}</p>
                              </div>
                              <div className="flex flex-col sm:items-end gap-1">
                                <div className="text-sm font-medium">ID:
                                  {complaint.id}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(complaint.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" size="sm">
                View All Complaints
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}