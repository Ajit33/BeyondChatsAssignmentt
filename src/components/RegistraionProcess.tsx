import { useState } from "react"
import ChatbotIntegration from "./ChatBotIntegration"
import SuccessScreen from "./SucessScreen"
import OrganizationSetup from "./OrganistationSetUp"
import UserRegistration from "./UserRegistraion"
import Stepper from "./Stepper"


type Step = "user-registration" | "organization-setup" | "chatbot-integration" | "success"

export default function RegistrationProcess() {
  const [currentStep, setCurrentStep] = useState<Step>("user-registration")
  const [userData, setUserData] = useState({})
  const [organizationData, setOrganizationData] = useState({})

  const steps = [
    { id: "user-registration", title: "User Registration" },
    { id: "organization-setup", title: "Setup Organisation" },
    { id: "chatbot-integration", title: "Chatbot Integration" },
    { id: "success", title: "Success" },
  ]

  const handleStepComplete = (step: Step, data: any) => {
    if (step === "user-registration") {
      setUserData(data)
    } else if (step === "organization-setup") {
      setOrganizationData(data)
    }
    const nextStepIndex = steps.findIndex((s) => s.id === step) + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id as Step)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Stepper steps={steps} currentStep={currentStep} />
      {currentStep === "user-registration" && (
        <UserRegistration onComplete={(data:any) => handleStepComplete("user-registration", data)} />
      )}
      {currentStep === "organization-setup" && (
        <OrganizationSetup onComplete={(data) => handleStepComplete("organization-setup", data)} />
      )}
      {currentStep === "chatbot-integration" && (
        <ChatbotIntegration onComplete={() => handleStepComplete("chatbot-integration", {})} />
      )}
      {currentStep === "success" && <SuccessScreen userData={userData} organizationData={organizationData} />}
    </div>
  )
}

