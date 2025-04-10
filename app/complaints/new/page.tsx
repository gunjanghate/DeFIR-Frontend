"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft, MapPin, Camera, Mic, Upload, ChevronRight, CheckCircle, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ComplaintTypeSelector } from "@/components/complaint-type-selector"
import { useComplaintStore } from '../../../lib/stores/complaintStore'
import axios from "axios"
import { ethers } from "ethers"
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import { cn } from "@/lib/utils"
// ABI for the SecureFIRSystem contract
const CONTRACT_ABI = [
  "function createFIR(string memory _title, string memory _description, string memory _complainantName, string memory _complainantContact, uint256 _incidentDate, string memory _incidentLocation, string memory _category, bool _includeComplainantAccess, string[] memory _evidenceCids) external",
  "event FIRCreated(uint256 indexed id, address indexed complainant)"
];

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = "0x61604bBC1D27D8C2a3646A6B11bd7E82a78dA5f0";

export default function NewComplaintPage() {
  const router = useRouter()
  const [id, setId] = useState("")
  const [step, setStep] = useState(1)
  const [complaintType, setComplaintType] = useState("")
  const [description, setDescription] = useState("")
  const [locationAddress, setLocationAddress] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactName, setContactName] = useState("")

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { complaints } = useComplaintStore()

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [evidenceCIDs, setEvidenceCIDs] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer - using ethers v6 syntax
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setWalletConnected(true);
        
        console.log("Wallet connected successfully");
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install MetaMask to use this feature");
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed and connected on component mount
    if (typeof window !== 'undefined' && window.ethereum) {
      connectWallet();
    }
  }, []);

  const handleNext = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    setEvidenceFiles(prev => [...prev, ...files]);
  };

  const uploadFilesToIPFS = async (): Promise<string[]> => {
    setLoading(true);
    try {
      const cids = await Promise.all(
        evidenceFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append(
            'pinataMetadata',
            JSON.stringify({
              name: file.name,
            })
          );

          const response = await fetch('/api/uploadany', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('File upload failed');

          const data = await response.json();
          return data.ipfsHash;
        })
      );
      setEvidenceCIDs(cids);
      return cids;
    } catch (err) {
      console.error("IPFS Upload Error:", err);
      alert("IPFS Upload failed");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitToBlockchain = async (evidenceCids: string[]) => {
    if (!contract || !signer) {
      alert("Wallet not connected. Please connect your wallet first.");
      return false;
    }

    try {
      // Format data for smart contract
      const title = complaintType;
      const complainantName = contactName || "Anonymous";
      const complainantContact = contactEmail || "N/A";
      const incidentDate = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const incidentLocation = locationAddress;
      const category = complaintType;
      const includeComplainantAccess = true; // Allow complainant to access the FIR

      // Create FIR transaction
      const tx = await contract.createFIR(
        title,
        description,
        complainantName,
        complainantContact,
        incidentDate,
        incidentLocation,
        category,
        includeComplainantAccess,
        evidenceCids
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get FIR ID from event - updated for ethers v6
      const event = receipt.logs.find((log: any) => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog?.name === 'FIRCreated';
        } catch (e) {
          return false;
        }
      });
      
      if (event) {
        const parsedLog = contract.interface.parseLog(event);
        if (parsedLog && parsedLog.args) {
          const firId = parsedLog.args[0].toString();
          setId(firId);
          console.log("FIR created with ID:", firId);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Blockchain submission error:", error);
      alert("Failed to submit complaint to blockchain");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // 1. Upload evidence files to IPFS
      console.log("Uploading files to IPFS:", evidenceFiles);
      const evidenceCids = await uploadFilesToIPFS();
      console.log("Evidence CIDs:", evidenceCids);
      
      if (evidenceCids.length === 0 && evidenceFiles.length > 0) {
        throw new Error('Failed to upload evidence files');
      }
      
      // 2. Submit to blockchain
      const blockchainSubmitted = await submitToBlockchain(evidenceCids);
      


      // 3. Create tracking ID for traditional database (as backup)
      const trackingId = id || `COMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // 4. Create complete complaint object
      const complaintData = {
        trackingId,
        description,
        locationAddress,
        evidenceFiles: evidenceCids,
        evidenceDescription,
        contactName: contactName || 'NIL',
        contactEmail: contactEmail || 'NIL',
        createdAt: new Date().toISOString(),
        complaintType,
        voicemailReceived: false,
        AIProcessingCompleted: false,
        PoliceAssigned: false,
        PoliceDispatched: false,
        PoliceArrived: false,
        ActionTaken: false,
        Resolved: false
      };
  
      // 5. Upload complete data to IPFS as backup
      const jsonBlob = new Blob([JSON.stringify(complaintData)], { type: 'application/json' });
      const jsonFile = new File([jsonBlob], 'complaint.json');
      
      const finalFormData = new FormData();
      finalFormData.append('file', jsonFile);
      
      const ipfsResponse = await fetch('/api/uploadany', {
        method: 'POST',
        body: finalFormData,
      });
  
      if (!ipfsResponse.ok) throw new Error('Data upload failed');
      
      const { ipfsHash } = await ipfsResponse.json();
      console.log('IPFS Hash for full complaint:', ipfsHash);
      
      // 6. Send to insert endpoint (optional backup database)
      const insertResponse = await axios.post('https://lavish-cooperation-production.up.railway.app/upload-json', {
        ipfsHash: ipfsHash,
        trackingId
      });
      
      if (insertResponse.status < 200 || insertResponse.status >= 300) {
        console.warn('Database insertion warning - continuing anyway');
      }
      
      // 7. Save ID if not already set by blockchain
      if (!id) {
        setId(trackingId);
      }
      
      // 8. Move to confirmation
      setStep(6);
      router.prefetch('/');
  
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error submitting complaint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8 px-2 ">

        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                    ? "bg-green-100 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle className="h-5 w-5 text-green-300" /> : i}
            </div>
            <span className="text-xs mt-1 hidden sm:block">
              {i === 1 ? "Type" : i === 2 ? "Location" : i === 3 ? "Evidence" : i === 4 ? "Contact" : "Review"}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-green-200 via-white to-green-200">
            

      <main className="container px-4 pt-32 md:px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Register New Complaint</h1>
          <p className="text-muted-foreground mb-6">
            Please provide the details of your complaint. All information will be securely stored on blockchain.
          </p>

          {step < 6 && renderStepIndicator()}

          {/* Step 1 - Complaint Type */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Complaint Type</CardTitle>
                <CardDescription>Select the type of complaint you want to register</CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintTypeSelector selectedType={complaintType} onSelect={setComplaintType} />
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="" htmlFor="description">Brief Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the issue in detail"
                      value={description}
                      className="mt-3"
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleNext} disabled={!complaintType || !description}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2 - Location */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Location Details</CardTitle>
                <CardDescription>Provide the location where the incident occurred</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter the address"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleNext} disabled={!locationAddress}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3 - Evidence */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Evidence Submission</CardTitle>
                <CardDescription>Upload files related to your complaint - they will be securely stored on IPFS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Section */}
                <div className="border rounded-md p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload files</p>
                    </div>
                  </Label>
                  
                  {/* Display Uploaded Files */}
                  {evidenceFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Files to be uploaded to IPFS:</p>
                      {evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Evidence Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="evidence-description">Evidence Description</Label>
                  <textarea
                    id="evidence-description"
                    value={evidenceDescription}
                    onChange={(e) => setEvidenceDescription(e.target.value)}
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="Add any additional information about the evidence..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4 - Contact */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Contact Information</CardTitle>
                <CardDescription>Provide your contact details so we can update you on your complaint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Checkbox checked={termsAccepted} onCheckedChange={(checked: boolean) => setTermsAccepted(checked)} />
                    <span>I understand this information will be stored on the blockchain</span>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 5 - Review */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 5: Review & Submit</CardTitle>
                <CardDescription>Please review your complaint details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Existing sections */}
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Complaint Type</h3>
                    <p>{complaintType}</p>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Location</h3>
                    <p>{locationAddress}</p>
                  </div>

                  {/* Evidence Section */}
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Evidence</h3>
                    <div className="space-y-3">
                      {evidenceFiles.length > 0 ? (
                        <>
                          <p className="text-sm font-medium">Files to be uploaded to IPFS:</p>
                          <div className="space-y-2">
                            {evidenceFiles.map((file, index) => (
                              <div 
                                key={index}
                                className="flex items-center p-2 bg-muted rounded"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-sm truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No files uploaded</p>
                      )}

                      <div className="pt-2">
                        <p className="text-sm font-medium">Evidence Description:</p>
                        <p className="text-sm text-muted-foreground">
                          {evidenceDescription || "No additional description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <p><strong>Name:</strong> {contactName || "Not provided"}</p>
                    <p><strong>Email:</strong> {contactEmail || "Not provided"}</p>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-yellow-50">
                    <h3 className="font-medium mb-2">Blockchain Storage</h3>
                    <p className="text-sm">
                      {walletConnected ? 
                        "Your connected wallet will be used to store this complaint on the blockchain." :
                        "Please connect your wallet to store this complaint securely on the blockchain."
                      }
                    </p>
                    {!walletConnected && (
                      <Button onClick={connectWallet} className="mt-2" size="sm">
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button className="bg-green-600 hover:bg-green-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 6 - Confirmation */}
          {step === 6 && (
            <Card>
              <CardHeader className="text-center pb-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Complaint Submitted Successfully!</CardTitle>
                <CardDescription>
                  Your complaint has been registered with ID: {id}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <p>
                    Your evidence has been securely stored on IPFS and referenced in the blockchain.
                  </p>
                  
                  {evidenceCIDs.length > 0 && (
                    <div className="bg-green-100 border-accent-foreground p-4 rounded-md text-left">
                      <h3 className="font-medium mb-2">Evidence IPFS References:</h3>
                      <div className="space-y-2 text-sm overflow-hidden">
                        {evidenceCIDs.map((cid, index) => (
                          <div key={index} className="bg-background p-2 rounded break-all">
                            <span className="font-mono">{cid}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}