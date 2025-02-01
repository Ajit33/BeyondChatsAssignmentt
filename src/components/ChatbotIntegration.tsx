import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChatbotIntegrationProps {
  onComplete: () => void
}

export default function ChatbotIntegration({ onComplete }: ChatbotIntegrationProps) {
  const [isIntegrated, setIsIntegrated] = useState(false)

  const handleTestChatbot = () => {
    window.open("https://example.com", "_blank")
  }

  const handleIntegrate = () => {
    // Simulate integration process
    setTimeout(() => {
      setIsIntegrated(true)
    }, 2000)
  }

  const handleMailInstructions = () => {
    // Simulate sending mail to client's developer
    console.log("Mailing instructions to developer")
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chatbot Integration & Testing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleTestChatbot}>Test Chatbot</Button>
        <Tabs defaultValue="copy-paste">
          <TabsList>
            <TabsTrigger value="copy-paste">Copy-Paste Integration</TabsTrigger>
            <TabsTrigger value="mail">Mail Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="copy-paste">
            <div className="space-y-2">
              <p>Copy and paste the following code within the {"<head>"} tag of your website:</p>
              <pre className="bg-gray-100 p-2 rounded">
                <code>{`<script src="https://example.com/chatbot.js"></script>`}</code>
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="mail">
            <Button onClick={handleMailInstructions}>Mail Instructions to Developer</Button>
          </TabsContent>
        </Tabs>
        <Button onClick={handleIntegrate}>Test Integration</Button>
        {isIntegrated ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">Integration Successful!</h3>
              <p>Congratulations! Your chatbot has been successfully integrated.</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={onComplete}>Explore Admin Panel</Button>
              <Button variant="outline" onClick={handleTestChatbot}>
                Start Talking to Your Chatbot
              </Button>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">Share on Twitter</Button>
              <Button variant="outline">Share on LinkedIn</Button>
              <Button variant="outline">Share on Facebook</Button>
            </div>
          </div>
        ) : (
          <p>Integration not yet detected. Please make sure you've added the code to your website and try again.</p>
        )}
      </CardContent>
    </Card>
  )
}

