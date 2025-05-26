"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, CheckCircle, XCircle, RotateCcw, Clock, Award, Play } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const quizData = {
  kinematics: {
    1: {
      title: "Basic Projectile Motion",
      difficulty: "Basic",
      timeLimit: 600, // 10 minutes
      questions: [
        {
          id: 1,
          question:
            "A ball is thrown horizontally from a height of 20 m with an initial velocity of 15 m/s. How long does it take to hit the ground?",
          options: ["1.4 s", "2.0 s", "2.5 s", "3.0 s"],
          correct: 1,
          explanation:
            "Using the kinematic equation y = h₀ + v₀t - ½gt², where h₀ = 20 m, v₀ = 0 (vertical), and y = 0 (ground level). Solving: 0 = 20 - ½(9.8)t², gives t = √(40/9.8) ≈ 2.0 s",
          formula: "y = h₀ + v₀t - ½gt²",
          points: 10,
        },
        {
          id: 2,
          question: "What is the horizontal distance traveled by the ball in the previous question?",
          options: ["20 m", "30 m", "40 m", "50 m"],
          correct: 1,
          explanation: "Horizontal distance = horizontal velocity × time = 15 m/s × 2.0 s = 30 m",
          formula: "x = v₀ₓ × t",
          points: 10,
        },
        {
          id: 3,
          question: "A projectile is launched at 45° with initial speed 20 m/s. What is its maximum height?",
          options: ["5.1 m", "10.2 m", "15.3 m", "20.4 m"],
          correct: 1,
          explanation:
            "At 45°, v₀y = 20sin(45°) = 14.14 m/s. Using v² = v₀² - 2gh at max height (v=0): h = v₀y²/(2g) = (14.14)²/(2×9.8) ≈ 10.2 m",
          formula: "h_max = v₀y²/(2g)",
          points: 15,
        },
        {
          id: 4,
          question: "For maximum range on level ground, a projectile should be launched at what angle?",
          options: ["30°", "45°", "60°", "90°"],
          correct: 1,
          explanation:
            "Maximum range occurs at 45° because this angle maximizes the product of horizontal and vertical velocity components for the given initial speed.",
          formula: "R = v₀²sin(2θ)/g",
          points: 10,
        },
        {
          id: 5,
          question: "A car accelerates from rest at 3 m/s² for 4 seconds. What distance does it travel?",
          options: ["12 m", "18 m", "24 m", "36 m"],
          correct: 2,
          explanation:
            "Using x = x₀ + v₀t + ½at² with x₀ = 0, v₀ = 0, a = 3 m/s², t = 4 s: x = ½(3)(4)² = ½(3)(16) = 24 m",
          formula: "x = x₀ + v₀t + ½at²",
          points: 10,
        },
      ],
    },
    2: {
      title: "Kinematic Equations Application",
      difficulty: "Intermediate",
      timeLimit: 900, // 15 minutes
      questions: [
        {
          id: 1,
          question: "A ball is thrown upward with initial velocity 25 m/s. How high does it go?",
          options: ["25.5 m", "31.9 m", "38.3 m", "44.7 m"],
          correct: 1,
          explanation:
            "At maximum height, final velocity = 0. Using v² = v₀² - 2gh: 0 = (25)² - 2(9.8)h, so h = 625/(2×9.8) ≈ 31.9 m",
          formula: "v² = v₀² - 2gh",
          points: 15,
        },
        {
          id: 2,
          question:
            "A car traveling at 30 m/s brakes with deceleration 5 m/s². How far does it travel before stopping?",
          options: ["60 m", "90 m", "120 m", "150 m"],
          correct: 1,
          explanation:
            "Using v² = v₀² + 2ax with v = 0, v₀ = 30 m/s, a = -5 m/s²: 0 = (30)² + 2(-5)x, so x = 900/10 = 90 m",
          formula: "v² = v₀² + 2ax",
          points: 15,
        },
        {
          id: 3,
          question: "An object is dropped from rest and falls for 3 seconds. What is its final velocity?",
          options: ["29.4 m/s", "32.1 m/s", "35.8 m/s", "39.2 m/s"],
          correct: 0,
          explanation: "Using v = v₀ + gt with v₀ = 0, g = 9.8 m/s², t = 3 s: v = 0 + (9.8)(3) = 29.4 m/s",
          formula: "v = v₀ + gt",
          points: 10,
        },
        {
          id: 4,
          question: "A projectile launched at 60° with speed 40 m/s. What is its time of flight?",
          options: ["3.5 s", "7.1 s", "10.6 s", "14.1 s"],
          correct: 1,
          explanation: "Time of flight = 2v₀sin(θ)/g = 2(40)sin(60°)/9.8 = 2(40)(0.866)/9.8 ≈ 7.1 s",
          formula: "t_flight = 2v₀sin(θ)/g",
          points: 15,
        },
      ],
    },
  },
  dynamics: {
    1: {
      title: "Newton's Second Law Problems",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "A 5 kg box is pushed with a force of 20 N. If there's no friction, what is its acceleration?",
          options: ["2 m/s²", "4 m/s²", "6 m/s²", "8 m/s²"],
          correct: 1,
          explanation: "Using Newton's second law F = ma: a = F/m = 20 N / 5 kg = 4 m/s²",
          formula: "F = ma",
          points: 10,
        },
        {
          id: 2,
          question: "A 10 kg object experiences a net force of 50 N. What is its acceleration?",
          options: ["3 m/s²", "5 m/s²", "7 m/s²", "9 m/s²"],
          correct: 1,
          explanation: "Using F = ma: a = F/m = 50 N / 10 kg = 5 m/s²",
          formula: "F = ma",
          points: 10,
        },
        {
          id: 3,
          question: "What force is needed to accelerate a 8 kg mass at 3 m/s²?",
          options: ["18 N", "24 N", "30 N", "36 N"],
          correct: 1,
          explanation: "Using F = ma: F = (8 kg)(3 m/s²) = 24 N",
          formula: "F = ma",
          points: 10,
        },
        {
          id: 4,
          question: "A 2 kg object has weight of approximately:",
          options: ["2 N", "9.8 N", "19.6 N", "39.2 N"],
          correct: 2,
          explanation: "Weight = mg = (2 kg)(9.8 m/s²) = 19.6 N",
          formula: "W = mg",
          points: 10,
        },
      ],
    },
  },
  energy: {
    1: {
      title: "Energy Conservation Problems",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "A 2 kg object moving at 10 m/s has kinetic energy of:",
          options: ["50 J", "100 J", "150 J", "200 J"],
          correct: 1,
          explanation: "KE = ½mv² = ½(2 kg)(10 m/s)² = ½(2)(100) = 100 J",
          formula: "KE = ½mv²",
          points: 10,
        },
        {
          id: 2,
          question: "A 5 kg object at height 10 m has potential energy of:",
          options: ["490 J", "500 J", "510 J", "520 J"],
          correct: 0,
          explanation: "PE = mgh = (5 kg)(9.8 m/s²)(10 m) = 490 J",
          formula: "PE = mgh",
          points: 10,
        },
        {
          id: 3,
          question: "An object slides down a frictionless incline from height 5 m. Its speed at the bottom is:",
          options: ["7.0 m/s", "9.9 m/s", "12.1 m/s", "14.0 m/s"],
          correct: 1,
          explanation: "Using energy conservation: mgh = ½mv², so v = √(2gh) = √(2×9.8×5) = √98 ≈ 9.9 m/s",
          formula: "mgh = ½mv²",
          points: 15,
        },
        {
          id: 4,
          question: "A spring with k = 100 N/m is compressed 0.2 m. Its elastic potential energy is:",
          options: ["1 J", "2 J", "3 J", "4 J"],
          correct: 1,
          explanation: "PE_spring = ½kx² = ½(100 N/m)(0.2 m)² = ½(100)(0.04) = 2 J",
          formula: "PE = ½kx²",
          points: 10,
        },
      ],
    },
  },
}

