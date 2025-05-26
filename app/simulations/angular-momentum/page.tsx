"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function AngularMomentumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [initialRadius, setInitialRadius] = useState([100])
  const [finalRadius, setFinalRadius] = useState([50])
  const [mass, setMass] = useState([2])
  const [time, setTime] = useState(0)
  const [currentRadius, setCurrentRadius] = useState(100)
  const [angularVelocity, setAngularVelocity] = useState(2)
  const [isContracting, setIsContracting] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const calculateMomentOfInertia = (radius: number) => mass[0] * (radius / 100) * (radius / 100) // point mass approximation
  const calculateAngularMomentum = (radius: number, omega: number) => calculateMomentOfInertia(radius) * omega
  const calculateKineticEnergy = (radius: number, omega: number) =>
    0.5 * calculateMomentOfInertia(radius) * omega * omega

  const initialL = calculateAngularMomentum(initialRadius[0], 2) // initial angular momentum

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw platform
    ctx.fillStyle = "#8B5CF6"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    ctx.fill()

    // Draw rotating person/object
    const angle = time * angularVelocity
    const objectX = centerX + currentRadius * Math.cos(angle)
    const objectY = centerY + currentRadius * Math.sin(angle)

    // Draw radius line
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(objectX, objectY)
    ctx.stroke()

    // Draw object
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.arc(objectX, objectY, 15, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#DC2626"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw velocity vector
    const velocityScale = 20
    const velocity = angularVelocity * (currentRadius / 100)
    const vx = -velocity * velocityScale * Math.sin(angle)
    const vy = velocity * velocityScale * Math.cos(angle)

    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(objectX, objectY)
    ctx.lineTo(objectX + vx, objectY + vy)
    ctx.stroke()

    // Velocity arrow
    const arrowAngle = Math.atan2(vy, vx)
    ctx.fillStyle = "#10B981"
    ctx.beginPath()
    ctx.moveTo(objectX + vx, objectY + vy)
    ctx.lineTo(
      objectX + vx - 10 * Math.cos(arrowAngle - Math.PI / 6),
      objectY + vy - 10 * Math.sin(arrowAngle - Math.PI / 6),
    )
    ctx.lineTo(
      objectX + vx - 10 * Math.cos(arrowAngle + Math.PI / 6),
      objectY + vy - 10 * Math.sin(arrowAngle + Math.PI / 6),
    )
    ctx.closePath()
    ctx.fill()

    // Draw circular path
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw target radius
    if (isContracting) {
      ctx.strokeStyle = "#F59E0B"
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.arc(centerX, centerY, finalRadius[0], 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "14px sans-serif"
    ctx.fillText(`ω = ${angularVelocity.toFixed(2)} rad/s`, 20, 30)
    ctx.fillText(`r = ${(currentRadius / 100).toFixed(2)} m`, 20, 50)
    ctx.fillText(`L = ${calculateAngularMomentum(currentRadius, angularVelocity).toFixed(3)} kg⋅m²/s`, 20, 70)
    ctx.fillText(`KE = ${calculateKineticEnergy(currentRadius, angularVelocity).toFixed(3)} J`, 20, 90)

    // Conservation status
    const currentL = calculateAngularMomentum(currentRadius, angularVelocity)
    const conservationError = Math.abs((currentL - initialL) / initialL) * 100
    ctx.fillStyle = conservationError < 1 ? "#10B981" : "#EF4444"
    ctx.fillText(`L Conservation: ${conservationError.toFixed(1)}% error`, 20, 110)
  }, [time, currentRadius, angularVelocity, isContracting, initialRadius, finalRadius, mass])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => prevTime + 0.02)

        if (isContracting) {
          setCurrentRadius((prevRadius) => {
            const newRadius = Math.max(finalRadius[0], prevRadius - 1)

            // Conservation of angular momentum: L = Iω = constant
            // I₁ω₁ = I₂ω₂
            const newI = calculateMomentOfInertia(newRadius)
            const newOmega = initialL / newI
            setAngularVelocity(newOmega)

            return newRadius
          })
        }

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
  }, [isPlaying, isContracting, finalRadius, initialL])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setCurrentRadius(initialRadius[0])
    setAngularVelocity(2)
    setIsContracting(false)
  }

  const handleContract = () => {
    setIsContracting(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/rotational-energy">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rotational Energy
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Angular Momentum Conservation</h1>
              <p className="text-sm text-gray-600">Explore conservation of angular momentum</p>
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
                    <CardTitle>Angular Momentum Conservation</CardTitle>
                    <CardDescription>Watch what happens when the radius changes</CardDescription>
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

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Angular Velocity</div>
                    <div className="text-lg font-bold text-blue-700">{angularVelocity.toFixed(2)} rad/s</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Angular Momentum</div>
                    <div className="text-lg font-bold text-green-700">
                      {calculateAngularMomentum(currentRadius, angularVelocity).toFixed(3)} kg⋅m²/s
                    </div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Kinetic Energy</div>
                    <div className="text-lg font-bold text-yellow-700">
                      {calculateKineticEnergy(currentRadius, angularVelocity).toFixed(3)} J
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button onClick={handlePlay} className="flex items-center space-x-2">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </Button>
                  <Button onClick={handleContract} disabled={isContracting} variant="outline">
                    Contract Radius
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
                <CardTitle>System Parameters</CardTitle>
                <CardDescription>Set initial conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Radius: {initialRadius[0]} cm</label>
                  <Slider
                    value={initialRadius}
                    onValueChange={setInitialRadius}
                    max={150}
                    min={50}
                    step={5}
                    className="w-full"
                    disabled={isPlaying}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Final Radius: {finalRadius[0]} cm</label>
                  <Slider
                    value={finalRadius}
                    onValueChange={setFinalRadius}
                    max={100}
                    min={20}
                    step={5}
                    className="w-full"
                    disabled={isPlaying}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass[0]} kg</label>
                  <Slider
                    value={mass}
                    onValueChange={setMass}
                    max={5}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                    disabled={isPlaying}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictions</CardTitle>
                <CardDescription>What will happen when radius contracts?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Initial ω:</span>
                  <span className="text-sm font-medium">2.00 rad/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Final ω (predicted):</span>
                  <span className="text-sm font-medium">
                    {(initialL / calculateMomentOfInertia(finalRadius[0])).toFixed(2)} rad/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Speed increase:</span>
                  <span className="text-sm font-medium">
                    {(initialL / calculateMomentOfInertia(finalRadius[0]) / 2).toFixed(1)}×
                  </span>
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
                    <strong>Conservation:</strong> L₁ = L₂ (no external torque)
                  </div>
                  <div>
                    <strong>Angular Momentum:</strong> L = Iω
                  </div>
                  <div>
                    <strong>Point Mass:</strong> I = mr²
                  </div>
                  <div>
                    <strong>Key Insight:</strong> As r decreases, ω increases to conserve L
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    This is why figure skaters spin faster when they pull their arms in!
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
