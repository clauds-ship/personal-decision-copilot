from pydantic import BaseModel

class DailyPlanRequest(BaseModel):
    energy_level: str
    available_hours: int
    priorities: str

class MorningRequest(BaseModel):
    sleep_hours: int
    available_minutes: int
    intensity: str

class WeekendRequest(BaseModel):
    social_energy: str
    budget: str
    weather_preference: str