export default function QuizPage() {
  const params = useParams()
  const topic = params.topic as string
  const quizId = Number.parseInt(params.id as string)

  const quiz = quizData[topic as keyof typeof quizData]?.[quizId as keyof (typeof quizData)[keyof typeof quizData]]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 600)
  const [quizStarted, setQuizStarted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizStarted, showResults])

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleSubmitQuiz = () => {
    let totalScore = 0
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct) {
        totalScore += question.points
      }
    })
    setScore(totalScore)
    setShowResults(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)
  const percentage = Math.round((score / totalPoints) * 100)

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 space-x-4">
              <Link href={`/topics/${topic}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
                  <p className="text-sm text-gray-600">Practice Quiz</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-6 h-6" />
                <span>{quiz.title}</span>
              </CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mr-2">
                  {quiz.difficulty}
                </Badge>
                <Badge variant="secondary">{quiz.questions.length} Questions</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{formatTime(quiz.timeLimit)}</div>
                  <div className="text-sm text-gray-600">Time Limit</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Calculator className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{quiz.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• You can navigate between questions using the Next/Previous buttons</li>
                  <li>• Submit your quiz before time runs out</li>
                  <li>• You'll receive detailed explanations after submission</li>
                </ul>
              </div>

              <Button onClick={() => setQuizStarted(true)} className="w-full" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 space-x-4">
              <Link href={`/topics/${topic}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quiz Results</h1>
                <p className="text-sm text-gray-600">{quiz.title}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Score Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <span>Your Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(score, totalPoints)}`}>{percentage}%</div>
                <div className="text-lg text-gray-600">
                  {score} out of {totalPoints} points
                </div>
                <Badge
                  variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}
                  className="mt-2"
                >
                  {percentage >= 90
                    ? "Excellent!"
                    : percentage >= 80
                      ? "Great Job!"
                      : percentage >= 60
                        ? "Good Work!"
                        : "Keep Practicing!"}
                </Badge>
              </div>
              <Progress value={percentage} className="h-3" />
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id]
              const isCorrect = userAnswer === question.correct

              return (
                <Card
                  key={question.id}
                  className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <Badge variant={isCorrect ? "default" : "destructive"}>
                          {isCorrect ? `+${question.points}` : "0"} pts
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base font-medium">{question.question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            optionIndex === question.correct
                              ? "bg-green-50 border-green-200"
                              : optionIndex === userAnswer && !isCorrect
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                            <span>{option}</span>
                            {optionIndex === question.correct && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                            {optionIndex === userAnswer && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900 mb-2">Explanation:</div>
                      <p className="text-blue-800 text-sm mb-2">{question.explanation}</p>
                      <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded text-sm">{question.formula}</code>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 flex space-x-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Link href={`/topics/${topic}`}>
              <Button>Continue Learning</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/topics/${topic}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Exit Quiz
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">
                {currentQuestion + 1} / {quiz.questions.length}
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              <Badge variant="secondary">{currentQ.points} points</Badge>
            </div>
            <CardDescription className="text-lg font-medium text-gray-900">{currentQ.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQ.id, Number.parseInt(value))}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
