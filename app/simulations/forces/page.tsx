"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function ForcesSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [appliedForce, setAppliedForce] = useState([20])
  const [mass, setMass] = useState([5])
  const [friction, setFriction] = useState([0.2])
  const [time, setTime] = useState(0)
  const [position, setPosition] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [showVectors, setShowVectors] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81

  const calculateNetForce = () => {
    const applied = appliedForce[0]
    const frictionForce = friction[0] * mass[0] * g
    const direction = velocity >= 0 ? 1 : -1
    return applied - frictionForce * direction
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

    // Draw ground
    ctx.fillStyle = "#8B5CF6"
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40)

    // Draw grid
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height - 40)
      ctx.stroke()
    }

    // Calculate box position
    const boxSize = Math.sqrt(mass[0]) * 10 + 20
    const boxX = 100 + position * 2 // scale position for display
    const boxY = canvas.height - 40 - boxSize

    // Draw box
    ctx.fillStyle = "#EF4444"
    ctx.fillRect(boxX, boxY, boxSize, boxSize)
    ctx.strokeStyle = "#DC2626"
    ctx.lineWidth = 2
    ctx.strokeRect(boxX, boxY, boxSize, boxSize)

    if (showVectors) {
      const vectorScale = 3
      const centerX = boxX + boxSize / 2
      const centerY = boxY + boxSize / 2

      // Applied force vector
      const appliedLength = Math.abs(appliedForce[0]) * vectorScale
      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + appliedLength, centerY)
      ctx.stroke()

      // Arrow for applied force
      ctx.fillStyle = "#10B981"
      ctx.beginPath()
      ctx.moveTo(centerX + appliedLength, centerY)
      ctx.lineTo(centerX + appliedLength - 10, centerY - 5)
      ctx.lineTo(centerX + appliedLength - 10, centerY + 5)
      ctx.closePath()
      ctx.fill()

      // Friction force vector
      const frictionForce = friction[0] * mass[0] * g
      const frictionLength = frictionForce * vectorScale
      const frictionDirection = velocity >= 0 ? -1 : 1

      if (Math.abs(velocity) > 0.1 || Math.abs(appliedForce[0]) > frictionForce) {
        ctx.strokeStyle = "#F59E0B"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, centerY + 20)
        ctx.lineTo(centerX + frictionLength * frictionDirection, centerY + 20)
        ctx.stroke()

        // Arrow for friction
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

      // Net force vector
      const netForce = calculateNetForce()
      if (Math.abs(netForce) > 0.1) {
        const netLength = Math.abs(netForce) * vectorScale
        const netDirection = netForce > 0 ? 1 : -1

        ctx.strokeStyle = "#3B82F6"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - 20)
        ctx.lineTo(centerX + netLength * netDirection, centerY - 20)
        ctx.stroke()

        // Arrow for net force
        ctx.fillStyle = "#3B82F6"
        ctx.beginPath()
        if (netDirection > 0) {
          ctx.moveTo(centerX + netLength, centerY - 20)
          ctx.lineTo(centerX + netLength - 10, centerY - 25)
          ctx.lineTo(centerX + netLength - 10, centerY - 15)
        } else {
          ctx.moveTo(centerX - netLength, centerY - 20)
          ctx.lineTo(centerX - netLength + 10, centerY - 25)
          ctx.lineTo(centerX - netLength + 10, centerY - 15)
        }
        ctx.closePath()
        ctx.fill()
      }
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`m = ${mass[0]} kg`, boxX, boxY - 10)
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, boxX, boxY + boxSize + 15)

    if (showVectors) {
      ctx.fillStyle = "#10B981"
      ctx.fillText(`Applied: ${appliedForce[0]} N`, 20, 30)
      ctx.fillStyle = "#F59E0B"
      ctx.fillText(`Friction: ${(friction[0] * mass[0] * g).toFixed(1)} N`, 20, 50)
      ctx.fillStyle = "#3B82F6"
      ctx.fillText(`Net: ${calculateNetForce().toFixed(1)} N`, 20, 70)
    }
  }, [position, velocity, appliedForce, mass, friction, showVectors])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const acceleration = calculateAcceleration()

          setVelocity((prevVel) => {
            const newVel = prevVel + acceleration * 0.02
            return newVel
          })

          setPosition((prevPos) => {
            const newPos = prevPos + velocity * 0.02
            return newPos
          })

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
  }, [isPlaying, velocity])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setPosition(0)
    setVelocity(0)
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
              <h1 className="text-xl font-bold text-gray-900">Force and Motion</h1>
              <p className="text-sm text-gray-600">Apply forces and observe resulting motion</p>
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
                    <CardTitle>Force and Motion Simulation</CardTitle>
                    <CardDescription>Apply forces and observe Newton's second law</CardDescription>
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
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>Adjust forces and object properties</CardDescription>
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
                  <label className="text-sm font-medium mb-2 block">Friction Coefficient: {friction[0]}</label>
                  <Slider value={friction} onValueChange={setFriction} max={1} min={0} step={0.05} className="w-full" />
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
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium">{position.toFixed(2)} m</span>
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
                    <strong>Newton's 2nd Law:</strong> F_net = ma
                  </div>
                  <div>
                    <strong>Friction Force:</strong> f = μN = μmg
                  </div>
                  <div>
                    <strong>Net Force:</strong> F_net = F_applied - f_friction
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
