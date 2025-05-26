"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function EnergyPendulumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [length, setLength] = useState([200])
  const [initialAngle, setInitialAngle] = useState([30])
  const [mass, setMass] = useState([5])
  const [time, setTime] = useState(0)
  const [angle, setAngle] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showEnergyBars, setShowEnergyBars] = useState(true)

  const g = 9.81 // gravity
  const damping = 0.999 // slight damping for realism

  const calculateAngle = (t: number) => {
    const L = length[0] / 100 // convert to meters
    const theta0 = (initialAngle[0] * Math.PI) / 180
    const omega = Math.sqrt(g / L)

    // Small angle approximation for simple harmonic motion
    if (Math.abs(theta0) < 0.3) {
      return theta0 * Math.cos(omega * t) * Math.pow(damping, t)
    } else {
      // More accurate calculation for larger angles
      const period = 4 * Math.sqrt(L / g) * (1 + (1 / 16) * theta0 * theta0)
      const omega_actual = (2 * Math.PI) / period
      return theta0 * Math.cos(omega_actual * t) * Math.pow(damping, t)
    }
  }

  const calculateEnergies = (currentAngle: number) => {
    const L = length[0] / 100 // convert to meters
    const m = mass[0] // mass in kg
    const h = L * (1 - Math.cos(currentAngle)) // height above lowest point
    const h_max = L * (1 - Math.cos((initialAngle[0] * Math.PI) / 180)) // max height

    const PE = m * g * h // potential energy
    const PE_max = m * g * h_max // max potential energy
    const KE = PE_max - PE // kinetic energy (conservation of energy)

    return {
      potential: PE,
      kinetic: Math.max(0, KE),
      total: PE_max,
      height: h,
    }
  }

  const getVelocity = (currentAngle: number) => {
    const L = length[0] / 100
    const h = L * (1 - Math.cos(currentAngle))
    const h_max = L * (1 - Math.cos((initialAngle[0] * Math.PI) / 180))

    // v = sqrt(2g(h_max - h))
    return Math.sqrt(2 * g * Math.max(0, h_max - h))
  }

  const getPeriod = () => {
    const L = length[0] / 100
    const theta0 = (initialAngle[0] * Math.PI) / 180

    if (Math.abs(theta0) < 0.3) {
      return 2 * Math.PI * Math.sqrt(L / g)
    } else {
      return 4 * Math.sqrt(L / g) * (1 + (1 / 16) * theta0 * theta0)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = 50
    const pendulumLength = length[0]

    // Calculate pendulum position
    const bobX = centerX + pendulumLength * Math.sin(angle)
    const bobY = centerY + pendulumLength * Math.cos(angle)

    // Draw ceiling/support
    ctx.strokeStyle = "#8B5CF6"
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(centerX - 30, centerY)
    ctx.lineTo(centerX + 30, centerY)
    ctx.stroke()

    // Draw string
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(bobX, bobY)
    ctx.stroke()

    // Draw pendulum bob
    const bobRadius = Math.sqrt(mass[0]) * 8 // radius proportional to sqrt(mass)
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#DC2626"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw angle arc
    if (Math.abs(angle) > 0.05) {
      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, Math.PI / 2, Math.PI / 2 + angle, angle < 0)
      ctx.stroke()
    }

    // Draw reference line (vertical)
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX, centerY + pendulumLength + 20)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw velocity vector
    const velocity = getVelocity(angle)
    const velocityScale = 20
    const velocityAngle = angle + Math.PI / 2 // perpendicular to string
    const vx = velocity * velocityScale * Math.cos(velocityAngle)
    const vy = velocity * velocityScale * Math.sin(velocityAngle)

    if (velocity > 0.1) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(bobX, bobY)
      ctx.lineTo(bobX + vx, bobY + vy)
      ctx.stroke()

      // Arrow head
      const arrowSize = 8
      const arrowAngle = Math.atan2(vy, vx)
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      ctx.moveTo(bobX + vx, bobY + vy)
      ctx.lineTo(
        bobX + vx - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
        bobY + vy - arrowSize * Math.sin(arrowAngle - Math.PI / 6),
      )
      ctx.lineTo(
        bobX + vx - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
        bobY + vy - arrowSize * Math.sin(arrowAngle + Math.PI / 6),
      )
      ctx.closePath()
      ctx.fill()
    }

    // Draw labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`θ = ${((angle * 180) / Math.PI).toFixed(1)}°`, centerX + 50, centerY + 30)
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, bobX + 20, bobY - 20)
  }, [angle, length, mass, initialAngle])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const newAngle = calculateAngle(newTime)
          setAngle(newAngle)
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
  }, [isPlaying, length, initialAngle])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setAngle((initialAngle[0] * Math.PI) / 180)
  }

  const energies = calculateEnergies(angle)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/energy">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Energy
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Energy in Pendulum Motion</h1>
              <p className="text-sm text-gray-600">Observe energy transformations in a swinging pendulum</p>
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
                    <CardTitle>Pendulum Simulation</CardTitle>
                    <CardDescription>Watch energy transform between potential and kinetic</CardDescription>
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
                          style={{ width: `${(energies.potential / energies.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{energies.potential.toFixed(1)} J</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600 mb-1">Kinetic Energy</div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full transition-all duration-100"
                          style={{ width: `${(energies.kinetic / energies.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{energies.kinetic.toFixed(1)} J</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-600 mb-1">Total Energy</div>
                      <div className="w-full bg-green-500 rounded-full h-4"></div>
                      <div className="text-xs text-gray-600 mt-1">{energies.total.toFixed(1)} J</div>
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
                <CardDescription>Adjust the pendulum properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Length: {length[0]} cm</label>
                  <Slider value={length} onValueChange={setLength} max={300} min={50} step={10} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Angle: {initialAngle[0]}°</label>
                  <Slider
                    value={initialAngle}
                    onValueChange={setInitialAngle}
                    max={60}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass[0]} kg</label>
                  <Slider value={mass} onValueChange={setMass} max={20} min={1} step={1} className="w-full" />
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
                  <span className="text-sm text-gray-600">Current Angle:</span>
                  <span className="text-sm font-medium">{((angle * 180) / Math.PI).toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Velocity:</span>
                  <span className="text-sm font-medium">{getVelocity(angle).toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Height:</span>
                  <span className="text-sm font-medium">{(energies.height * 100).toFixed(1)} cm</span>
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
                    <strong>Period:</strong> T = 2π√(L/g)
                  </div>
                  <div>
                    <strong>Potential Energy:</strong> PE = mgh
                  </div>
                  <div>
                    <strong>Kinetic Energy:</strong> KE = ½mv²
                  </div>
                  <div>
                    <strong>Conservation:</strong> PE + KE = constant
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Energy transforms continuously between potential (at extremes) and kinetic (at bottom).
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
