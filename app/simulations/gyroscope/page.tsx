"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function GyroscopeSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [spinRate, setSpinRate] = useState([50]) // rad/s
  const [mass, setMass] = useState([2]) // kg
  const [radius, setRadius] = useState([0.2]) // m
  const [supportDistance, setSupportDistance] = useState([0.3]) // m from center
  const [time, setTime] = useState(0)
  const [precessionAngle, setPrecessionAngle] = useState(0)
  const [tiltAngle, setTiltAngle] = useState([15]) // degrees
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81

  const calculateMomentOfInertia = () => 0.5 * mass[0] * radius[0] * radius[0] // solid disk
  const calculateAngularMomentum = () => calculateMomentOfInertia() * spinRate[0]
  const calculateTorque = () => mass[0] * g * supportDistance[0] * Math.sin((tiltAngle[0] * Math.PI) / 180)
  const calculatePrecessionRate = () => calculateTorque() / calculateAngularMomentum()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 500 // pixels per meter

    // Draw support point
    ctx.fillStyle = "#8B5CF6"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Calculate gyroscope position
    const tiltRad = (tiltAngle[0] * Math.PI) / 180
    const gyroX = centerX + supportDistance[0] * scale * Math.cos(precessionAngle) * Math.cos(tiltRad)
    const gyroY = centerY + supportDistance[0] * scale * Math.sin(precessionAngle) * Math.cos(tiltRad)
    const gyroZ = supportDistance[0] * scale * Math.sin(tiltRad)

    // Draw support rod
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(gyroX, gyroY - gyroZ * 0.5) // pseudo 3D projection
    ctx.stroke()

    // Draw gyroscope disk
    const diskRadius = radius[0] * scale
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.arc(gyroX, gyroY - gyroZ * 0.5, diskRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#DC2626"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw spin axis
    const axisLength = diskRadius * 1.5
    const axisX = axisLength * Math.cos(precessionAngle + Math.PI / 2)
    const axisY = axisLength * Math.sin(precessionAngle + Math.PI / 2)

    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(gyroX - axisX, gyroY - gyroZ * 0.5 - axisY)
    ctx.lineTo(gyroX + axisX, gyroY - gyroZ * 0.5 + axisY)
    ctx.stroke()

    // Draw angular momentum vector (along spin axis)
    const LScale = 0.5
    const LLength = calculateAngularMomentum() * LScale
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(gyroX, gyroY - gyroZ * 0.5)
    ctx.lineTo(
      gyroX + LLength * Math.cos(precessionAngle + Math.PI / 2),
      gyroY - gyroZ * 0.5 + LLength * Math.sin(precessionAngle + Math.PI / 2),
    )
    ctx.stroke()

    // Arrow for angular momentum
    const arrowX = gyroX + LLength * Math.cos(precessionAngle + Math.PI / 2)
    const arrowY = gyroY - gyroZ * 0.5 + LLength * Math.sin(precessionAngle + Math.PI / 2)
    const arrowAngle = precessionAngle + Math.PI / 2

    ctx.fillStyle = "#3B82F6"
    ctx.beginPath()
    ctx.moveTo(arrowX, arrowY)
    ctx.lineTo(arrowX - 12 * Math.cos(arrowAngle - Math.PI / 6), arrowY - 12 * Math.sin(arrowAngle - Math.PI / 6))
    ctx.lineTo(arrowX - 12 * Math.cos(arrowAngle + Math.PI / 6), arrowY - 12 * Math.sin(arrowAngle + Math.PI / 6))
    ctx.closePath()
    ctx.fill()

    // Draw weight vector
    const weightScale = 0.1
    const weightLength = mass[0] * g * weightScale
    ctx.strokeStyle = "#F59E0B"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(gyroX, gyroY - gyroZ * 0.5)
    ctx.lineTo(gyroX, gyroY - gyroZ * 0.5 + weightLength)
    ctx.stroke()

    // Weight arrow
    ctx.fillStyle = "#F59E0B"
    ctx.beginPath()
    ctx.moveTo(gyroX, gyroY - gyroZ * 0.5 + weightLength)
    ctx.lineTo(gyroX - 8, gyroY - gyroZ * 0.5 + weightLength - 15)
    ctx.lineTo(gyroX + 8, gyroY - gyroZ * 0.5 + weightLength - 15)
    ctx.closePath()
    ctx.fill()

    // Draw precession path
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(centerX, centerY, supportDistance[0] * scale * Math.cos(tiltRad), 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`Spin Rate: ${spinRate[0]} rad/s`, 20, 30)
    ctx.fillText(`Precession Rate: ${calculatePrecessionRate().toFixed(2)} rad/s`, 20, 50)
    ctx.fillText(`Angular Momentum: ${calculateAngularMomentum().toFixed(1)} kg⋅m²/s`, 20, 70)
    ctx.fillText(`Torque: ${calculateTorque().toFixed(2)} N⋅m`, 20, 90)

    // Legend
    ctx.fillStyle = "#3B82F6"
    ctx.fillText("L (Angular Momentum)", 20, canvas.height - 60)
    ctx.fillStyle = "#F59E0B"
    ctx.fillText("Weight", 20, canvas.height - 40)
    ctx.fillStyle = "#10B981"
    ctx.fillText("Spin Axis", 20, canvas.height - 20)
  }, [precessionAngle, spinRate, mass, radius, supportDistance, tiltAngle])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const precessionRate = calculatePrecessionRate()
          setPrecessionAngle((prev) => prev + precessionRate * 0.02)
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
    setPrecessionAngle(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/torque-rotation">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Torque & Rotation
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gyroscope Physics</h1>
              <p className="text-sm text-gray-600">Understand gyroscopic motion and precession</p>
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
                    <CardTitle>Gyroscope Simulation</CardTitle>
                    <CardDescription>Observe precession and gyroscopic effects</CardDescription>
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
                    <div className="text-sm font-medium text-blue-600">Angular Momentum</div>
                    <div className="text-lg font-bold text-blue-700">
                      {calculateAngularMomentum().toFixed(1)} kg⋅m²/s
                    </div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Torque</div>
                    <div className="text-lg font-bold text-yellow-700">{calculateTorque().toFixed(2)} N⋅m</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Precession Rate</div>
                    <div className="text-lg font-bold text-green-700">{calculatePrecessionRate().toFixed(2)} rad/s</div>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gyroscope Properties</CardTitle>
                <CardDescription>Adjust gyroscope parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Spin Rate: {spinRate[0]} rad/s</label>
                  <Slider value={spinRate} onValueChange={setSpinRate} max={100} min={10} step={5} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mass: {mass[0]} kg</label>
                  <Slider value={mass} onValueChange={setMass} max={5} min={0.5} step={0.1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Radius: {radius[0]} m</label>
                  <Slider value={radius} onValueChange={setRadius} max={0.5} min={0.1} step={0.01} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Support Distance: {supportDistance[0]} m</label>
                  <Slider
                    value={supportDistance}
                    onValueChange={setSupportDistance}
                    max={0.5}
                    min={0.1}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tilt Angle: {tiltAngle[0]}°</label>
                  <Slider value={tiltAngle} onValueChange={setTiltAngle} max={45} min={5} step={1} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculations</CardTitle>
                <CardDescription>Physics analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Moment of Inertia:</span>
                  <span className="text-sm font-medium">{calculateMomentOfInertia().toFixed(4)} kg⋅m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Precession Period:</span>
                  <span className="text-sm font-medium">
                    {calculatePrecessionRate() > 0 ? ((2 * Math.PI) / calculatePrecessionRate()).toFixed(1) : "∞"} s
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
                    <strong>Gyroscopic Precession:</strong> Ω = τ/L
                  </div>
                  <div>
                    <strong>Angular Momentum:</strong> L = Iω
                  </div>
                  <div>
                    <strong>Torque:</strong> τ = mgr sin θ
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    A spinning gyroscope precesses when a torque is applied perpendicular to its spin axis.
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
