"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, CheckCircle, XCircle, TrendingUp, Zap, Battery, RotateCcw } from "lucide-react"
import Link from "next/link"

const practiceProblems = [
  {
    id: 1,
    topic: "Kinematics",
    icon: TrendingUp,
    difficulty: "Basic",
    question:
      "A ball is thrown horizontally from a height of 20 m with an initial velocity of 15 m/s. How long does it take to hit the ground?",
    options: ["1.4 s", "2.0 s", "2.5 s", "3.0 s"],
    correct: 1,
    explanation:
      "Using the kinematic equation y = h₀ + v₀t - ½gt², where h₀ = 20 m, v₀ = 0 (vertical), and y = 0 (ground level). Solving: 0 = 20 - ½(9.8)t², gives t = √(40/9.8) ≈ 2.0 s",
    formula: "y = h₀ + v₀t - ½gt²",
  },
  {
    id: 2,
    topic: "Dynamics",
    icon: Zap,
    difficulty: "Intermediate",
    question:
      "A 5 kg box is pushed across a horizontal surface with a force of 30 N. If the coefficient of kinetic friction is 0.4, what is the acceleration of the box?",
    options: ["2.1 m/s²", "3.0 m/s²", "4.2 m/s²", "6.0 m/s²"],
    correct: 0,
    explanation:
      "First find friction force: f = μₖmg = 0.4 × 5 × 9.8 = 19.6 N. Net force = 30 - 19.6 = 10.4 N. Using F = ma: a = 10.4/5 = 2.08 ≈ 2.1 m/s²",
    formula: "F_net = ma, f = μₖN",
  },
  {
    id: 3,
    topic: "Energy",
    icon: Battery,
    difficulty: "Advanced",
    question:
      "A 2 kg object slides down a frictionless incline from a height of 10 m. What is its speed at the bottom?",
    options: ["10 m/s", "14 m/s", "20 m/s", "28 m/s"],
    correct: 1,
    explanation:
      "Using conservation of energy: PE = KE, mgh = ½mv². The mass cancels out: gh = ½v², so v = √(2gh) = √(2 × 9.8 × 10) = √196 = 14 m/s",
    formula: "PE = KE → mgh = ½mv²",
  },
]

export default function PracticePage() {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completedProblems, setCompletedProblems] = useState<number[]>([])

  const problem = practiceProblems[currentProblem]
  const isCorrect = selectedAnswer === problem.correct.toString()

  const handleSubmit = () => {
    if (!selectedAnswer) return

    setShowResult(true)
    if (isCorrect && !completedProblems.includes(problem.id)) {
      setScore(score + 1)
      setCompletedProblems([...completedProblems, problem.id])
    }
  }

  const handleNext = () => {
    if (currentProblem < practiceProblems.length - 1) {
      setCurrentProblem(currentProblem + 1)
      setSelectedAnswer("")
      setShowResult(false)
    }
  }

  const handlePrevious = () => {
    if (currentProblem > 0) {
      setCurrentProblem(currentProblem - 1)
      setSelectedAnswer("")
      setShowResult(false)
    }
  }

  const handleReset = () => {
    setCurrentProblem(0)
    setSelectedAnswer("")
    setShowResult(false)
    setScore(0)
    setCompletedProblems([])
  }

  const Icon = problem.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Practice Problems</h1>
                  <p className="text-sm text-gray-600">Test your understanding with AP-style questions</p>
                </div>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  Problem {currentProblem + 1} of {practiceProblems.length}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {score}/{practiceProblems.length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={((currentProblem + 1) / practiceProblems.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Problem */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Badge variant="outline">{problem.topic}</Badge>
                <Badge variant="secondary" className="ml-2">
                  {problem.difficulty}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-xl leading-relaxed">{problem.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
              {problem.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {showResult && index === problem.correct && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showResult && index.toString() === selectedAnswer && index !== problem.correct && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </RadioGroup>

            <div className="mt-6 flex items-center space-x-4">
              {!showResult ? (
                <Button onClick={handleSubmit} disabled={!selectedAnswer} className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Submit Answer</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</span>
                  </div>
                  {currentProblem < practiceProblems.length - 1 && <Button onClick={handleNext}>Next Problem</Button>}
                </div>
              )}

              {currentProblem > 0 && (
                <Button onClick={handlePrevious} variant="outline">
                  Previous
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {showResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Explanation</span>
                {isCorrect && <Badge variant="default">+10 XP</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-medium text-blue-900 mb-2">Key Formula:</div>
                <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">{problem.formula}</code>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-2">Solution:</div>
                <p className="text-gray-700 leading-relaxed">{problem.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Message */}
        {currentProblem === practiceProblems.length - 1 && showResult && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Practice Session Complete!</CardTitle>
              <CardDescription className="text-green-700">
                You scored {score} out of {practiceProblems.length} problems correctly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
