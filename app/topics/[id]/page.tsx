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
// The completedProblems here are effectively stubs now, localStorage is the source of truth.
const userProgress = {
  completedSimulations: [], // Will be populated by allSimulationsStatus logic
  completedProblems: [],   // Will be populated by localStorage logic
  watchedVideos: ["kinematics-intro", "kinematics-projectile", "dynamics-newton", "energy-conservation"], // Example, manage as needed
}

// Data reflecting the actual completion status of all simulations
// This should ideally be sourced from a shared location or service,
// but for this task, it's defined here based on the review.
const allSimulationsStatus: { [id: string]: boolean } = {
  "projectile": true,  // Only projectile is true now
  "graphs": false,
  "relative": false,
  "forces": false,
  "friction": false,
  "energy-pendulum": false,
  "collision-elastic": false,
  "centripetal": false,
  "spring-mass": false,
  "torque-balance": false,
  "rotating-disk": false,
  "gyroscope": false,
  "rolling-objects": false,
  "angular-momentum": false,
  "buoyancy": false,
  "fluid-flow": false,
  "pressure-depth": false,
};

const topicData = {
  kinematics: {
    title: "Kinematics",
    description: "Motion in one and two dimensions",
    icon: TrendingUp,
    progress: 0,
    color: "bg-blue-500",
    concepts: ["Position, velocity, and acceleration", "Kinematic equations", "Projectile motion", "Relative motion"],
    simulations: [
      { id: "projectile", title: "Projectile Motion Simulator", description: "Explore projectile paths", difficulty: "Intermediate", completed: false },
      { id: "graphs", title: "Motion Graphs", description: "Visualize motion relationships", difficulty: "Basic", completed: false },
      { id: "relative", title: "Relative Motion", description: "Motion from different frames", difficulty: "Advanced", completed: false },
    ],
    videos: [
      { title: "Introduction to Kinematics", duration: "12:34", rating: 4.8, views: "125K", watched: false, url: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", description: "Basic concepts" },
      { title: "Projectile Motion Explained", duration: "18:45", rating: 4.9, views: "89K", watched: false, url: "https://www.youtube.com/watch?v=R-q0KrxxGK0", description: "Projectile guide" },
    ],
    problems: [
      { id: 1, title: "Kinematics Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Kinematics Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  dynamics: {
    title: "Dynamics",
    description: "Newton's Laws of Motion",
    icon: Zap,
    progress: 0,
    color: "bg-green-500",
    concepts: ["Newton's First Law (Inertia)", "Newton's Second Law (F = ma)", "Newton's Third Law (Action-Reaction)", "Free body diagrams", "Friction forces"],
    simulations: [
      { id: "forces", title: "Force and Motion", description: "Apply forces, observe motion", difficulty: "Basic", completed: false },
      { id: "friction", title: "Friction Simulator", description: "Explore static/kinetic friction", difficulty: "Intermediate", completed: false },
    ],
    videos: [
      { title: "Newton's Laws Explained", duration: "20:15", rating: 4.9, views: "200K", watched: false, url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds", description: "Newton's three laws" },
    ],
    problems: [
      { id: 1, title: "Dynamics Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Dynamics Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  "circular-motion": {
    title: "Circular Motion",
    description: "Circular motion and gravitation",
    icon: Orbit,
    progress: 0,
    color: "bg-purple-500",
    concepts: ["Centripetal acceleration", "Centripetal force", "Angular velocity", "Uniform circular motion"],
    simulations: [
      { id: "centripetal", title: "Centripetal Force", description: "Visualize circular forces", difficulty: "Intermediate", completed: false },
    ],
    videos: [
      { title: "Introduction to Circular Motion", duration: "15:30", rating: 4.8, views: "140K", watched: false, url: "https://www.youtube.com/watch?v=bpFK2VCRHUs", description: "Centripetal force basics" },
    ],
    problems: [
      { id: 1, title: "Circular Motion Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Circular Motion Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  energy: {
    title: "Energy",
    description: "Work, energy, and power",
    icon: Battery,
    progress: 0,
    color: "bg-yellow-500",
    concepts: ["Kinetic and potential energy", "Conservation of energy", "Work-energy theorem", "Power"],
    simulations: [
      { id: "energy-pendulum", title: "Energy in Pendulum", description: "Energy transformations", difficulty: "Basic", completed: false },
    ],
    videos: [
      { title: "Conservation of Energy", duration: "16:20", rating: 4.9, views: "180K", watched: false, url: "https://www.youtube.com/watch?v=79YPBtH_2Qs", description: "Energy conservation principles" },
    ],
    problems: [
      { id: 1, title: "Energy Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Energy Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  momentum: {
    title: "Momentum",
    description: "Linear momentum and collisions",
    icon: RotateCcw,
    progress: 0,
    color: "bg-red-500",
    concepts: ["Linear momentum", "Conservation of momentum", "Elastic/Inelastic collisions", "Impulse"],
    simulations: [
      { id: "collision-elastic", title: "Elastic Collisions", description: "Elastic collision scenarios", difficulty: "Intermediate", completed: false },
    ],
    videos: [
      { title: "Introduction to Momentum", duration: "14:25", rating: 4.8, views: "160K", watched: false, url: "https://www.youtube.com/watch?v=uPpkgUvlnkE", description: "Momentum concepts" },
    ],
    problems: [
      { id: 1, title: "Momentum Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Momentum Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  "harmonic-motion": {
    title: "Simple Harmonic Motion",
    description: "Oscillations and waves",
    icon: Waves,
    progress: 0,
    color: "bg-indigo-500",
    concepts: ["Simple harmonic motion", "Period and frequency", "Spring-mass systems", "Pendulums"],
    simulations: [
      { id: "spring-mass", title: "Spring-Mass System", description: "Explore SHM with springs", difficulty: "Advanced", completed: false },
    ],
    videos: [
      { title: "Intro to Simple Harmonic Motion", duration: "16:45", rating: 4.8, views: "130K", watched: false, url: "https://www.youtube.com/watch?v=Qf5mKtjIqSs", description: "Oscillatory motion basics" },
    ],
    problems: [
      { id: 1, title: "Simple Harmonic Motion Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Simple Harmonic Motion Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  "torque-rotation": {
    title: "Torque & Rotational Dynamics",
    description: "Rotational motion and torque",
    icon: Settings,
    progress: 0,
    color: "bg-orange-500",
    concepts: ["Torque", "Moment of inertia", "Rotational kinematics", "Angular momentum"],
    simulations: [
      { id: "torque-balance", title: "Torque Balance", description: "Rotational equilibrium", difficulty: "Basic", completed: false },
      { id: "rotating-disk", title: "Rotating Disk", description: "Rotational motion analysis", difficulty: "Intermediate", completed: false },
      { id: "gyroscope", title: "Gyroscope Physics", description: "Gyroscopic motion", difficulty: "Advanced", completed: false },
    ],
    videos: [
      { title: "Introduction to Torque", duration: "15:30", rating: 4.8, views: "120K", watched: false, url: "https://www.youtube.com/watch?v=YlYEi0PgG1g", description: "Torque basics" },
    ],
    problems: [
      { id: 1, title: "Torque & Rotational Dynamics Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Torque & Rotational Dynamics Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  "rotational-energy": {
    title: "Rotational Energy & Momentum",
    description: "Energy and momentum in rotating systems",
    icon: RotateCcw, // Re-using momentum icon, consider a different one if available
    progress: 0,
    color: "bg-pink-500",
    concepts: ["Rotational kinetic energy", "Conservation of angular momentum", "Rolling motion"],
    simulations: [
      { id: "rolling-objects", title: "Rolling Motion", description: "Rolling vs sliding", difficulty: "Intermediate", completed: false },
      { id: "angular-momentum", title: "Angular Momentum Conservation", description: "Explore L conservation", difficulty: "Advanced", completed: false },
    ],
    videos: [
      { title: "Rotational Energy", duration: "16:20", rating: 4.8, views: "110K", watched: false, url: "https://www.youtube.com/watch?v=HxTZ446tbzE", description: "Rotational KE" },
    ],
    problems: [
      { id: 1, title: "Rotational Energy & Momentum Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Rotational Energy & Momentum Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
  fluids: {
    title: "Fluids",
    description: "Fluid statics and dynamics",
    icon: Droplets,
    progress: 0,
    color: "bg-cyan-500",
    concepts: ["Fluid pressure", "Buoyancy", "Archimedes' principle", "Fluid flow", "Bernoulli's equation"],
    simulations: [
      { id: "buoyancy", title: "Buoyancy Simulator", description: "Floating/sinking objects", difficulty: "Basic", completed: false },
      { id: "fluid-flow", title: "Fluid Flow", description: "Bernoulli's principle", difficulty: "Intermediate", completed: false },
      { id: "pressure-depth", title: "Pressure vs Depth", description: "Pressure variation", difficulty: "Basic", completed: false },
    ],
    videos: [
      { title: "Introduction to Fluids", duration: "14:30", rating: 4.7, views: "105K", watched: false, url: "https://www.youtube.com/watch?v=fJefjG3xhW0", description: "Fluid properties" },
    ],
    problems: [
      { id: 1, title: "Fluids Quiz 1", difficulty: "Basic", completed: false, score: null },
      { id: 2, title: "Fluids Quiz 2", difficulty: "Intermediate", completed: false, score: null },
    ],
  },
};

// Helper function (no longer uses global topicData directly for problem completion for progress calculation)
const calculateTopicProgressLocal = (topic: any, completedProblemMap: { [key: string]: boolean }) => {
  if (!topic) return 0;

  // Simulation completion is now handled by allSimulationsStatus via useEffect update
  const completedSims = topic.simulations.filter((sim: any) => sim.completed).length;
  
  // Problem completion for progress calculation needs to use the map from localStorage
  let completedProbs = 0;
  if (topic.problems) {
    topic.problems.forEach((prob: any) => {
      const problemKey = `${topic.id}-${prob.id}`; // topic.id here is the string key like "kinematics"
      if (completedProblemMap[problemKey]) {
        completedProbs++;
      }
    });
  }

  // Video watching status (assuming it's managed via userProgress or similar, or set to false if not tracked)
  const watchedVids = topic.videos.filter((video: any) => video.watched).length;

  const totalActivities = (topic.simulations?.length || 0) + (topic.problems?.length || 0) + (topic.videos?.length || 0);
  const completedActivities = completedSims + completedProbs + watchedVids;
  
  return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
};


export default function TopicPage() {
  const params = useParams();
  const topicId = params.id as string; // This is the key for topicData, e.g., "kinematics"

  const [currentTopic, setCurrentTopic] = useState(() => {
    const initialTopic = topicData[topicId as keyof typeof topicData];
    // Initial progress calculation can be done here or deferred to useEffect
    // For now, use the statically set progress or let useEffect handle it.
    return initialTopic;
  });

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    let userEmail: string | null = null;
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        userEmail = userData?.email || null;
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }

    let completedQuizzesFromStorage: { [key: string]: boolean } = {};
    if (userEmail) {
      const progressKey = `progress_${userEmail}`;
      const progressJson = localStorage.getItem(progressKey);
      if (progressJson) {
        try {
          const progressData = JSON.parse(progressJson);
          if (progressData?.completedQuizzes) {
            completedQuizzesFromStorage = progressData.completedQuizzes;
          }
        } catch (e) {
          console.error("Failed to parse progress data from localStorage", e);
        }
      }
    }

    const initialTopicFromGlobal = topicData[topicId as keyof typeof topicData];

    if (initialTopicFromGlobal) {
      const updatedProblems = initialTopicFromGlobal.problems.map(problem => ({
        ...problem,
        completed: completedQuizzesFromStorage[`${topicId}-${problem.id}`] === true,
        // score can also be updated from localStorage if available, e.g. progressData.quizScores[`${topicId}-${problem.id}`]
      }));

      const updatedSimulations = initialTopicFromGlobal.simulations.map(sim => ({
        ...sim,
        completed: allSimulationsStatus[sim.id] || false,
      }));
      
      // Create a temporary topic object to pass to calculateTopicProgressLocal
      // Add topicId to this temporary object so calculateTopicProgressLocal can build problemKey
      const tempTopicForProgressCalc = {
        ...initialTopicFromGlobal,
        id: topicId, // Add the topicId string (e.g. "kinematics") for progress calculation context
        simulations: updatedSimulations,
        problems: updatedProblems, 
        // videos array remains as is from topicData, or could be updated if watch status is in localStorage
      };

      const newProgress = calculateTopicProgressLocal(tempTopicForProgressCalc, completedQuizzesFromStorage);
      
      setCurrentTopic({
        ...initialTopicFromGlobal, // Start with the base global data
        simulations: updatedSimulations, // Apply updated simulations
        problems: updatedProblems,       // Apply updated problems
        progress: newProgress,           // Apply new progress
      });

    } else {
      setCurrentTopic(undefined); 
    }
  // IMPORTANT: Add dependencies for user progress if it can change and cause re-calculation
  // For now, only topicId, but in a real app, user login/logout or progress updates might trigger this.
  }, [topicId]); 

  const topic = currentTopic; 

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
