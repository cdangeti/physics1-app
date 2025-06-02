"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Play,
  Calculator,
  BookOpen,
  Video,
  TrendingUp,
  Zap,
  Battery,
  RotateCcw,
  Check,
  ExternalLink,
  Orbit,
  Waves,
  Settings,
  Droplets,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// User progress data - (completedSimulations will be overridden by allSimulationsStatus)
const userProgress = {
  completedSimulations: ["projectile", "graphs", "forces", "energy-pendulum", "collision-elastic"],
  completedProblems: ["kinematics-1", "kinematics-2", "dynamics-1", "energy-1", "energy-2", "energy-3"],
  watchedVideos: ["kinematics-intro", "kinematics-projectile", "dynamics-newton", "energy-conservation"],
}

// Data reflecting the actual completion status of all simulations
// This should ideally be sourced from a shared location or service,
// but for this task, it's defined here based on the review.
const allSimulationsStatus: { [id: string]: boolean } = {
  "projectile": true,
  "graphs": true,
  "relative": true,
  "forces": true,
  "friction": true,
  "energy-pendulum": true,
  "collision-elastic": true,
  "centripetal": true,
  "spring-mass": true,
  "torque-balance": true,
  "rotating-disk": true,
  "gyroscope": true,
  "rolling-objects": true,
  "angular-momentum": true,
  "buoyancy": true,
  "fluid-flow": true,
  "pressure-depth": true,
};

