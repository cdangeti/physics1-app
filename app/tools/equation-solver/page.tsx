"use client"

import { useState } from "react"
import * as math from "mathjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calculator, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

const equations = {
  "Kinematics - 1": {
    equation: "v = v₀ + at",
    variables: ["v", "v0", "a", "t"],
    solutions: {
      v: "v0 + a*t",
      v0: "v - a*t",
      a: "(v - v0)/t",
      t: "(v - v0)/a",
    },
  },
  "Kinematics - 2": {
    equation: "x = x₀ + v₀t + ½at²",
    variables: ["x", "x0", "v0", "a", "t"],
    solutions: {
      x: "x0 + v0*t + 0.5*a*t^2",
      x0: "x - v0*t - 0.5*a*t^2",
      v0: "(x - x0 - 0.5*a*t^2)/t",
      a: "2*(x - x0 - v0*t)/t^2",
      t: "(-v0 + sqrt(v0^2 + 2*a*(x-x0)))/a",
    },
  },
  "Kinematics - 3": {
    equation: "v² = v₀² + 2a(x - x₀)",
    variables: ["v", "v0", "a", "x", "x0"],
    solutions: {
      v: "sqrt(v0^2 + 2*a*(x - x0))",
      v0: "sqrt(v^2 - 2*a*(x - x0))",
      a: "(v^2 - v0^2)/(2*(x - x0))",
      x: "x0 + (v^2 - v0^2)/(2*a)",
      x0: "x - (v^2 - v0^2)/(2*a)",
    },
  },
  "Center of Mass": {
    equation: "x_cm = (m₁x₁ + m₂x₂)/(m₁ + m₂)",
    variables: ["x_cm", "m1", "x1", "m2", "x2"],
    solutions: {
      x_cm: "(m1*x1 + m2*x2)/(m1 + m2)",
      m1: "m2*(x_cm - x2)/(x1 - x_cm)",
      x1: "(x_cm*(m1 + m2) - m2*x2)/m1",
      m2: "m1*(x_cm - x1)/(x2 - x_cm)",
      x2: "(x_cm*(m1 + m2) - m1*x1)/m2",
    },
  },
  "Newton's Second Law": {
    equation: "F_net = ma",
    variables: ["F_net", "m", "a"],
    solutions: {
      F_net: "m*a",
      m: "F_net/a",
      a: "F_net/m",
    },
  },
  "Gravitational Force": {
    equation: "F_g = G(m₁m₂)/r²",
    variables: ["F_g", "G", "m1", "m2", "r"],
    solutions: {
      F_g: "G*(m1*m2)/r^2",
      G: "F_g*r^2/(m1*m2)",
      m1: "F_g*r^2/(G*m2)",
      m2: "F_g*r^2/(G*m1)",
      r: "sqrt(G*m1*m2/F_g)",
    },
  },
  "Friction Force": {
    equation: "F_f = μF_n",
    variables: ["F_f", "mu", "F_n"],
    solutions: {
      F_f: "mu*F_n",
      mu: "F_f/F_n",
      F_n: "F_f/mu",
    },
  },
  "Spring Force": {
    equation: "F_s = -kΔx",
    variables: ["F_s", "k", "dx"],
    solutions: {
      F_s: "-k*dx",
      k: "-F_s/dx",
      dx: "-F_s/k",
    },
  },
  "Circular Motion": {
    equation: "a_c = v²/r",
    variables: ["a_c", "v", "r"],
    solutions: {
      a_c: "v^2/r",
      v: "sqrt(a_c*r)",
      r: "v^2/a_c",
    },
  },
  "Kinetic Energy": {
    equation: "K = ½mv²",
    variables: ["K", "m", "v"],
    solutions: {
      K: "0.5*m*v^2",
      m: "2*K/v^2",
      v: "sqrt(2*K/m)",
    },
  },
  Work: {
    equation: "W = Fd cos θ",
    variables: ["W", "F", "d", "theta"],
    solutions: {
      W: "F*d*cos(theta)",
      F: "W/(d*cos(theta))",
      d: "W/(F*cos(theta))",
      theta: "acos(W/(F*d))",
    },
  },
  "Potential Energy - Spring": {
    equation: "U_s = ½k(Δx)²",
    variables: ["U_s", "k", "dx"],
    solutions: {
      U_s: "0.5*k*dx^2",
      k: "2*U_s/dx^2",
      dx: "sqrt(2*U_s/k)",
    },
  },
  "Potential Energy - Gravity": {
    equation: "U_g = mgΔy",
    variables: ["U_g", "m", "g", "dy"],
    solutions: {
      U_g: "m*g*dy",
      m: "U_g/(g*dy)",
      g: "U_g/(m*dy)",
      dy: "U_g/(m*g)",
    },
  },
  "Power - Average": {
    equation: "P_avg = ΔE/Δt",
    variables: ["P_avg", "dE", "dt"],
    solutions: {
      P_avg: "dE/dt",
      dE: "P_avg*dt",
      dt: "dE/P_avg",
    },
  },
  "Power - Instantaneous": {
    equation: "P_inst = Fv cos θ",
    variables: ["P_inst", "F", "v", "theta"],
    solutions: {
      P_inst: "F*v*cos(theta)",
      F: "P_inst/(v*cos(theta))",
      v: "P_inst/(F*cos(theta))",
      theta: "acos(P_inst/(F*v))",
    },
  },
  Momentum: {
    equation: "p = mv",
    variables: ["p", "m", "v"],
    solutions: {
      p: "m*v",
      m: "p/v",
      v: "p/m",
    },
  },
  Impulse: {
    equation: "J = F_avg Δt",
    variables: ["J", "F_avg", "dt"],
    solutions: {
      J: "F_avg*dt",
      F_avg: "J/dt",
      dt: "J/F_avg",
    },
  },
  "Angular Velocity": {
    equation: "ω = ω₀ + αt",
    variables: ["omega", "omega0", "alpha", "t"],
    solutions: {
      omega: "omega0 + alpha*t",
      omega0: "omega - alpha*t",
      alpha: "(omega - omega0)/t",
      t: "(omega - omega0)/alpha",
    },
  },
  "Angular Displacement": {
    equation: "θ = θ₀ + ω₀t + ½αt²",
    variables: ["theta", "theta0", "omega0", "alpha", "t"],
    solutions: {
      theta: "theta0 + omega0*t + 0.5*alpha*t^2",
      theta0: "theta - omega0*t - 0.5*alpha*t^2",
      omega0: "(theta - theta0 - 0.5*alpha*t^2)/t",
      alpha: "2*(theta - theta0 - omega0*t)/t^2",
      t: "(-omega0 + sqrt(omega0^2 + 2*alpha*(theta-theta0)))/alpha",
    },
  },
  Torque: {
    equation: "τ = rF sin θ",
    variables: ["tau", "r", "F", "theta"],
    solutions: {
      tau: "r*F*sin(theta)",
      r: "tau/(F*sin(theta))",
      F: "tau/(r*sin(theta))",
      theta: "asin(tau/(r*F))",
    },
  },
  "Rotational Kinetic Energy": {
    equation: "K_rot = ½Iω²",
    variables: ["K_rot", "I", "omega"],
    solutions: {
      K_rot: "0.5*I*omega^2",
      I: "2*K_rot/omega^2",
      omega: "sqrt(2*K_rot/I)",
    },
  },
  "Angular Momentum": {
    equation: "L = Iω",
    variables: ["L", "I", "omega"],
    solutions: {
      L: "I*omega",
      I: "L/omega",
      omega: "L/I",
    },
  },
  "Period - Spring": {
    equation: "T_s = 2π√(m/k)",
    variables: ["T_s", "m", "k"],
    solutions: {
      T_s: "2*pi*sqrt(m/k)",
      m: "k*(T_s/(2*pi))^2",
      k: "m*(2*pi/T_s)^2",
    },
  },
  "Period - Pendulum": {
    equation: "T_p = 2π√(l/g)",
    variables: ["T_p", "l", "g"],
    solutions: {
      T_p: "2*pi*sqrt(l/g)",
      l: "g*(T_p/(2*pi))^2",
      g: "l*(2*pi/T_p)^2",
    },
  },
  Density: {
    equation: "ρ = m/V",
    variables: ["rho", "m", "V"],
    solutions: {
      rho: "m/V",
      m: "rho*V",
      V: "m/rho",
    },
  },
  Pressure: {
    equation: "P = F/A",
    variables: ["P", "F", "A"],
    solutions: {
      P: "F/A",
      F: "P*A",
      A: "F/P",
    },
  },
  "Pressure - Depth": {
    equation: "P = P₀ + ρgh",
    variables: ["P", "P0", "rho", "g", "h"],
    solutions: {
      P: "P0 + rho*g*h",
      P0: "P - rho*g*h",
      rho: "(P - P0)/(g*h)",
      g: "(P - P0)/(rho*h)",
      h: "(P - P0)/(rho*g)",
    },
  },
  "Buoyant Force": {
    equation: "F_b = ρVg",
    variables: ["F_b", "rho", "V", "g"],
    solutions: {
      F_b: "rho*V*g",
      rho: "F_b/(V*g)",
      V: "F_b/(rho*g)",
      g: "F_b/(rho*V)",
    },
  },
  "Continuity Equation": {
    equation: "A₁v₁ = A₂v₂",
    variables: ["A1", "v1", "A2", "v2"],
    solutions: {
      A1: "A2*v2/v1",
      v1: "A2*v2/A1",
      A2: "A1*v1/v2",
      v2: "A1*v1/A2",
    },
  },
}

