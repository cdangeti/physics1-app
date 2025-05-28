"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Pause, Play, RefreshCw } from "lucide-react"

// Physics constants
const GRAVITY = 9.8 // m/s²

// Types for our simulation
interface SimulationParams {
  angle: number // degrees
  mass: number // kg
  frictionCoefficient: number
  showForces: boolean
  showVectors: boolean
  showValues: boolean
}

interface PhysicsValues {
  gravityForce: number // N
  normalForce: number // N
  frictionForce: number // N
  netForce: number // N
  acceleration: number // m/s²
  velocity: number // m/s
  distance: number // m
  time: number // s
}

export default function InclinedPlaneSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Simulation parameters
  const [params, setParams] = useState<SimulationParams>({
    angle: 30,
    mass: 1,
    frictionCoefficient: 0.2,
    showForces: true,
    showVectors: true,
    showValues: true,
  })

  // Physics values
  const [physics, setPhysics] = useState<PhysicsValues>({
    gravityForce: 0,
    normalForce: 0,
    frictionForce: 0,
    netForce: 0,
    acceleration: 0,
    velocity: 0,
    distance: 0,
    time: 0,
  })

  // Simulation state
  const [isRunning, setIsRunning] = useState(false)
  const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0 })
  const lastTimeRef = useRef<number | null>(null)

  // Calculate physics values based on parameters
  const calculatePhysics = (params: SimulationParams): PhysicsValues => {
    const angleInRadians = (params.angle * Math.PI) / 180

    // Forces
    const gravityForce = params.mass * GRAVITY
    const gravityParallel = params.mass * GRAVITY * Math.sin(angleInRadians)
    const gravityPerpendicular = params.mass * GRAVITY * Math.cos(angleInRadians)

    const normalForce = gravityPerpendicular
    const frictionForce = params.frictionCoefficient * normalForce

    // Net force parallel to the incline
    const netForce = gravityParallel - frictionForce

    // Acceleration
    const acceleration = netForce / params.mass

    return {
      gravityForce,
      normalForce,
      frictionForce,
      netForce,
      acceleration,
      velocity: physics.velocity,
      distance: physics.distance,
      time: physics.time,
    }
  }

  // Update physics when parameters change
  useEffect(() => {
    const newPhysics = calculatePhysics(params)
    setPhysics(newPhysics)

    // Reset simulation if parameters change
    if (isRunning) {
      resetSimulation()
      setIsRunning(true)
    } else {
      resetSimulation()
    }
  }, [params.angle, params.mass, params.frictionCoefficient])

  // Animation loop
  const animate = (timestamp: number) => {
    if (!isRunning) return

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000 // Convert to seconds
    lastTimeRef.current = timestamp

    // Update physics
    setPhysics((prev) => {
      const newVelocity = prev.velocity + prev.acceleration * deltaTime
      const newDistance = prev.distance + newVelocity * deltaTime
      const newTime = prev.time + deltaTime

      return {
        ...prev,
        velocity: newVelocity,
        distance: newDistance,
        time: newTime,
      }
    })

    // Draw the simulation
    drawSimulation()

    // Continue animation
    animationRef.current = requestAnimationFrame(animate)
  }

  // Start/stop simulation
  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning])

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    cancelAnimationFrame(animationRef.current)
    lastTimeRef.current = null

    setPhysics((prev) => ({
      ...prev,
      velocity: 0,
      distance: 0,
      time: 0,
    }))

    setObjectPosition({ x: 0, y: 0 })
    drawSimulation()
  }

  // Draw the simulation on canvas
  const drawSimulation = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Inclined plane parameters
    const planeLength = width * 0.7
    const angleInRadians = (params.angle * Math.PI) / 180

    // Calculate plane coordinates
    const planeStartX = centerX - (planeLength / 2) * Math.cos(angleInRadians)
    const planeStartY = centerY + (planeLength / 2) * Math.sin(angleInRadians)
    const planeEndX = centerX + (planeLength / 2) * Math.cos(angleInRadians)
    const planeEndY = centerY - (planeLength / 2) * Math.sin(angleInRadians)

    // Draw ground (horizontal line)
    ctx.beginPath()
    ctx.moveTo(planeStartX, planeStartY)
    ctx.lineTo(planeStartX + planeLength * Math.cos(angleInRadians), planeStartY)
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw inclined plane
    ctx.beginPath()
    ctx.moveTo(planeStartX, planeStartY)
    ctx.lineTo(planeEndX, planeEndY)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 3
    ctx.stroke()

    // Calculate object position on the plane
    const maxDistance = planeLength
    const normalizedDistance = Math.min(physics.distance / 10, 1) // Normalize to 0-1 range
    const objectX = planeStartX + normalizedDistance * (planeEndX - planeStartX)
    const objectY = planeStartY + normalizedDistance * (planeEndY - planeStartY)

    setObjectPosition({ x: objectX, y: objectY })

    // Draw object (circle)
    const objectRadius = 15 + params.mass * 5 // Size based on mass
    ctx.beginPath()
    ctx.arc(objectX, objectY, objectRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()
    ctx.strokeStyle = "#1d4ed8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw angle arc
    ctx.beginPath()
    ctx.arc(planeStartX, planeStartY, 40, -Math.PI / 2, -Math.PI / 2 + angleInRadians, false)
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw angle text
    ctx.fillStyle = "#f59e0b"
    ctx.font = "16px Arial"
    ctx.fillText(`${params.angle}°`, planeStartX + 20, planeStartY - 20)

    // Draw forces if enabled
    if (params.showForces && params.showVectors) {
      const vectorScale = 5 // Scale factor for vector visualization

      // Gravity force
      drawVector(ctx, objectX, objectY, 0, vectorScale * physics.gravityForce, "#dc2626", "Fg")

      // Normal force
      const normalAngle = angleInRadians + Math.PI / 2 // Perpendicular to plane
      drawVector(ctx, objectX, objectY, normalAngle, vectorScale * physics.normalForce, "#16a34a", "Fn")

      // Friction force
      const frictionAngle = angleInRadians + Math.PI // Opposite to motion direction
      drawVector(ctx, objectX, objectY, frictionAngle, vectorScale * physics.frictionForce, "#9333ea", "Ff")

      // Net force
      const netForceAngle = angleInRadians // Parallel to plane
      drawVector(ctx, objectX, objectY, netForceAngle, vectorScale * Math.abs(physics.netForce), "#0891b2", "Fnet")
    }

    // Draw values if enabled
    if (params.showValues) {
      ctx.fillStyle = "#000"
      ctx.font = "14px Arial"
      ctx.textAlign = "left"

      const textX = 20
      let textY = 30
      const lineHeight = 20

      ctx.fillText(`Time: ${physics.time.toFixed(2)} s`, textX, textY)
      textY += lineHeight
      ctx.fillText(`Distance: ${physics.distance.toFixed(2)} m`, textX, textY)
      textY += lineHeight
      ctx.fillText(`Velocity: ${physics.velocity.toFixed(2)} m/s`, textX, textY)
      textY += lineHeight
      ctx.fillText(`Acceleration: ${physics.acceleration.toFixed(2)} m/s²`, textX, textY)
    }
  }

  // Helper function to draw vectors
  const drawVector = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    magnitude: number,
    color: string,
    label: string,
  ) => {
    const arrowLength = magnitude
    const arrowWidth = 8

    // Don't draw if magnitude is too small
    if (Math.abs(arrowLength) < 5) return

    // Calculate end point
    const endX = x + arrowLength * Math.cos(angle)
    const endY = y + arrowLength * Math.sin(angle)

    // Draw line
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrowhead
    const arrowAngle1 = angle + Math.PI - Math.PI / 6
    const arrowAngle2 = angle + Math.PI + Math.PI / 6

    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(endX + arrowWidth * Math.cos(arrowAngle1), endY + arrowWidth * Math.sin(arrowAngle1))
    ctx.lineTo(endX + arrowWidth * Math.cos(arrowAngle2), endY + arrowWidth * Math.sin(arrowAngle2))
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()

    // Draw label
    ctx.fillStyle = color
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(label, endX + 15 * Math.cos(angle), endY + 15 * Math.sin(angle))
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Initial draw
    drawSimulation()

    // Handle window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawSimulation()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-slate-50 w-full" style={{ height: "500px" }}>
              <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: "none" }} />

              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsRunning(!isRunning)}>
                  {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" size="sm" onClick={resetSimulation}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>

              <div className="absolute top-4 right-4 bg-white/80 p-3 rounded-lg shadow-sm">
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span>Acceleration:</span>
                    <span className="font-medium">{physics.acceleration.toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Velocity:</span>
                    <span className="font-medium">{physics.velocity.toFixed(2)} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{physics.distance.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{physics.time.toFixed(2)} s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Tabs defaultValue="parameters">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="forces">Forces</TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="angle">Angle (degrees)</Label>
                  <span className="text-sm font-medium">{params.angle}°</span>
                </div>
                <Slider
                  id="angle"
                  min={0}
                  max={90}
                  step={1}
                  value={[params.angle]}
                  onValueChange={(value) => setParams({ ...params, angle: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="mass">Mass (kg)</Label>
                  <span className="text-sm font-medium">{params.mass} kg</span>
                </div>
                <Slider
                  id="mass"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[params.mass]}
                  onValueChange={(value) => setParams({ ...params, mass: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="friction">Friction Coefficient (μ)</Label>
                  <span className="text-sm font-medium">{params.frictionCoefficient}</span>
                </div>
                <Slider
                  id="friction"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[params.frictionCoefficient]}
                  onValueChange={(value) => setParams({ ...params, frictionCoefficient: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showVectors">Show Force Vectors</Label>
                  <Switch
                    id="showVectors"
                    checked={params.showVectors}
                    onCheckedChange={(checked) => setParams({ ...params, showVectors: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forces" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                        <Label>Gravity Force</Label>
                      </div>
                      <p className="text-sm font-medium">{(params.mass * GRAVITY).toFixed(2)} N</p>
                      <p className="text-xs text-muted-foreground">
                        F<sub>g</sub> = mg
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                        <Label>Normal Force</Label>
                      </div>
                      <p className="text-sm font-medium">{physics.normalForce.toFixed(2)} N</p>
                      <p className="text-xs text-muted-foreground">
                        F<sub>n</sub> = mg·cos(θ)
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                        <Label>Friction Force</Label>
                      </div>
                      <p className="text-sm font-medium">{physics.frictionForce.toFixed(2)} N</p>
                      <p className="text-xs text-muted-foreground">
                        F<sub>f</sub> = μF<sub>n</sub>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-cyan-600 mr-2"></div>
                        <Label>Net Force</Label>
                      </div>
                      <p className="text-sm font-medium">{physics.netForce.toFixed(2)} N</p>
                      <p className="text-xs text-muted-foreground">
                        F<sub>net</sub> = mg·sin(θ) - F<sub>f</sub>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Key Equations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>
                          a = F<sub>net</sub> / m = g·sin(θ) - μg·cos(θ)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>
                          v = v<sub>0</sub> + at
                        </span>
                      </div>
                      <div className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>
                          x = x<sub>0</sub> + v<sub>0</sub>t + ½at²
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

