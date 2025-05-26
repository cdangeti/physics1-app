"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

const materials = {
  wood: { density: 600, color: "#8B4513", name: "Wood" },
  ice: { density: 917, color: "#E0F2FE", name: "Ice" },
  aluminum: { density: 2700, color: "#C0C0C0", name: "Aluminum" },
  iron: { density: 7870, color: "#696969", name: "Iron" },
  cork: { density: 240, color: "#DEB887", name: "Cork" },
  plastic: { density: 950, color: "#FF6B6B", name: "Plastic" },
}

export default function BuoyancySimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [material, setMaterial] = useState("wood")
  const [objectVolume, setObjectVolume] = useState([0.001]) // m³
  const [fluidDensity, setFluidDensity] = useState([1000]) // water density
  const [showInfo, setShowInfo] = useState(false)

  const g = 9.81

  const getMaterial = () => materials[material as keyof typeof materials]
  const getObjectMass = () => getMaterial().density * objectVolume[0]
  const getWeight = () => getObjectMass() * g
  const getBuoyantForce = () => fluidDensity[0] * g * getSubmergedVolume()
  const getNetForce = () => getBuoyantForce() - getWeight()

  const getSubmergedVolume = () => {
    const objectDensity = getMaterial().density
    if (objectDensity <= fluidDensity[0]) {
      // Floating: partially submerged
      return objectVolume[0] * (objectDensity / fluidDensity[0])
    } else {
      // Sinking: fully submerged
      return objectVolume[0]
    }
  }

  const isFloating = () => getMaterial().density < fluidDensity[0]
  const getSubmergedFraction = () => getSubmergedVolume() / objectVolume[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw container
    const containerWidth = 400
    const containerHeight = 300
    const containerX = (canvas.width - containerWidth) / 2
    const containerY = canvas.height - containerHeight - 50

    // Draw water
    ctx.fillStyle = "#3B82F6"
    ctx.globalAlpha = 0.6
    ctx.fillRect(containerX, containerY, containerWidth, containerHeight)
    ctx.globalAlpha = 1.0

    // Draw container walls
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 4
    ctx.strokeRect(containerX, containerY, containerWidth, containerHeight)

    // Calculate object dimensions (cube for simplicity)
    const objectSideLength = Math.cbrt(objectVolume[0]) * 1000 // scale for display
    const objectSize = Math.max(20, Math.min(80, objectSideLength))

    // Calculate object position
    const objectX = containerX + containerWidth / 2 - objectSize / 2
    let objectY

    if (isFloating()) {
      // Floating: object sits at water surface
      const submergedHeight = objectSize * getSubmergedFraction()
      objectY = containerY + containerHeight - submergedHeight
    } else {
      // Sinking: object sits at bottom
      objectY = containerY + containerHeight - objectSize
    }

    // Draw object
    const mat = getMaterial()
    ctx.fillStyle = mat.color
    ctx.fillRect(objectX, objectY, objectSize, objectSize)
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.strokeRect(objectX, objectY, objectSize, objectSize)

    // Draw water level line
    ctx.strokeStyle = "#1E40AF"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(containerX, containerY + containerHeight)
    ctx.lineTo(containerX + containerWidth, containerY + containerHeight)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw force vectors
    const centerX = objectX + objectSize / 2
    const centerY = objectY + objectSize / 2

    // Weight vector (downward)
    const weightScale = 0.1
    const weightLength = getWeight() * weightScale
    ctx.strokeStyle = "#EF4444"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX, centerY + weightLength)
    ctx.stroke()

    // Weight arrow
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.moveTo(centerX, centerY + weightLength)
    ctx.lineTo(centerX - 8, centerY + weightLength - 15)
    ctx.lineTo(centerX + 8, centerY + weightLength - 15)
    ctx.closePath()
    ctx.fill()

    // Buoyant force vector (upward)
    const buoyantLength = getBuoyantForce() * weightScale
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(centerX + 20, centerY)
    ctx.lineTo(centerX + 20, centerY - buoyantLength)
    ctx.stroke()

    // Buoyant force arrow
    ctx.fillStyle = "#10B981"
    ctx.beginPath()
    ctx.moveTo(centerX + 20, centerY - buoyantLength)
    ctx.lineTo(centerX + 12, centerY - buoyantLength + 15)
    ctx.lineTo(centerX + 28, centerY - buoyantLength + 15)
    ctx.closePath()
    ctx.fill()

    // Labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`Weight: ${getWeight().toFixed(2)} N`, centerX + 30, centerY + 20)
    ctx.fillText(`Buoyant Force: ${getBuoyantForce().toFixed(2)} N`, centerX + 30, centerY - 20)
    ctx.fillText(`Material: ${mat.name}`, 20, 30)
    ctx.fillText(`Density: ${mat.density} kg/m³`, 20, 50)
    ctx.fillText(`Status: ${isFloating() ? "Floating" : "Sinking"}`, 20, 70)

    // Fluid info
    ctx.fillText(`Fluid Density: ${fluidDensity[0]} kg/m³`, 20, canvas.height - 60)
    ctx.fillText(`Submerged Volume: ${(getSubmergedVolume() * 1000).toFixed(1)} L`, 20, canvas.height - 40)
    ctx.fillText(`Submerged Fraction: ${(getSubmergedFraction() * 100).toFixed(1)}%`, 20, canvas.height - 20)
  }, [material, objectVolume, fluidDensity])

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
              <h1 className="text-xl font-bold text-gray-900">Buoyancy Simulator</h1>
              <p className="text-sm text-gray-600">Explore floating and sinking objects</p>
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
                    <CardTitle>Buoyancy Simulation</CardTitle>
                    <CardDescription>Observe how different materials behave in fluids</CardDescription>
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
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm font-medium text-red-600">Weight</div>
                    <div className="text-lg font-bold text-red-700">{getWeight().toFixed(2)} N</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Buoyant Force</div>
                    <div className="text-lg font-bold text-green-700">{getBuoyantForce().toFixed(2)} N</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Net Force</div>
                    <div
                      className={`text-lg font-bold ${getNetForce() > 0 ? "text-green-700" : getNetForce() < 0 ? "text-red-700" : "text-gray-700"}`}
                    >
                      {getNetForce().toFixed(2)} N
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Object Properties</CardTitle>
                <CardDescription>Select material and size</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Material</label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(materials).map(([key, mat]) => (
                        <SelectItem key={key} value={key}>
                          {mat.name} ({mat.density} kg/m³)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Volume: {(objectVolume[0] * 1000).toFixed(1)} L
                  </label>
                  <Slider
                    value={objectVolume}
                    onValueChange={setObjectVolume}
                    max={0.008}
                    min={0.0001}
                    step={0.0001}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fluid Properties</CardTitle>
                <CardDescription>Adjust fluid density</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fluid Density: {fluidDensity[0]} kg/m³</label>
                  <Slider
                    value={fluidDensity}
                    onValueChange={setFluidDensity}
                    max={1500}
                    min={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    Water: 1000 kg/m³, Seawater: 1025 kg/m³, Mercury: 13534 kg/m³
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>Buoyancy calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Object Mass:</span>
                  <span className="text-sm font-medium">{getObjectMass().toFixed(3)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Displaced Volume:</span>
                  <span className="text-sm font-medium">{(getSubmergedVolume() * 1000).toFixed(1)} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant={isFloating() ? "default" : "destructive"}>
                    {isFloating() ? "Floating" : "Sinking"}
                  </Badge>
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
                    <strong>Archimedes' Principle:</strong> F_b = ρ_fluid × g × V_displaced
                  </div>
                  <div>
                    <strong>Floating Condition:</strong> ρ_object &lt; ρ_fluid
                  </div>
                  <div>
                    <strong>Equilibrium:</strong> F_buoyant = Weight
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    An object floats when its average density is less than the fluid density.
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