// Topic data with static structure first
const topicData = {
  kinematics: {
    title: "Kinematics",
    description: "Motion in one and two dimensions",
    icon: TrendingUp,
    progress: 0, // Will be calculated later
    color: "bg-blue-500",
    concepts: ["Position, velocity, and acceleration", "Kinematic equations", "Projectile motion", "Relative motion"],
    simulations: [
      {
        id: "projectile",
        title: "Projectile Motion Simulator",
        description: "Explore how angle and velocity affect projectile paths",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("projectile"),
      },
      {
        id: "graphs",
        title: "Motion Graphs",
        description: "Visualize position, velocity, and acceleration relationships",
        difficulty: "Basic",
        completed: userProgress.completedSimulations.includes("graphs"),
      },
      {
        id: "relative",
        title: "Relative Motion",
        description: "Understand motion from different reference frames",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("relative"),
      },
    ],
    videos: [
      {
        title: "Introduction to Kinematics",
        duration: "12:34",
        rating: 4.8,
        views: "125K",
        watched: userProgress.watchedVideos.includes("kinematics-intro"),
        url: "https://www.youtube.com/watch?v=ZM8ECpBuQYE",
        description: "Basic concepts of motion, position, velocity, and acceleration",
      },
      {
        title: "Projectile Motion Explained",
        duration: "18:45",
        rating: 4.9,
        views: "89K",
        watched: userProgress.watchedVideos.includes("kinematics-projectile"),
        url: "https://www.youtube.com/watch?v=R-q0KrxxGK0",
        description: "Complete guide to projectile motion with examples",
      },
      {
        title: "Kinematic Equations Derivation",
        duration: "15:22",
        rating: 4.7,
        views: "67K",
        watched: userProgress.watchedVideos.includes("kinematics-graphs"),
        url: "https://www.youtube.com/watch?v=opnU1ekFBNU",
        description: "How to derive and use the kinematic equations",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Basic Projectile Motion",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("kinematics-1"),
        score: 85,
      },
      {
        id: 2,
        title: "Kinematic Equations Application",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("kinematics-2"),
        score: 92,
      },
      {
        id: 3,
        title: "Complex Projectile Scenarios",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("kinematics-3"),
        score: null,
      },
    ],
  },
  dynamics: {
    title: "Dynamics",
    description: "Newton's Laws of Motion",
    icon: Zap,
    progress: 0, // Will be calculated later
    color: "bg-green-500",
    concepts: [
      "Newton's First Law (Inertia)",
      "Newton's Second Law (F = ma)",
      "Newton's Third Law (Action-Reaction)",
      "Free body diagrams",
      "Friction forces",
    ],
    simulations: [
      {
        id: "forces",
        title: "Force and Motion",
        description: "Apply forces and observe resulting motion",
        difficulty: "Basic",
        completed: userProgress.completedSimulations.includes("forces"),
      },
      {
        id: "friction",
        title: "Friction Simulator",
        description: "Explore static and kinetic friction",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("friction"),
      },
      {
        id: "incline",
        title: "Inclined Plane Forces",
        description: "Analyze forces on inclined surfaces",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("incline"),
      },
      {
        id: "elevator",
        title: "Elevator Physics",
        description: "Understand apparent weight in accelerating systems",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("elevator"),
      },
    ],
    videos: [
      {
        title: "Newton's Laws Explained",
        duration: "20:15",
        rating: 4.9,
        views: "200K",
        watched: userProgress.watchedVideos.includes("dynamics-newton"),
        url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
        description: "Complete overview of Newton's three laws of motion",
      },
      {
        title: "Free Body Diagrams",
        duration: "14:30",
        rating: 4.8,
        views: "150K",
        watched: userProgress.watchedVideos.includes("dynamics-friction"),
        url: "https://www.youtube.com/watch?v=95K2d_8LbAY",
        description: "How to draw and analyze free body diagrams",
      },
      {
        title: "Friction Forces",
        duration: "16:45",
        rating: 4.7,
        views: "120K",
        watched: userProgress.watchedVideos.includes("dynamics-friction-advanced"),
        url: "https://www.youtube.com/watch?v=fo_pmp5rtzo",
        description: "Static and kinetic friction with problem solving",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Newton's Second Law Problems",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("dynamics-1"),
        score: 78,
      },
      {
        id: 2,
        title: "Friction Force Calculations",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("dynamics-2"),
        score: null,
      },
    ],
  },
  "circular-motion": {
    title: "Circular Motion",
    description: "Circular motion and gravitation",
    icon: Orbit,
    progress: 0, // Will be calculated later
    color: "bg-purple-500",
    concepts: [
      "Centripetal acceleration",
      "Centripetal force",
      "Angular velocity and frequency",
      "Uniform circular motion",
      "Banked curves",
    ],
    simulations: [
      {
        id: "centripetal",
        title: "Centripetal Force",
        description: "Visualize forces in circular motion",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("centripetal"),
      },
      {
        id: "orbital",
        title: "Orbital Motion",
        description: "Explore planetary and satellite motion",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("orbital"),
      },
    ],
    videos: [
      {
        title: "Introduction to Circular Motion",
        duration: "15:30",
        rating: 4.8,
        views: "140K",
        watched: userProgress.watchedVideos.includes("circular-intro"),
        url: "https://www.youtube.com/watch?v=bpFK2VCRHUs",
        description: "Basic concepts of circular motion and centripetal force",
      },
      {
        title: "Gravity and Orbital Motion",
        duration: "18:20",
        rating: 4.9,
        views: "110K",
        watched: userProgress.watchedVideos.includes("circular-gravity"),
        url: "https://www.youtube.com/watch?v=7gf6YpdvtE0",
        description: "Understanding gravitational forces and orbital mechanics",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Centripetal Force Problems",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("circular-1"),
        score: null,
      },
      {
        id: 2,
        title: "Circular Motion Applications",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("circular-2"),
        score: null,
      },
      {
        id: 3,
        title: "Orbital Mechanics",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("circular-3"),
        score: null,
      },
    ],
  },
  energy: {
    title: "Energy",
    description: "Work, energy, and power",
    icon: Battery,
    progress: 0, // Will be calculated later
    color: "bg-yellow-500",
    concepts: ["Kinetic and potential energy", "Conservation of energy", "Work-energy theorem", "Power and efficiency"],
    simulations: [
      {
        id: "energy-pendulum",
        title: "Energy in Pendulum Motion",
        description: "Observe energy transformations in a swinging pendulum",
        difficulty: "Basic",
        completed: userProgress.completedSimulations.includes("energy-pendulum"),
      },
      {
        id: "energy-roller",
        title: "Roller Coaster Physics",
        description: "Design tracks and analyze energy conservation",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("energy-roller"),
      },
      {
        id: "energy-spring",
        title: "Spring Potential Energy",
        description: "Explore elastic potential energy in springs",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("energy-spring"),
      },
    ],
    videos: [
      {
        title: "Conservation of Energy",
        duration: "16:20",
        rating: 4.9,
        views: "180K",
        watched: userProgress.watchedVideos.includes("energy-conservation"),
        url: "https://www.youtube.com/watch?v=79YPBtH_2Qs",
        description: "Energy conservation principles and applications",
      },
      {
        title: "Work and Energy",
        duration: "13:45",
        rating: 4.7,
        views: "120K",
        watched: userProgress.watchedVideos.includes("energy-work"),
        url: "https://www.youtube.com/watch?v=w4QFJb9a8vo",
        description: "Work-energy theorem and problem solving",
      },
      {
        title: "Power in Physics",
        duration: "11:30",
        rating: 4.6,
        views: "95K",
        watched: userProgress.watchedVideos.includes("energy-power"),
        url: "https://www.youtube.com/watch?v=m2tJHiiShps",
        description: "Understanding power, efficiency, and energy transfer",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Energy Conservation Problems",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("energy-1"),
        score: 88,
      },
      {
        id: 2,
        title: "Work-Energy Theorem",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("energy-2"),
        score: 91,
      },
      {
        id: 3,
        title: "Spring Energy Systems",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("energy-3"),
        score: 85,
      },
    ],
  },
  momentum: {
    title: "Momentum",
    description: "Linear momentum and collisions",
    icon: RotateCcw,
    progress: 0, // Will be calculated later
    color: "bg-red-500",
    concepts: [
      "Linear momentum",
      "Conservation of momentum",
      "Elastic collisions",
      "Inelastic collisions",
      "Impulse-momentum theorem",
    ],
    simulations: [
      {
        id: "collision-elastic",
        title: "Elastic Collisions",
        description: "Analyze perfectly elastic collision scenarios",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("collision-elastic"),
      },
      {
        id: "collision-inelastic",
        title: "Inelastic Collisions",
        description: "Study momentum conservation in inelastic collisions",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("collision-inelastic"),
      },
    ],
    videos: [
      {
        title: "Introduction to Momentum",
        duration: "14:25",
        rating: 4.8,
        views: "160K",
        watched: userProgress.watchedVideos.includes("momentum-intro"),
        url: "https://www.youtube.com/watch?v=uPpkgUvlnkE",
        description: "Basic momentum concepts and conservation",
      },
      {
        title: "Collision Analysis",
        duration: "18:10",
        rating: 4.9,
        views: "140K",
        watched: userProgress.watchedVideos.includes("momentum-collisions"),
        url: "https://www.youtube.com/watch?v=7O4V7JzOHGo",
        description: "Elastic and inelastic collision problem solving",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Momentum Conservation",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("momentum-1"),
        score: 82,
      },
      {
        id: 2,
        title: "Collision Problems",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("momentum-2"),
        score: null,
      },
    ],
  },
  "harmonic-motion": {
    title: "Simple Harmonic Motion",
    description: "Oscillations and waves",
    icon: Waves,
    progress: 0, // Will be calculated later
    color: "bg-indigo-500",
    concepts: [
      "Simple harmonic motion",
      "Period and frequency",
      "Spring-mass systems",
      "Pendulum motion",
      "Energy in oscillations",
    ],
    simulations: [
      {
        id: "spring-mass",
        title: "Spring-Mass System",
        description: "Explore simple harmonic motion with springs",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("spring-mass"),
      },
      {
        id: "pendulum-shm",
        title: "Pendulum Oscillations",
        description: "Study pendulum motion and period dependence",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("pendulum-shm"),
      },
    ],
    videos: [
      {
        title: "Introduction to Simple Harmonic Motion",
        duration: "16:45",
        rating: 4.8,
        views: "130K",
        watched: userProgress.watchedVideos.includes("shm-intro"),
        url: "https://www.youtube.com/watch?v=Qf5mKtjIqSs",
        description: "Basic concepts of oscillatory motion and SHM",
      },
      {
        title: "Pendulum Physics",
        duration: "14:20",
        rating: 4.7,
        views: "95K",
        watched: userProgress.watchedVideos.includes("shm-pendulum"),
        url: "https://www.youtube.com/watch?v=4zqtZAg7lJ0",
        description: "Understanding pendulum motion and period calculations",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Spring-Mass Problems",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("shm-1"),
        score: null,
      },
      {
        id: 2,
        title: "Pendulum Calculations",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("shm-2"),
        score: null,
      },
      {
        id: 3,
        title: "Energy in Oscillations",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("shm-3"),
        score: null,
      },
    ],
  },
  "torque-rotation": {
    title: "Torque & Rotational Dynamics",
    description: "Rotational motion and torque",
    icon: Settings,
    progress: 0,
    color: "bg-orange-500",
    concepts: [
      "Torque and rotational equilibrium",
      "Moment of inertia",
      "Rotational kinematics",
      "Newton's second law for rotation",
      "Angular momentum",
    ],
    simulations: [
      {
        id: "torque-balance",
        title: "Torque Balance",
        description: "Explore rotational equilibrium and torque",
        difficulty: "Basic",
        completed: userProgress.completedSimulations.includes("torque-balance"),
      },
      {
        id: "rotating-disk",
        title: "Rotating Disk",
        description: "Analyze rotational motion and angular acceleration",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("rotating-disk"),
      },
      {
        id: "gyroscope",
        title: "Gyroscope Physics",
        description: "Understand gyroscopic motion and precession",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("gyroscope"),
      },
    ],
    videos: [
      {
        title: "Introduction to Torque",
        duration: "15:30",
        rating: 4.8,
        views: "120K",
        watched: userProgress.watchedVideos.includes("torque-intro"),
        url: "https://www.youtube.com/watch?v=YlYEi0PgG1g",
        description: "Basic concepts of torque and rotational motion",
      },
      {
        title: "Moment of Inertia Explained",
        duration: "18:45",
        rating: 4.9,
        views: "95K",
        watched: userProgress.watchedVideos.includes("moment-inertia"),
        url: "https://www.youtube.com/watch?v=jIMihpDmBpY",
        description: "Understanding moment of inertia for different shapes",
      },
      {
        title: "Rotational Dynamics Problems",
        duration: "22:15",
        rating: 4.7,
        views: "85K",
        watched: userProgress.watchedVideos.includes("rotational-dynamics"),
        url: "https://www.youtube.com/watch?v=3A8bBWQk8xE",
        description: "Problem solving with rotational motion equations",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Torque and Equilibrium",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("torque-1"),
        score: null,
      },
      {
        id: 2,
        title: "Rotational Kinematics",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("torque-2"),
        score: null,
      },
      {
        id: 3,
        title: "Complex Rotation Problems",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("torque-3"),
        score: null,
      },
    ],
  },
  "rotational-energy": {
    title: "Rotational Energy & Momentum",
    description: "Energy and momentum in rotating systems",
    icon: RotateCcw,
    progress: 0,
    color: "bg-pink-500",
    concepts: [
      "Rotational kinetic energy",
      "Angular momentum",
      "Conservation of angular momentum",
      "Rolling motion",
      "Combined translational and rotational motion",
    ],
    simulations: [
      {
        id: "rolling-objects",
        title: "Rolling Motion",
        description: "Compare rolling vs sliding motion down inclines",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("rolling-objects"),
      },
      {
        id: "angular-momentum",
        title: "Angular Momentum Conservation",
        description: "Explore conservation of angular momentum",
        difficulty: "Advanced",
        completed: userProgress.completedSimulations.includes("angular-momentum"),
      },
    ],
    videos: [
      {
        title: "Rotational Energy",
        duration: "16:20",
        rating: 4.8,
        views: "110K",
        watched: userProgress.watchedVideos.includes("rotational-energy"),
        url: "https://www.youtube.com/watch?v=HxTZ446tbzE",
        description: "Understanding rotational kinetic energy",
      },
      {
        title: "Angular Momentum",
        duration: "19:45",
        rating: 4.9,
        views: "98K",
        watched: userProgress.watchedVideos.includes("angular-momentum-video"),
        url: "https://www.youtube.com/watch?v=7gf6YpdvtE0",
        description: "Angular momentum and its conservation",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Rotational Energy Problems",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("rot-energy-1"),
        score: null,
      },
      {
        id: 2,
        title: "Rolling Motion Analysis",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("rot-energy-2"),
        score: null,
      },
      {
        id: 3,
        title: "Angular Momentum Conservation",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("rot-energy-3"),
        score: null,
      },
    ],
  },
  fluids: {
    title: "Fluids",
    description: "Fluid statics and dynamics",
    icon: Droplets,
    progress: 0,
    color: "bg-cyan-500",
    concepts: [
      "Fluid pressure and density",
      "Buoyancy and Archimedes' principle",
      "Fluid flow and continuity",
      "Bernoulli's equation",
      "Viscosity and turbulence",
    ],
    simulations: [
      {
        id: "buoyancy",
        title: "Buoyancy Simulator",
        description: "Explore floating and sinking objects",
        difficulty: "Basic",
        completed: userProgress.completedSimulations.includes("buoyancy"),
      },
      {
        id: "fluid-flow",
        title: "Fluid Flow",
        description: "Visualize fluid flow and Bernoulli's principle",
        difficulty: "Intermediate",
        completed: userProgress.completedSimulations.includes("fluid-flow"),
      },
      {
        id: "pressure-depth",
        title: "Pressure vs Depth",
        description: "Understand how pressure varies with depth",
        difficulty: "Basic",
        completed: userProgress.completedSimulations.includes("pressure-depth"),
      },
    ],
    videos: [
      {
        title: "Introduction to Fluids",
        duration: "14:30",
        rating: 4.7,
        views: "105K",
        watched: userProgress.watchedVideos.includes("fluids-intro"),
        url: "https://www.youtube.com/watch?v=fJefjG3xhW0",
        description: "Basic fluid properties and pressure",
      },
      {
        title: "Buoyancy and Archimedes",
        duration: "17:20",
        rating: 4.8,
        views: "125K",
        watched: userProgress.watchedVideos.includes("buoyancy-video"),
        url: "https://www.youtube.com/watch?v=OaGBPQpIzvc",
        description: "Understanding buoyant force and floating",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Fluid Pressure Problems",
        difficulty: "Basic",
        completed: userProgress.completedProblems.includes("fluids-1"),
        score: null,
      },
      {
        id: 2,
        title: "Buoyancy Calculations",
        difficulty: "Intermediate",
        completed: userProgress.completedProblems.includes("fluids-2"),
        score: null,
      },
      {
        id: 3,
        title: "Fluid Flow Analysis",
        difficulty: "Advanced",
        completed: userProgress.completedProblems.includes("fluids-3"),
        score: null,
      },
    ],
  },
}

