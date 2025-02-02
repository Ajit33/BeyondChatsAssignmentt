"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Facebook, Linkedin, Twitter, MessageCircle, X, Copy, Check } from "lucide-react"

interface ChatbotIntegrationProps {
  onComplete: () => void

}

export default function ChatbotIntegration({ onComplete }: ChatbotIntegrationProps) {
  const [isIntegrated, setIsIntegrated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTestChatbot = () => {
    setShowChatbot(true)
  }

  const handleIntegrate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsIntegrated(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleMailInstructions = () => {
    console.log("Mailing instructions to developer")
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('<script src="https://example.com/chatbot.js"></script>')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }


  const DummyChatbot = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {showChatbot && (
        <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-3 flex justify-between items-center">
            <span className="text-white font-medium">Chat Support</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-blue-100"
              onClick={() => setShowChatbot(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 h-64 bg-gray-50">
            <div className="text-center text-gray-500 text-sm">This is a demo chatbot interface</div>
          </div>
        </div>
      )}
      {!showChatbot && (
        <Button
          className="rounded-full p-3 h-12 w-12 shadow-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          onClick={() => setShowChatbot(true)}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  )

  const TopBar = () => (
    <div className="bg-yellow-50 border-b border-yellow-100 p-2 text-center text-sm">
      <span className="text-yellow-800">
        Chatbot not working as intended?
        <button className="ml-2 text-blue-600 hover:underline">Share feedback</button>
      </span>
    </div>
  )

  const IntegrationSuccess = () => (
    <div className="space-y-6">
      <div className="py-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800 text-lg font-semibold">Integration Successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            Congratulations! Your chatbot has been successfully integrated.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          onClick={() => onComplete()}
        >
          Explore Admin Panel
        </Button>
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          onClick={handleTestChatbot}
        >
          Start Talking to Your Chatbot
        </Button>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-sm font-medium mb-4">Share your success:</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </Button>
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <TopBar />
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chatbot Integration & Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleTestChatbot}
              className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            >
              Test Chatbot
            </Button>
          </div>

          <Tabs defaultValue="copy-paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="copy-paste">Copy-Paste Integration</TabsTrigger>
              <TabsTrigger value="mail">Mail Instructions</TabsTrigger>
            </TabsList>

            <TabsContent value="copy-paste" className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">
                  Copy and paste the following code within the <code>{"<head>"}</code> tag of your website:
                </p>
                <div className="bg-slate-900 text-slate-50 p-4 rounded font-mono text-sm relative">
                  <code>{`<script src="https://example.com/chatbot.js"></script>`}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-100"
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mail">
              <Button
                onClick={handleMailInstructions}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
              >
                Mail Instructions to Developer
              </Button>
            </TabsContent>
          </Tabs>

          <div className="pt-6">
            <Button
              onClick={handleIntegrate}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
              disabled={isLoading}
            >
              {isLoading ? "Testing Integration..." : "Test Integration"}
            </Button>

            {isIntegrated ? (
              <div className="mt-6">
                <IntegrationSuccess />
              </div>
            ) : (
              <Alert className="mt-4">
                <AlertTitle>Integration not detected</AlertTitle>
                <AlertDescription>
                  Please make sure you've added the code to your website and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      <DummyChatbot />
    </>
  )
}

