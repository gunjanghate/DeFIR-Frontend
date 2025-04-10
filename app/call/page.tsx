"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, X, Delete } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DialerApp() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setIpAddress(data.ip)
      } catch (error) {
        console.error("Error fetching IP address:", error)
      }
    }
    fetchIpAddress()
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecording(true)
      setIsCallActive(true)
      setCallDuration(0)

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        await sendToServer(audioBlob)
      }

      mediaRecorderRef.current.start()
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      stopRecording()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRecording(false)
    setIsCallActive(false)
  }

  const sendToServer = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("file", audioBlob, `recording-${Date.now()}.wav`)
      formData.append(
        "metadata",
        JSON.stringify({
          phoneNumber,
          ipAddress,
          duration: callDuration,
          timestamp: new Date().toISOString(),
        })
      )

      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Server error")
      const result = await response.json()
      console.log("Server response:", result)
    } catch (error) {
      console.error("Error submitting recording:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNumberClick = (num: string) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + num)
    }
  }

  const handleDeleteClick = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        {isCallActive ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-2xl font-bold mb-2">DeFIR</div>
            <div className="text-green-500 mb-4">
              {isRecording ? "Recording..." : "Call connected"}
            </div>
            <div className="text-xl mb-8">{formatTime(callDuration)}</div>

            <Button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <X className="h-8 w-8" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <input
              type="text"
              value={phoneNumber}
              readOnly
              className="w-full text-center text-3xl font-semibold mb-4 bg-transparent outline-none"
              placeholder="Enter phone number"
            />
            <div className="grid grid-cols-3 gap-4 p-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
                <Button key={num} onClick={() => handleNumberClick(num.toString())} className="rounded-full h-16 w-16 text-2xl font-medium mx-auto">
                  {num}
                </Button>
              ))}
            </div>
            <div className="flex justify-between w-full px-6">
              <Button onClick={startRecording} className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16">
                <Phone className="h-6 w-6" />
              </Button>
              <Button onClick={handleDeleteClick} className="rounded-full w-16 h-16">
                <Delete className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
