"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

const fluids = {
  water: { density: 1000, color: "#3B82F6", name: "Water" },
  seawater: { density: 1025, color: "#1E40AF", name: "Seawater" },
  oil: { density: 800, color: "#F59E0B", name: "Oil" },
  mercury: { density: 13534, color: "#6B7280", name: "Mercury" },
  alcohol: { density: 789, color: "#10B981", name: "Alcohol" },
}

export default function PressureDepthSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [fluidType, setFluidType] = useState("water")
  const [containerHeight, setContainerHeight] = useState([5]) // meters
  const [probeDepth, setProbeDepth] = useState([2]) // meters
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81
  const atmosphericPressure = 101325 // Pa

  const getFluid = () => fluids[fluidType as keyof typeof fluids]
  const calculatePressure = (depth: number) => atmosphericPressure + getFluid().density * g * depth
  const calculateGaugePressure = (depth: number) => getFluid().density * g * depth

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const containerWidth = 300
    const containerX = (canvas.width - containerWidth) / 2
    const containerY = 50
    const scale = 60 // pixels per meter

    const fluidHeight = containerHeight[0] * scale
    const fluid = getFluid()

    // Draw container walls
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 4
    ctx.strokeRect(containerX, containerY, containerWidth, fluidHeight)

    // Draw fluid
    ctx.fillStyle = fluid.color
    ctx.globalAlpha = 0.7
    ctx.fillRect(containerX, containerY, containerWidth, fluidHeight)
    ctx.globalAlpha = 1.0

    // Draw pressure gradient visualization
    const gradientSteps = 20
    for (let i = 0; i < gradientSteps; i++) {
      const depth = (i / gradientSteps) * containerHeight[0]
      const pressure = calculateGaugePressure(depth)
      const maxPressure = calculateGaugePressure(containerHeight[0])
      const intensity = pressure / maxPressure

      ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.5})`
      ctx.fillRect(
        containerX + containerWidth + 20,
        containerY + (i / gradientSteps) * fluidHeight,
        30,
        fluidHeight / gradientSteps,
      )
    }

    // Draw pressure scale
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.strokeRect(containerX + containerWidth + 20, containerY, 30, fluidHeight)

    // Draw probe
    const probeY = containerY + (probeDepth[0] / containerHeight[0]) * fluidHeight

    // Probe line
    ctx.strokeStyle = "#EF4444"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(containerX, probeY)
    ctx.lineTo(containerX + containerWidth, probeY)
    ctx.stroke()
    ctx.setLineDash([])

    // Probe sensor
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.arc(containerX + containerWidth / 2, probeY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Depth markers
    ctx.strokeStyle = "#6B7280"
    ctx.lineWidth = 1
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#374151"

    for (let d = 0; d <= containerHeight[0]; d += 1) {
      const y = containerY + (d / containerHeight[0]) * fluidHeight
      ctx.beginPath()
      ctx.moveTo(containerX - 10, y)
      ctx.lineTo(containerX, y)
      ctx.stroke()
      ctx.fillText(`${d}m`, containerX - 30, y + 3)
    }

    // Pressure readings at different depths
    const readings = [0, 1, 2, 3, 4, 5].filter((d) => d <= containerHeight[0])
    readings.forEach((depth, index) => {
      const y = containerY + (depth / containerHeight[0]) * fluidHeight
      const pressure = calculatePressure(depth)
      const gaugePressure = calculateGaugePressure(depth)

      ctx.fillStyle = "#374151"
      ctx.font = "10px sans-serif"
      ctx.fillText(`${(pressure / 1000).toFixed(1)} kPa`, containerX + containerWidth + 60, y + 3)
      ctx.fillText(`(${(gaugePressure / 1000).toFixed(1)} gauge)`, containerX + containerWidth + 60, y + 15)
    })

    // Current probe reading
    const currentPressure = calculatePressure(probeDepth[0])
    const currentGauge = calculateGaugePressure(probeDepth[0])

    // Probe display
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(containerX + 50, containerY - 40, 200, 30)
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.strokeRect(containerX + 50, containerY - 40, 200, 30)

    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(
      `Depth: ${probeDepth[0]}m | Pressure: ${(currentPressure / 1000).toFixed(1)} kPa`,
      containerX + 60,
      containerY - 20,
    )

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "14px sans-serif"
    ctx.fillText(`Fluid: ${fluid.name}`, 20, 30)
    ctx.fillText(`Density: ${fluid.density} kg/m³`, 20, 50)
    ctx.fillText(`Container Height: ${containerHeight[0]} m`, 20, 70)

    // Pressure scale label
    ctx.save()
    ctx.translate(containerX + containerWidth + 35, containerY + fluidHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = "12px sans-serif"
    ctx.fillText("Pressure", -30, 0)
    ctx.restore()

    // Surface pressure indicator
    ctx.fillStyle = "#10B981"
    ctx.font = "10px sans-serif"
    ctx.fillText("Atmospheric Pressure", containerX, containerY - 10)
    ctx.fillText(`${(atmosphericPressure / 1000).toFixed(1)} kPa`, containerX, containerY - 25)
  }, [fluidType, containerHeight, probeDepth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/topics/fluids">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Fluids
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pressure vs Depth</h1>
              <p className="text-sm text-gray-600">Understand how pressure varies with depth</p>
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
                    <CardTitle>Pressure vs Depth Simulation</CardTitle>
                    <CardDescription>Move the probe to measure pressure at different depths</CardDescription>
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Absolute Pressure</div>
                    <div className="text-lg font-bold text-blue-700">
                      {(calculatePressure(probeDepth[0]) / 1000).toFixed(1)} kPa
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Gauge Pressure</div>
                    <div className="text-lg font-bold text-green-700">
                      {(calculateGaugePressure(probeDepth[0]) / 1000).toFixed(1)} kPa
                    </div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Depth</div>
                    <div className="text-lg font-bold text-yellow-700">{probeDepth[0]} m</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fluid Properties</CardTitle>
                <CardDescription>Select fluid type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fluid Type</label>
                  <Select value={fluidType} onValueChange={setFluidType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fluids).map(([key, fluid]) => (
                        <SelectItem key={key} value={key}>
                          {fluid.name} ({fluid.density} kg/m³)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Container Height: {containerHeight[0]} m</label>
                  <Slider
                    value={containerHeight}
                    onValueChange={setContainerHeight}
                    max={10}
                    min={2}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Probe Depth: {probeDepth[0]} m</label>
                  <Slider
                    value={probeDepth}
                    onValueChange={setProbeDepth}
                    max={containerHeight[0]}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pressure Analysis</CardTitle>
                <CardDescription>Pressure calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atmospheric Pressure:</span>
                  <span className="text-sm font-medium">{(atmosphericPressure / 1000).toFixed(1)} kPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hydrostatic Pressure:</span>
                  <span className="text-sm font-medium">
                    {(calculateGaugePressure(probeDepth[0]) / 1000).toFixed(1)} kPa
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Pressure:</span>
                  <span className="text-sm font-medium">
                    {(calculatePressure(probeDepth[0]) / 1000).toFixed(1)} kPa
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pressure per meter:</span>
                  <span className="text-sm font-medium">{((getFluid().density * g) / 1000).toFixed(2)} kPa/m</span>
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
                    <strong>Hydrostatic Pressure:</strong> P = ρgh
                  </div>
                  <div>
                    <strong>Total Pressure:</strong> P_total = P_atm + ρgh
                  </div>
                  <div>
                    <strong>Key Insight:</strong> Pressure increases linearly with depth
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    This is why deep-sea creatures need special adaptations and submarines need thick hulls.
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
