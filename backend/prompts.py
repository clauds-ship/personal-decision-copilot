def build_daily_prompt(data):

    return f"""
    You are an intelligent personal planning assistant.

    The user has:
    - Energy level: {data.energy_level}
    - Available hours tonight: {data.available_hours}
    - Current priorities: {data.priorities}

    Generate:
    1. An optimized evening plan
    2. Recommended ordering of activities
    3. Reasoning behind tradeoffs
    4. Suggestions to avoid burnout

    Keep recommendations realistic and actionable.
    """

def build_morning_prompt(data):

    return f"""
    The user slept {data.sleep_hours} hours.

    They have {data.available_minutes} minutes available.

    Desired workout intensity:
    {data.intensity}

    Generate:
    - ideal morning flow
    - workout recommendation
    - prep efficiency suggestions
    - energy optimization suggestions
    - simple breakfast ideas that are protein-rich

    Be practical and concise.
    """

def build_weekend_prompt(data):

    return f"""
    The user wants weekend recommendations.

    Social energy:
    {data.social_energy}

    Budget:
    {data.budget}

    Weather preference:
    {data.weather_preference}

    Balance:
    - rest
    - activity
    - socializing
    - recovery
    - enjoyment

    Generate a thoughtful weekend recommendation plan.
    """