import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3-flash-preview")


def analyze_issue(description: str):

    prompt = f"""
You are an AI that classifies civic complaints.

A citizen reported the following issue:

Description: {description}

Determine:
1. The most appropriate department
2. Priority level (low, medium, high)
3. Priority Score, whole number between 0 and 100

Possible departments:
Road
Electricity
Water
Sanitation
BBMP

Return ONLY valid JSON in this format:

{{
  "department": "...",
  "priority": "...",
  "priority_score": "...",
}}
"""

    response = model.generate_content(prompt)

    try:
        data = json.loads(response.text)
        return data
    except:
        return {
            "department": "BBMP",
            "priority": "medium"
        }