// Helper functions - now defined after topicData
const calculateTopicProgress = (topicId: string) => {
  const topic = topicData[topicId as keyof typeof topicData]
  if (!topic) return 0

  const completedSims = topic.simulations.filter((sim) => sim.completed).length
  const completedProbs = topic.problems.filter((prob) => prob.completed).length
  const watchedVids = topic.videos.filter((video) => video.watched).length

  const totalActivities = topic.simulations.length + topic.problems.length + topic.videos.length
  const completedActivities = completedSims + completedProbs + watchedVids

  return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0
}

// Update progress values after topicData is defined
// This initial progress calculation will be based on potentially stale `problem.completed` values
// The useEffect in the component will recalculate for the current topic with fresh data.
Object.keys(topicData).forEach((topicId) => {
  const topic = topicData[topicId as keyof typeof topicData]
  topic.progress = calculateTopicProgress(topicId)
})

export default function TopicPage() {
  const params = useParams()
  const topicId = params.id as string

  // Initialize state with data from topicData. This will be updated by useEffect.
  // Type assertion for topic structure; consider defining a type for Topic if not already done elsewhere.
  const [currentTopic, setCurrentTopic] = useState(() => topicData[topicId as keyof typeof topicData]);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    let userEmail: string | null = null;
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        userEmail = userData?.email || null;
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // userEmail remains null
      }
    }

    let completedQuizzes: { [key: string]: boolean } = {};
    if (userEmail) {
      const progressKey = `progress_${userEmail}`;
      const progressJson = localStorage.getItem(progressKey);
      if (progressJson) {
        try {
          const progressData = JSON.parse(progressJson);
          if (progressData?.completedQuizzes) {
            completedQuizzes = progressData.completedQuizzes;
          }
        } catch (e) {
          console.error("Failed to parse progress data from localStorage", e);
          // completedQuizzes remains empty
        }
      }
    }

    const initialTopicFromGlobal = topicData[topicId as keyof typeof topicData];

    if (initialTopicFromGlobal) {
      // Update problem completion status
      const updatedProblems = initialTopicFromGlobal.problems.map(problem => {
        const problemKey = `${topicId}-${problem.id}`; // e.g., "kinematics-1"
        return {
          ...problem,
          completed: completedQuizzes[problemKey] === true,
        };
      });

      // Update simulation completion status
      const updatedSimulations = initialTopicFromGlobal.simulations.map(sim => {
        return {
          ...sim,
          completed: allSimulationsStatus[sim.id] || false, // Use status from allSimulationsStatus
        };
      });

      const newTopicState = {
        ...initialTopicFromGlobal,
        problems: updatedProblems,
        simulations: updatedSimulations, // Include updated simulations
      };

      // Recalculate progress for this new topic state
      // Note: completedSims will now use the updatedSimulations
      const completedSims = newTopicState.simulations.filter(sim => sim.completed).length;
      const completedProbs = newTopicState.problems.filter(prob => prob.completed).length;
      const watchedVids = newTopicState.videos.filter(video => video.watched).length; // Assuming video watching status is managed elsewhere or remains as is
      
      const totalActivities = newTopicState.simulations.length + newTopicState.problems.length + newTopicState.videos.length;
      
      newTopicState.progress = totalActivities > 0 
        ? Math.round(((completedSims + completedProbs + watchedVids) / totalActivities) * 100) 
        : 0;
      
      setCurrentTopic(newTopicState);
    } else {
      setCurrentTopic(undefined); 
    }
  }, [topicId]); // Rerun when topicId changes

  const topic = currentTopic; // Use the state variable for rendering

  if (!topic) {
    return <div>Topic not found</div>
  }

  const Icon = topic.icon

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
              <div className={`w-8 h-8 ${topic.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{topic.title}</h1>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your mastery of {topic.title}</CardDescription>
              </div>
              <Badge variant={topic.progress >= 80 ? "default" : "secondary"} className="text-lg px-3 py-1">
                {topic.progress}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={topic.progress} className="h-3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{topic.simulations.length}</div>
                <div className="text-sm text-gray-600">Simulations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{topic.videos.length}</div>
                <div className="text-sm text-gray-600">Video Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{topic.problems.length}</div>
                <div className="text-sm text-gray-600">Practice Problems</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Key Concepts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topic.concepts.map((concept, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{concept}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="simulations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simulations" className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Simulations</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="problems" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Problems</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topic.simulations.map((simulation, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{simulation.title}</CardTitle>
                      <Badge variant="outline">{simulation.difficulty}</Badge>
                    </div>
                    <CardDescription>{simulation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Link href={`/simulations/${simulation.id}`}>
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Launch Simulation
                        </Button>
                      </Link>
                      {simulation.completed && <Check className="w-6 h-6 text-green-500 ml-2" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topic.videos.map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{video.duration}</span>
                        <span>
                          ⭐ {video.rating} • {video.views} views
                        </span>
                      </div>
                    </CardDescription>
                    <div className="text-xs text-gray-600 mt-2">{video.description}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full" variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Watch on YouTube
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                      {video.watched && <Check className="w-6 h-6 text-green-500 ml-2" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="problems">
            <div className="space-y-4">
              {topic.problems.map((problem) => (
                <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{problem.title}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mr-2">
                            {problem.difficulty}
                          </Badge>
                          {problem.completed && <Badge variant="default">Completed • Score: {problem.score}%</Badge>}
                        </CardDescription>
                      </div>
                      <Link href={`/quiz/${topicId}/${problem.id}`}>
                        <Button variant={problem.completed ? "outline" : "default"}>
                          <Calculator className="w-4 h-4 mr-2" />
                          {problem.completed ? "Review" : "Start"}
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
