"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  FileText,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Award,
  ExternalLink,
  Check,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const examYears = [
  {
    year: 2025,
    questions: 4,
    duration: 100,
    pdfUrl: "https://apcentral.collegeboard.org/media/pdf/ap25-frq-physics-1.pdf",
    description: "Latest AP Physics 1 Free Response Questions (New Format)",
    difficulty: "Recent",
  },
  {
    year: 2024,
    questions: 5,
    duration: 90,
    pdfUrl: "https://apcentral.collegeboard.org/media/pdf/ap24-frq-physics-1.pdf",
    description: "AP Physics 1 Free Response Questions",
    difficulty: "Recent",
  },
  {
    year: 2023,
    questions: 5,
    duration: 90,
    pdfUrl: "https://apcentral.collegeboard.org/media/pdf/ap23-frq-physics-1.pdf",
    description: "AP Physics 1 Free Response Questions",
    difficulty: "Recent",
  },
  {
    year: 2022,
    questions: 5,
    duration: 90,
    pdfUrl: "https://apcentral.collegeboard.org/media/pdf/ap22-frq-physics-1.pdf",
    description: "AP Physics 1 Free Response Questions",
    difficulty: "Recent",
  },
  {
    year: 2021,
    questions: 4,
    duration: 90,
    pdfUrl: "https://apcentral.collegeboard.org/media/pdf/ap21-frq-physics-1.pdf",
    description: "AP Physics 1 Free Response Questions (COVID-modified)",
    difficulty: "Recent",
  },
  {
    year: 2019,
    questions: 5,
    duration: 90,
    pdfUrl: "https://apcentral.collegeboard.org/media/pdf/ap19-frq-physics-1.pdf",
    description: "Traditional format AP Physics 1 exam",
    difficulty: "Moderate",
  },
]

const frqTopics = [
  {
    year: 2025,
    topics: [
      "Advanced Kinematics",
      "Complex Force Systems",
      "Energy and Work-Energy Theorem",
      "Momentum and Impulse",
      "Rotational Dynamics",
    ],
  },
  {
    year: 2024,
    topics: [
      "Kinematics and Dynamics",
      "Energy and Momentum",
      "Circular Motion and Gravitation",
      "Simple Harmonic Motion",
      "Rotational Motion",
    ],
  },
  {
    year: 2023,
    topics: [
      "Projectile Motion",
      "Forces and Newton's Laws",
      "Energy Conservation",
      "Momentum and Collisions",
      "Oscillations",
    ],
  },
  {
    year: 2022,
    topics: ["Motion Graphs", "Inclined Plane Dynamics", "Energy and Work", "Elastic Collisions", "Pendulum Motion"],
  },
  {
    year: 2021,
    topics: ["Kinematics Analysis", "Force Analysis", "Energy Systems", "Momentum Conservation"],
  },
  {
    year: 2019,
    topics: [
      "Motion in Two Dimensions",
      "Newton's Laws Applications",
      "Energy Conservation",
      "Linear Momentum",
      "Simple Harmonic Motion",
    ],
  },
]

