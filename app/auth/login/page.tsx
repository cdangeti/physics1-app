"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight, SkipForward } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user session (in real app, this would be handled by your auth provider)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: email.split("@")[0],
          loginTime: new Date().toISOString(),
        }),
      )

      router.push("/")
    } catch (err) {
      setError("Invalid email or password")
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
          <p className="text-gray-600 mt-1">Welcome back, Physics Champion!</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-gray-600">Continue your AP Physics 1 mastery journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Demo Account */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                <strong>Demo:</strong> Use any email and password to try the app
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

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Interactive Labs</p>
          </div>
          <div className="p-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Progress Tracking</p>
          </div>
          <div className="p-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Real AP Exams</p>
          </div>
        </div>
      </div>
    </div>
  )
}
