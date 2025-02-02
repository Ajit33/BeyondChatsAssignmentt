import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface UserRegistrationProps {
  onComplete: (data: any) => void
}

export default function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVerificationSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [isVerificationSent, timer])

  useEffect(() => {
    const newErrors: { [key: string]: string } = {}
    
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (touched.password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (touched.name && name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    
    setErrors(newErrors)
  }, [email, password, name, touched])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.keys(errors).length === 0 && verificationCode) {
      onComplete({ name, email, password })
    }
  }

  const sendVerificationCode = () => {
    if (Object.keys(errors).length === 0) {
      setIsVerificationSent(true)
      setTimer(60)
      setCanResend(false)
    }
  }

  const resendCode = () => {
    if (canResend) {
      setTimer(60)
      setCanResend(false)
      // Implement resend logic here
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-50 to-blue-50 registration-card">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className={`space-y-6 ${!isVerificationSent ? 'slide-in' : ''}`}>
            {!isVerificationSent && (
              <>
                <div className="relative">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`input-line ${errors.name ? 'error' : ''}`}
                    placeholder=" "
                  />
                  <Label htmlFor="name" className="input-label">
                    Full Name
                  </Label>
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`input-line ${errors.email ? 'error' : ''}`}
                    placeholder=" "
                  />
                  <Label htmlFor="email" className="input-label">
                    Email Address
                  </Label>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`input-line ${errors.password ? 'error' : ''}`}
                    placeholder=" "
                  />
                  <Label htmlFor="password" className="input-label">
                    Password
                  </Label>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
              </>
            )}

            {isVerificationSent && (
              <div className="relative slide-in">
                <div className="mb-4 text-center">
                  <div className="verification-timer flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    {timer > 0 ? (
                      <span>Resend code in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={resendCode}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </div>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="input-line text-center text-2xl tracking-wider"
                  placeholder="Enter verification code"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {!isVerificationSent ? (
            <Button
              type="button"
              onClick={sendVerificationCode}
              className="w-full primary-button"
              disabled={Object.keys(errors).length > 0 || !email || !password || !name}
            >
              Send Verification Code
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full primary-button"
              disabled={!verificationCode}
            >
              Complete Registration
            </Button>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full google-button"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}