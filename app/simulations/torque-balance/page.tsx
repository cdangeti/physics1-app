"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

export default function TorqueBalanceSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [force1, setForce1] = useState([20])
  const [force2, setForce2] = useState([15])
  const [distance1, setDistance1] = useState([3])
  const [distance2, setDistance2] = useState([4])
  const [leverLength, setLeverLength] = useState([8])
  const [showInfo, setShowInfo] = useState(false)

  const calculateTorque1 = () => force1[0] * distance1[0]
  const calculateTorque2 = () => force2[0] * distance2[0]
  const getNetTorque = () => calculateTorque1() - calculateTorque2()
  const isBalanced = () => Math.abs(getNetTorque()) < 0.5

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 30 // pixels per meter

    // Calculate lever rotation based on net torque
    const maxRotation = 0.3 // max 0.3 radians
    const rotation = isBalanced() ? 0 : Math.sign(getNetTorque()) * Math.min(Math.abs(getNetTorque()) / 50, maxRotation)

    // Draw fulcrum
    ctx.fillStyle = "#8B5CF6"
    ctx.beginPath()
    ctx.moveTo(centerX - 20, centerY + 20)
    ctx.lineTo(centerX + 20, centerY + 20)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fill()

    // Draw lever bar
    const leverHalfLength = (leverLength[0] / 2) * scale
    const leftX = centerX - leverHalfLength * Math.cos(rotation)
    const leftY = centerY - leverHalfLength * Math.sin(rotation)
    const rightX = centerX + leverHalfLength * Math.cos(rotation)
    const rightY = centerY + leverHalfLength * Math.sin(rotation)

    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(leftX, leftY)
    ctx.lineTo(rightX, rightY)
    ctx.stroke()

    // Draw force 1 (left side)
    const force1X = centerX - distance1[0] * scale * Math.cos(rotation)
    const force1Y = centerY - distance1[0] * scale * Math.sin(rotation)

    // Force 1 arrow (downward)
    const force1Length = force1[0] * 3
    ctx.strokeStyle = "#EF4444"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(force1X, force1Y)
    ctx.lineTo(force1X, force1Y + force1Length)
    ctx.stroke()

    // Force 1 arrowhead
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.moveTo(force1X, force1Y + force1Length)
    ctx.lineTo(force1X - 8, force1Y + force1Length - 15)
    ctx.lineTo(force1X + 8, force1Y + force1Length - 15)
    ctx.closePath()
    ctx.fill()

    // Draw force 2 (right side)
    const force2X = centerX + distance2[0] * scale * Math.cos(rotation)
    const force2Y = centerY + distance2[0] * scale * Math.sin(rotation)

    // Force 2 arrow (downward)
    const force2Length = force2[0] * 3
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(force2X, force2Y)
    ctx.lineTo(force2X, force2Y + force2Length)
    ctx.stroke()

    // Force 2 arrowhead
    ctx.fillStyle = "#3B82F6"
    ctx.beginPath()
    ctx.moveTo(force2X, force2Y + force2Length)
    ctx.lineTo(force2X - 8, force2Y + force2Length - 15)
    ctx.lineTo(force2X + 8, force2Y + force2Length - 15)
    ctx.closePath()
    ctx.fill()

    // Draw distance markers
    ctx.strokeStyle = "#6B7280"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    // Distance 1 marker
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 30)
    ctx.lineTo(force1X, force1Y - 30)
    ctx.stroke()

    // Distance 2 marker
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 30)
    ctx.lineTo(force2X, force2Y - 30)
    ctx.stroke()

    ctx.setLineDash([])

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "14px sans-serif"
    ctx.fillText(`F₁ = ${force1[0]} N`, force1X - 30, force1Y + force1Length + 25)
    ctx.fillText(`F₂ = ${force2[0]} N`, force2X - 30, force2Y + force2Length + 25)
    ctx.fillText(`d₁ = ${distance1[0]} m`, force1X - 30, force1Y - 40)
    ctx.fillText(`d₂ = ${distance2[0]} m`, force2X - 30, force2Y - 40)

    // Balance status
    ctx.font = "16px sans-serif"
    ctx.fillStyle = isBalanced() ? "#10B981" : "#EF4444"
    ctx.fillText(isBalanced() ? "BALANCED" : "NOT BALANCED", centerX - 50, 50)

    // Torque values
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#EF4444"
    ctx.fillText(`τ₁ = ${calculateTorque1().toFixed(1)} N⋅m`, 20, canvas.height - 60)
    ctx.fillStyle = "#3B82F6"
    ctx.fillText(`τ₂ = ${calculateTorque2().toFixed(1)} N⋅m`, 20, canvas.height - 40)
    ctx.fillStyle = "#374151"
    ctx.fillText(`Net τ = ${getNetTorque().toFixed(1)} N⋅m`, 20, canvas.height - 20)
  }, [force1, force2, distance1, distance2, leverLength])

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
              <h1 className="text-xl font-bold text-gray-900">Torque Balance Simulator</h1>
              <p className="text-sm text-gray-600">Explore rotational equilibrium and torque</p>
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
                    <CardTitle>Lever Balance Simulation</CardTitle>
                    <CardDescription>Adjust forces and distances to achieve equilibrium</CardDescription>
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
                    <div className="text-sm font-medium text-red-600">Left Torque</div>
                    <div className="text-xl font-bold text-red-700">{calculateTorque1().toFixed(1)} N⋅m</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Right Torque</div>
                    <div className="text-xl font-bold text-blue-700">{calculateTorque2().toFixed(1)} N⋅m</div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge variant={isBalanced() ? "default" : "destructive"} className="text-lg px-4 py-2">
                    {isBalanced() ? "✓ Balanced" : "⚠ Not Balanced"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Left Side (Red)</CardTitle>
                <CardDescription>Adjust force and distance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Force 1: {force1[0]} N</label>
                  <Slider value={force1} onValueChange={setForce1} max={50} min={5} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Distance 1: {distance1[0]} m</label>
                  <Slider
                    value={distance1}
                    onValueChange={setDistance1}
                    max={6}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Right Side (Blue)</CardTitle>
                <CardDescription>Adjust force and distance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Force 2: {force2[0]} N</label>
                  <Slider value={force2} onValueChange={setForce2} max={50} min={5} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Distance 2: {distance2[0]} m</label>
                  <Slider
                    value={distance2}
                    onValueChange={setDistance2}
                    max={6}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculations</CardTitle>
                <CardDescription>Torque analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Torque:</span>
                  <span className="text-sm font-medium">{getNetTorque().toFixed(1)} N⋅m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Torque Ratio:</span>
                  <span className="text-sm font-medium">{(calculateTorque1() / calculateTorque2()).toFixed(2)}</span>
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
                    <strong>Torque:</strong> τ = F × d
                  </div>
                  <div>
                    <strong>Equilibrium:</strong> Στ = 0
                  </div>
                  <div>
                    <strong>Balance Condition:</strong> τ₁ = τ₂
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    For rotational equilibrium, the sum of clockwise torques must equal the sum of counterclockwise
                    torques.
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
