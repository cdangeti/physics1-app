"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, Pause, RotateCcw, Info } from "lucide-react"
import Link from "next/link"

const objects = {
  sphere: { name: "Solid Sphere", I_factor: 2 / 5, color: "#EF4444" },
  cylinder: { name: "Solid Cylinder", I_factor: 1 / 2, color: "#3B82F6" },
  ring: { name: "Ring/Hoop", I_factor: 1, color: "#10B981" },
  disk: { name: "Solid Disk", I_factor: 1 / 2, color: "#F59E0B" },
}

export default function RollingObjectsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [object1Type, setObject1Type] = useState("sphere")
  const [object2Type, setObject2Type] = useState("ring")
  const [inclineAngle, setInclineAngle] = useState([30])
  const [inclineHeight, setInclineHeight] = useState([3])
  const [time, setTime] = useState(0)
  const [positions, setPositions] = useState({ obj1: 0, obj2: 0 })
  const [velocities, setVelocities] = useState({ obj1: 0, obj2: 0 })
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81

  const getObject = (type: string) => objects[type as keyof typeof objects]

  const calculateAcceleration = (I_factor: number) => {
    const theta = (inclineAngle[0] * Math.PI) / 180
    return (g * Math.sin(theta)) / (1 + I_factor)
  }

  const calculateFinalVelocity = (I_factor: number) => {
    const h = inclineHeight[0]
    return Math.sqrt((2 * g * h) / (1 + I_factor))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const inclineLength = 400
    const inclineStartX = 50
    const inclineStartY = 100
    const theta = (inclineAngle[0] * Math.PI) / 180

    // Draw incline
    ctx.strokeStyle = "#8B5CF6"
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(inclineStartX, inclineStartY)
    ctx.lineTo(inclineStartX + inclineLength * Math.cos(theta), inclineStartY + inclineLength * Math.sin(theta))
    ctx.stroke()

    // Draw ground
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(inclineStartX + inclineLength * Math.cos(theta), inclineStartY + inclineLength * Math.sin(theta))
    ctx.lineTo(canvas.width - 50, inclineStartY + inclineLength * Math.sin(theta))
    ctx.stroke()

    // Draw objects
    const obj1 = getObject(object1Type)
    const obj2 = getObject(object2Type)
    const objectRadius = 15

    // Object 1 position
    const obj1X = inclineStartX + positions.obj1 * Math.cos(theta)
    const obj1Y = inclineStartY + positions.obj1 * Math.sin(theta)

    // Object 2 position
    const obj2X = inclineStartX + positions.obj2 * Math.cos(theta)
    const obj2Y = inclineStartY + positions.obj2 * Math.sin(theta) + 40

    // Draw object 1
    ctx.fillStyle = obj1.color
    ctx.beginPath()
    ctx.arc(obj1X, obj1Y, objectRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw object 2
    ctx.fillStyle = obj2.color
    ctx.beginPath()
    ctx.arc(obj2X, obj2Y, objectRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw velocity vectors
    if (velocities.obj1 > 0.1) {
      const vectorScale = 20
      const v1Length = velocities.obj1 * vectorScale
      ctx.strokeStyle = obj1.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(obj1X + 20, obj1Y - 20)
      ctx.lineTo(obj1X + 20 + v1Length * Math.cos(theta), obj1Y - 20 + v1Length * Math.sin(theta))
      ctx.stroke()
    }

    if (velocities.obj2 > 0.1) {
      const vectorScale = 20
      const v2Length = velocities.obj2 * vectorScale
      ctx.strokeStyle = obj2.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(obj2X + 20, obj2Y - 20)
      ctx.lineTo(obj2X + 20 + v2Length * Math.cos(theta), obj2Y - 20 + v2Length * Math.sin(theta))
      ctx.stroke()
    }

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`${obj1.name}: ${velocities.obj1.toFixed(2)} m/s`, 20, 30)
    ctx.fillText(`${obj2.name}: ${velocities.obj2.toFixed(2)} m/s`, 20, 50)
    ctx.fillText(`Angle: ${inclineAngle[0]}°`, 20, 70)
    ctx.fillText(`Height: ${inclineHeight[0]} m`, 20, 90)

    // Finish line
    const finishX = inclineStartX + inclineLength * Math.cos(theta)
    const finishY = inclineStartY + inclineLength * Math.sin(theta)
    ctx.strokeStyle = "#EF4444"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(finishX, finishY - 30)
    ctx.lineTo(finishX, finishY + 50)
    ctx.stroke()
    ctx.setLineDash([])
  }, [positions, velocities, object1Type, object2Type, inclineAngle, inclineHeight])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02

          const obj1 = getObject(object1Type)
          const obj2 = getObject(object2Type)

          const a1 = calculateAcceleration(obj1.I_factor)
          const a2 = calculateAcceleration(obj2.I_factor)

          setVelocities((prev) => ({
            obj1: prev.obj1 + a1 * 0.02,
            obj2: prev.obj2 + a2 * 0.02,
          }))

          setPositions((prev) => ({
            obj1: prev.obj1 + velocities.obj1 * 0.02,
            obj2: prev.obj2 + velocities.obj2 * 0.02,
          }))

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
  }, [isPlaying, velocities, object1Type, object2Type])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setPositions({ obj1: 0, obj2: 0 })
    setVelocities({ obj1: 0, obj2: 0 })
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
              <h1 className="text-xl font-bold text-gray-900">Rolling Motion Simulator</h1>
              <p className="text-sm text-gray-600">Compare rolling vs sliding motion down inclines</p>
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
                    <CardTitle>Rolling Objects Race</CardTitle>
                    <CardDescription>See which object reaches the bottom first</CardDescription>
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
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm font-medium text-red-600">{getObject(object1Type).name}</div>
                    <div className="text-lg font-bold text-red-700">{velocities.obj1.toFixed(2)} m/s</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">{getObject(object2Type).name}</div>
                    <div className="text-lg font-bold text-green-700">{velocities.obj2.toFixed(2)} m/s</div>
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
                <CardTitle>Object Selection</CardTitle>
                <CardDescription>Choose objects to race</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Object 1 (Red)</label>
                  <Select value={object1Type} onValueChange={setObject1Type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(objects).map(([key, obj]) => (
                        <SelectItem key={key} value={key}>
                          {obj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Object 2 (Green)</label>
                  <Select value={object2Type} onValueChange={setObject2Type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(objects).map(([key, obj]) => (
                        <SelectItem key={key} value={key}>
                          {obj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incline Parameters</CardTitle>
                <CardDescription>Adjust the ramp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Angle: {inclineAngle[0]}°</label>
                  <Slider
                    value={inclineAngle}
                    onValueChange={setInclineAngle}
                    max={60}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Height: {inclineHeight[0]} m</label>
                  <Slider
                    value={inclineHeight}
                    onValueChange={setInclineHeight}
                    max={5}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theoretical Results</CardTitle>
                <CardDescription>Predicted final velocities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{getObject(object1Type).name}:</span>
                  <span className="text-sm font-medium">
                    {calculateFinalVelocity(getObject(object1Type).I_factor).toFixed(2)} m/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{getObject(object2Type).name}:</span>
                  <span className="text-sm font-medium">
                    {calculateFinalVelocity(getObject(object2Type).I_factor).toFixed(2)} m/s
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
                    <strong>Rolling Acceleration:</strong> a = g sin θ / (1 + I/mr²)
                  </div>
                  <div>
                    <strong>Energy Conservation:</strong> mgh = ½mv² + ½Iω²
                  </div>
                  <div>
                    <strong>Key Insight:</strong> Objects with smaller moment of inertia roll faster
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Solid spheres beat solid cylinders, which beat rings/hoops down an incline.
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
