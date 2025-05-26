"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function MotionGraphsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [acceleration, setAcceleration] = useState([2])
  const [initialVelocity, setInitialVelocity] = useState([5])
  const [initialPosition, setInitialPosition] = useState([0])
  const [time, setTime] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [activeGraph, setActiveGraph] = useState("position")

  const calculatePosition = (t: number) => {
    const x0 = initialPosition[0]
    const v0 = initialVelocity[0]
    const a = acceleration[0]
    return x0 + v0 * t + 0.5 * a * t * t
  }

  const calculateVelocity = (t: number) => {
    const v0 = initialVelocity[0]
    const a = acceleration[0]
    return v0 + a * t
  }

  const calculateAcceleration = () => {
    return acceleration[0]
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw axes
    const centerY = canvas.height / 2
    const centerX = 60

    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    // Y-axis
    ctx.beginPath()
    ctx.moveTo(centerX, 20)
    ctx.lineTo(centerX, canvas.height - 20)
    ctx.stroke()
    // X-axis
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(canvas.width - 20, centerY)
    ctx.stroke()

    // Draw graph based on active tab
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 3
    ctx.beginPath()

    const timeScale = 20 // pixels per second
    const maxTime = (canvas.width - centerX - 20) / timeScale

    if (activeGraph === "position") {
      const positionScale = 2 // pixels per meter
      for (let t = 0; t <= maxTime; t += 0.1) {
        const x = centerX + t * timeScale
        const y = centerY - calculatePosition(t) * positionScale
        if (t === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
    } else if (activeGraph === "velocity") {
      const velocityScale = 5 // pixels per m/s
      for (let t = 0; t <= maxTime; t += 0.1) {
        const x = centerX + t * timeScale
        const y = centerY - calculateVelocity(t) * velocityScale
        if (t === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
    } else if (activeGraph === "acceleration") {
      const accelScale = 10 // pixels per m/s²
      const y = centerY - calculateAcceleration() * accelScale
      ctx.moveTo(centerX, y)
      ctx.lineTo(canvas.width - 20, y)
    }

    ctx.stroke()

    // Draw current time indicator
    if (time > 0) {
      const currentX = centerX + time * timeScale
      ctx.strokeStyle = "#EF4444"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(currentX, 20)
      ctx.lineTo(currentX, canvas.height - 20)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw current value point
      let currentY
      if (activeGraph === "position") {
        currentY = centerY - calculatePosition(time) * 2
      } else if (activeGraph === "velocity") {
        currentY = centerY - calculateVelocity(time) * 5
      } else {
        currentY = centerY - calculateAcceleration() * 10
      }

      ctx.fillStyle = "#EF4444"
      ctx.beginPath()
      ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText("Time (s)", canvas.width - 60, centerY + 15)

    ctx.save()
    ctx.translate(20, centerY)
    ctx.rotate(-Math.PI / 2)
    if (activeGraph === "position") {
      ctx.fillText("Position (m)", -40, 0)
    } else if (activeGraph === "velocity") {
      ctx.fillText("Velocity (m/s)", -50, 0)
    } else {
      ctx.fillText("Acceleration (m/s²)", -60, 0)
    }
    ctx.restore()

    // Scale markers
    ctx.fillStyle = "#6B7280"
    ctx.font = "10px sans-serif"
    for (let i = 1; i <= 10; i++) {
      const x = centerX + i * timeScale
      if (x < canvas.width - 20) {
        ctx.fillText(i.toString(), x - 3, centerY + 15)
      }
    }
  }, [time, acceleration, initialVelocity, initialPosition, activeGraph])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.05
          if (newTime >= 10) {
            setIsPlaying(false)
            return 10
          }
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
  }, [isPlaying])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/kinematics">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Kinematics
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Motion Graphs</h1>
              <p className="text-sm text-gray-600">Visualize position, velocity, and acceleration relationships</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Kinematic Graphs</CardTitle>
                    <CardDescription>
                      Explore relationships between position, velocity, and acceleration
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeGraph} onValueChange={setActiveGraph} className="mb-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="position">Position vs Time</TabsTrigger>
                    <TabsTrigger value="velocity">Velocity vs Time</TabsTrigger>
                    <TabsTrigger value="acceleration">Acceleration vs Time</TabsTrigger>
                  </TabsList>
                </Tabs>

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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>Adjust motion parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Position: {initialPosition[0]} m</label>
                  <Slider
                    value={initialPosition}
                    onValueChange={setInitialPosition}
                    max={20}
                    min={-20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Velocity: {initialVelocity[0]} m/s</label>
                  <Slider
                    value={initialVelocity}
                    onValueChange={setInitialVelocity}
                    max={20}
                    min={-20}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Acceleration: {acceleration[0]} m/s²</label>
                  <Slider
                    value={acceleration}
                    onValueChange={setAcceleration}
                    max={10}
                    min={-10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Values</CardTitle>
                <CardDescription>Real-time measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium">{calculatePosition(time).toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Velocity:</span>
                  <span className="text-sm font-medium">{calculateVelocity(time).toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Acceleration:</span>
                  <span className="text-sm font-medium">{calculateAcceleration().toFixed(2)} m/s²</span>
                </div>
              </CardContent>
            </Card>

            {showInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Kinematic Equations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <strong>Position:</strong> x = x₀ + v₀t + ½at²
                  </div>
                  <div>
                    <strong>Velocity:</strong> v = v₀ + at
                  </div>
                  <div>
                    <strong>Acceleration:</strong> a = constant
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
