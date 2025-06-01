"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function FrictionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [appliedForce, setAppliedForce] = useState([0])
  const [mass, setMass] = useState([5])
  const [staticFriction, setStaticFriction] = useState([0.6])
  const [kineticFriction, setKineticFriction] = useState([0.4])
  const [time, setTime] = useState(0)
  const [position, setPosition] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81

  const getMaxStaticFriction = () => staticFriction[0] * mass[0] * g
  const getKineticFriction = () => kineticFriction[0] * mass[0] * g

  const calculateNetForce = () => {
    const applied = appliedForce[0]
    const maxStatic = getMaxStaticFriction()
    const kinetic = getKineticFriction()

    if (!isMoving) {
      // Static case
      if (Math.abs(applied) <= maxStatic) {
        return 0 // Static friction balances applied force
      } else {
        // Overcome static friction, start moving
        setIsMoving(true)
        const direction = applied > 0 ? 1 : -1
        return applied - kinetic * direction
      }
    } else {
      // Kinetic case
      if (Math.abs(velocity) < 0.01 && Math.abs(applied) <= maxStatic) {
        // Stopped and applied force is less than static friction
        setIsMoving(false)
        setVelocity(0)
        return 0
      }
      const direction = velocity > 0 ? 1 : velocity < 0 ? -1 : applied > 0 ? 1 : -1
      return applied - kinetic * direction
    }
  }

  const calculateAcceleration = () => {
    return calculateNetForce() / mass[0]
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw surface
    ctx.fillStyle = "#8B5CF6"
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40)

    // Draw surface texture
    ctx.fillStyle = "#7C3AED"
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(i + j * 6, canvas.height - 35 + j * 8, 4, 4)
      }
    }

    // Calculate box position
    const boxSize = Math.sqrt(mass[0]) * 8 + 20
    const boxX = 150 + position * 2
    const boxY = canvas.height - 40 - boxSize

    // Draw box
    ctx.fillStyle = isMoving ? "#10B981" : "#EF4444"
    ctx.fillRect(boxX, boxY, boxSize, boxSize)
    ctx.strokeStyle = isMoving ? "#059669" : "#DC2626"
    ctx.lineWidth = 2
    ctx.strokeRect(boxX, boxY, boxSize, boxSize)

    const centerX = boxX + boxSize / 2
    const centerY = boxY + boxSize / 2

    // Draw applied force vector
    if (Math.abs(appliedForce[0]) > 0.1) {
      const vectorScale = 3
      const appliedLength = Math.abs(appliedForce[0]) * vectorScale
      const direction = appliedForce[0] > 0 ? 1 : -1

      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - 20)
      ctx.lineTo(centerX + appliedLength * direction, centerY - 20)
      ctx.stroke()

      // Arrow
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      if (direction > 0) {
        ctx.moveTo(centerX + appliedLength, centerY - 20)
        ctx.lineTo(centerX + appliedLength - 10, centerY - 25)
        ctx.lineTo(centerX + appliedLength - 10, centerY - 15)
      } else {
        ctx.moveTo(centerX - appliedLength, centerY - 20)
        ctx.lineTo(centerX - appliedLength + 10, centerY - 25)
        ctx.lineTo(centerX - appliedLength + 10, centerY - 15)
      }
      ctx.closePath()
      ctx.fill()
    }

    // Draw friction force vector
    const frictionForce = isMoving ? getKineticFriction() : Math.min(Math.abs(appliedForce[0]), getMaxStaticFriction())
    if (frictionForce > 0.1) {
      const vectorScale = 3
      const frictionLength = frictionForce * vectorScale
      let frictionDirection = 0

      if (isMoving) {
        frictionDirection = velocity > 0 ? -1 : 1
      } else {
        frictionDirection = appliedForce[0] > 0 ? -1 : appliedForce[0] < 0 ? 1 : 0
      }

      if (frictionDirection !== 0) {
        ctx.strokeStyle = "#F59E0B"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, centerY + 20)
        ctx.lineTo(centerX + frictionLength * frictionDirection, centerY + 20)
        ctx.stroke()

        // Arrow
        ctx.fillStyle = "#F59E0B"
        ctx.beginPath()
        if (frictionDirection > 0) {
          ctx.moveTo(centerX + frictionLength, centerY + 20)
          ctx.lineTo(centerX + frictionLength - 10, centerY + 15)
          ctx.lineTo(centerX + frictionLength - 10, centerY + 25)
        } else {
          ctx.moveTo(centerX - frictionLength, centerY + 20)
          ctx.lineTo(centerX - frictionLength + 10, centerY + 15)
          ctx.lineTo(centerX - frictionLength + 10, centerY + 25)
        }
        ctx.closePath()
        ctx.fill()
      }
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`${isMoving ? "MOVING" : "STATIC"}`, boxX, boxY - 10)
    ctx.fillText(`v = ${velocity.toFixed(2)} m/s`, boxX, boxY + boxSize + 15)

    // Force information
    ctx.fillStyle = "#3B82F6"
    ctx.fillText(`Applied: ${appliedForce[0]} N`, 20, 30)
    ctx.fillStyle = "#F59E0B"
    if (isMoving) {
      ctx.fillText(`Kinetic Friction: ${getKineticFriction().toFixed(1)} N`, 20, 50)
    } else {
      ctx.fillText(
        `Static Friction: ${frictionForce.toFixed(1)} N (max: ${getMaxStaticFriction().toFixed(1)} N)`,
        20,
        50,
      )
    }
    ctx.fillStyle = "#10B981"
    ctx.fillText(`Net Force: ${calculateNetForce().toFixed(1)} N`, 20, 70)
  }, [position, velocity, appliedForce, mass, staticFriction, kineticFriction, isMoving])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const acceleration = calculateAcceleration()

          setVelocity((prevVel) => {
            const newVel = prevVel + acceleration * 0.02
            // Stop if velocity becomes very small and no net force
            if (Math.abs(newVel) < 0.01 && Math.abs(calculateNetForce()) < 0.1) {
              setIsMoving(false)
              return 0
            }
            return newVel
          })

          setPosition((prevPos) => prevPos + velocity * 0.02)

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
  }, [isPlaying, velocity, appliedForce, mass, staticFriction, kineticFriction, isMoving])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setPosition(0)
    setVelocity(0)
    setIsMoving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
               <Link href="/topics/dynamics">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dynamics
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Friction Simulator</h1>
              <p className="text-sm text-gray-600">Explore static and kinetic friction</p>
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
                    <CardTitle>Friction Simulation</CardTitle>
                    <CardDescription>Understand static vs kinetic friction</CardDescription>
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
                    height={300}
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
                  <Badge variant={isMoving ? "default" : "destructive"}>{isMoving ? "Moving" : "Static"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>Adjust forces and friction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Applied Force: {appliedForce[0]} N</label>
                  <Slider
                    value={appliedForce}
                    onValueChange={setAppliedForce}
                    max={50}
                    min={-50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass[0]} kg</label>
                  <Slider value={mass} onValueChange={setMass} max={20} min={1} step={0.5} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Static Friction (μₛ): {staticFriction[0]}</label>
                  <Slider
                    value={staticFriction}
                    onValueChange={setStaticFriction}
                    max={1.5}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Kinetic Friction (μₖ): {kineticFriction[0]}</label>
                  <Slider
                    value={kineticFriction}
                    onValueChange={setKineticFriction}
                    max={1.2}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Measurements</CardTitle>
                <CardDescription>Real-time calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Static Friction:</span>
                  <span className="text-sm font-medium">{getMaxStaticFriction().toFixed(1)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kinetic Friction:</span>
                  <span className="text-sm font-medium">{getKineticFriction().toFixed(1)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Force:</span>
                  <span className="text-sm font-medium">{calculateNetForce().toFixed(1)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Acceleration:</span>
                  <span className="text-sm font-medium">{calculateAcceleration().toFixed(2)} m/s²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Velocity:</span>
                  <span className="text-sm font-medium">{velocity.toFixed(2)} m/s</span>
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
                    <strong>Static Friction:</strong> fₛ ≤ μₛN (prevents motion)
                  </div>
                  <div>
                    <strong>Kinetic Friction:</strong> fₖ = μₖN (opposes motion)
                  </div>
                  <div>
                    <strong>Key Point:</strong> μₛ &gt; μₖ (static &gt; kinetic)
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Static friction adjusts to balance applied force up to its maximum value. Once overcome, kinetic
                    friction takes over.
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
