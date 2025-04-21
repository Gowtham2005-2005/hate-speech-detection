"use client"

import { useState, useEffect } from "react"
import { Download, BarChart2, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { DetectionResult } from "@/components/hate-speech-dashboard"
import { HateSpeechScoreChart } from "@/components/hate-speech-score-chart"
import { CategoryBreakdownChart } from "@/components/category-breakdown-chart"
import { AnalysisLoading } from "@/components/analysis-loading"
import { toast, Toaster } from "sonner"
interface DetectionResultsProps {
  result: DetectionResult
}

export function DetectionResults({ result }: DetectionResultsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  // Add useEffect to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  

    const handleDownloadReport = async () => {
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

    const handleViewFullAnalysis = () => {
    // Store the result in localStorage for retrieval in the full analysis page
    localStorage.setItem('analysisResult', JSON.stringify(result))
    // Navigate to the full analysis page
    router.push('/results/full-analysis')
  }
  if (isLoading) {
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
      className="h-screen w-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster   position="bottom-right"
  theme="system"
  richColors
  closeButton
  />
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <Badge variant={result.isHateSpeech ? "destructive" : "outline"} className="ml-2">
              {result.isHateSpeech ? "Hate Speech Detected" : "No Hate Speech"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Generating..." : "Download Report"}
            </Button>
            <Button size="sm" onClick={handleViewFullAnalysis}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Full Analysis
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Card className="border-none shadow-md h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl">Message Analysis Summary</CardTitle>
                  <CardDescription className="text-sm">
                    Analysis completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit">
                  Analysis ID: HSA-{Math.floor(Math.random() * 1000000)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="px-6 pt-4 border-b">
                  <TabsList className="h-10 w-full grid-cols-3 p-1">
                    <TabsTrigger value="overview" className="text-sm">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="text-sm">
                      Detailed Metrics
                    </TabsTrigger>
                    <TabsTrigger value="message" className="text-sm">
                      Message Content
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  <TabsContent value="overview" className="h-full mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                      {/* Left panel - fixed width */}
                      <div className="flex flex-col lg:col-span-1">
                        <h3 className="text-lg font-medium mb-4">Detection Result</h3>
                        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl p-6">
                          <HateSpeechScoreChart scores={result.scores} />
                        </div>
                      </div>

                      {/* Right panel - takes remaining space */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Analysis Summary</h3>
                          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
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

                            <Separator className="my-2" />

                            <div className="pt-2">
                              <h4 className="text-sm font-medium mb-3">Analysis Result</h4>
                              <div className="flex flex-wrap items-center gap-2">
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
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Analysis Explanation</h3>
                          <Card className="border border-border/50">
                            <CardContent className="pt-6">
                              <p className="text-sm text-muted-foreground">
                                {result.isHateSpeech
                                  ? `This message was classified as hate speech with ${(result.metrics.confidence * 100).toFixed(1)}% confidence. The content contains language that targets specific groups or individuals in a harmful way.`
                                  : `This message was classified as safe content with ${(result.metrics.confidence * 100).toFixed(1)}% confidence. No harmful or offensive content was detected.`}
                              </p>

                              {result.isHateSpeech && (
                                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
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
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="h-full mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                      {/* Left panel - fixed width */}
                      <div className="flex flex-col lg:col-span-1">
                        <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
                        <div className="flex-1 bg-muted/30 rounded-xl p-6 flex items-center justify-center">
                          <CategoryBreakdownChart data={generateCategoryData(result)} />
                        </div>
                      </div>

                      {/* Right panel - takes remaining space */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Detailed Metrics</h3>
                          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
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

                            <Separator />

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

                            <Separator />

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
                        </div>

                        <Card className="border border-border/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Info className="h-4 w-4 text-primary" />
                              Understanding the Metrics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <h4 className="font-medium">Hate Speech Score</h4>
                                <p className="text-xs text-muted-foreground">
                                  Measures the likelihood that content contains hate speech targeting individuals or groups
                                  based on protected attributes
                                </p>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-medium">Offensive Content</h4>
                                <p className="text-xs text-muted-foreground">
                                  Measures the presence of offensive language, profanity, or insults that may be inappropriate
                                  but don't necessarily constitute hate speech
                                </p>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-medium">Confidence Score</h4>
                                <p className="text-xs text-muted-foreground">
                                  Indicates how certain the model is about its classification, with higher values representing
                                  greater confidence
                                </p>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-medium">Severity Level</h4>
                                <p className="text-xs text-muted-foreground">
                                  Measures how extreme or harmful the detected content is, with higher values indicating more
                                  severe violations
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="message" className="h-full mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                      {/* Left panel - fixed width */}
                      <div className="flex flex-col lg:col-span-1">
                        <h3 className="text-lg font-medium mb-4">Message Analysis</h3>
                        <div className="flex-1 bg-muted/30 rounded-xl p-6 flex flex-col justify-between">
                          <div className="space-y-4 flex-1">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm">{result.message}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant={result.isHateSpeech ? "destructive" : "outline"} className="px-3 py-1">
                                {result.isHateSpeech ? "Hate Speech Detected" : "No Hate Speech"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-4">
                            Analyzed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      {/* Right panel - takes remaining space */}
                      <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-medium">Content Guidelines</h3>
                        <Card className="border border-border/50">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Our platform prohibits the following types of content:
                              </p>
                              <ul className="list-disc pl-5 text-sm space-y-2">
                                <li className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Hate speech:</span> Content that promotes
                                  violence against, threatens, or dehumanizes people based on protected characteristics
                                </li>
                                <li className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Harassment:</span> Targeted abuse or
                                  harassment against individuals or groups
                                </li>
                                <li className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Threats:</span> Direct or indirect threats of
                                  violence against any person or group
                                </li>
                                <li className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Discrimination:</span> Content that promotes
                                  discrimination based on race, ethnicity, national origin, religious affiliation, sexual
                                  orientation, gender, gender identity, or disability
                                </li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}