from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from anthropic import Anthropic
from dotenv import load_dotenv

import os
import json

from models import *
from prompts import *

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
            max_tokens=700,
            messages=[
                {
                    "role": "user",
                    "content": prompt
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

    return {
        "plan": response
    }

@app.post("/morning-plan")
def morning_plan(data: MorningRequest):

    prompt = build_morning_prompt(data)

    response = ask_claude(prompt)

    return {
        "plan": response
    }

@app.post("/weekend-plan")
def weekend_plan(data: WeekendRequest):

    prompt = build_weekend_prompt(data)

    response = ask_claude(prompt)

    return {
        "plan": response
    }