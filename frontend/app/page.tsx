"use client"

import { useState } from "react"

export default function Home() {

  const [mode, setMode] = useState("daily")

  const [response, setResponse] = useState("")

  // Daily
  const [energy, setEnergy] = useState("")
  const [hours, setHours] = useState(2)
  const [priorities, setPriorities] = useState("")

  // Morning
  const [sleep, setSleep] = useState(7)
  const [minutes, setMinutes] = useState(45)
  const [intensity, setIntensity] = useState("medium")

  // Weekend
  const [social, setSocial] = useState("medium")
  const [budget, setBudget] = useState("medium")
  const [weather, setWeather] = useState("sunny")

  async function generatePlan() {

    let endpoint = ""
    let body = {}

    if (mode === "daily") {

      endpoint = "daily-plan"

      body = {
        energy_level: energy,
        available_hours: hours,
        priorities: priorities
      }
    }

    if (mode === "morning") {

      endpoint = "morning-plan"

      body = {
        sleep_hours: sleep,
        available_minutes: minutes,
        intensity: intensity
      }
    }

    if (mode === "weekend") {

      endpoint = "weekend-plan"

      body = {
        social_energy: social,
        budget: budget,
        weather_preference: weather
      }
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      setResponse(JSON.stringify(data, null, 2))

    } catch (error) {

      console.error(error)

      setResponse("Error connecting to backend")
    }
  }
  return (

    <main className="p-10 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        Personal Decision Copilot
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">

        <button onClick={() => setMode("daily")}>
          Daily Planner
        </button>

        <button onClick={() => setMode("morning")}>
          Morning Optimizer
        </button>

        <button onClick={() => setMode("weekend")}>
          Weekend Planner
        </button>

      </div>

      {/* DAILY */}
      {mode === "daily" && (

        <div className="space-y-4">

          <input
            className="border p-2 w-full"
            placeholder="Energy level"
            onChange={(e) => setEnergy(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Available hours"
            onChange={(e) => setHours(Number(e.target.value))}
          />

          <textarea
            className="border p-2 w-full"
            placeholder="Current priorities"
            onChange={(e) => setPriorities(e.target.value)}
          />

        </div>
      )}

      {/* MORNING */}
      {mode === "morning" && (

        <div className="space-y-4">

          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Sleep hours"
            onChange={(e) => setSleep(Number(e.target.value))}
          />

          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Available minutes"
            onChange={(e) => setMinutes(Number(e.target.value))}
          />

          <input
            className="border p-2 w-full"
            placeholder="Workout intensity"
            onChange={(e) => setIntensity(e.target.value)}
          />

        </div>
      )}

      {/* WEEKEND */}
      {mode === "weekend" && (

        <div className="space-y-4">

          <input
            className="border p-2 w-full"
            placeholder="Social energy"
            onChange={(e) => setSocial(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            placeholder="Budget"
            onChange={(e) => setBudget(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            placeholder="Weather preference"
            onChange={(e) => setWeather(e.target.value)}
          />

        </div>
      )}

      <button
        className="bg-black text-white px-4 py-2 mt-6"
        onClick={generatePlan}
      >
        Generate Plan
      </button>

      <div className="mt-8 border p-4 rounded">

        <pre className="whitespace-pre-wrap">
          {response}
        </pre>

      </div>

    </main>
  )
}