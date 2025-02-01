import { Check, Lock } from "lucide-react"

interface Step {
  id: string
  title: string
}

interface StepperProps {
  steps: Step[]
  currentStep: string
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = steps.findIndex((s) => s.id === currentStep) > index
          const isActive = step.id === currentStep
          return (
            <div key={step.id} className="flex items-center w-full md:w-auto">
              <div className="flex flex-row md:flex-col items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted
                      ? "bg-gradient-to-r from-green-400 to-green-500"
                      : isActive
                        ? "bg-gradient-to-r from-blue-400 to-blue-500"
                        : "bg-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : isActive ? (
                    <Lock className="w-6 h-6 text-white" />
                  ) : (
                    <span className="w-6 h-6 text-gray-400">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3 md:ml-0 md:mt-2">
                  <p
                    className={`text-sm font-medium ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}`}
                  >
                    {step.title}
                  </p>
                  <div
                    className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs
                    ${
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : isActive
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                    }
                  `}
                  >
                    <span className="relative flex h-2 w-2 mr-1">
                      <span
                        className={`
                        animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                        ${isCompleted ? "bg-green-400" : isActive ? "bg-blue-400" : "bg-gray-400"}
                      `}
                      ></span>
                      <span
                        className={`
                        relative inline-flex rounded-full h-2 w-2
                        ${isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-500"}
                      `}
                      ></span>
                    </span>
                    {isCompleted ? "Completed" : isActive ? "In Progress" : "Pending"}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden md:block h-[2px] w-12 mx-2 ${
                    isCompleted ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gray-200"
                  }`}
                />
              )}
              {index < steps.length - 1 && (
                <div
                  className={`md:hidden w-[2px] h-12 my-2 ${
                    isCompleted ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

