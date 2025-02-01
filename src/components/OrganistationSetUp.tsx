"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface OrganizationSetupProps {
  onComplete: (data: any) => void
}

interface WebPage {
  url: string
  status: "pending" | "scraped"
  dataChunks: string[]
}

export default function OrganizationSetup({ onComplete }: OrganizationSetupProps) {
  const [companyName, setCompanyName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [description, setDescription] = useState("")
  const [webPages, setWebPages] = useState<WebPage[]>([])
  const [selectedPage, setSelectedPage] = useState<WebPage | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [allPagesScraped, setAllPagesScraped] = useState(false)

  useEffect(() => {
    if (websiteUrl) {
      fetchMetaDescription()
    }
  }, [websiteUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ companyName, websiteUrl, description })
  }

  const fetchMetaDescription = async () => {
    // Simulating API call to fetch meta description
    setTimeout(() => {
      setDescription(`This is an auto-fetched meta description for ${websiteUrl}`)
    }, 1000)
  }

  const simulateWebScraping = () => {
    setIsTraining(true)
    const dummyPages: WebPage[] = [
      { url: "Home", status: "pending", dataChunks: [] },
      { url: "About", status: "pending", dataChunks: [] },
      { url: "Products", status: "pending", dataChunks: [] },
      { url: "Contact", status: "pending", dataChunks: [] },
      { url: "Blog", status: "pending", dataChunks: [] },
    ]
    setWebPages(dummyPages)

    // Simulate scraping process
    dummyPages.forEach((page, index) => {
      setTimeout(
        () => {
          setWebPages((prevPages) => {
            const updatedPages = [...prevPages]
            updatedPages[index] = {
              ...updatedPages[index],
              status: "scraped",
              dataChunks: [`${page.url} content`, `${page.url} metadata`, `${page.url} links`],
            }
            if (index === dummyPages.length - 1) {
              setIsTraining(false)
              setAllPagesScraped(true)
            }
            return updatedPages
          })
        },
        (index + 1) * 2000,
      ) // Simulate 2 seconds per page
    })
  }

  const showPageData = (page: WebPage) => {
    setSelectedPage(page)
  }

  const isSetupComplete = companyName && websiteUrl && description

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Setup Organisation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="border-t-0 border-x-0 rounded-none focus:ring-0"
            />
          </motion.div>
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
              className="border-t-0 border-x-0 rounded-none focus:ring-0"
            />
          </motion.div>
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border-t-0 border-x-0 rounded-none focus:ring-0"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button type="button" onClick={simulateWebScraping} disabled={isTraining || !isSetupComplete}>
              {isTraining ? "Web Scraping in Progress..." : "Start Web Scraping"}
            </Button>
          </motion.div>
          {webPages.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold">Scraped Pages</h3>
              <div className="grid grid-cols-2 gap-2">
                {webPages.map((page) => (
                  <Button
                    key={page.url}
                    variant={page.status === "scraped" ? "default" : "outline"}
                    onClick={() => showPageData(page)}
                    className="justify-between"
                  >
                    {page.url}
                    <span className={`text-xs ${page.status === "scraped" ? "text-green-500" : "text-yellow-500"}`}>
                      {page.status}
                    </span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
          {selectedPage && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold">Data from {selectedPage.url}</h3>
              {selectedPage.dataChunks.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedPage.dataChunks.map((chunk, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {chunk}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p>No data chunks available yet.</p>
              )}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button type="submit" className="w-full" disabled={!allPagesScraped}>
              Continue to Chatbot Integration
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}

