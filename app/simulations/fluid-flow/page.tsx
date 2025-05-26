"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

export default function FluidFlowSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [area1, setArea1] = useState([0.01]) // m²
  const [area2, setArea2] = useState([0.005]) // m²
  const [height1, setHeight1] = useState([2]) // m
  const [height2, setHeight2] = useState([1]) // m
  const [flowRate, setFlowRate] = useState([0.001]) // m³/s
  const [showInfo, setShowInfo] = useState(false)

  const density = 1000 // kg/m³ (water)
  const g = 9.81

  const calculateVelocity1 = () => flowRate[0] / area1[0]
  const calculateVelocity2 = () => flowRate[0] / area2[0]
  const calculatePressure1 = () => {
    // Using Bernoulli's equation: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂
    const v1 = calculateVelocity1()
    const v2 = calculateVelocity2()
    const h1 = height1[0]
    const h2 = height2[0]

    // Assuming P₂ = atmospheric pressure (0 gauge pressure)
    return 0.5 * density * (v2 * v2 - v1 * v1) + density * g * (h2 - h1)
  }
  const calculatePressure2 = () => 0 // reference pressure

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scale = 100 // pixels per meter
    const baseY = canvas.height - 50

    // Draw pipe system
    const pipe1Width = Math.sqrt(area1[0]) * scale * 20
    const pipe2Width = Math.sqrt(area2[0]) * scale * 20
    const pipe1Height = height1[0] * scale
    const pipe2Height = height2[0] * scale

    // Pipe 1 (wider section)
    ctx.fillStyle = "#8B5CF6"
    ctx.fillRect(100, baseY - pipe1Height, pipe1Width, pipe1Height)
    ctx.strokeStyle = "#7C3AED"
    ctx.lineWidth = 3
    ctx.strokeRect(100, baseY - pipe1Height, pipe1Width, pipe1Height)

    // Transition section
    ctx.fillStyle = "#8B5CF6"
    ctx.beginPath()
    ctx.moveTo(100 + pipe1Width, baseY - pipe1Height)
    ctx.lineTo(300, baseY - pipe2Height)
    ctx.lineTo(300, baseY)
    ctx.lineTo(100 + pipe1Width, baseY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Pipe 2 (narrower section)
    ctx.fillStyle = "#8B5CF6"
    ctx.fillRect(300, baseY - pipe2Height, pipe2Width, pipe2Height)
    ctx.strokeStyle = "#7C3AED"
    ctx.lineWidth = 3
    ctx.strokeRect(300, baseY - pipe2Height, pipe2Width, pipe2Height)

    // Draw fluid flow (animated particles)
    const time = Date.now() * 0.001
    const v1 = calculateVelocity1()
    const v2 = calculateVelocity2()

    // Flow particles in pipe 1
    for (let i = 0; i < 5; i++) {
      const x = 120 + ((time * v1 * 50 + i * 30) % (pipe1Width - 20))
      const y = baseY - pipe1Height / 2
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Flow particles in pipe 2
    for (let i = 0; i < 8; i++) {
      const x = 320 + ((time * v2 * 50 + i * 20) % (pipe2Width - 20))
      const y = baseY - pipe2Height / 2
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Velocity vectors
    const vectorScale = 100

    // Vector 1
    const v1Length = v1 * vectorScale
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(150, baseY - pipe1Height - 30)
    ctx.lineTo(150 + v1Length, baseY - pipe1Height - 30)
    ctx.stroke()

    // Arrow 1
    ctx.fillStyle = "#10B981"
    ctx.beginPath()
    ctx.moveTo(150 + v1Length, baseY - pipe1Height - 30)
    ctx.lineTo(150 + v1Length - 10, baseY - pipe1Height - 35)
    ctx.lineTo(150 + v1Length - 10, baseY - pipe1Height - 25)
    ctx.closePath()
    ctx.fill()

    // Vector 2
    const v2Length = v2 * vectorScale
    ctx.strokeStyle = "#EF4444"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(350, baseY - pipe2Height - 30)
    ctx.lineTo(350 + v2Length, baseY - pipe2Height - 30)
    ctx.stroke()

    // Arrow 2
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.moveTo(350 + v2Length, baseY - pipe2Height - 30)
    ctx.lineTo(350 + v2Length - 10, baseY - pipe2Height - 35)
    ctx.lineTo(350 + v2Length - 10, baseY - pipe2Height - 25)
    ctx.closePath()
    ctx.fill()

    // Pressure indicators
    const p1 = calculatePressure1()
    const p2 = calculatePressure2()

    // Pressure gauge 1
    ctx.fillStyle = p1 > 0 ? "#F59E0B" : "#6B7280"
    ctx.fillRect(80, baseY - pipe1Height - 80, 20, Math.abs(p1) / 1000)
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.strokeRect(80, baseY - pipe1Height - 80, 20, 60)

    // Pressure gauge 2
    ctx.fillStyle = p2 > 0 ? "#F59E0B" : "#6B7280"
    ctx.fillRect(280, baseY - pipe2Height - 80, 20, Math.abs(p2) / 1000)
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.strokeRect(280, baseY - pipe2Height - 80, 20, 60)

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`A₁ = ${(area1[0] * 10000).toFixed(1)} cm²`, 20, 30)
    ctx.fillText(`A₂ = ${(area2[0] * 10000).toFixed(1)} cm²`, 20, 50)
    ctx.fillText(`v₁ = ${v1.toFixed(2)} m/s`, 120, baseY - pipe1Height - 50)
    ctx.fillText(`v₂ = ${v2.toFixed(2)} m/s`, 320, baseY - pipe2Height - 50)
    ctx.fillText(`P₁ = ${(p1 / 1000).toFixed(1)} kPa`, 60, baseY - pipe1Height - 90)
    ctx.fillText(`P₂ = ${(p2 / 1000).toFixed(1)} kPa`, 260, baseY - pipe2Height - 90)

    // Height markers
    ctx.strokeStyle = "#6B7280"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(50, baseY - pipe1Height)
    ctx.lineTo(120, baseY - pipe1Height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(50, baseY - pipe2Height)
    ctx.lineTo(320, baseY - pipe2Height)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillText(`h₁ = ${height1[0]} m`, 20, baseY - pipe1Height + 10)
    ctx.fillText(`h₂ = ${height2[0]} m`, 20, baseY - pipe2Height + 10)

    // Flow rate
    ctx.fillText(`Q = ${(flowRate[0] * 1000).toFixed(1)} L/s`, 20, 70)
  }, [area1, area2, height1, height2, flowRate])

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
              <h1 className="text-xl font-bold text-gray-900">Fluid Flow Simulator</h1>
              <p className="text-sm text-gray-600">Visualize fluid flow and Bernoulli's principle</p>
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
                    <CardTitle>Fluid Flow Simulation</CardTitle>
                    <CardDescription>Observe how velocity and pressure change in a pipe</CardDescription>
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

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Velocity 1</div>
                    <div className="text-lg font-bold text-green-700">{calculateVelocity1().toFixed(2)} m/s</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm font-medium text-red-600">Velocity 2</div>
                    <div className="text-lg font-bold text-red-700">{calculateVelocity2().toFixed(2)} m/s</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Pressure 1</div>
                    <div className="text-lg font-bold text-yellow-700">
                      {(calculatePressure1() / 1000).toFixed(1)} kPa
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Pressure 2</div>
                    <div className="text-lg font-bold text-blue-700">
                      {(calculatePressure2() / 1000).toFixed(1)} kPa
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipe Geometry</CardTitle>
                <CardDescription>Adjust pipe dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Area 1: {(area1[0] * 10000).toFixed(1)} cm²</label>
                  <Slider
                    value={area1}
                    onValueChange={setArea1}
                    max={0.02}
                    min={0.005}
                    step={0.001}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Area 2: {(area2[0] * 10000).toFixed(1)} cm²</label>
                  <Slider
                    value={area2}
                    onValueChange={setArea2}
                    max={0.015}
                    min={0.002}
                    step={0.001}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Height 1: {height1[0]} m</label>
                  <Slider value={height1} onValueChange={setHeight1} max={3} min={0.5} step={0.1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Height 2: {height2[0]} m</label>
                  <Slider value={height2} onValueChange={setHeight2} max={3} min={0.5} step={0.1} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Parameters</CardTitle>
                <CardDescription>Control the flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Flow Rate: {(flowRate[0] * 1000).toFixed(1)} L/s
                  </label>
                  <Slider
                    value={flowRate}
                    onValueChange={setFlowRate}
                    max={0.005}
                    min={0.0001}
                    step={0.0001}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>Flow relationships</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Velocity Ratio:</span>
                  <span className="text-sm font-medium">
                    {(calculateVelocity2() / calculateVelocity1()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Area Ratio:</span>
                  <span className="text-sm font-medium">{(area1[0] / area2[0]).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pressure Difference:</span>
                  <span className="text-sm font-medium">
                    {((calculatePressure1() - calculatePressure2()) / 1000).toFixed(1)} kPa
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
                    <strong>Continuity Equation:</strong> A₁v₁ = A₂v₂
                  </div>
                  <div>
                    <strong>Bernoulli's Equation:</strong> P + ½ρv² + ρgh = constant
                  </div>
                  <div>
                    <strong>Key Insight:</strong> Smaller area → higher velocity → lower pressure
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    This principle explains how airplane wings generate lift and how carburetors work.
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
