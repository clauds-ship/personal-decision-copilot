"use client"

import { useMemo, useState } from "react"

type Mode = "daily" | "morning" | "weekend"

type PlanResponse = {
  schedule?: Array<string | Record<string, unknown>>
  reasoning?: string
  burnout_risk?: string
  burnout_score?: string | number
  energy_alignment?: string
  [key: string]: unknown
}

const modes: Array<{
  id: Mode
  label: string
  eyebrow: string
  action: string
}> = [
  {
    id: "daily",
    label: "Daily Planner",
    eyebrow: "Tonight",
    action: "Build daily plan",
  },
  {
    id: "morning",
    label: "Morning Optimizer",
    eyebrow: "Start well",
    action: "Shape my morning",
  },
  {
    id: "weekend",
    label: "Weekend Planner",
    eyebrow: "Recharge",
    action: "Plan the weekend",
  },
]

const modePrompts: Record<Mode, string> = {
  daily: "Tell me what kind of energy you have tonight, how much time is real, and what is tugging for attention.",
  morning: "Good morning. Give me the essentials and I will keep the start of your day realistic, steady, and useful.",
  weekend: "Let's protect your recovery while still making room for the kind of weekend you actually want.",
}

const energyOptions = [
  "Very low",
  "Low",
  "Medium",
  "High",
  "Scattered",
  "Focused",
]

const intensityOptions = ["Recovery", "Light", "Medium", "Hard"]
const socialOptions = ["Solo reset", "Low-key", "Medium", "Highly social"]
const budgetOptions = ["Free", "Low", "Medium", "Flexible"]
const weatherOptions = ["Indoor", "Outdoor", "Sunny", "Rain friendly", "No preference"]

function greetingForNow() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Good morning"
  }

  if (hour < 17) {
    return "Good afternoon"
  }

  return "Good evening"
}

function formatValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return value
  }

  return JSON.stringify(value)
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("daily")
  const [response, setResponse] = useState<PlanResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [energy, setEnergy] = useState("Medium")
  const [hours, setHours] = useState(2)
  const [priorities, setPriorities] = useState("")

  const [sleep, setSleep] = useState(7)
  const [minutes, setMinutes] = useState(45)
  const [intensity, setIntensity] = useState("Medium")

  const [social, setSocial] = useState("Medium")
  const [budget, setBudget] = useState("Medium")
  const [weather, setWeather] = useState("No preference")

  const currentMode = modes.find((item) => item.id === mode) ?? modes[0]
  const greeting = useMemo(() => greetingForNow(), [])

  async function generatePlan() {
    let endpoint = ""
    let body = {}

    if (mode === "daily") {
      endpoint = "daily-plan"
      body = {
        energy_level: energy,
        available_hours: hours,
        priorities: priorities || "No specific priorities shared",
      }
    }

    if (mode === "morning") {
      endpoint = "morning-plan"
      body = {
        sleep_hours: sleep,
        available_minutes: minutes,
        intensity,
      }
    }

    if (mode === "weekend") {
      endpoint = "weekend-plan"
      body = {
        social_energy: social,
        budget,
        weather_preference: weather,
      }
    }

    setIsLoading(true)
    setError("")
    setResponse(null)

    try {
      const res = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error("The planning service did not return a plan.")
      }

      const data = await res.json()
      setResponse(data)
    } catch (requestError) {
      console.error(requestError)
      setError("I could not reach the planning service. Make sure the backend is running, then try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1f2933]">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-6 md:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] md:px-8 md:py-10">
        <aside className="flex flex-col justify-between rounded-lg border border-[#ddd5c8] bg-[#fcfaf6] p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7a6f64]">
              Personal Decision Copilot
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#172026] md:text-5xl">
              {greeting}, Claudia.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#5f6b75]">
              Choose a planning mode, tune the defaults, and add only the details that matter. The copilot will turn the inputs into a practical recommendation.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {modes.map((item) => (
              <button
                key={item.id}
                className={`mode-button ${mode === item.id ? "mode-button-active" : ""}`}
                onClick={() => {
                  setMode(item.id)
                  setResponse(null)
                  setError("")
                }}
                type="button"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6f64]">
                    {item.eyebrow}
                  </span>
                  <span className="mt-1 block text-base font-semibold">
                    {item.label}
                  </span>
                </span>
                <span aria-hidden="true" className="mode-dot" />
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-lg border border-[#d8dce0] bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-2 border-b border-[#e6e8ea] pb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#66717c]">
              {currentMode.label}
            </p>
            <h2 className="text-2xl font-semibold text-[#172026]">
              {modePrompts[mode]}
            </h2>
          </div>

          <div className="mt-6 grid gap-5">
            {mode === "daily" && (
              <>
                <label className="field">
                  <span>Energy level</span>
                  <select value={energy} onChange={(event) => setEnergy(event.target.value)}>
                    {energyOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Available hours tonight</span>
                  <input
                    min="0"
                    step="0.5"
                    type="number"
                    value={hours}
                    onChange={(event) => setHours(Number(event.target.value))}
                  />
                </label>

                <label className="field">
                  <span>Current priorities</span>
                  <textarea
                    placeholder="Example: finish case prep, tidy the kitchen, call a friend"
                    value={priorities}
                    onChange={(event) => setPriorities(event.target.value)}
                  />
                </label>
              </>
            )}

            {mode === "morning" && (
              <>
                <label className="field">
                  <span>Sleep hours</span>
                  <input
                    min="0"
                    max="14"
                    step="0.5"
                    type="number"
                    value={sleep}
                    onChange={(event) => setSleep(Number(event.target.value))}
                  />
                </label>

                <label className="field">
                  <span>Available minutes</span>
                  <input
                    min="5"
                    step="5"
                    type="number"
                    value={minutes}
                    onChange={(event) => setMinutes(Number(event.target.value))}
                  />
                </label>

                <label className="field">
                  <span>Workout intensity</span>
                  <select value={intensity} onChange={(event) => setIntensity(event.target.value)}>
                    {intensityOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {mode === "weekend" && (
              <>
                <label className="field">
                  <span>Social energy</span>
                  <select value={social} onChange={(event) => setSocial(event.target.value)}>
                    {socialOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Budget</span>
                  <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                    {budgetOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Weather preference</span>
                  <select value={weather} onChange={(event) => setWeather(event.target.value)}>
                    {weatherOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>

          <button
            className="primary-action"
            disabled={isLoading}
            onClick={generatePlan}
            type="button"
          >
            {isLoading ? "Thinking..." : currentMode.action}
          </button>

          <section className="result-panel" aria-live="polite">
            {!response && !error && (
              <p className="empty-state">
                Your recommendation will appear here with a schedule, tradeoffs, and energy notes.
              </p>
            )}

            {error && <p className="error-state">{error}</p>}

            {response && (
              <div className="grid gap-5">
                {Array.isArray(response.schedule) && response.schedule.length > 0 && (
                  <div>
                    <h3>Suggested flow</h3>
                    <ol className="schedule-list">
                      {response.schedule.map((item, index) => (
                        <li key={`${index}-${formatValue(item)}`}>
                          {formatValue(item)}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="insight-grid">
                  {response.burnout_risk && (
                    <div>
                      <span>Burnout risk</span>
                      <strong>{response.burnout_risk}</strong>
                    </div>
                  )}
                  {response.burnout_score && (
                    <div>
                      <span>Burnout score</span>
                      <strong>{response.burnout_score}</strong>
                    </div>
                  )}
                  {response.energy_alignment && (
                    <div>
                      <span>Energy alignment</span>
                      <strong>{response.energy_alignment}</strong>
                    </div>
                  )}
                </div>

                {response.reasoning && (
                  <div>
                    <h3>Why this works</h3>
                    <p className="reasoning">{response.reasoning}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  )
}
