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
      title: "Kinematics Fundamentals",
      difficulty: "Basic",
      timeLimit: 600, // 10 minutes
      questions: [
        {
          id: 1,
          question: "An object moves with constant velocity. Which of the following is true?",
          options: [
            "The object is accelerating.",
            "The net force on the object is zero.",
            "The object's speed is increasing.",
            "The object is changing direction."
          ],
          correct: 1,
          explanation: "When an object moves with constant velocity, there is no acceleration, which means the net force acting on it must be zero (Newton's First Law).",
          formula: "F_net = 0 for constant velocity",
          points: 10,
        },
        {
          id: 2,
          question: "A car accelerates uniformly from rest. Which graph best represents its velocity over time?",
          options: [
            "A horizontal line above the time axis.",
            "A straight line with positive slope starting at the origin.",
            "A curve concave down starting at the origin.",
            "A straight line with negative slope starting above the time axis."
          ],
          correct: 1,
          explanation: "For uniform acceleration from rest, velocity increases linearly with time, resulting in a straight line with positive slope starting from the origin.",
          formula: "v = v₀ + at",
          points: 10,
        },
        {
          id: 3,
          question: "An object is thrown vertically upward. At its highest point:",
          options: [
            "Velocity and acceleration are zero.",
            "Velocity is zero; acceleration is downward.",
            "Velocity is downward; acceleration is zero.",
            "Velocity and acceleration are both downward."
          ],
          correct: 1,
          explanation: "At the highest point, the object momentarily stops (velocity = 0) but still experiences gravitational acceleration downward.",
          formula: "a = -g (constant)",
          points: 10,
        },
        {
          id: 4,
          question: "Which of the following statements about free fall is correct?",
          options: [
            "All objects fall at the same rate regardless of mass.",
            "Heavier objects fall faster than lighter ones.",
            "Air resistance causes all objects to fall at the same rate.",
            "Objects in free fall have zero acceleration."
          ],
          correct: 0,
          explanation: "In the absence of air resistance, all objects fall with the same acceleration due to gravity, regardless of their mass.",
          formula: "a = g = 9.8 m/s²",
          points: 10,
        },
        {
          id: 5,
          question: "A position-time graph with a straight line indicates:",
          options: [
            "Constant acceleration.",
            "Changing velocity.",
            "Constant velocity.",
            "Object at rest."
          ],
          correct: 2,
          explanation: "A straight line on a position-time graph indicates constant velocity, as the slope represents velocity.",
          formula: "v = Δx/Δt",
          points: 10,
        }
      ],
    },
    2: {
      title: "Advanced Kinematics",
      difficulty: "Intermediate",
      timeLimit: 900, // 15 minutes
      questions: [
        {
          id: 1,
          question: "The area under a velocity-time graph represents:",
          options: [
            "Acceleration.",
            "Displacement.",
            "Speed.",
            "Jerk."
          ],
          correct: 1,
          explanation: "The area under a velocity-time graph represents displacement, as it is the integral of velocity with respect to time.",
          formula: "Δx = ∫v dt",
          points: 15,
        },
        {
          id: 2,
          question: "An object moving in a straight line slows down. Its acceleration is:",
          options: [
            "In the direction of motion.",
            "Opposite to the direction of motion.",
            "Zero.",
            "Perpendicular to the direction of motion."
          ],
          correct: 1,
          explanation: "When an object slows down, its acceleration is opposite to its velocity (direction of motion).",
          formula: "a = Δv/Δt",
          points: 15,
        },
        {
          id: 3,
          question: "A velocity-time graph with a horizontal line indicates:",
          options: [
            "Constant acceleration.",
            "Changing velocity.",
            "Constant velocity.",
            "Object at rest."
          ],
          correct: 2,
          explanation: "A horizontal line on a velocity-time graph indicates constant velocity, as the slope (acceleration) is zero.",
          formula: "a = 0 for constant velocity",
          points: 15,
        },
        {
          id: 4,
          question: "If an object has a negative acceleration, it is:",
          options: [
            "Always slowing down.",
            "Always speeding up.",
            "Slowing down or speeding up depending on direction of velocity.",
            "Moving at constant speed."
          ],
          correct: 2,
          explanation: "Negative acceleration can mean either slowing down in the positive direction or speeding up in the negative direction, depending on the initial velocity.",
          formula: "a = Δv/Δt",
          points: 15,
        }
      ],
    },
  },
  dynamics: {
    1: {
      title: "Newton's Laws",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "A box remains at rest on a horizontal surface. Which of the following best explains this situation?",
          options: [
            "No forces act on the box.",
            "The net force on the box is zero.",
            "The box has no mass.",
            "The box is in motion but appears stationary."
          ],
          correct: 1,
          explanation: "According to Newton's First Law, an object remains at rest when the net force acting on it is zero.",
          formula: "F_net = 0",
          points: 10,
        },
        {
          id: 2,
          question: "An object moves at a constant velocity. What can be said about the net external force acting on it?",
          options: [
            "It is directed opposite to the motion.",
            "It is directed along the motion.",
            "It is zero.",
            "It varies with time."
          ],
          correct: 2,
          explanation: "According to Newton's First Law, an object moving at constant velocity has zero net force acting on it.",
          formula: "F_net = 0 for constant velocity",
          points: 10,
        },
        {
          id: 3,
          question: "According to Newton's Third Law, when you push against a wall, the wall:",
          options: [
            "Does not exert any force.",
            "Exerts an equal and opposite force on you.",
            "Exerts a greater force on you.",
            "Moves in the direction of your push."
          ],
          correct: 1,
          explanation: "Newton's Third Law states that for every action force, there is an equal and opposite reaction force.",
          formula: "F_action = -F_reaction",
          points: 10,
        },
        {
          id: 4,
          question: "A car accelerates forward. The force propelling the car forward is exerted by:",
          options: [
            "The engine on the wheels.",
            "The wheels on the road.",
            "The road on the wheels.",
            "Air resistance."
          ],
          correct: 2,
          explanation: "The road exerts a forward force on the wheels, which propels the car forward (Newton's Third Law).",
          formula: "F = ma",
          points: 10,
        }
      ],
    },
  },
  "circular-motion": {
    1: {
      title: "Circular Motion Basics",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "An object moves in a circle at constant speed. What is the direction of its acceleration?",
          options: [
            "Tangential to the circle",
            "Radially outward",
            "Radially inward",
            "Zero"
          ],
          correct: 2,
          explanation: "In uniform circular motion, the acceleration is directed toward the center of the circle (centripetal acceleration).",
          formula: "a_c = v²/r",
          points: 10,
        },
        {
          id: 2,
          question: "A car rounds a flat curve at constant speed. What provides the necessary centripetal force?",
          options: [
            "Gravity",
            "Normal force",
            "Friction",
            "Engine thrust"
          ],
          correct: 2,
          explanation: "On a flat curve, static friction between the tires and the road provides the centripetal force needed for circular motion.",
          formula: "F_c = mv²/r",
          points: 10,
        },
        {
          id: 3,
          question: "In uniform circular motion, which of the following remains constant?",
          options: [
            "Velocity",
            "Acceleration",
            "Speed",
            "Direction of motion"
          ],
          correct: 2,
          explanation: "In uniform circular motion, only the speed remains constant, while velocity and acceleration are constantly changing direction.",
          formula: "v = constant",
          points: 10,
        },
        {
          id: 4,
          question: "A ball is tied to a string and swung in a horizontal circle. If the string breaks, the ball will:",
          options: [
            "Move radially inward",
            "Move radially outward",
            "Continue in a circular path",
            "Move tangentially to the circle"
          ],
          correct: 3,
          explanation: "When the centripetal force (string tension) is removed, the ball will move in a straight line tangent to its circular path (Newton's First Law).",
          formula: "F_c = 0 after string breaks",
          points: 10,
        }
      ],
    },
  },
  energy: {
    1: {
      title: "Work and Energy",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "When a constant force is applied to an object, the work done on the object is:",
          options: [
            "Always positive",
            "Always negative",
            "Zero if the force is perpendicular to the displacement",
            "Independent of the angle between force and displacement"
          ],
          correct: 2,
          explanation: "Work is zero when the force is perpendicular to the displacement, as W = F·d·cos(θ) and cos(90°) = 0.",
          formula: "W = F·d·cos(θ)",
          points: 10,
        },
        {
          id: 2,
          question: "Which of the following statements is true regarding kinetic energy?",
          options: [
            "It is a scalar quantity",
            "It depends on the velocity squared",
            "It is always positive",
            "It is independent of mass"
          ],
          correct: 1,
          explanation: "Kinetic energy depends on the square of velocity, as shown in the formula KE = ½mv².",
          formula: "KE = ½mv²",
          points: 10,
        },
        {
          id: 3,
          question: "If the velocity of an object is doubled, its kinetic energy:",
          options: [
            "Doubles",
            "Quadruples",
            "Halves",
            "Remains the same"
          ],
          correct: 1,
          explanation: "Since kinetic energy depends on velocity squared, doubling the velocity quadruples the kinetic energy.",
          formula: "KE ∝ v²",
          points: 10,
        },
        {
          id: 4,
          question: "The work-energy theorem states that the work done on an object is equal to:",
          options: [
            "The change in its velocity",
            "The change in its momentum",
            "The change in its kinetic energy",
            "The product of force and time"
          ],
          correct: 2,
          explanation: "The work-energy theorem states that the net work done on an object equals its change in kinetic energy.",
          formula: "W_net = ΔKE",
          points: 10,
        }
      ],
    },
  },
  momentum: {
    1: {
      title: "Linear Momentum",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "Momentum is defined as the product of an object's:",
          options: [
            "Mass and velocity",
            "Mass and acceleration",
            "Force and time",
            "Velocity and time"
          ],
          correct: 0,
          explanation: "Momentum is defined as the product of an object's mass and velocity: p = mv.",
          formula: "p = mv",
          points: 10,
        },
        {
          id: 2,
          question: "Which of the following statements is true about momentum?",
          options: [
            "Momentum is a scalar quantity.",
            "Momentum is conserved only when no external forces act on a system.",
            "Momentum is always conserved in all types of collisions.",
            "Momentum can be negative if the velocity is negative."
          ],
          correct: 1,
          explanation: "Momentum is conserved only when no external forces act on a system, as per the law of conservation of momentum.",
          formula: "Σp_initial = Σp_final",
          points: 10,
        },
        {
          id: 3,
          question: "If the velocity of an object is doubled, its momentum:",
          options: [
            "Doubles",
            "Quadruples",
            "Halves",
            "Remains the same"
          ],
          correct: 0,
          explanation: "Since momentum is directly proportional to velocity, doubling the velocity doubles the momentum.",
          formula: "p = mv",
          points: 10,
        },
        {
          id: 4,
          question: "The impulse experienced by an object is equal to:",
          options: [
            "The change in its velocity",
            "The change in its momentum",
            "The product of force and time",
            "All of the above"
          ],
          correct: 3,
          explanation: "Impulse equals the change in momentum and is also equal to the product of force and time: J = Δp = F·Δt.",
          formula: "J = Δp = F·Δt",
          points: 10,
        }
      ],
    },
  },
  "harmonic-motion": {
    1: {
      title: "Simple Harmonic Motion",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "In simple harmonic motion, when is the acceleration of the object at its maximum magnitude?",
          options: [
            "At the equilibrium position",
            "At maximum displacement",
            "When velocity is maximum",
            "When kinetic energy is maximum"
          ],
          correct: 1,
          explanation: "In SHM, acceleration is maximum at maximum displacement, where the restoring force is greatest.",
          formula: "a = -ω²x",
          points: 10,
        },
        {
          id: 2,
          question: "A mass-spring system oscillates with amplitude A. At what displacement is the kinetic energy equal to the potential energy?",
          options: [
            "0",
            "A/2",
            "A/√2",
            "A"
          ],
          correct: 2,
          explanation: "When KE = PE, the displacement is A/√2, as this is where half the total energy is kinetic and half is potential.",
          formula: "KE = PE at x = A/√2",
          points: 10,
        },
        {
          id: 3,
          question: "Doubling the mass attached to a spring affects the period how?",
          options: [
            "Period doubles",
            "Period increases by √2",
            "Period remains unchanged",
            "Period decreases by √2"
          ],
          correct: 1,
          explanation: "The period of a mass-spring system is proportional to the square root of the mass: T = 2π√(m/k).",
          formula: "T = 2π√(m/k)",
          points: 10,
        },
        {
          id: 4,
          question: "A pendulum's length is quadrupled. How does its period change?",
          options: [
            "Doubles",
            "Quadruples",
            "Halves",
            "Remains the same"
          ],
          correct: 0,
          explanation: "The period of a pendulum is proportional to the square root of its length: T = 2π√(L/g).",
          formula: "T = 2π√(L/g)",
          points: 10,
        }
      ],
    },
  },
  fluids: {
    1: {
      title: "Fluid Mechanics",
      difficulty: "Basic",
      timeLimit: 600,
      questions: [
        {
          id: 1,
          question: "An object is fully submerged in water and experiences a buoyant force. If the object is moved to a fluid with a higher density, how does the buoyant force change?",
          options: [
            "Increases",
            "Decreases",
            "Remains the same",
            "Cannot be determined without more information"
          ],
          correct: 0,
          explanation: "Buoyant force equals the weight of the displaced fluid. A denser fluid has more weight per unit volume, so the buoyant force increases.",
          formula: "F_b = ρ_fluid·V_displaced·g",
          points: 10,
        },
        {
          id: 2,
          question: "A cube floats in water with half of its volume submerged. If placed in oil with a lower density than water, what happens to the submerged volume?",
          options: [
            "It increases",
            "It decreases",
            "It remains the same",
            "The cube sinks"
          ],
          correct: 0,
          explanation: "In a less dense fluid, a greater volume must be submerged to displace the same weight of fluid.",
          formula: "V_submerged = m_object/ρ_fluid",
          points: 10,
        },
        {
          id: 3,
          question: "In a fluid at rest, how does pressure change with depth?",
          options: [
            "Increases linearly",
            "Decreases linearly",
            "Remains constant",
            "Increases exponentially"
          ],
          correct: 0,
          explanation: "Pressure increases linearly with depth according to the equation P = ρgh.",
          formula: "P = P₀ + ρgh",
          points: 10,
        },
        {
          id: 4,
          question: "Two identical containers are filled to the same height, one with water and the other with mercury. Which container has a greater pressure at the bottom?",
          options: [
            "Water",
            "Mercury",
            "Both have the same pressure",
            "Cannot be determined"
          ],
          correct: 1,
          explanation: "Mercury has a higher density than water, so at the same depth, the pressure is greater.",
          formula: "P = ρgh",
          points: 10,
        }
      ],
    },
  }
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
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Check if quiz is already completed
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      const savedProgress = localStorage.getItem(`progress_${parsedUser.email}`)
      if (savedProgress) {
        const progress = JSON.parse(savedProgress)
        const quizKey = `${topic}-${quizId}`
        setIsCompleted(progress.completedQuizzes?.[quizKey] || false)
      }
    }
  }, [topic, quizId])

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

    // Save quiz completion and score
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      const savedProgress = localStorage.getItem(`progress_${parsedUser.email}`)
      const progress = savedProgress ? JSON.parse(savedProgress) : { completedQuizzes: {}, quizScores: {} }
      const quizKey = `${topic}-${quizId}`
      
      // Only mark as completed if all questions were answered
      const allQuestionsAnswered = quiz.questions.every(q => selectedAnswers[q.id] !== undefined)
      
      const updatedProgress = {
        ...progress,
        completedQuizzes: {
          ...progress.completedQuizzes,
          [quizKey]: allQuestionsAnswered
        },
        quizScores: {
          ...progress.quizScores,
          [quizKey]: allQuestionsAnswered ? totalScore : null
        }
      }
      localStorage.setItem(`progress_${parsedUser.email}`, JSON.stringify(updatedProgress))
      setIsCompleted(allQuestionsAnswered)
    }
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
