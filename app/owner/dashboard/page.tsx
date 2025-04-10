// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import {
//   Shield,
//   Bell,
//   User,
//   LogOut,
//   Plus,
//   Trash,
//   ArrowUpRight,
//   AlertTriangle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { ethers } from "ethers"
// import dynamic from "next/dynamic"

// import SecureFIRSystem from  "../../../../artifacts/contracts/SecureFIRSystem.sol/SecureFIRSystem.json"
// import PoliceWalletManager from "../../../../artifacts/contracts/PoliceWalletManager.sol/PoliceWalletManager.json"

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS2
// const CONTRACT_ADDRESS1 = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
// interface FIR {
//   id: number
//   title: string
//   description: string
//   status: string
//   assignedOfficer: string
//   incidentDate: number
//   isResolved: boolean
// }

// interface PoliceOfficer {
//   address: string
//   isActive: boolean
// }

// export default function OwnerDashboardPage() {
//   const [activeTab, setActiveTab] = useState("firs")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [firs, setFirs] = useState<FIR[]>([])
//   const [officers, setOfficers] = useState<PoliceOfficer[]>([])
//   const [newOfficerAddress, setNewOfficerAddress] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [isOwner, setIsOwner] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     if (typeof window !== 'undefined' && window.ethereum) {
//       initializeContract()
//     }
//   }, [])

//   const initializeContract = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum)
//       const signer = await provider.getSigner()
//       const contract = new ethers.Contract(
//         CONTRACT_ADDRESS!,
//         (await SecureFIRSystem).abi,
//         signer
//       )
//       const contract1 = new ethers.Contract(
//         CONTRACT_ADDRESS1!,
//         (await PoliceWalletManager).abi,
//         signer
//       )

//       const ownerAddress = await contract.owner()
//       const userAddress = await signer.getAddress()
//       setIsOwner(userAddress.toLowerCase() === ownerAddress.toLowerCase())
//       loadFIRs(contract)
      
//         loadPoliceOfficers(contract1)
       

//     } catch (error) {
//       console.error("Initialization error:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadFIRs = async (contract: ethers.Contract) => {
//     try {
//       const firArray: FIR[] = [];
  
//       // Parallel fetching with error handling
//       const requests = Array.from({length: 4 - 1}, (_, i) => i + 1)
//         .map(async (i) => {
//           try {
//             const [title, status, assignedOfficer] = await contract.getFIRDetails(i);
//             const sensitiveData = await contract.getSensitiveFIRDetails(i);
            
//             return {
//               id: i,
//               title,
//               status,
//               assignedOfficer,
//               description: sensitiveData[0], // description
//               incidentDate: Number(sensitiveData[3]), // incidentDate from sensitive data
//               isResolved: status === "Resolved",
//               category: sensitiveData[4], // category
//               evidenceCids: sensitiveData[5] // evidenceCids
//             };
//           } catch (err) {
//             console.error(`Error fetching FIR #${i}:`, err);
//             return null;
//           }
//         });
  
//       const results = await Promise.all(requests);
//       const validFirs = results.filter(fir => fir !== null) as FIR[];
      
//       setFirs(validFirs);
//     } catch (error) {
//       console.error("Error loading FIRs:", error);
//     }
//   };
//   const loadPoliceOfficers = async (contract: ethers.Contract) => {
//     try {
//       const officerAddresses = await contract.getPoliceList();
      
//       // Map addresses to officer objects with status information
//       const officerObjects = officerAddresses.map((address: string) => ({
//         address: address,
//         isActive: true
//       }));
      
//       console.log(officerAddresses)
//       setOfficers(officerObjects);
//     } catch (error) {
//       console.error("Error loading officers:", error);
//       setOfficers([]);
//     }
//   }

//   const handleAddOfficer = async () => {
//     if (!mounted) return

//     try {

