"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useComplaintStore } from "../../../lib/stores/complaintStore";

export default function TrackComplaintPage() {
  const router = useRouter()
  const [trackingId, setTrackingId] = useState("")
  const [error, setError] = useState("")

  

  useComplaintStore((state: { getComplaintByTrackingId: (id: string) => void }) => state.getComplaintByTrackingId(trackingId));


  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingId.trim()) {
      setError("Please enter a tracking ID")
      return
    }

    router.push(`/complaints/status/${trackingId}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-poppins bg-gradient-to-bl from-green-200 via-white to-green-300">
      

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Track Your Complaint</CardTitle>
          <CardDescription>Enter your complaint tracking ID to check its status</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="tracking-id"
                placeholder="Enter tracking ID (e.g., ABC12345)"
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value)
                  setError("")
                }}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <p className="text-xs text-muted-foreground">
                You can find your tracking ID in the SMS sent to you or in your email confirmation.
              </p>
            </div>

            <Button className="bg-green-600 hover:bg-green-700 w-full gap-2" type="submit">
              <Search className="h-4 w-4" />
              Track Complaint
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button  variant="ghost" size="sm" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
        </CardFooter>
      </Card>
    </div>
  )
}