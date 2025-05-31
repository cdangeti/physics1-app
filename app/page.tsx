"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Calculator,
  FileText,
  TrendingUp,
  Zap,
  RotateCcw,
  Orbit,
  Battery,
  Waves,
  Settings,
  Droplets,
  BookOpen,
  Target,
  Award,
  Clock,
  Sparkles,
  LogOut,
  User,
  Video,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const topics = [
  {
    id: "kinematics",
    title: "Kinematics",
    description: "Motion in one and two dimensions",
    icon: TrendingUp,
    simulations: 3,
    problems: 8,
    videos: 3,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: "dynamics",
    title: "Dynamics",
    description: "Newton's Laws of Motion",
    icon: Zap,
    simulations: 4,
    problems: 12,
    videos: 2,
    color: "bg-gradient-to-br from-green-500 to-green-600",
  },
  {
    id: "circular-motion",
    title: "Circular Motion",
    description: "Circular motion and gravitation",
    icon: Orbit,
    simulations: 2,
    problems: 6,
    videos: 2,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    id: "energy",
    title: "Energy",
    description: "Work, energy, and power",
    icon: Battery,
    simulations: 3,
    problems: 10,
    videos: 3,
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
  },
  {
    id: "momentum",
    title: "Momentum",
    description: "Linear momentum and collisions",
    icon: RotateCcw,
    simulations: 2,
    problems: 7,
    videos: 2,
    color: "bg-gradient-to-br from-red-500 to-red-600",
  },
  {
    id: "torque-rotation",
    title: "Torque & Rotational Dynamics",
    description: "Rotational motion and torque",
    icon: Settings,
    simulations: 3,
    problems: 8,
    videos: 3,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
  {
    id: "rotational-energy",
    title: "Rotational Energy & Momentum",
    description: "Energy and momentum in rotating systems",
    icon: RotateCcw,
    simulations: 2,
    problems: 6,
    videos: 2,
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
  },
  {
    id: "harmonic-motion",
    title: "Simple Harmonic Motion",
    description: "Oscillations and waves",
    icon: Waves,
    simulations: 2,
    problems: 5,
    videos: 2,
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  },
  {
    id: "fluids",
    title: "Fluids",
    description: "Fluid statics and dynamics",
    icon: Droplets,
    simulations: 3,
    problems: 6,
    videos: 2,
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  },
]

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
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

    // Load user progress or set defaults
    const savedProgress = localStorage.getItem(`progress_${parsedUser.email}`)
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    } else {
      // Default progress for new users
      const defaultProgress = {
        completedSimulations: [],
        completedProblems: [],
        watchedVideos: [],
        examScores: {},
        studyStreak: 1,
        totalXP: 0,
        level: 1,
        lastLoginDate: new Date().toDateString(),
        activityHistory: [], // Track all user activities
      }
      setUserProgress(defaultProgress)
      localStorage.setItem(`progress_${parsedUser.email}`, JSON.stringify(defaultProgress))
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const updateStudyStreak = () => {
    if (!userProgress || !user) return

    const today = new Date().toDateString()
    const lastLogin = userProgress.lastLoginDate

    let newStreak = userProgress.studyStreak

    if (lastLogin !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastLogin === yesterday.toDateString()) {
        // Consecutive day
        newStreak += 1
      } else if (lastLogin !== today) {
        // Streak broken
        newStreak = 1
      }

      const updatedProgress = {
        ...userProgress,
        studyStreak: newStreak,
        lastLoginDate: today,
      }

      setUserProgress(updatedProgress)
      localStorage.setItem(`progress_${user.email}`, JSON.stringify(updatedProgress))
    }
  }

  // Generate recent activity from user's actual progress
  const generateRecentActivity = () => {
    if (!userProgress) return []

    const activities = []
    const activityHistory = userProgress.activityHistory || []

    // If user has activity history, use it
    if (activityHistory.length > 0) {
      return activityHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5) // Show last 5 activities
    }

    // For new users or users without activity history, generate some based on their progress
    const now = new Date()

    // Add activities based on completed simulations
    if (userProgress.completedSimulations.length > 0) {
      const recentSims = userProgress.completedSimulations.slice(-2) // Last 2 simulations
      recentSims.forEach((sim, index) => {
        const timestamp = new Date(now.getTime() - (index + 1) * 2 * 60 * 60 * 1000) // Hours ago
        activities.push({
          id: `sim-${sim}`,
          type: "simulation",
          title: `Completed ${getSimulationName(sim)} simulation`,
          timestamp: timestamp.toISOString(),
          xp: 25,
          icon: Play,
          color: "blue",
        })
      })
    }

    // Add activities based on completed problems
    if (userProgress.completedProblems.length > 0) {
      const recentProblems = userProgress.completedProblems.slice(-2) // Last 2 problems
      recentProblems.forEach((problem, index) => {
        const timestamp = new Date(now.getTime() - (index + 3) * 3 * 60 * 60 * 1000) // Hours ago
        activities.push({
          id: `prob-${problem}`,
          type: "problem",
          title: `Solved ${getProblemName(problem)} problem`,
          timestamp: timestamp.toISOString(),
          xp: 10,
          icon: Calculator,
          color: "green",
        })
      })
    }

    // Add activities based on watched videos
    if (userProgress.watchedVideos.length > 0) {
      const recentVideos = userProgress.watchedVideos.slice(-1) // Last video
      recentVideos.forEach((video, index) => {
        const timestamp = new Date(now.getTime() - (index + 5) * 4 * 60 * 60 * 1000) // Hours ago
        activities.push({
          id: `vid-${video}`,
          type: "video",
          title: `Watched ${getVideoName(video)} video`,
          timestamp: timestamp.toISOString(),
          xp: 15,
          icon: Video,
          color: "purple",
        })
      })
    }

    // Add exam activities
    const examKeys = Object.keys(userProgress.examScores)
    if (examKeys.length > 0) {
      const recentExam = examKeys[examKeys.length - 1]
      const score = userProgress.examScores[recentExam]
      const timestamp = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000) // Days ago
      activities.push({
        id: `exam-${recentExam}`,
        type: "exam",
        title: `Completed ${recentExam} AP Exam (Score: ${score})`,
        timestamp: timestamp.toISOString(),
        xp: 100,
        icon: FileText,
        color: "purple",
      })
    }

    // If no activities, show welcome message
    if (activities.length === 0) {
      activities.push({
        id: "welcome",
        type: "welcome",
        title: "Welcome to PhysicsAce! Start your first simulation to begin tracking your progress.",
        timestamp: now.toISOString(),
        xp: 0,
        icon: Sparkles,
        color: "blue",
      })
    }

    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  // Helper functions to get readable names
  const getSimulationName = (simId) => {
    const simNames = {
      projectile: "Projectile Motion",
      graphs: "Motion Graphs",
      relative: "Relative Motion",
      forces: "Force Analysis",
      friction: "Friction Forces",
      "Inclined-Plane": "Inclined Plane",
      elevator: "Elevator Physics",
      centripetal: "Centripetal Force",
      orbital: "Orbital Motion",
      "energy-pendulum": "Pendulum Energy",
      "energy-roller": "Roller Coaster Energy",
      "energy-spring": "Spring Energy",
      "collision-elastic": "Elastic Collision",
      "collision-inelastic": "Inelastic Collision",
      "pendulum-shm": "Simple Pendulum",
      "spring-mass": "Spring-Mass System",
    }
    return simNames[simId] || simId
  }

  const getProblemName = (problemId) => {
    const parts = problemId.split("-")
    const topic = parts[0]
    const number = parts[1]
    return `${topic.charAt(0).toUpperCase() + topic.slice(1)} Problem ${number}`
  }

  const getVideoName = (videoId) => {
    const videoNames = {
      "kinematics-intro": "Kinematics Introduction",
      "kinematics-projectile": "Projectile Motion Concepts",
      "kinematics-graphs": "Motion Graphs Explained",
      "dynamics-newton": "Newton's Laws",
      "dynamics-friction": "Friction Forces",
      "circular-intro": "Circular Motion Basics",
      "circular-gravity": "Gravity and Orbits",
      "energy-conservation": "Energy Conservation",
      "energy-work": "Work and Energy",
      "energy-power": "Power in Physics",
      "momentum-intro": "Momentum Basics",
      "momentum-collisions": "Collision Analysis",
      "shm-intro": "Simple Harmonic Motion",
      "shm-pendulum": "Pendulum Motion",
    }
    return videoNames[videoId] || videoId
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    return activityTime.toLocaleDateString()
  }

  const getActivityColor = (color) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      orange: "bg-orange-50 border-orange-200",
    }
    return colors[color] || colors.blue
  }

  const getIconColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    }
    return colors[color] || colors.blue
  }

  const getBadgeColor = (color) => {
    const colors = {
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      orange: "bg-orange-500 hover:bg-orange-600",
    }
    return colors[color] || colors.blue
  }

  useEffect(() => {
    if (userProgress && user) {
      updateStudyStreak()
      setRecentActivity(generateRecentActivity())
    }
  }, [userProgress, user])

  // Calculate progress functions (same as before but using userProgress)
  const calculateTopicProgress = (topicId: string) => {
    if (!userProgress) return 0

    const topic = topics.find((t) => t.id === topicId)
    if (!topic) return 0

    const simulationIds = getSimulationIds(topicId)
    const problemIds = getProblemIds(topicId)
    const videoIds = getVideoIds(topicId)

    const completedSims = simulationIds.filter((id) => userProgress.completedSimulations.includes(id)).length
    const completedProbs = problemIds.filter((id) => userProgress.completedProblems.includes(id)).length
    const watchedVids = videoIds.filter((id) => userProgress.watchedVideos.includes(id)).length

    const totalActivities = topic.simulations + topic.problems + topic.videos
    const completedActivities = completedSims + completedProbs + watchedVids

    return Math.round((completedActivities / totalActivities) * 100)
  }

  const getSimulationIds = (topicId: string) => {
    const simulations = {
      kinematics: ["projectile", "graphs", "relative"],
      dynamics: ["forces", "friction", "incline", "elevator"],
      "circular-motion": ["centripetal", "orbital"],
      energy: ["energy-pendulum", "energy-roller", "energy-spring"],
      momentum: ["collision-elastic", "collision-inelastic"],
      "harmonic-motion": ["pendulum-shm", "spring-mass"],
    }
    return simulations[topicId] || []
  }

  const getProblemIds = (topicId: string) => {
    const problems = {
      kinematics: [
        "kinematics-1",
        "kinematics-2",
        "kinematics-3",
        "kinematics-4",
        "kinematics-5",
        "kinematics-6",
        "kinematics-7",
        "kinematics-8",
      ],
      dynamics: [
        "dynamics-1",
        "dynamics-2",
        "dynamics-3",
        "dynamics-4",
        "dynamics-5",
        "dynamics-6",
        "dynamics-7",
        "dynamics-8",
        "dynamics-9",
        "dynamics-10",
        "dynamics-11",
        "dynamics-12",
      ],
      "circular-motion": ["circular-1", "circular-2", "circular-3", "circular-4", "circular-5", "circular-6"],
      energy: [
        "energy-1",
        "energy-2",
        "energy-3",
        "energy-4",
        "energy-5",
        "energy-6",
        "energy-7",
        "energy-8",
        "energy-9",
        "energy-10",
      ],
      momentum: ["momentum-1", "momentum-2", "momentum-3", "momentum-4", "momentum-5", "momentum-6", "momentum-7"],
      "harmonic-motion": ["shm-1", "shm-2", "shm-3", "shm-4", "shm-5"],
    }
    return problems[topicId] || []
  }

  const getVideoIds = (topicId: string) => {
    const videos = {
      kinematics: ["kinematics-intro", "kinematics-projectile", "kinematics-graphs"],
      dynamics: ["dynamics-newton", "dynamics-friction",""],
      "circular-motion": ["circular-intro", "circular-gravity"],
      energy: ["energy-conservation", "energy-work", "energy-power"],
      momentum: ["momentum-intro", "momentum-collisions"],
      "harmonic-motion": ["shm-intro", "shm-pendulum"],
    }
    return videos[topicId] || []
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your physics journey...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProgress) {
    return null
  }

  const topicsWithProgress = topics.map((topic) => ({
    ...topic,
    progress: calculateTopicProgress(topic.id),
  }))

  const overallProgress = Math.round(topicsWithProgress.reduce((acc, topic) => acc + topic.progress, 0) / topics.length)
  const completedTopics = topicsWithProgress.filter((topic) => topic.progress >= 80).length
  const totalProblems = topics.reduce((acc, topic) => acc + topic.problems, 0)
  const completedProblems = userProgress.completedProblems.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PhysicsAce
                </h1>
                <p className="text-xs text-gray-500">AP Physics 1 Mastery</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome, {user.name}!</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-white/50">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
            Welcome back, {user.name}! 🚀
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Continue your journey to AP Physics 1 mastery with interactive simulations, practice exams, and powerful
            tools
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-100">Overall Progress</CardTitle>
                <Target className="w-5 h-5 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2 bg-blue-400/30" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-100">Topics Mastered</CardTitle>
                <Award className="w-5 h-5 text-green-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {completedTopics}/{topics.length}
              </div>
              <p className="text-sm text-green-100">Units completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-100">Problems Solved</CardTitle>
                <Calculator className="w-5 h-5 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {completedProblems}/{totalProblems}
              </div>
              <p className="text-sm text-purple-100">Practice problems</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-100">Study Streak</CardTitle>
                <Clock className="w-5 h-5 text-orange-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userProgress.studyStreak}</div>
              <p className="text-sm text-orange-100">Days in a row 🔥</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            Quick Launch
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/simulations">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">Interactive Labs</CardTitle>
                      <CardDescription className="text-gray-600">Visualize physics in action</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/exams">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">Practice Exams</CardTitle>
                      <CardDescription className="text-gray-600">Real AP exam questions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/tools/equation-solver">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Calculator className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">Formula Solver</CardTitle>
                      <CardDescription className="text-gray-600">Solve equations instantly</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Physics Units
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicsWithProgress.map((topic) => {
              const Icon = topic.icon
              return (
                <Link key={topic.id} href={`/topics/${topic.id}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 ${topic.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900">{topic.title}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">{topic.description}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={topic.progress >= 80 ? "default" : "secondary"}
                          className={topic.progress >= 80 ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {topic.progress}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Progress value={topic.progress} className="h-3 mb-4" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {topic.simulations} labs
                        </span>
                        <span className="flex items-center gap-1">
                          <Calculator className="w-3 h-3" />
                          {topic.problems} problems
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              {recentActivity.length > 0 && recentActivity[0].type !== "welcome"
                ? "Your latest study sessions and achievements"
                : "Start learning to see your progress here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-center space-x-4 p-3 rounded-xl border ${getActivityColor(activity.color)}`}
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${getIconColor(activity.color)} rounded-full flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                      {activity.xp > 0 && <Badge className={getBadgeColor(activity.color)}>+{activity.xp} XP</Badge>}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activity yet. Start exploring to see your progress!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
