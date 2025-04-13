"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

interface ChatInterfaceProps {
  message: string
  setMessage: (message: string) => void
  chatHistory: { text: string; isUser: boolean; timestamp: Date }[]
  isLoading: boolean
  isBanned: boolean
  onSendMessage: () => void
  onReload: () => void
}

export function ChatInterface({
  message,
  setMessage,
  chatHistory,
  isLoading,
  isBanned,
  onSendMessage,
  onReload,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <CardHeader className="border-b px-4 py-3 flex-shrink-0 sticky top-0 z-10 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <CardTitle className="text-base">Hate Speech Detection</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="h-8 w-8" />
            <Button variant="outline" size="icon" onClick={onReload} className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Reload</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm max-w-[250px]">
              Send a message to analyze it for hate speech content.
              <span className="block mt-2 text-xs opacity-70">
                Note: If the backend API is not available, the system will use demo mode with simulated results.
              </span>
            </p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              className={`flex ${chat.isUser ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  chat.isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm break-words">{chat.text}</span>
                  <span className="text-xs mt-1 opacity-70 self-end">{formatTime(chat.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <Card className="rounded-none border-t border-l-0 border-r-0 border-b-0 sticky bottom-0 z-10 bg-background">
        <CardContent className="p-4">
          {isBanned ? (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center">
              <Badge variant="destructive" className="mb-2">
                Account Suspended
              </Badge>
              <p className="text-sm text-muted-foreground">
                Your account has been temporarily suspended due to hate speech violation. Click the reload button to
                start a new session.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || isBanned}
                className="rounded-full bg-muted border-none"
              />
              <Button
                size="icon"
                disabled={!message.trim() || isLoading || isBanned}
                onClick={onSendMessage}
                className="rounded-full h-10 w-10 shrink-0"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
