"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  radius: number
  color: string
}

export default function CollisionElasticSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [mass1, setMass1] = useState([5])
  const [mass2, setMass2] = useState([3])
  const [velocity1, setVelocity1] = useState([8])
  const [velocity2, setVelocity2] = useState([0])
  const [time, setTime] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [collisionOccurred, setCollisionOccurred] = useState(false)

  const [balls, setBalls] = useState<Ball[]>([
    {
      x: 100,
      y: 200,
      vx: 8,
      vy: 0,
      mass: 5,
      radius: 25,
      color: "#EF4444",
    },
    {
      x: 500,
      y: 200,
      vx: 0,
      vy: 0,
      mass: 3,
      radius: 20,
      color: "#3B82F6",
    },
  ])

  const calculateCollision = (ball1: Ball, ball2: Ball) => {
    const dx = ball2.x - ball1.x
    const dy = ball2.y - ball1.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= ball1.radius + ball2.radius) {
      // Collision detected
      const angle = Math.atan2(dy, dx)

      // Velocities in rotated frame
      const v1 = ball1.vx * Math.cos(angle) + ball1.vy * Math.sin(angle)
      const v2 = ball2.vx * Math.cos(angle) + ball2.vy * Math.sin(angle)

      // Perpendicular velocities (unchanged)
      const v1p = -ball1.vx * Math.sin(angle) + ball1.vy * Math.cos(angle)
      const v2p = -ball2.vx * Math.sin(angle) + ball2.vy * Math.cos(angle)

      // New velocities after elastic collision
      const v1_new = ((ball1.mass - ball2.mass) * v1 + 2 * ball2.mass * v2) / (ball1.mass + ball2.mass)
      const v2_new = ((ball2.mass - ball1.mass) * v2 + 2 * ball1.mass * v1) / (ball1.mass + ball2.mass)

      // Convert back to x,y coordinates
      ball1.vx = v1_new * Math.cos(angle) - v1p * Math.sin(angle)
      ball1.vy = v1_new * Math.sin(angle) + v1p * Math.cos(angle)
      ball2.vx = v2_new * Math.cos(angle) - v2p * Math.sin(angle)
      ball2.vy = v2_new * Math.sin(angle) + v2p * Math.cos(angle)

      // Separate balls to prevent overlap
      const overlap = ball1.radius + ball2.radius - distance
      const separationX = (overlap / 2) * Math.cos(angle)
      const separationY = (overlap / 2) * Math.sin(angle)

      ball1.x -= separationX
      ball1.y -= separationY
      ball2.x += separationX
      ball2.y += separationY

      setCollisionOccurred(true)
    }
  }

  const updateBalls = (deltaTime: number) => {
    setBalls((prevBalls) => {
      const newBalls = prevBalls.map((ball) => ({
        ...ball,
        x: ball.x + ball.vx * deltaTime * 60,
        y: ball.y + ball.vy * deltaTime * 60,
      }))

      // Check for collisions
      if (newBalls.length === 2) {
        calculateCollision(newBalls[0], newBalls[1])
      }

      // Bounce off walls
      newBalls.forEach((ball) => {
        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= 600) {
          ball.vx = -ball.vx
          ball.x = Math.max(ball.radius, Math.min(600 - ball.radius, ball.x))
        }
        if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= 400) {
          ball.vy = -ball.vy
          ball.y = Math.max(ball.radius, Math.min(400 - ball.radius, ball.y))
        }
      })

      return newBalls
    })
  }

  const calculateMomentum = () => {
    const totalMomentumX = balls.reduce((sum, ball) => sum + ball.mass * ball.vx, 0)
    const totalMomentumY = balls.reduce((sum, ball) => sum + ball.mass * ball.vy, 0)
    return Math.sqrt(totalMomentumX * totalMomentumX + totalMomentumY * totalMomentumY)
  }

  const calculateKineticEnergy = () => {
    return balls.reduce((sum, ball) => sum + 0.5 * ball.mass * (ball.vx * ball.vx + ball.vy * ball.vy), 0)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background grid
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw balls
    balls.forEach((ball, index) => {
      // Ball
      ctx.fillStyle = ball.color
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.stroke()

      // Velocity vector
      const vectorScale = 10
      const vx = ball.vx * vectorScale
      const vy = ball.vy * vectorScale

      if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
        ctx.strokeStyle = "#10B981"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(ball.x, ball.y)
        ctx.lineTo(ball.x + vx, ball.y + vy)
        ctx.stroke()

        // Arrow head
        const arrowSize = 8
        const arrowAngle = Math.atan2(vy, vx)
        ctx.fillStyle = "#10B981"
        ctx.beginPath()
        ctx.moveTo(ball.x + vx, ball.y + vy)
        ctx.lineTo(
          ball.x + vx - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
          ball.y + vy - arrowSize * Math.sin(arrowAngle - Math.PI / 6),
        )
        ctx.lineTo(
          ball.x + vx - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
          ball.y + vy - arrowSize * Math.sin(arrowAngle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fill()
      }

      // Labels
      ctx.fillStyle = "#374151"
      ctx.font = "12px sans-serif"
      ctx.fillText(`m${index + 1} = ${ball.mass}kg`, ball.x - 20, ball.y - ball.radius - 10)
      ctx.fillText(
        `v = ${Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy).toFixed(1)} m/s`,
        ball.x - 25,
        ball.y + ball.radius + 20,
      )
    })

    // Collision indicator
    if (collisionOccurred) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [balls, collisionOccurred])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => prevTime + 0.016) // ~60fps
        updateBalls(0.016)
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

  useEffect(() => {
    // Reset collision indicator after a short time
    if (collisionOccurred) {
      const timer = setTimeout(() => setCollisionOccurred(false), 200)
      return () => clearTimeout(timer)
    }
  }, [collisionOccurred])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setCollisionOccurred(false)
    setBalls([
      {
        x: 100,
        y: 200,
        vx: velocity1[0],
        vy: 0,
        mass: mass1[0],
        radius: Math.sqrt(mass1[0]) * 5 + 10,
        color: "#EF4444",
      },
      {
        x: 500,
        y: 200,
        vx: velocity2[0],
        vy: 0,
        mass: mass2[0],
        radius: Math.sqrt(mass2[0]) * 5 + 10,
        color: "#3B82F6",
      },
    ])
  }

  // Update ball properties when sliders change
  useEffect(() => {
    if (!isPlaying) {
      setBalls((prevBalls) => [
        {
          ...prevBalls[0],
          mass: mass1[0],
          vx: velocity1[0],
          radius: Math.sqrt(mass1[0]) * 5 + 10,
        },
        {
          ...prevBalls[1],
          mass: mass2[0],
          vx: velocity2[0],
          radius: Math.sqrt(mass2[0]) * 5 + 10,
        },
      ])
    }
  }, [mass1, mass2, velocity1, velocity2, isPlaying])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/momentum">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Momentum
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Elastic Collision Simulator</h1>
              <p className="text-sm text-gray-600">Analyze momentum and energy conservation in collisions</p>
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
                    <CardTitle>Collision Simulation</CardTitle>
                    <CardDescription>Watch momentum and energy conservation in action</CardDescription>
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 mb-1">Total Momentum</div>
                    <div className="text-lg font-bold">{calculateMomentum().toFixed(2)} kg⋅m/s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600 mb-1">Total Kinetic Energy</div>
                    <div className="text-lg font-bold">{calculateKineticEnergy().toFixed(2)} J</div>
                  </div>
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
                <CardTitle>Ball 1 (Red)</CardTitle>
                <CardDescription>Adjust properties of the first ball</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass1[0]} kg</label>
                  <Slider value={mass1} onValueChange={setMass1} max={20} min={1} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Velocity: {velocity1[0]} m/s</label>
                  <Slider
                    value={velocity1}
                    onValueChange={setVelocity1}
                    max={15}
                    min={-15}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ball 2 (Blue)</CardTitle>
                <CardDescription>Adjust properties of the second ball</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass2[0]} kg</label>
                  <Slider value={mass2} onValueChange={setMass2} max={20} min={1} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Velocity: {velocity2[0]} m/s</label>
                  <Slider
                    value={velocity2}
                    onValueChange={setVelocity2}
                    max={15}
                    min={-15}
                    step={0.5}
                    className="w-full"
                  />
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
                    <strong>Momentum Conservation:</strong> p₁ + p₂ = p₁' + p₂'
                  </div>
                  <div>
                    <strong>Energy Conservation:</strong> KE₁ + KE₂ = KE₁' + KE₂'
                  </div>
                  <div>
                    <strong>Elastic Collision:</strong> Both momentum and kinetic energy are conserved
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    In elastic collisions, objects bounce off each other without losing energy to heat, sound, or
                    deformation.
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
