"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, SkipForward } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required"
    if (!formData.email.trim()) return "Email is required"
    if (formData.password.length < 6) return "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) return "Passwords don't match"
    if (!agreedToTerms) return "Please agree to the terms and conditions"
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user session with initial progress
      const newUser = {
        name: formData.name,
        email: formData.email,
        joinDate: new Date().toISOString(),
        progress: {
          completedSimulations: [],
          completedProblems: [],
          watchedVideos: [],
          completedExams: {},
          examScores: {},
          studyStreak: 1,
          totalXP: 0,
          level: 1,
          activityHistory: [
            {
              id: "welcome-new",
              type: "welcome",
              title: "Welcome to PhysicsAce! Start with the Projectile Motion simulation.",
              timestamp: new Date().toISOString(),
              xp: 0,
              icon: "Sparkles",
              color: "blue",
            },
          ],
        },
      }

      localStorage.setItem("user", JSON.stringify(newUser))

      router.push("/")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // Create a guest user session
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: "guest@physicsace.com",
        name: "Guest User",
        isGuest: true,
        loginTime: new Date().toISOString(),
        progress: {
          completedSimulations: [],
          completedProblems: [],
          watchedVideos: [],
          completedExams: {},
          examScores: {},
          studyStreak: 1,
          totalXP: 0,
          level: 1,
          activityHistory: [
            {
              id: "welcome-guest",
              type: "welcome",
              title: "Welcome to PhysicsAce! Start exploring simulations to track your progress.",
              timestamp: new Date().toISOString(),
              xp: 0,
              icon: "Sparkles",
              color: "blue",
            },
          ],
        },
      }),
    )

    router.push("/")
  }

  const passwordStrength = () => {
    const password = formData.password
    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }

  const getStrengthColor = () => {
    const strength = passwordStrength()
    if (strength <= 1) return "bg-red-500"
    if (strength <= 2) return "bg-yellow-500"
    if (strength <= 3) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    const strength = passwordStrength()
    if (strength <= 1) return "Weak"
    if (strength <= 2) return "Fair"
    if (strength <= 3) return "Good"
    return "Strong"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PhysicsAce
          </h1>
          <p className="text-gray-600 mt-1">Start your physics mastery journey!</p>
        </div>

        {/* Signup Form */}
        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join thousands of students mastering AP Physics 1
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength() / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{getStrengthText()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords don't match</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="mt-6">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full h-12 bg-white/50 border-gray-200 hover:bg-white/80 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <SkipForward className="w-4 h-4" />
              <span>Skip for now - Try as guest</span>
            </div>
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            You can explore all features, but progress won't be saved permanently
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span>Track your progress across all topics</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span>Maintain your study streak and earn XP</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span>Access to all interactive simulations</span>
          </div>
        </div>
      </div>
    </div>
  )
}
