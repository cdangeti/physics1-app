"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function RotatingDiskSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [torque, setTorque] = useState([10])
  const [momentOfInertia, setMomentOfInertia] = useState([2])
  const [radius, setRadius] = useState([100])
  const [time, setTime] = useState(0)
  const [angularVelocity, setAngularVelocity] = useState(0)
  const [angle, setAngle] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const calculateAngularAcceleration = () => torque[0] / momentOfInertia[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const diskRadius = radius[0]

    // Draw disk
    ctx.fillStyle = "#3B82F6"
    ctx.beginPath()
    ctx.arc(centerX, centerY, diskRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#1E40AF"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw radius line to show rotation
    const lineX = centerX + diskRadius * 0.8 * Math.cos(angle)
    const lineY = centerY + diskRadius * 0.8 * Math.sin(angle)

    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(lineX, lineY)
    ctx.stroke()

    // Draw center dot
    ctx.fillStyle = "#1E40AF"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw torque arrow
    if (Math.abs(torque[0]) > 0.1) {
      const torqueRadius = diskRadius + 30
      const arrowLength = Math.abs(torque[0]) * 3
      const direction = torque[0] > 0 ? 1 : -1

      // Curved arrow to show torque direction
      ctx.strokeStyle = "#EF4444"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(centerX, centerY, torqueRadius, 0, direction * arrowLength * 0.01)
      ctx.stroke()

      // Arrow head
      const arrowAngle = direction * arrowLength * 0.01
      const arrowX = centerX + torqueRadius * Math.cos(arrowAngle)
      const arrowY = centerY + torqueRadius * Math.sin(arrowAngle)

      ctx.fillStyle = "#EF4444"
      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(
        arrowX - 15 * Math.cos(arrowAngle + (direction * Math.PI) / 6),
        arrowY - 15 * Math.sin(arrowAngle + (direction * Math.PI) / 6),
      )
      ctx.lineTo(
        arrowX - 15 * Math.cos(arrowAngle - (direction * Math.PI) / 6),
        arrowY - 15 * Math.sin(arrowAngle - (direction * Math.PI) / 6),
      )
      ctx.closePath()
      ctx.fill()
    }

    // Draw angular velocity vector
    if (Math.abs(angularVelocity) > 0.1) {
      const vectorLength = Math.abs(angularVelocity) * 20
      const direction = angularVelocity > 0 ? 1 : -1

      ctx.strokeStyle = "#10B981"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - diskRadius - 50)
      ctx.lineTo(centerX, centerY - diskRadius - 50 - vectorLength * direction)
      ctx.stroke()

      // Arrow head
      const arrowY = centerY - diskRadius - 50 - vectorLength * direction
      ctx.fillStyle = "#10B981"
      ctx.beginPath()
      if (direction > 0) {
        ctx.moveTo(centerX, arrowY)
        ctx.lineTo(centerX - 8, arrowY + 15)
        ctx.lineTo(centerX + 8, arrowY + 15)
      } else {
        ctx.moveTo(centerX, arrowY)
        ctx.lineTo(centerX - 8, arrowY - 15)
        ctx.lineTo(centerX + 8, arrowY - 15)
      }
      ctx.closePath()
      ctx.fill()
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "14px sans-serif"
    ctx.fillText(`ω = ${angularVelocity.toFixed(2)} rad/s`, 20, 30)
    ctx.fillText(`α = ${calculateAngularAcceleration().toFixed(2)} rad/s²`, 20, 50)
    ctx.fillText(`θ = ${(angle % (2 * Math.PI)).toFixed(2)} rad`, 20, 70)

    if (Math.abs(torque[0]) > 0.1) {
      ctx.fillStyle = "#EF4444"
      ctx.fillText(`τ = ${torque[0]} N⋅m`, centerX + diskRadius + 40, centerY)
    }

    if (Math.abs(angularVelocity) > 0.1) {
      ctx.fillStyle = "#10B981"
      ctx.fillText(`ω`, centerX + 10, centerY - diskRadius - 60)
    }
  }, [angle, angularVelocity, torque, momentOfInertia, radius])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02
          const alpha = calculateAngularAcceleration()

          setAngularVelocity((prevOmega) => {
            const newOmega = prevOmega + alpha * 0.02
            return newOmega
          })

          setAngle((prevAngle) => prevAngle + angularVelocity * 0.02)

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
  }, [isPlaying, angularVelocity])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setAngularVelocity(0)
    setAngle(0)
  }

  const calculateRotationalKE = () => 0.5 * momentOfInertia[0] * angularVelocity * angularVelocity

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
              <h1 className="text-xl font-bold text-gray-900">Rotating Disk Simulator</h1>
              <p className="text-sm text-gray-600">Analyze rotational motion and angular acceleration</p>
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
                    <CardTitle>Rotating Disk Simulation</CardTitle>
                    <CardDescription>Apply torque and observe rotational motion</CardDescription>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>Adjust disk properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Applied Torque: {torque[0]} N⋅m</label>
                  <Slider value={torque} onValueChange={setTorque} max={50} min={-50} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Moment of Inertia: {momentOfInertia[0]} kg⋅m²
                  </label>
                  <Slider
                    value={momentOfInertia}
                    onValueChange={setMomentOfInertia}
                    max={10}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Disk Radius: {radius[0]} px</label>
                  <Slider value={radius} onValueChange={setRadius} max={150} min={50} step={5} className="w-full" />
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
                  <span className="text-sm text-gray-600">Angular Acceleration:</span>
                  <span className="text-sm font-medium">{calculateAngularAcceleration().toFixed(2)} rad/s²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Angular Velocity:</span>
                  <span className="text-sm font-medium">{angularVelocity.toFixed(2)} rad/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Angle:</span>
                  <span className="text-sm font-medium">{(angle % (2 * Math.PI)).toFixed(2)} rad</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rotational KE:</span>
                  <span className="text-sm font-medium">{calculateRotationalKE().toFixed(2)} J</span>
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
                    <strong>Newton's 2nd Law (Rotation):</strong> τ = Iα
                  </div>
                  <div>
                    <strong>Angular Kinematics:</strong> ω = ω₀ + αt
                  </div>
                  <div>
                    <strong>Rotational KE:</strong> KE = ½Iω²
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Torque causes angular acceleration, just like force causes linear acceleration.
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
