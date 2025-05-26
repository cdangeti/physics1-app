"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function SpringMassSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [springConstant, setSpringConstant] = useState([50])
  const [mass, setMass] = useState([2])
  const [amplitude, setAmplitude] = useState([50])
  const [time, setTime] = useState(0)
  const [position, setPosition] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showEnergyBars, setShowEnergyBars] = useState(true)

  const calculatePosition = (t: number) => {
    const k = springConstant[0]
    const m = mass[0]
    const A = amplitude[0] / 100 // convert to meters
    const omega = Math.sqrt(k / m)

    return A * Math.cos(omega * t)
  }

  const calculateVelocity = (t: number) => {
    const k = springConstant[0]
    const m = mass[0]
    const A = amplitude[0] / 100
    const omega = Math.sqrt(k / m)

    return -A * omega * Math.sin(omega * t)
  }

  const calculateAcceleration = (t: number) => {
    const k = springConstant[0]
    const m = mass[0]
    const A = amplitude[0] / 100
    const omega = Math.sqrt(k / m)

    return -A * omega * omega * Math.cos(omega * t)
  }

  const calculateEnergies = (pos: number, vel: number) => {
    const k = springConstant[0]
    const m = mass[0]

    const PE = 0.5 * k * pos * pos // spring potential energy
    const KE = 0.5 * m * vel * vel // kinetic energy
    const total = PE + KE

    return { potential: PE, kinetic: KE, total }
  }

  const getPeriod = () => {
    const k = springConstant[0]
    const m = mass[0]
    return 2 * Math.PI * Math.sqrt(m / k)
  }

  const getFrequency = () => {
    return 1 / getPeriod()
  }

  const getAngularFrequency = () => {
    const k = springConstant[0]
    const m = mass[0]
    return Math.sqrt(k / m)
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
    const equilibriumX = centerX
    const currentX = equilibriumX + position * 100 // convert back to pixels

    // Draw wall
    ctx.fillStyle = "#8B5CF6"
    ctx.fillRect(50, centerY - 100, 20, 200)

    // Draw spring
    const springLength = currentX - 70
    const springCoils = 12
    const springWidth = 20

    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(70, centerY)

    for (let i = 0; i <= springCoils; i++) {
      const x = 70 + (springLength / springCoils) * i
      const y = centerY + (i % 2 === 0 ? 0 : i % 4 === 1 ? springWidth : -springWidth)
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Draw mass
    const massSize = Math.sqrt(mass[0]) * 15 + 10
    ctx.fillStyle = "#EF4444"
    ctx.fillRect(currentX - massSize / 2, centerY - massSize / 2, massSize, massSize)
    ctx.strokeStyle = "#DC2626"
    ctx.lineWidth = 2
    ctx.strokeRect(currentX - massSize / 2, centerY - massSize / 2, massSize, massSize)

    // Draw equilibrium position
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(equilibriumX, centerY - 60)
    ctx.lineTo(equilibriumX, centerY + 60)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw force vector
    const force = -springConstant[0] * position // F = -kx
    const forceScale = 2
    const forceLength = Math.abs(force) * forceScale

    if (Math.abs(force) > 0.1) {
      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(currentX, centerY)
      ctx.lineTo(currentX + (force > 0 ? forceLength : -forceLength), centerY)
      ctx.stroke()

      // Arrow head
      const arrowSize = 10
      const arrowX = currentX + (force > 0 ? forceLength : -forceLength)
      ctx.fillStyle = "#10B981"
      ctx.beginPath()
      if (force > 0) {
        ctx.moveTo(arrowX, centerY)
        ctx.lineTo(arrowX - arrowSize, centerY - arrowSize / 2)
        ctx.lineTo(arrowX - arrowSize, centerY + arrowSize / 2)
      } else {
        ctx.moveTo(arrowX, centerY)
        ctx.lineTo(arrowX + arrowSize, centerY - arrowSize / 2)
        ctx.lineTo(arrowX + arrowSize, centerY + arrowSize / 2)
      }
      ctx.closePath()
      ctx.fill()
    }

    // Draw velocity vector
    const velocity = calculateVelocity(time)
    const velocityScale = 100
    const velocityLength = Math.abs(velocity) * velocityScale

    if (Math.abs(velocity) > 0.01) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(currentX, centerY - 40)
      ctx.lineTo(currentX + (velocity > 0 ? velocityLength : -velocityLength), centerY - 40)
      ctx.stroke()

      // Arrow head
      const arrowSize = 8
      const arrowX = currentX + (velocity > 0 ? velocityLength : -velocityLength)
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      if (velocity > 0) {
        ctx.moveTo(arrowX, centerY - 40)
        ctx.lineTo(arrowX - arrowSize, centerY - 40 - arrowSize / 2)
        ctx.lineTo(arrowX - arrowSize, centerY - 40 + arrowSize / 2)
      } else {
        ctx.moveTo(arrowX, centerY - 40)
        ctx.lineTo(arrowX + arrowSize, centerY - 40 - arrowSize / 2)
        ctx.lineTo(arrowX + arrowSize, centerY - 40 + arrowSize / 2)
      }
      ctx.closePath()
      ctx.fill()
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText("Equilibrium", equilibriumX - 30, centerY + 80)
    ctx.fillText(`x = ${position.toFixed(2)} m`, currentX - 20, centerY + 40)

    if (Math.abs(force) > 0.1) {
      ctx.fillStyle = "#10B981"
      ctx.fillText(`F = ${force.toFixed(1)} N`, currentX + 30, centerY + 10)
    }

    if (Math.abs(velocity) > 0.01) {
      ctx.fillStyle = "#3B82F6"
      ctx.fillText(`v = ${velocity.toFixed(2)} m/s`, currentX + 30, centerY - 30)
    }
  }, [position, time, springConstant, mass, amplitude])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const newPosition = calculatePosition(newTime)
          setPosition(newPosition)
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
  }, [isPlaying, springConstant, mass, amplitude])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setPosition(amplitude[0] / 100)
  }

  const velocity = calculateVelocity(time)
  const acceleration = calculateAcceleration(time)
  const energies = calculateEnergies(position, velocity)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/harmonic-motion">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Simple Harmonic Motion
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Spring-Mass System</h1>
              <p className="text-sm text-gray-600">Explore simple harmonic motion with springs</p>
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
                    <CardTitle>Spring-Mass Simulation</CardTitle>
                    <CardDescription>Observe simple harmonic motion and energy transformations</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowEnergyBars(!showEnergyBars)}>
                      Energy Bars
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

                {showEnergyBars && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600 mb-1">Potential Energy</div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-red-500 h-4 rounded-full transition-all duration-100"
                          style={{ width: `${energies.total > 0 ? (energies.potential / energies.total) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{energies.potential.toFixed(2)} J</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600 mb-1">Kinetic Energy</div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full transition-all duration-100"
                          style={{ width: `${energies.total > 0 ? (energies.kinetic / energies.total) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{energies.kinetic.toFixed(2)} J</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-600 mb-1">Total Energy</div>
                      <div className="w-full bg-green-500 rounded-full h-4"></div>
                      <div className="text-xs text-gray-600 mt-1">{energies.total.toFixed(2)} J</div>
                    </div>
                  </div>
                )}

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
                <CardDescription>Adjust the spring-mass system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Spring Constant: {springConstant[0]} N/m</label>
                  <Slider
                    value={springConstant}
                    onValueChange={setSpringConstant}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass[0]} kg</label>
                  <Slider value={mass} onValueChange={setMass} max={10} min={0.5} step={0.1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Amplitude: {amplitude[0]} cm</label>
                  <Slider
                    value={amplitude}
                    onValueChange={setAmplitude}
                    max={100}
                    min={10}
                    step={5}
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
                  <span className="text-sm text-gray-600">Period:</span>
                  <span className="text-sm font-medium">{getPeriod().toFixed(2)} s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frequency:</span>
                  <span className="text-sm font-medium">{getFrequency().toFixed(2)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Angular Frequency:</span>
                  <span className="text-sm font-medium">{getAngularFrequency().toFixed(2)} rad/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium">{position.toFixed(3)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Velocity:</span>
                  <span className="text-sm font-medium">{velocity.toFixed(3)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Acceleration:</span>
                  <span className="text-sm font-medium">{acceleration.toFixed(3)} m/s²</span>
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
                    <strong>Position:</strong> x(t) = A cos(ωt)
                  </div>
                  <div>
                    <strong>Velocity:</strong> v(t) = -Aω sin(ωt)
                  </div>
                  <div>
                    <strong>Acceleration:</strong> a(t) = -Aω² cos(ωt)
                  </div>
                  <div>
                    <strong>Angular Frequency:</strong> ω = √(k/m)
                  </div>
                  <div>
                    <strong>Period:</strong> T = 2π√(m/k)
                  </div>
                  <div>
                    <strong>Spring Force:</strong> F = -kx
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    The restoring force is proportional to displacement and always points toward equilibrium.
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
