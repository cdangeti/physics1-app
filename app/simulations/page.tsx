"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Play,
  CheckCircle,
  TrendingUp,
  Zap,
  Orbit,
  Battery,
  RotateCcw,
  Waves,
  Settings,
  Droplets,
} from "lucide-react"
import Link from "next/link"

const simulations = [
  {
    id: "projectile",
    title: "Projectile Motion",
    description: "Explore how angle and velocity affect projectile paths",
    topic: "Kinematics",
    icon: TrendingUp,
    difficulty: "Intermediate",
    duration: "10-15 min",
    completed: true,
    color: "bg-blue-500",
    path: "/simulations/projectile",
  },
  {
    id: "graphs",
    title: "Motion Graphs",
    description: "Visualize position, velocity, and acceleration relationships",
    topic: "Kinematics",
    icon: TrendingUp,
    difficulty: "Basic",
    duration: "8-12 min",
    completed: true,
    color: "bg-blue-500",
    path: "/simulations/graphs",
  },
  {
    id: "relative",
    title: "Relative Motion",
    description: "Understand motion from different reference frames",
    topic: "Kinematics",
    icon: TrendingUp,
    difficulty: "Advanced",
    duration: "12-18 min",
    completed: true,
    color: "bg-blue-500",
    path: "/simulations/relative",
  },
  {
    id: "forces",
    title: "Force and Motion",
    description: "Apply forces and observe resulting motion",
    topic: "Dynamics",
    icon: Zap,
    difficulty: "Basic",
    duration: "8-12 min",
    completed: true,
    color: "bg-green-500",
    path: "/simulations/forces",
  },
  {
    id: "friction",
    title: "Friction Simulator",
    description: "Explore static and kinetic friction",
    topic: "Dynamics",
    icon: Zap,
    difficulty: "Intermediate",
    duration: "10-15 min",
    completed: true,
    color: "bg-green-500",
    path: "/simulations/friction",
  },
  {
    id: "energy-pendulum",
    title: "Energy in Pendulum Motion",
    description: "Observe energy transformations in a swinging pendulum",
    topic: "Energy",
    icon: Battery,
    difficulty: "Basic",
    duration: "8-12 min",
    completed: true,
    color: "bg-yellow-500",
    path: "/simulations/energy-pendulum",
  },
  {
    id: "collision-elastic",
    title: "Elastic Collisions",
    description: "Analyze perfectly elastic collision scenarios",
    topic: "Momentum",
    icon: RotateCcw,
    difficulty: "Intermediate",
    duration: "12-18 min",
    completed: true,
    color: "bg-red-500",
    path: "/simulations/collision-elastic",
  },
  {
    id: "centripetal",
    title: "Centripetal Force",
    description: "Visualize forces in circular motion",
    topic: "Circular Motion",
    icon: Orbit,
    difficulty: "Intermediate",
    duration: "10-15 min",
    completed: true,
    color: "bg-purple-500",
    path: "/simulations/centripetal",
  },
  {
    id: "spring-mass",
    title: "Spring-Mass System",
    description: "Explore simple harmonic motion with springs",
    topic: "Simple Harmonic Motion",
    icon: Waves,
    difficulty: "Advanced",
    duration: "15-20 min",
    completed: true,
    color: "bg-indigo-500",
    path: "/simulations/spring-mass",
  },
  {
    id: "torque-balance",
    title: "Torque Balance",
    description: "Explore rotational equilibrium and torque",
    topic: "Torque & Rotation",
    icon: Settings,
    difficulty: "Basic",
    duration: "8-12 min",
    completed: true,
    color: "bg-orange-500",
    path: "/simulations/torque-balance",
  },
  {
    id: "rotating-disk",
    title: "Rotating Disk",
    description: "Analyze rotational motion and angular acceleration",
    topic: "Torque & Rotation",
    icon: Settings,
    difficulty: "Intermediate",
    duration: "10-15 min",
    completed: true,
    color: "bg-orange-500",
    path: "/simulations/rotating-disk",
  },
  {
    id: "gyroscope",
    title: "Gyroscope Physics",
    description: "Understand gyroscopic motion and precession",
    topic: "Torque & Rotation",
    icon: Settings,
    difficulty: "Advanced",
    duration: "15-20 min",
    completed: true,
    color: "bg-orange-500",
    path: "/simulations/gyroscope",
  },
  {
    id: "rolling-objects",
    title: "Rolling Motion",
    description: "Compare rolling vs sliding motion down inclines",
    topic: "Rotational Energy",
    icon: RotateCcw,
    difficulty: "Intermediate",
    duration: "12-18 min",
    completed: true,
    color: "bg-pink-500",
    path: "/simulations/rolling-objects",
  },
  {
    id: "angular-momentum",
    title: "Angular Momentum Conservation",
    description: "Explore conservation of angular momentum",
    topic: "Rotational Energy",
    icon: RotateCcw,
    difficulty: "Advanced",
    duration: "15-20 min",
    completed: true,
    color: "bg-pink-500",
    path: "/simulations/angular-momentum",
  },
  {
    id: "buoyancy",
    title: "Buoyancy Simulator",
    description: "Explore floating and sinking objects",
    topic: "Fluids",
    icon: Droplets,
    difficulty: "Basic",
    duration: "8-12 min",
    completed: true,
    color: "bg-cyan-500",
    path: "/simulations/buoyancy",
  },
  {
    id: "fluid-flow",
    title: "Fluid Flow",
    description: "Visualize fluid flow and Bernoulli's principle",
    topic: "Fluids",
    icon: Droplets,
    difficulty: "Intermediate",
    duration: "10-15 min",
    completed: true,
    color: "bg-cyan-500",
    path: "/simulations/fluid-flow",
  },
  {
    id: "pressure-depth",
    title: "Pressure vs Depth",
    description: "Understand how pressure varies with depth",
    topic: "Fluids",
    icon: Droplets,
    difficulty: "Basic",
    duration: "8-12 min",
    completed: true,
    color: "bg-cyan-500",
    path: "/simulations/pressure-depth",
  },
]

export default function SimulationsPage() {
  const completedCount = simulations.filter((sim) => sim.completed).length
  const totalCount = simulations.length

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
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interactive Simulations</h1>
                <p className="text-sm text-gray-600">Visualize physics concepts through interactive experiments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your simulation completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Simulations Completed</span>
              <span className="text-lg font-bold">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Simulations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((simulation) => {
            const Icon = simulation.icon
            return (
              <Card key={simulation.id} className="hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${simulation.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{simulation.title}</span>
                          {simulation.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </CardTitle>
                        <CardDescription className="text-sm">{simulation.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{simulation.topic}</Badge>
                      <Badge
                        variant={
                          simulation.difficulty === "Basic"
                            ? "secondary"
                            : simulation.difficulty === "Intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {simulation.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Duration: {simulation.duration}</span>
                      {simulation.completed && <span className="text-green-600 font-medium">Completed ✓</span>}
                    </div>

                    <Link href={simulation.path}>
                      <Button className="w-full" variant={simulation.completed ? "outline" : "default"}>
                        <Play className="w-4 h-4 mr-2" />
                        {simulation.completed ? "Review Simulation" : "Start Simulation"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Learning Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Simulation Tips</CardTitle>
            <CardDescription>Get the most out of your interactive learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Before Starting</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Review the key concepts for the topic</li>
                  <li>• Have a notebook ready for observations</li>
                  <li>• Think about what you expect to see</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">During Simulation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Experiment with different parameter values</li>
                  <li>• Pay attention to how variables affect outcomes</li>
                  <li>• Use the info panels to understand the physics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