//       const provider = new ethers.BrowserProvider(window.ethereum)
//       const signer = await provider.getSigner()
//       const contract = new ethers.Contract(
//         CONTRACT_ADDRESS1!,
//         PoliceWalletManager.abi,
//         signer
//       )
// loadPoliceOfficers(contract)
//       if (!ethers.isAddress(newOfficerAddress)) {
//         alert("Invalid Ethereum address")
//         return
//       }

//       const tx = await contract.addPolice(newOfficerAddress)
//       await tx.wait()
//       setNewOfficerAddress("")
//       loadPoliceOfficers(contract)
//     } catch (error) {
//       console.error("Error adding officer:", error)
//     }
//   }

//   if (!mounted || loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>
//   }

//   if (!isOwner) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="p-8 text-center">
//           <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
//           <p className="text-muted-foreground mb-4">This page is only accessible to the contract owner</p>
//           <Button asChild>
//             <Link href="/">Return to Home</Link>
//           </Button>
//         </Card>
//       </div>
//     )
//   }

//   async function handleRemoveOfficer(address: string): Promise<void> {
//     if (!mounted) return

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum)
//       const signer = provider.getSigner()
//       const contract = new ethers.Contract(
//         CONTRACT_ADDRESS1!,
//         PoliceWalletManager.abi,
//         await signer
//       )

//       const tx = await contract.removePolice(address)
//       await tx.wait()
//       loadPoliceOfficers(contract)
//     } catch (error) {
//       console.error("Error removing officer:", error)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b">
//         <div className="container flex h-16 items-center px-4 md:px-6">
//           <div className="flex items-center gap-2">
//             <Shield className="h-6 w-6 text-primary" />
//             <span className="text-xl font-bold">DeFIR</span>
//           </div>
//           <nav className="ml-auto flex items-center gap-4 sm:gap-6">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarFallback>AD</AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Admin Dashboard</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </nav>
//         </div>
//       </header>

//       <main className="container px-4 md:px-6 py-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="mb-6">
//             <TabsTrigger value="firs">FIR Management</TabsTrigger>
//             <TabsTrigger value="police">Police Management</TabsTrigger>
//           </TabsList>

//           {activeTab === "firs" && (
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle>FIR Cases</CardTitle>
//                     <CardDescription>Manage all registered FIR cases</CardDescription>
//                   </div>
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Search cases..."
//                       className="max-w-xs"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {firs.filter(fir => 
//                     fir.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     fir.description.toLowerCase().includes(searchQuery.toLowerCase())
//                   ).map(fir => (
//                     <Card key={fir.id}>
//                       <CardContent className="p-4 flex items-center justify-between">
//                         <div className="space-y-1">
//                             <CardTitle>{fir.title  }</CardTitle>
//                             <CardDescription>{fir.description}</CardDescription>
                          
//                             <Badge variant={fir.isResolved ? "default" : "destructive"}>
//                                 {fir.isResolved ? "Resolved" : "Pending"}</Badge>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <Button variant="outline" asChild>
                           
//                               <ArrowUpRight className="h-4 w-4" />
                           
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
                    
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "police" && (
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle>Police Officers</CardTitle>
//                     <CardDescription>Manage authorized police officers</CardDescription>
//                   </div>
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Officer wallet address"
//                       className="w-64"
//                       value={newOfficerAddress}
//                       onChange={(e) => setNewOfficerAddress(e.target.value)}
//                     />
//                     <Button onClick={handleAddOfficer}>
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add Officer
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {officers.map((officer, i) => (
//                     <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <User className="h-5 w-5 text-muted-foreground" />
//                         <span className="font-mono">{officer.address}</span>
                      
//                           <Badge className="bg-green-100 text-green-800">Active</Badge>
                       
//                       </div>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleRemoveOfficer(officer.address)}
//                         disabled={!officer.isActive}
//                       >
//                         <Trash className="h-4 w-4 mr-2" />
//                         Remove
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </Tabs>
//       </main>
//     </div>
//   )
// }
import React from 'react'

const page = () => {
  return (
    <div>
      Still working on it
    </div>
  )
}

export default page
