"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PlagiarismResults } from "@/components/plagiarism-results"
import { AnalysisLoading } from "@/components/analysis-loading"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function PlagiarismChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [checkOnlineSources, setCheckOnlineSources] = useState(true)
  const [thresholds, setThresholds] = useState({
    semantic: 0.85,
    ngram: 0.4,
    fuzzy: 0.7,
  })
  const [dragActive, setDragActive] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 3000)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle the file
      console.log("File dropped:", e.dataTransfer.files[0])
    }
  }

  if (isLoading) {
    return <AnalysisLoading />
  }

  if (showResults) {
    return <PlagiarismResults />
  }

  return (
    <div className="space-y-6 max-w-full">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Plagiarism Checker</CardTitle>
              <CardDescription className="text-base mt-1">
                Upload a PDF or provide a URL to check for plagiarism
              </CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs bg-primary/5">
              Pro Feature
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload" className="text-sm">
                Upload PDF
              </TabsTrigger>
              <TabsTrigger value="url" className="text-sm">
                PDF URL
              </TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="upload" className="space-y-4">
                <motion.div
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border"}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">Drag and drop your PDF here</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md">
                    Supported formats: PDF, DOCX, TXT (max 10MB)
                  </p>
                  <Button type="button" size="lg" className="relative overflow-hidden group">
                    <span className="relative z-10 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Files
                    </span>
                    <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
                  </Button>
                </motion.div>
              </TabsContent>
              <TabsContent value="url" className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="pdf-url">PDF URL</Label>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      id="pdf-url"
                      placeholder="https://example.com/document.pdf"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Enter a direct link to a PDF document</p>
                </div>
              </TabsContent>

              <div className="space-y-6 mt-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="font-medium text-lg">Analysis Options</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Configure how the plagiarism check will be performed</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Card className="border border-border/50">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="check-online" className="text-base">
                              Check Online Sources
                            </Label>
                            <p className="text-sm text-muted-foreground">Compare document against online sources</p>
                          </div>
                          <Switch
                            id="check-online"
                            checked={checkOnlineSources}
                            onCheckedChange={setCheckOnlineSources}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="font-medium text-lg">Detection Thresholds</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Adjust sensitivity thresholds for different types of similarity detection
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Card className="border border-border/50">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="semantic-threshold">Semantic Similarity</Label>
                            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                              {thresholds.semantic.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            id="semantic-threshold"
                            min={0.5}
                            max={1}
                            step={0.01}
                            value={[thresholds.semantic]}
                            onValueChange={(value) => setThresholds({ ...thresholds, semantic: value[0] })}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Less Strict: 0.5</span>
                            <span>More Strict: 1.0</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="ngram-threshold">N-gram Similarity</Label>
                            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                              {thresholds.ngram.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            id="ngram-threshold"
                            min={0.1}
                            max={0.8}
                            step={0.01}
                            value={[thresholds.ngram]}
                            onValueChange={(value) => setThresholds({ ...thresholds, ngram: value[0] })}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Less Strict: 0.1</span>
                            <span>More Strict: 0.8</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="fuzzy-threshold">Fuzzy Similarity</Label>
                            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                              {thresholds.fuzzy.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            id="fuzzy-threshold"
                            min={0.3}
                            max={0.9}
                            step={0.01}
                            value={[thresholds.fuzzy]}
                            onValueChange={(value) => setThresholds({ ...thresholds, fuzzy: value[0] })}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Less Strict: 0.3</span>
                            <span>More Strict: 0.9</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-8">
                <Button type="submit" size="lg" className="w-full">
                  Check for Plagiarism
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  By submitting, you agree to our{" "}
                  <a href="#" className="underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
