"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

export default function RelativeMotionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [carVelocity, setCarVelocity] = useState([15])
  const [trainVelocity, setTrainVelocity] = useState([25])
  const [observerFrame, setObserverFrame] = useState("ground")
  const [time, setTime] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const [carPosition, setCarPosition] = useState(100)
  const [trainPosition, setTrainPosition] = useState(50)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate relative positions based on observer frame
    let displayCarPos = carPosition
    let displayTrainPos = trainPosition
    let backgroundOffset = 0

    if (observerFrame === "car") {
      // Car appears stationary, everything else moves relative to car
      backgroundOffset = -carPosition + 100
      displayCarPos = 100
      displayTrainPos = trainPosition + backgroundOffset
    } else if (observerFrame === "train") {
      // Train appears stationary, everything else moves relative to train
      backgroundOffset = -trainPosition + 200
      displayCarPos = carPosition + backgroundOffset
      displayTrainPos = 200
    }

    // Draw ground/road with moving reference lines
    ctx.fillStyle = "#6B7280"
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60)

    // Draw road markings that move with reference frame
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 3
    ctx.setLineDash([20, 20])
    for (let i = -200; i < canvas.width + 200; i += 100) {
      const lineX = i + (backgroundOffset % 100)
      if (lineX > -50 && lineX < canvas.width + 50) {
        ctx.beginPath()
        ctx.moveTo(lineX, canvas.height - 30)
        ctx.lineTo(lineX + 40, canvas.height - 30)
        ctx.stroke()
      }
    }
    ctx.setLineDash([])

    // Draw train tracks
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 4
    for (let i = 0; i < 2; i++) {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height - 120 + i * 20)
      ctx.lineTo(canvas.width, canvas.height - 120 + i * 20)
      ctx.stroke()
    }

    // Draw train ties
    ctx.strokeStyle = "#654321"
    ctx.lineWidth = 2
    for (let i = -50; i < canvas.width + 50; i += 30) {
      const tieX = i + (backgroundOffset % 30)
      if (tieX > -20 && tieX < canvas.width + 20) {
        ctx.beginPath()
        ctx.moveTo(tieX, canvas.height - 130)
        ctx.lineTo(tieX, canvas.height - 90)
        ctx.stroke()
      }
    }

    // Draw car
    if (displayCarPos > -100 && displayCarPos < canvas.width + 100) {
      ctx.fillStyle = "#EF4444"
      ctx.fillRect(displayCarPos - 25, canvas.height - 90, 50, 30)
      ctx.fillStyle = "#1F2937"
      // Wheels
      ctx.beginPath()
      ctx.arc(displayCarPos - 15, canvas.height - 55, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(displayCarPos + 15, canvas.height - 55, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Car velocity vector
      const carVelInFrame =
        observerFrame === "car" ? 0 : observerFrame === "train" ? carVelocity[0] - trainVelocity[0] : carVelocity[0]

      if (Math.abs(carVelInFrame) > 0.5) {
        const vectorScale = 3
        const vectorLength = Math.abs(carVelInFrame) * vectorScale
        const direction = carVelInFrame > 0 ? 1 : -1

        ctx.strokeStyle = "#10B981"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(displayCarPos, canvas.height - 100)
        ctx.lineTo(displayCarPos + vectorLength * direction, canvas.height - 100)
        ctx.stroke()

        // Arrow
        ctx.fillStyle = "#10B981"
        ctx.beginPath()
        if (direction > 0) {
          ctx.moveTo(displayCarPos + vectorLength, canvas.height - 100)
          ctx.lineTo(displayCarPos + vectorLength - 10, canvas.height - 105)
          ctx.lineTo(displayCarPos + vectorLength - 10, canvas.height - 95)
        } else {
          ctx.moveTo(displayCarPos - vectorLength, canvas.height - 100)
          ctx.lineTo(displayCarPos - vectorLength + 10, canvas.height - 105)
          ctx.lineTo(displayCarPos - vectorLength + 10, canvas.height - 95)
        }
        ctx.closePath()
        ctx.fill()
      }
    }

    // Draw train
    if (displayTrainPos > -150 && displayTrainPos < canvas.width + 150) {
      ctx.fillStyle = "#3B82F6"
      ctx.fillRect(displayTrainPos - 40, canvas.height - 150, 80, 40)
      ctx.fillStyle = "#1E40AF"
      ctx.fillRect(displayTrainPos - 35, canvas.height - 145, 70, 30)

      // Train wheels
      ctx.fillStyle = "#1F2937"
      for (let i = -25; i <= 25; i += 25) {
        ctx.beginPath()
        ctx.arc(displayTrainPos + i, canvas.height - 105, 10, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Train velocity vector
      const trainVelInFrame =
        observerFrame === "train" ? 0 : observerFrame === "car" ? trainVelocity[0] - carVelocity[0] : trainVelocity[0]

      if (Math.abs(trainVelInFrame) > 0.5) {
        const vectorScale = 3
        const vectorLength = Math.abs(trainVelInFrame) * vectorScale
        const direction = trainVelInFrame > 0 ? 1 : -1

        ctx.strokeStyle = "#F59E0B"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(displayTrainPos, canvas.height - 160)
        ctx.lineTo(displayTrainPos + vectorLength * direction, canvas.height - 160)
        ctx.stroke()

        // Arrow
        ctx.fillStyle = "#F59E0B"
        ctx.beginPath()
        if (direction > 0) {
          ctx.moveTo(displayTrainPos + vectorLength, canvas.height - 160)
          ctx.lineTo(displayTrainPos + vectorLength - 10, canvas.height - 165)
          ctx.lineTo(displayTrainPos + vectorLength - 10, canvas.height - 155)
        } else {
          ctx.moveTo(displayTrainPos - vectorLength, canvas.height - 160)
          ctx.lineTo(displayTrainPos - vectorLength + 10, canvas.height - 165)
          ctx.lineTo(displayTrainPos - vectorLength + 10, canvas.height - 155)
        }
        ctx.closePath()
        ctx.fill()
      }
    }

    // Labels and info
    ctx.fillStyle = "#374151"
    ctx.font = "14px sans-serif"
    ctx.fillText(`Observer Frame: ${observerFrame.charAt(0).toUpperCase() + observerFrame.slice(1)}`, 20, 30)

    ctx.font = "12px sans-serif"
    if (observerFrame === "ground") {
      ctx.fillStyle = "#10B981"
      ctx.fillText(`Car: ${carVelocity[0]} m/s`, 20, 50)
      ctx.fillStyle = "#F59E0B"
      ctx.fillText(`Train: ${trainVelocity[0]} m/s`, 20, 70)
    } else if (observerFrame === "car") {
      ctx.fillStyle = "#10B981"
      ctx.fillText(`Car: 0 m/s (stationary)`, 20, 50)
      ctx.fillStyle = "#F59E0B"
      ctx.fillText(`Train: ${(trainVelocity[0] - carVelocity[0]).toFixed(1)} m/s`, 20, 70)
    } else {
      ctx.fillStyle = "#10B981"
      ctx.fillText(`Car: ${(carVelocity[0] - trainVelocity[0]).toFixed(1)} m/s`, 20, 50)
      ctx.fillStyle = "#F59E0B"
      ctx.fillText(`Train: 0 m/s (stationary)`, 20, 70)
    }
  }, [carPosition, trainPosition, carVelocity, trainVelocity, observerFrame])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => prevTime + 0.02)

        setCarPosition((prev) => prev + carVelocity[0] * 0.02 * 10) // scale for display
        setTrainPosition((prev) => prev + trainVelocity[0] * 0.02 * 10)

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
  }, [isPlaying, carVelocity, trainVelocity])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setCarPosition(100)
    setTrainPosition(50)
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
              <h1 className="text-xl font-bold text-gray-900">Relative Motion</h1>
              <p className="text-sm text-gray-600">Understand motion from different reference frames</p>
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
                    <CardTitle>Relative Motion Simulation</CardTitle>
                    <CardDescription>Observe how motion appears from different reference frames</CardDescription>
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
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reference Frame</CardTitle>
                <CardDescription>Choose your observer's perspective</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={observerFrame} onValueChange={setObserverFrame}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground (Stationary)</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Velocities</CardTitle>
                <CardDescription>Adjust object speeds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Car Velocity: {carVelocity[0]} m/s</label>
                  <Slider
                    value={carVelocity}
                    onValueChange={setCarVelocity}
                    max={40}
                    min={-40}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Train Velocity: {trainVelocity[0]} m/s</label>
                  <Slider
                    value={trainVelocity}
                    onValueChange={setTrainVelocity}
                    max={40}
                    min={-40}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relative Velocities</CardTitle>
                <CardDescription>Calculated relative speeds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Car relative to Train:</span>
                  <span className="text-sm font-medium">{(carVelocity[0] - trainVelocity[0]).toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Train relative to Car:</span>
                  <span className="text-sm font-medium">{(trainVelocity[0] - carVelocity[0]).toFixed(1)} m/s</span>
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
                    <strong>Relative Velocity:</strong> v₁₂ = v₁ - v₂
                  </div>
                  <div>
                    <strong>Reference Frame:</strong> The coordinate system from which motion is observed
                  </div>
                  <div>
                    <strong>Key Insight:</strong> Motion is relative - there's no absolute reference frame
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
