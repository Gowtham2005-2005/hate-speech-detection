"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { ModelInfo } from "@/components/model-info"
import { DetectionResults } from "@/components/detection-results"
import { useToast } from "@/hooks/use-toast"

export interface DetectionResult {
  isHateSpeech: boolean
  scores: {
    hateSpeech: number
    offensive: number
    neutral: number
  }
  metrics: {
    confidence: number
    severity: number
    targetGroup: string | null
    category: string | null
  }
  message: string
}

export function HateSpeechDashboard() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // Fix: Initialize isBanned with a boolean value instead of referencing itself
  const [isBanned, setIsBanned] = useState(false)
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null)
  const { toast } = useToast()

  // Update the handleSendMessage function to include a fallback mechanism
  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message to chat
    const newMessage = { text: message, isUser: true, timestamp: new Date() }
    setChatHistory([...chatHistory, newMessage])

    // Clear input and set loading
    setMessage("")
    setIsLoading(true)

    try {
      // Try to call API
      let data: DetectionResult

      try {
        const response = await fetch("http://localhost:8000/detect-hate-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newMessage.text }),
        })

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const apiResponse = await response.json()
        
        // Transform the API response to match the expected format
        data = {
          isHateSpeech: apiResponse.is_hate_speech,
          scores: {
            hateSpeech: apiResponse.is_hate_speech ? apiResponse.confidence : 0,
            offensive: apiResponse.is_hate_speech ? apiResponse.confidence * 0.8 : 0,
            neutral: apiResponse.is_hate_speech ? 0 : apiResponse.confidence,
          },
          metrics: {
            confidence: apiResponse.confidence,
            severity: apiResponse.is_hate_speech ? apiResponse.confidence : 0,
            targetGroup: apiResponse.is_hate_speech ? "general" : null,
            category: apiResponse.is_hate_speech ? "hate speech" : null,
          },
          message: apiResponse.original_text,
        }
      } catch (error) {
        console.warn("API call failed, using mock data instead:", error)

        // Generate mock data based on the message content
        const containsHateKeywords = /\b(hate|stupid|idiot|kill|racist|ugly)\b/i.test(newMessage.text)

        // Mock data for demonstration when API is unavailable
        data = {
          isHateSpeech: containsHateKeywords,
          scores: {
            hateSpeech: containsHateKeywords ? 0.78 : 0.12,
            offensive: containsHateKeywords ? 0.65 : 0.25,
            neutral: containsHateKeywords ? 0.22 : 0.88,
          },
          metrics: {
            confidence: containsHateKeywords ? 0.85 : 0.92,
            severity: containsHateKeywords ? 0.72 : 0.15,
            targetGroup: containsHateKeywords ? "general" : null,
            category: containsHateKeywords ? "offensive language" : null,
          },
          message: newMessage.text,
        }

        // Show toast about using mock data
        toast({
          title: "Using Demo Mode",
          description: "Backend API not available. Using simulated detection results.",
          variant: "default",
        })
      }

      setDetectionResult(data)

      // Add response to chat
      setChatHistory((prev) => [
        ...prev,
        {
          text: `Message analyzed: ${data.isHateSpeech ? "Hate speech detected" : "No hate speech detected"}`,
          isUser: false,
          timestamp: new Date(),
        },
      ])

      // Handle hate speech detection
      if (data.isHateSpeech) {
        setIsBanned(true)
        toast({
          title: "User Banned",
          description: "Hate speech detected in your message. Your account has been temporarily suspended.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in hate speech detection flow:", error)
      toast({
        title: "Error",
        description: "Something went wrong with the analysis. Please try again.",
        variant: "destructive",
      })

      // Add error message to chat
      setChatHistory((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't analyze that message. Please try again or reload the page.",
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReload = () => {
    setChatHistory([])
    setDetectionResult(null)
    setIsBanned(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-[400px] border-r border-border">
        <ChatInterface
          message={message}
          setMessage={setMessage}
          chatHistory={chatHistory}
          isLoading={isLoading}
          isBanned={isBanned}
          onSendMessage={handleSendMessage}
          onReload={handleReload}
        />
      </div>
      <div className="flex-1 overflow-y-auto h-screen">
        {detectionResult ? <DetectionResults result={detectionResult} /> : <ModelInfo />}
      </div>
    </div>
  )
}
