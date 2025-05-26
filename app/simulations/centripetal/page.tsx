"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function CentripetalForceSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [radius, setRadius] = useState([100])
  const [velocity, setVelocity] = useState([5])
  const [mass, setMass] = useState([2])
  const [time, setTime] = useState(0)
  const [angle, setAngle] = useState(0)
  const [showVectors, setShowVectors] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const calculateCentripetalForce = () => {
    const m = mass[0]
    const v = velocity[0]
    const r = radius[0] / 50 // convert to meters
    return (m * v * v) / r
  }

  const calculateAngularVelocity = () => {
    const v = velocity[0]
    const r = radius[0] / 50 // convert to meters
    return v / r
  }

  const calculatePeriod = () => {
    const omega = calculateAngularVelocity()
    return (2 * Math.PI) / omega
  }

  const calculateFrequency = () => {
    return 1 / calculatePeriod()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const r = radius[0]

    // Calculate object position
    const objectX = centerX + r * Math.cos(angle)
    const objectY = centerY + r * Math.sin(angle)

    // Draw circular path
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(centerX, centerY, r, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw center point
    ctx.fillStyle = "#374151"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI)
    ctx.fill()

    // Draw object
    const objectRadius = Math.sqrt(mass[0]) * 8 + 5
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.arc(objectX, objectY, objectRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#DC2626"
    ctx.lineWidth = 2
    ctx.stroke()

    if (showVectors) {
      const vectorScale = 20

      // Draw velocity vector (tangent to circle)
      const vx = -velocity[0] * vectorScale * Math.sin(angle)
      const vy = velocity[0] * vectorScale * Math.cos(angle)

      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(objectX, objectY)
      ctx.lineTo(objectX + vx, objectY + vy)
      ctx.stroke()

      // Velocity vector arrow
      const vArrowAngle = Math.atan2(vy, vx)
      const arrowSize = 8
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      ctx.moveTo(objectX + vx, objectY + vy)
      ctx.lineTo(
        objectX + vx - arrowSize * Math.cos(vArrowAngle - Math.PI / 6),
        objectY + vy - arrowSize * Math.sin(vArrowAngle - Math.PI / 6),
      )
      ctx.lineTo(
        objectX + vx - arrowSize * Math.cos(vArrowAngle + Math.PI / 6),
        objectY + vy - arrowSize * Math.sin(vArrowAngle + Math.PI / 6),
      )
      ctx.closePath()
      ctx.fill()

      // Draw centripetal force vector (toward center)
      const forceScale = 2
      const fx = (centerX - objectX) * forceScale
      const fy = (centerY - objectY) * forceScale

      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(objectX, objectY)
      ctx.lineTo(objectX + fx, objectY + fy)
      ctx.stroke()

      // Force vector arrow
      const fArrowAngle = Math.atan2(fy, fx)
      ctx.fillStyle = "#10B981"
      ctx.beginPath()
      ctx.moveTo(objectX + fx, objectY + fy)
      ctx.lineTo(
        objectX + fx - arrowSize * Math.cos(fArrowAngle - Math.PI / 6),
        objectY + fy - arrowSize * Math.sin(fArrowAngle - Math.PI / 6),
      )
      ctx.lineTo(
        objectX + fx - arrowSize * Math.cos(fArrowAngle + Math.PI / 6),
        objectY + fy - arrowSize * Math.sin(fArrowAngle + Math.PI / 6),
      )
      ctx.closePath()
      ctx.fill()

      // Draw radius line
      ctx.strokeStyle = "#6B7280"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(objectX, objectY)
      ctx.stroke()
    }

    // Draw labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"

    if (showVectors) {
      ctx.fillStyle = "#3B82F6"
      ctx.fillText("v (velocity)", objectX + 30, objectY - 20)
      ctx.fillStyle = "#10B981"
      ctx.fillText("Fc (centripetal force)", objectX - 80, objectY + 30)
    }

    ctx.fillStyle = "#374151"
    ctx.fillText(`r = ${(radius[0] / 50).toFixed(1)} m`, centerX + 10, centerY - 10)
  }, [angle, radius, velocity, mass, showVectors])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const omega = calculateAngularVelocity()
          setAngle(omega * newTime)
          return newTime
        })

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, radius, velocity])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setAngle(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/circular-motion">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Circular Motion
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Centripetal Force Simulator</h1>
              <p className="text-sm text-gray-600">Visualize forces in circular motion</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Simulation Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Circular Motion Simulation</CardTitle>
                    <CardDescription>Observe centripetal force and velocity vectors</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowVectors(!showVectors)}>
                      {showVectors ? "Hide" : "Show"} Vectors
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-gray-200 rounded bg-white w-full"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button onClick={handlePlay} className="flex items-center space-x-2">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </Button>
                  <Badge variant="secondary">Time: {time.toFixed(2)}s</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>Adjust the circular motion properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Radius: {(radius[0] / 50).toFixed(1)} m</label>
                  <Slider value={radius} onValueChange={setRadius} max={150} min={50} step={5} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Velocity: {velocity[0]} m/s</label>
                  <Slider value={velocity} onValueChange={setVelocity} max={15} min={1} step={0.5} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass[0]} kg</label>
                  <Slider value={mass} onValueChange={setMass} max={10} min={1} step={0.5} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculations</CardTitle>
                <CardDescription>Real-time physics values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Centripetal Force:</span>
                  <span className="text-sm font-medium">{calculateCentripetalForce().toFixed(1)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Angular Velocity:</span>
                  <span className="text-sm font-medium">{calculateAngularVelocity().toFixed(2)} rad/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Period:</span>
                  <span className="text-sm font-medium">{calculatePeriod().toFixed(2)} s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frequency:</span>
                  <span className="text-sm font-medium">{calculateFrequency().toFixed(2)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Angle:</span>
                  <span className="text-sm font-medium">{(((angle * 180) / Math.PI) % 360).toFixed(1)}°</span>
                </div>
              </CardContent>
            </Card>

            {showInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Physics Concepts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <strong>Centripetal Force:</strong> Fc = mv²/r
                  </div>
                  <div>
                    <strong>Angular Velocity:</strong> ω = v/r
                  </div>
                  <div>
                    <strong>Period:</strong> T = 2π/ω
                  </div>
                  <div>
                    <strong>Frequency:</strong> f = 1/T
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Centripetal force always points toward the center of the circular path and is perpendicular to
                    velocity.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
