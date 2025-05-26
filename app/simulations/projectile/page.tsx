"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function ProjectileSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [velocity, setVelocity] = useState([50])
  const [angle, setAngle] = useState([45])
  const [height, setHeight] = useState([0])
  const [time, setTime] = useState(0)
  const [projectile, setProjectile] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81 // gravity
  const scale = 5 // pixels per meter

  const calculatePosition = (t: number) => {
    const v0 = velocity[0]
    const theta = (angle[0] * Math.PI) / 180
    const h0 = height[0]

    const x = v0 * Math.cos(theta) * t
    const y = h0 + v0 * Math.sin(theta) * t - 0.5 * g * t * t

    return { x, y }
  }

  const getMaxTime = () => {
    const v0 = velocity[0]
    const theta = (angle[0] * Math.PI) / 180
    const h0 = height[0]

    // Time when projectile hits ground (y = 0)
    const discriminant = (v0 * Math.sin(theta)) ** 2 + 2 * g * h0
    return (v0 * Math.sin(theta) + Math.sqrt(discriminant)) / g
  }

  const getRange = () => {
    const maxTime = getMaxTime()
    return calculatePosition(maxTime).x
  }

  const getMaxHeight = () => {
    const v0 = velocity[0]
    const theta = (angle[0] * Math.PI) / 180
    const h0 = height[0]

    return h0 + (v0 * Math.sin(theta)) ** 2 / (2 * g)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system (origin at bottom-left)
    ctx.save()
    ctx.translate(50, canvas.height - 50)
    ctx.scale(1, -1)

    // Draw ground
    ctx.strokeStyle = "#8B5CF6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(canvas.width - 100, 0)
    ctx.stroke()

    // Draw grid
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width - 100; i += scale * 10) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height - 100)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height - 100; i += scale * 10) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width - 100, i)
      ctx.stroke()
    }

    // Draw trajectory trail
    if (trail.length > 1) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(trail[0].x * scale, trail[0].y * scale)
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x * scale, trail[i].y * scale)
      }
      ctx.stroke()
    }

    // Draw projectile
    if (projectile.y >= 0) {
      ctx.fillStyle = "#EF4444"
      ctx.beginPath()
      ctx.arc(projectile.x * scale, projectile.y * scale, 6, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw launch vector
    const v0 = velocity[0]
    const theta = (angle[0] * Math.PI) / 180
    const vectorLength = v0 * 0.5
    const vectorX = vectorLength * Math.cos(theta)
    const vectorY = vectorLength * Math.sin(theta)

    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, height[0] * scale)
    ctx.lineTo(vectorX, height[0] * scale + vectorY)
    ctx.stroke()

    // Draw arrowhead
    const arrowSize = 8
    const arrowAngle = Math.atan2(vectorY, vectorX)
    ctx.fillStyle = "#10B981"
    ctx.beginPath()
    ctx.moveTo(vectorX, height[0] * scale + vectorY)
    ctx.lineTo(
      vectorX - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
      height[0] * scale + vectorY - arrowSize * Math.sin(arrowAngle - Math.PI / 6),
    )
    ctx.lineTo(
      vectorX - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
      height[0] * scale + vectorY - arrowSize * Math.sin(arrowAngle + Math.PI / 6),
    )
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    // Draw labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText("Distance (m)", canvas.width / 2 - 30, canvas.height - 10)

    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Height (m)", -30, 0)
    ctx.restore()
  }, [projectile, trail, velocity, angle, height])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.05
          const maxTime = getMaxTime()

          if (newTime >= maxTime) {
            setIsPlaying(false)
            return maxTime
          }

          const pos = calculatePosition(newTime)
          setProjectile(pos)
          setTrail((prev) => [...prev, pos])

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
  }, [isPlaying, velocity, angle, height])

  const handlePlay = () => {
    if (time >= getMaxTime()) {
      handleReset()
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setProjectile({ x: 0, y: height[0] })
    setTrail([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
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
              <h1 className="text-xl font-bold text-gray-900">Projectile Motion Simulator</h1>
              <p className="text-sm text-gray-600">Explore how angle and velocity affect projectile paths</p>
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
                    <CardTitle>Interactive Simulation</CardTitle>
                    <CardDescription>Adjust parameters and observe the projectile motion</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
                    <Info className="w-4 h-4" />
                  </Button>
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
                <CardDescription>Adjust the initial conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Velocity: {velocity[0]} m/s</label>
                  <Slider value={velocity} onValueChange={setVelocity} max={100} min={10} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Launch Angle: {angle[0]}°</label>
                  <Slider value={angle} onValueChange={setAngle} max={90} min={0} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Height: {height[0]} m</label>
                  <Slider value={height} onValueChange={setHeight} max={50} min={0} step={1} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculated Values</CardTitle>
                <CardDescription>Physics calculations in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Range:</span>
                  <span className="text-sm font-medium">{getRange().toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Height:</span>
                  <span className="text-sm font-medium">{getMaxHeight().toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Flight Time:</span>
                  <span className="text-sm font-medium">{getMaxTime().toFixed(1)} s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current X:</span>
                  <span className="text-sm font-medium">{projectile.x.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Y:</span>
                  <span className="text-sm font-medium">{Math.max(0, projectile.y).toFixed(1)} m</span>
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
                    <strong>Horizontal Motion:</strong> x = v₀cos(θ)t
                  </div>
                  <div>
                    <strong>Vertical Motion:</strong> y = h₀ + v₀sin(θ)t - ½gt²
                  </div>
                  <div>
                    <strong>Range Formula:</strong> R = v₀²sin(2θ)/g
                  </div>
                  <div>
                    <strong>Max Height:</strong> h = h₀ + v₀²sin²(θ)/(2g)
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