export default function EquationSolverPage() {
  const [selectedEquation, setSelectedEquation] = useState(Object.keys(equations)[0])
  const [variableValues, setVariableValues] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleEquationChange = (value) => {
    setSelectedEquation(value)
    setVariableValues({})
    setResult(null)
    setError(null)
  }

  const handleVariableChange = (variable, value) => {
    setVariableValues((prevState) => ({
      ...prevState,
      [variable]: value === "" ? undefined : Number.parseFloat(value),
    }))
  }

  const solveEquation = () => {
    try {
      setError(null)
      const { variables, solutions } = equations[selectedEquation]

      const unknownVariables = variables.filter((v) => variableValues[v] === undefined)

      if (unknownVariables.length !== 1) {
        setError(
          `Please leave exactly one variable empty to solve for. Currently ${unknownVariables.length} variables are empty.`,
        )
        return
      }

      const solveFor = unknownVariables[0]
      const solutionFormula = solutions[solveFor]

      if (!solutionFormula) {
        setError(`No solution formula found for ${solveFor}`)
        return
      }

      const scope = {}
      for (const v of variables) {
        if (v !== solveFor && variableValues[v] !== undefined) {
          scope[v] = variableValues[v]
        }
      }

      try {
        const result = math.evaluate(solutionFormula, scope)

        if (isNaN(result) || !isFinite(result)) {
          setError(`Could not solve for ${solveFor}. Check your input values.`)
          return
        }

        const roundedResult = math.round(result, 6)
        setResult(`${solveFor} = ${roundedResult}`)
      } catch (evalError) {
        setError(`Error calculating ${solveFor}: ${evalError.message}`)
      }
    } catch (e) {
      setError(`Error: ${e.message}`)
    }
  }

  const { equation, variables } = equations[selectedEquation]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Physics Equation Solver</h1>
                <p className="text-sm text-gray-600">Solve physics equations step by step</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Equation Solver</span>
              </CardTitle>
              <CardDescription>
                Select an equation and enter known values to solve for the unknown variable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Equation Selection */}
              <div className="space-y-2">
                <Label htmlFor="equation-select">Select Equation:</Label>
                <Select value={selectedEquation} onValueChange={handleEquationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an equation" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(equations).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Equation Display */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="font-mono text-lg text-center">{equation}</p>
              </div>

              {/* Variable Inputs */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Enter Known Values:</Label>
                <div className="grid grid-cols-2 gap-4">
                  {variables.map((variable) => (
                    <div key={variable} className="space-y-2">
                      <Label htmlFor={variable} className="text-sm font-medium">
                        {variable}:
                      </Label>
                      <Input
                        type="number"
                        id={variable}
                        step="any"
                        value={variableValues[variable] !== undefined ? variableValues[variable] : ""}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        placeholder="Leave empty to solve"
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Solve Button */}
              <Button onClick={solveEquation} className="w-full" size="lg">
                <Calculator className="w-4 h-4 mr-2" />
                Solve Equation
              </Button>

              {/* Instructions */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong> Fill in all values except the one you want to solve for, then click
                  "Solve Equation".
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
              <CardDescription>Results and step-by-step explanation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Solution Found</span>
                  </div>
                  <p className="text-lg font-mono text-green-900">{result}</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Error</span>
                  </div>
                  <p className="text-red-900">{error}</p>
                </div>
              )}

              {!result && !error && (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Enter values and click solve to see the result</p>
                </div>
              )}

              {/* Current Equation Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Current Equation:</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-mono text-center">{equation}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Variables:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {variables.map((variable) => (
                      <div key={variable} className="flex justify-between">
                        <span className="font-mono">{variable}:</span>
                        <span className={variableValues[variable] !== undefined ? "text-green-600" : "text-gray-400"}>
                          {variableValues[variable] !== undefined ? variableValues[variable] : "unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Equations Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>Common physics equations available in the solver</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Kinematics</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono">v = v₀ + at</p>
                  <p className="font-mono">x = x₀ + v₀t + ½at²</p>
                  <p className="font-mono">v² = v₀² + 2a(x - x₀)</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Dynamics</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono">F_net = ma</p>
                  <p className="font-mono">F_f = μF_n</p>
                  <p className="font-mono">F_s = -kΔx</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">Energy</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono">K = ½mv²</p>
                  <p className="font-mono">U_g = mgΔy</p>
                  <p className="font-mono">W = Fd cos θ</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">Momentum</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono">p = mv</p>
                  <p className="font-mono">J = F_avg Δt</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-orange-600">Rotation</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono">τ = rF sin θ</p>
                  <p className="font-mono">L = Iω</p>
                  <p className="font-mono">K_rot = ½Iω²</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-600">Fluids</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono">P = F/A</p>
                  <p className="font-mono">F_b = ρVg</p>
                  <p className="font-mono">A₁v₁ = A₂v₂</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
