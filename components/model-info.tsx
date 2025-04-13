"use client"

import { Info, Shield, AlertTriangle, BarChart2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ModelInfo() {
  return (
    <div className="p-6 space-y-6 h-full">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Hate Speech Detection</h1>
        <p className="text-sm text-muted-foreground">About This Model</p>
      </div>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identifies and filters harmful content to create safer online spaces
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyzes text for hate speech, offensive language, and targeted harassment
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Provides detailed metrics and confidence scores for detected content
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our hate speech detection model uses advanced natural language processing techniques to analyze text
                content:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Type a message in the chat interface on the left</li>
                <li>Our model analyzes the text for harmful content</li>
                <li>Detailed results are displayed with confidence scores and metrics</li>
                <li>If hate speech is detected, the user account is temporarily suspended</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Categories of Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hate Speech</h3>
                <p className="text-xs text-muted-foreground">
                  Content that expresses hatred toward a group based on attributes such as race, ethnicity, gender,
                  religion, sexual orientation, or disability
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Offensive Language</h3>
                <p className="text-xs text-muted-foreground">
                  Content that contains profanity, insults, or vulgar language that may be considered inappropriate
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Targeted Harassment</h3>
                <p className="text-xs text-muted-foreground">
                  Content that deliberately attacks or bullies an individual or specific group
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Threats</h3>
                <p className="text-xs text-muted-foreground">
                  Content that expresses intent to commit violence or harm against individuals or groups
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  )
}
