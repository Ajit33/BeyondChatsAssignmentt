import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SuccessScreenProps {
  userData: any
  organizationData: any
}

export default function SuccessScreen({ userData, organizationData }: SuccessScreenProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registration Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Congratulations, {userData.name}! Your account for {organizationData.companyName} has been successfully
          created and your chatbot has been integrated.
        </p>
        <div className="flex justify-center space-x-4">
          <Button>Go to Dashboard</Button>
          <Button variant="outline">View Chatbot</Button>
        </div>
      </CardContent>
    </Card>
  )
}