export default function ExamsPage() {
  const [user, setUser] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [completedExams, setCompletedExams] = useState({})
  const [examScores, setExamScores] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load user progress
    const savedProgress = localStorage.getItem(`progress_${parsedUser.email}`)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setUserProgress(progress)
      setCompletedExams(progress.completedExams || {})
      setExamScores(progress.examScores || {})
    } else {
      // Initialize default progress
      const defaultProgress = {
        completedSimulations: [],
        completedProblems: [],
        watchedVideos: [],
        completedExams: {},
        examScores: {},
        studyStreak: 1,
        totalXP: 0,
        level: 1,
        lastLoginDate: new Date().toDateString(),
        activityHistory: [],
      }
      setUserProgress(defaultProgress)
      localStorage.setItem(`progress_${parsedUser.email}`, JSON.stringify(defaultProgress))
    }

    setIsLoading(false)
  }, [router])

  const handleExamCompletion = (year, completed, score = null) => {
    if (!user || !userProgress) return

    const updatedCompletedExams = { ...completedExams, [year]: completed }
    const updatedExamScores = { ...examScores }

    if (completed && score !== null) {
      updatedExamScores[year] = score
    } else if (!completed) {
      delete updatedExamScores[year]
    }

    setCompletedExams(updatedCompletedExams)
    setExamScores(updatedExamScores)

    // Update user progress
    const updatedProgress = {
      ...userProgress,
      completedExams: updatedCompletedExams,
      examScores: updatedExamScores,
    }

    // Add activity to history if completing exam
    if (completed && !completedExams[year]) {
      const activity = {
        id: `exam-${year}-${Date.now()}`,
        type: "exam",
        title: `Completed ${year} AP Physics 1 FRQ${score ? ` (Score: ${score}%)` : ""}`,
        timestamp: new Date().toISOString(),
        xp: 100,
        icon: "FileText",
        color: "purple",
      }

      updatedProgress.activityHistory = [...(userProgress.activityHistory || []), activity]
      updatedProgress.totalXP = (userProgress.totalXP || 0) + 100
    }

    setUserProgress(updatedProgress)
    localStorage.setItem(`progress_${user.email}`, JSON.stringify(updatedProgress))
  }

  const handleScoreInput = (year, score) => {
    const numericScore = Number.parseInt(score)
    if (numericScore >= 0 && numericScore <= 100) {
      handleExamCompletion(year, true, numericScore)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <FileText className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading practice exams...</p>
        </div>
      </div>
    )
  }

  const completedExamsList = Object.keys(completedExams).filter((year) => completedExams[year])
  const averageScore =
    completedExamsList.length > 0
      ? Math.round(
          completedExamsList.reduce((acc, year) => acc + (examScores[year] || 0), 0) / completedExamsList.length,
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AP Physics 1 Practice Exams</h1>
                <p className="text-sm text-gray-600">Official College Board Free Response Questions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Exams Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {completedExamsList.length}/{examYears.length}
              </div>
              <p className="text-sm text-gray-500">Total available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
              <p className="text-sm text-gray-500">Across completed exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {completedExamsList.length > 0
                  ? Math.max(...completedExamsList.map((year) => examScores[year] || 0))
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-500">Highest score achieved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Study Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  completedExamsList.reduce((acc, year) => {
                    const exam = examYears.find((e) => e.year.toString() === year)
                    return acc + (exam ? exam.duration / 60 : 1.5)
                  }, 0) * 10,
                ) / 10}
                h
              </div>
              <p className="text-sm text-gray-500">Total practice time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="exams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exams">Practice Exams</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            <div className="space-y-6">
              {/* Important Notice */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Official AP Physics 1 Free Response Questions</span>
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    These are the actual Free Response Questions (FRQs) from past AP Physics 1 exams. Check off exams as
                    you complete them and enter your scores to track your progress!
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Format Change Notice */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>Exam Format Changes</span>
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    <strong>Starting 2025:</strong> AP Physics 1 FRQ section now contains 4 questions with 100 minutes
                    total time. Previous years (2024 and earlier) had 5 questions with 90 minutes.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examYears.map((exam) => {
                  const yearTopics = frqTopics.find((t) => t.year === exam.year)
                  const isCompleted = completedExams[exam.year] || false
                  const score = examScores[exam.year]

                  return (
                    <Card key={exam.year} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`exam-${exam.year}`}
                                checked={isCompleted}
                                onCheckedChange={(checked) => handleExamCompletion(exam.year, checked)}
                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              />
                              {isCompleted && <Check className="w-4 h-4 text-green-500" />}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {exam.year} AP Physics 1 FRQ
                                {exam.year >= 2025 && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    New Format
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {exam.questions} questions • {exam.duration} minutes •{" "}
                                {isCompleted ? `Completed${score ? ` (${score}%)` : ""}` : "Not attempted"}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant={
                              exam.difficulty === "Recent"
                                ? "default"
                                : exam.difficulty === "Moderate"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {exam.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Your Score:</span>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={score || ""}
                                  onChange={(e) => handleScoreInput(exam.year, e.target.value)}
                                  placeholder="Enter score"
                                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-500">%</span>
                              </div>
                            </div>
                            {score && (
                              <Badge
                                variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
                                className="w-fit"
                              >
                                {score}% - {score >= 80 ? "Excellent!" : score >= 60 ? "Good!" : "Keep practicing!"}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {exam.duration} minutes • {exam.questions} Free Response Questions
                            </span>
                          </div>

                          {yearTopics && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700">Topics Covered:</p>
                              <div className="flex flex-wrap gap-1">
                                {yearTopics.topics.map((topic, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            {exam.pdfUrl ? (
                              <Button className="flex-1" variant={isCompleted ? "outline" : "default"} asChild>
                                <a href={exam.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {isCompleted ? "Review PDF" : "Start Exam"}
                                </a>
                              </Button>
                            ) : (
                              <Button className="flex-1" variant="outline" disabled>
                                PDF Not Available
                              </Button>
                            )}
                            {isCompleted && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExamCompletion(exam.year, false)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Reset
                              </Button>
                            )}
                          </div>

                          {exam.pdfUrl && (
                            <p className="text-xs text-gray-500">Opens official College Board PDF in new tab</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Exam Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Exam Tips & Strategy</CardTitle>
                  <CardDescription>How to approach AP Physics 1 Free Response Questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Time Management</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 2025+ format: ~25 minutes per question (100 min ÷ 4 questions)</li>
                        <li>• 2024 and earlier: ~18 minutes per question (90 min ÷ 5 questions)</li>
                        <li>• Read all questions first, start with easiest</li>
                        <li>• Leave time to review your work</li>
                        <li>• Don't get stuck on one part - move on and return</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">Problem-Solving Strategy</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Draw clear diagrams and label variables</li>
                        <li>• Show all work and reasoning clearly</li>
                        <li>• Use proper physics terminology</li>
                        <li>• Check units and significant figures</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Performance Trend</span>
                  </CardTitle>
                  <CardDescription>Your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedExamsList.length > 0 ? (
                      completedExamsList
                        .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
                        .slice(0, 5)
                        .map((year, index) => {
                          const score = examScores[year]
                          const prevYear = completedExamsList
                            .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
                            .slice(0, 5)[index + 1]
                          const prevScore = prevYear ? examScores[prevYear] : null

                          return (
                            <div key={year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">{year} AP Exam</div>
                                <div className="text-sm text-gray-600">
                                  {index === 0 ? "Most recent" : `${index + 1} exam${index > 0 ? "s" : ""} ago`}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{score ? `${score}%` : "No score entered"}</div>
                                {index > 0 && score && prevScore && (
                                  <div
                                    className={`text-sm ${
                                      score > prevScore
                                        ? "text-green-600"
                                        : score < prevScore
                                          ? "text-red-600"
                                          : "text-gray-600"
                                    }`}
                                  >
                                    {score > prevScore
                                      ? `+${score - prevScore}`
                                      : score < prevScore
                                        ? `${score - prevScore}`
                                        : "No change"}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Complete your first exam to see performance trends</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                  <CardDescription>Milestones you've reached</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 ${completedExamsList.length > 0 ? "" : "opacity-50"}`}>
                      <div
                        className={`w-8 h-8 ${completedExamsList.length > 0 ? "bg-green-100" : "bg-gray-100"} rounded-full flex items-center justify-center`}
                      >
                        <Award
                          className={`w-4 h-4 ${completedExamsList.length > 0 ? "text-green-600" : "text-gray-400"}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">First FRQ Completed</div>
                        <div className="text-sm text-gray-600">
                          {completedExamsList.length > 0 ? "Completed!" : "Complete your first practice exam"}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 ${averageScore >= 70 ? "" : "opacity-50"}`}>
                      <div
                        className={`w-8 h-8 ${averageScore >= 70 ? "bg-blue-100" : "bg-gray-100"} rounded-full flex items-center justify-center`}
                      >
                        <Target className={`w-4 h-4 ${averageScore >= 70 ? "text-blue-600" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <div className="font-medium">Strong Performance</div>
                        <div className="text-sm text-gray-600">
                          {averageScore >= 70 ? "Average score above 70%!" : "Achieve 70% average score"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-3 ${completedExamsList.length >= 3 ? "" : "opacity-50"}`}
                    >
                      <div
                        className={`w-8 h-8 ${completedExamsList.length >= 3 ? "bg-purple-100" : "bg-gray-100"} rounded-full flex items-center justify-center`}
                      >
                        <Calendar
                          className={`w-4 h-4 ${completedExamsList.length >= 3 ? "text-purple-600" : "text-gray-400"}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">Consistent Practice</div>
                        <div className="text-sm text-gray-600">
                          {completedExamsList.length >= 3 ? "Completed 3+ exams!" : "Complete 3 practice exams"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-3 ${
                        completedExamsList.length > 0 &&
                        completedExamsList.every((year) => examScores[year] !== undefined)
                          ? ""
                          : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 ${
                          completedExamsList.length > 0 &&
                          completedExamsList.every((year) => examScores[year] !== undefined)
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        } rounded-full flex items-center justify-center`}
                      >
                        <TrendingUp
                          className={`w-4 h-4 ${
                            completedExamsList.length > 0 &&
                            completedExamsList.every((year) => examScores[year] !== undefined)
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">Score Tracker</div>
                        <div className="text-sm text-gray-600">
                          {completedExamsList.length > 0 &&
                          completedExamsList.every((year) => examScores[year] !== undefined)
                            ? "All completed exams have scores!"
                            : "Enter scores for all completed exams"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
