from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from json_repair import repair_json

from anthropic import Anthropic
from dotenv import load_dotenv

import os
import json

from models import *
from prompts import *
from memory import *

load_dotenv()

app = FastAPI()

# CORS FIX

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"message": "ok"}

def ask_claude(prompt):

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=400,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        )

        return response.content[0].text

    except Exception as e:

        print("ERROR:", e)

        return str(e)

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/daily-plan")
def daily_plan(data: DailyPlanRequest):

    prompt = build_daily_prompt(data)

    response = ask_claude(prompt)
    response = response.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(repair_json(response))

    db = SessionLocal()

    new_recommendation = Recommendation(
        plan_type="daily",
        recommendation=response
    )

    db.add(new_recommendation)
    db.commit()
    db.close()

    return parsed

@app.post("/morning-plan")
def morning_plan(data: MorningRequest):

    prompt = build_morning_prompt(data)

    response = ask_claude(prompt)
    response = response.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(repair_json(response))

    db = SessionLocal()

    new_recommendation = Recommendation(
        plan_type="morning",
        recommendation=response
    )

    db.add(new_recommendation)
    db.commit()
    db.close()

    return parsed

@app.post("/weekend-plan")
def weekend_plan(data: WeekendRequest):

    prompt = build_weekend_prompt(data)

    response = ask_claude(prompt)
    response = response.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(repair_json(response))

    db = SessionLocal()

    new_recommendation = Recommendation(
        plan_type="weekend",
        recommendation=response
    )

    db.add(new_recommendation)
    db.commit()
    db.close()

    return parsed