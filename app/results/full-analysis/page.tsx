// app/results/full-analysis/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Download, ArrowLeft, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type { DetectionResult } from "@/components/hate-speech-dashboard"
import { HateSpeechScoreChart } from "@/components/hate-speech-score-chart"
import { CategoryBreakdownChart } from "@/components/category-breakdown-chart"
import { AnalysisLoading } from "@/components/analysis-loading"
import { toast,Toaster } from "sonner"

export default function FullAnalysisPage() {
  const router = useRouter()
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Retrieve result from localStorage
    const storedResult = localStorage.getItem('analysisResult')
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult))
      } catch (error) {
        console.error('Error parsing stored result:', error)
        toast.error("Error Loading Analysis", {
          description: "There was an error loading the analysis data. Please try again.",
        })
      }
    }
    
    // Simulated loading for UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // Handler for downloading the report
  const handleDownloadReport = async () => {
    if (!result) return
    
    try {
      setIsDownloading(true)
      
      const response = await fetch('/api/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate report')
      }
      
      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
      
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url
      link.download = 'hate-speech-analysis-report.pdf'
      
      // Append the link to the body
      document.body.appendChild(link)
      
      // Click the link to download the file
      link.click()
      
      // Remove the link from the body
      document.body.removeChild(link)
      
      // Revoke the URL
      window.URL.revokeObjectURL(url)
      
      toast.success("Report Downloaded", {
        description: "Your analysis report has been successfully downloaded.",
      })
    } catch (error) {
      console.error('Error downloading report:', error)
      toast.error("Download Failed", {
        description: "There was an error downloading the report. Please try again.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading || !result) {
    return <AnalysisLoading />
  }

  const generateCategoryData = (result: DetectionResult) => {
    // Generate category data based on the detection result
    const baseCategories = [
      { name: "Hate Speech", value: result.scores.hateSpeech },
      { name: "Offensive", value: result.scores.offensive },
    ]

    // Add additional categories based on the detection result
    if (result.isHateSpeech) {
      return [
        ...baseCategories,
        { name: "Threat", value: result.metrics.severity * 0.8 },
        { name: "Harassment", value: result.metrics.severity * 0.7 },
        { name: "Discrimination", value: result.metrics.severity * 0.9 },
      ]
    }

    return [
      ...baseCategories,
      { name: "Neutral", value: result.scores.neutral },
      { name: "Informative", value: result.scores.neutral * 0.9 },
      { name: "Positive", value: result.scores.neutral * 0.7 },
    ]
  }

  return (
    <motion.div
      className="min-h-screen w-full overflow-x-hidden pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <Toaster   position="bottom-right"
  theme="system"
  richColors
  closeButton
  />
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Full Analysis Review</h1>
              <p className="text-sm text-muted-foreground">Comprehensive report of content analysis</p>
            </div>
            <Badge variant={result.isHateSpeech ? "destructive" : "outline"} className="ml-2">
              {result.isHateSpeech ? "Hate Speech Detected" : "No Hate Speech"}
            </Badge>
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Generating..." : "Download Report"}
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Report Header Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">Analysis Report</CardTitle>
                  <CardDescription className="text-sm">
                    Analysis completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit">
                  Analysis ID: HSA-{Math.floor(Math.random() * 1000000)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {result.isHateSpeech ? (
                  <Badge variant="destructive" className="px-3 py-1">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Hate Speech Detected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Safe Content
                  </Badge>
                )}

                {result.metrics.targetGroup && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Target: {result.metrics.targetGroup}
                  </Badge>
                )}

                {result.metrics.category && (
                  <Badge variant="outline" className="px-3 py-1">
                    Category: {result.metrics.category}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Message Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{result.message}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Analyzed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    {result.isHateSpeech
                      ? `This message was classified as hate speech with ${(result.metrics.confidence * 100).toFixed(1)}% confidence. The content contains language that targets specific groups or individuals in a harmful way.`
                      : `This message was classified as safe content with ${(result.metrics.confidence * 100).toFixed(1)}% confidence. No harmful or offensive content was detected.`}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Hate Speech Score</span>
                        <span className="text-sm font-mono">{(result.scores.hateSpeech * 100).toFixed(2)}%</span>
                      </div>
                      <Progress
                        value={result.scores.hateSpeech * 100}
                        className="h-2"
                        indicatorClassName={result.scores.hateSpeech > 0.5 ? "bg-destructive" : "bg-primary"}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Offensive Content</span>
                        <span className="text-sm font-mono">{(result.scores.offensive * 100).toFixed(2)}%</span>
                      </div>
                      <Progress
                        value={result.scores.offensive * 100}
                        className="h-2"
                        indicatorClassName={result.scores.offensive > 0.7 ? "bg-destructive" : "bg-primary"}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Neutral Content</span>
                        <span className="text-sm font-mono">{(result.scores.neutral * 100).toFixed(2)}%</span>
                      </div>
                      <Progress value={result.scores.neutral * 100} className="h-2" />
                    </div>
                  </div>

                  {result.isHateSpeech && (
                    <div className="mt-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-destructive">Content Warning</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            This message violates community guidelines on hate speech. The account has been
                            temporarily suspended.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detection Result</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <div className="w-full max-w-sm">
                  <HateSpeechScoreChart scores={result.scores} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <div className="w-full max-w-sm">
                  <CategoryBreakdownChart data={generateCategoryData(result)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Confidence Score</h4>
                      <span className="text-sm font-mono">{(result.metrics.confidence * 100).toFixed(2)}%</span>
                    </div>
                    <Progress value={result.metrics.confidence * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      How confident the model is in its classification
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Severity Level</h4>
                      <span className="text-sm font-mono">{(result.metrics.severity * 100).toFixed(2)}%</span>
                    </div>
                    <Progress
                      value={result.metrics.severity * 100}
                      className="h-2"
                      indicatorClassName={result.metrics.severity > 0.5 ? "bg-destructive" : "bg-primary"}
                    />
                    <p className="text-xs text-muted-foreground">How severe the detected content is rated</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Target Analysis</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {result.metrics.targetGroup ? (
                        <Badge variant="secondary">Target: {result.metrics.targetGroup}</Badge>
                      ) : (
                        <Badge variant="outline">No specific target detected</Badge>
                      )}

                      {result.metrics.category && (
                        <Badge variant="outline">Category: {result.metrics.category}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Identifies if the content targets specific groups or individuals
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Understanding the Metrics
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="space-y-1">
                        <h5 className="font-medium">Hate Speech Score</h5>
                        <p className="text-xs text-muted-foreground">
                          Measures the likelihood that content contains hate speech targeting individuals or groups
                          based on protected attributes
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-medium">Offensive Content</h5>
                        <p className="text-xs text-muted-foreground">
                          Measures the presence of offensive language, profanity, or insults that may be inappropriate
                          but don't necessarily constitute hate speech
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-medium">Confidence Score</h5>
                        <p className="text-xs text-muted-foreground">
                          Indicates how certain the model is about its classification, with higher values representing
                          greater confidence
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-medium">Severity Level</h5>
                        <p className="text-xs text-muted-foreground">
                          Measures how extreme or harmful the detected content is, with higher values indicating more
                          severe violations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Guidelines Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our platform prohibits the following types of content:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Hate Speech</h4>
                    <p className="text-xs text-muted-foreground">
                      Content that promotes violence against, threatens, or dehumanizes people based on protected characteristics
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Harassment</h4>
                    <p className="text-xs text-muted-foreground">
                      Targeted abuse or harassment against individuals or groups
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Threats</h4>
                    <p className="text-xs text-muted-foreground">
                      Direct or indirect threats of violence against any person or group
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Discrimination</h4>
                    <p className="text-xs text-muted-foreground">
                      Content that promotes discrimination based on race, ethnicity, national origin, religious affiliation, sexual
                      orientation, gender, gender identity, or disability
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}