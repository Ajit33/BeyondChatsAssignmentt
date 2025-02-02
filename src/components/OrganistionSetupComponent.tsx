import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"


interface OrganizationSetupProps {
    onComplete: (data: {
      companyName: string
      websiteUrl: string
      description: string
      webPages: WebPage[]
    }) => void
    preventNavigation?: boolean
    initialData?: {
      companyName?: string
      websiteUrl?: string
      description?: string
    }
  }
  
  interface WebPage {
    url: string
    status: "pending" | "scraped"
    dataChunks: {
      type: string
      content: string
    }[]
  }
  
  interface MetaData {
    title: string
    description: string
    error?: string
  }
  
  interface WebPageButtonProps {
    page: WebPage
    isSelected: boolean
    onClick: (e: React.MouseEvent) => void
    className?: string
  }
  
  const WebPageButton: React.FC<WebPageButtonProps> = ({
    page,
    isSelected,
    onClick,
    className
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      onClick(e)
    }
  
    return (
      <Button
        type="button"
        onClick={handleClick}
        variant={page.status === "scraped" ? "default" : "outline"}
        className={`w-full justify-between h-auto py-2 px-3 ${
          isSelected ? "ring-2 ring-indigo-500" : ""
        } ${
          page.status === "scraped"
            ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
            : ""
        } ${className || ""}`}
      >
        <span className="truncate">{page.url}</span>
        <span
          className={`ml-2 text-xs ${
            page.status === "scraped"
              ? "text-green-500"
              : "text-yellow-500"
          }`}
        >
          {page.status === "scraped" ? "✓" : "..."}
        </span>
      </Button>
    )
  }
  
  export default function OrganizationSetup({ 
    onComplete, 
    preventNavigation = false,
    initialData = {}
  }: OrganizationSetupProps) {
    const [companyName, setCompanyName] = useState(initialData.companyName || "")
    const [websiteUrl, setWebsiteUrl] = useState(initialData.websiteUrl || "")
    const [description, setDescription] = useState(initialData.description || "")
    const [webPages, setWebPages] = useState<WebPage[]>([])
    const [selectedPage, setSelectedPage] = useState<WebPage | null>(null)
    const [isTraining, setIsTraining] = useState(false)
    const [allPagesScraped, setAllPagesScraped] = useState(false)
    const [isFetchingMeta, setIsFetchingMeta] = useState(false)
    const [metaError, setMetaError] = useState<string>("")
    const [metaData, setMetaData] = useState<MetaData | null>(null)
  
    useEffect(() => {
      if (websiteUrl) {
        const timer = setTimeout(() => {
          if (isValidUrl(websiteUrl)) {
            fetchMetaData()
          }
        }, 500)
        return () => clearTimeout(timer)
      }
    }, [websiteUrl])
  
    const isValidUrl = (url: string) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }
  
    const fetchMetaData = async () => {
      setIsFetchingMeta(true)
      setMetaError("")
      
      try {
        const response = await fetch(`/api/fetch-meta?url=${encodeURIComponent(websiteUrl)}`)
        if (!response.ok) throw new Error('Failed to fetch meta data')
        
        const data = await response.json()
        setMetaData(data)
        
        if (!description || description === "") {
          setDescription(data.description || '')
        }
        
        if (!companyName || companyName === "") {
          setCompanyName(data.title?.split('|')[0]?.trim() || '')
        }
      } catch (error) {
        setMetaError('Could not fetch website metadata. Please enter description manually.')
        console.error('Failed to fetch meta description:', error)
      } finally {
        setIsFetchingMeta(false)
      }
    }
  
    const simulateWebScraping = () => {
      setIsTraining(true)
      const dummyPages: WebPage[] = [
        { url: "Home", status: "pending", dataChunks: [] },
        { url: "About Us", status: "pending", dataChunks: [] },
        { url: "Products", status: "pending", dataChunks: [] },
        { url: "Services", status: "pending", dataChunks: [] },
        { url: "Blog", status: "pending", dataChunks: [] },
        { url: "Contact", status: "pending", dataChunks: [] }
      ]
      setWebPages(dummyPages)
  
      dummyPages.forEach((page, index) => {
        setTimeout(() => {
          setWebPages(prevPages => {
            const updatedPages = [...prevPages]
            updatedPages[index] = {
              ...updatedPages[index],
              status: "scraped",
              dataChunks: [
                {
                  type: "Meta Information",
                  content: `Title: ${page.url} | ${companyName}\nDescription: Comprehensive information about our ${page.url.toLowerCase()} section.`
                },
                {
                  type: "Main Content",
                  content: `Detailed content about ${page.url.toLowerCase()} including key features and benefits.`
                },
                {
                  type: "SEO Data",
                  content: `Keywords: ${page.url.toLowerCase()}, ${companyName.toLowerCase()}, business\nMeta Description: Learn more about our ${page.url.toLowerCase()} offerings.`
                },
                {
                  type: "Navigation Links",
                  content: "Home, About Us, Products, Services, Blog, Contact"
                }
              ]
            }
            if (index === dummyPages.length - 1) {
              setIsTraining(false)
              setAllPagesScraped(true)
            }
            return updatedPages
          })
        }, (index + 1) * 2000)
      })
    }
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!preventNavigation) {
        onComplete({ 
          companyName, 
          websiteUrl, 
          description, 
          webPages 
        })
      }
    }
  
    const isSetupComplete = companyName && websiteUrl && description
  
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-4 sm:p-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Organization Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Company Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700 text-left">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg"
                  placeholder="Enter company name"
                />
              </motion.div>
  
              {/* Website URL Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 text-left">
                  Website URL
                </Label>
                <Input
                  id="websiteUrl"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  required
                  className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg"
                  placeholder="https://example.com"
                />
              </motion.div>
  
              {/* Description Textarea */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700 text-left">
                    Description
                  </Label>
                  {isFetchingMeta && (
                    <span className="text-xs text-indigo-500 flex items-center">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Fetching website data...
                    </span>
                  )}
                </div>
                
                {metaError && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{metaError}</AlertDescription>
                  </Alert>
                )}
  
                <div className="relative">
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full min-h-[120px] sm:min-h-[150px] px-4 py-3 border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/50 rounded-lg resize-y"
                    placeholder="Enter company description"
                  />
                </div>
  
                {metaData && !metaError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-gray-500 mt-1"
                  >
                    Website meta data loaded successfully
                  </motion.div>
                )}
              </motion.div>
  
              {/* Web Scraping Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="w-full"
              >
                <Button
                  type="button"
                  onClick={simulateWebScraping}
                  disabled={isTraining || !isSetupComplete}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                >
                  {isTraining ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Web Scraping in Progress...
                    </>
                  ) : (
                    "Start Web Scraping"
                  )}
                </Button>
              </motion.div>
  
              {/* Scraped Pages Display */}
              {webPages.length > 0 && (
                <motion.div
                  className="space-y-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800">Detected Pages</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {webPages.map((page) => (
                      <WebPageButton
                        key={page.url}
                        page={page}
                        isSelected={selectedPage?.url === page.url}
                        onClick={() => setSelectedPage(page)}
                      />
                    ))}
                  </div>
  
                  {selectedPage && (
                    <motion.div
                      className="mt-6 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-md font-semibold text-gray-800">
                        Data from {selectedPage.url}
                      </h4>
                      {selectedPage.dataChunks.length > 0 ? (
                        <div className="space-y-4">
                          {selectedPage.dataChunks.map((chunk, index) => (
                            <motion.div
                              key={index}
                              className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-gray-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.1 }}
                            >
                              <h5 className="font-medium text-gray-800 mb-2">
                                {chunk.type}
                              </h5>
                              <p className="text-sm text-gray-600 whitespace-pre-line">{chunk.content}</p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Waiting for data to be scraped...
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
  
              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                  disabled={!isSetupComplete}
                >
                  Continue to Chatbot Integration
                  {!allPagesScraped && " (Scraping will continue in background)"}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }