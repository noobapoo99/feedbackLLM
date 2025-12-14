from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from groq import Groq
import os
import json
import time
from typing import Optional, Dict

app = FastAPI()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

class ChatContext(BaseModel):
    user: Dict
    page: Dict
    uiState: Optional[Dict] = {}
    message: str


def build_prompt(ctx: ChatContext) -> str:
    page = ctx.page.get("name")

    if page == "reviews":
        ui_capabilities = """
Allowed UI actions:
- filter_sentiment (positive | negative | neutral)
- reset_reviews
"""
    elif page == "analytics":
        ui_capabilities = """
Allowed UI actions:
- set_chart (pie | bar | line)
"""
    else:
        ui_capabilities = "No UI actions available."

    return f"""
You are an AI assistant embedded inside a web dashboard.

You MUST respond in valid JSON ONLY.

Schema:
{{
  "reply": "string",
  "ui_action": null | {{
    "type": "set_chart" | "filter_sentiment" | "reset_reviews" | "navigate",
    "chart": "pie" | "bar" | "line",
    "sentiment": "positive" | "negative" | "neutral",
    "route": "string"
  }}
}}

Rules:
- You MUST emit ui_action when the page is "reviews" and the user asks to filter or reset
- "show positive reviews" → filter_sentiment + positive
- "show negative reviews" → filter_sentiment + negative
- "reset" → reset_reviews
- ui_action MUST NOT be null in these cases
- Never emit set_chart on reviews page
- Do NOT include markdown
- Do NOT include explanations outside JSON


Context:
- Page: {page}
- Route: {ctx.page.get("route")}

{ui_capabilities}

Example:
User: show positive reviews
Response:
{{
  "reply": "Showing positive reviews.",
  "ui_action": {{
    "type": "filter_sentiment",
    "sentiment": "positive"
  }}
}}

User message:
{ctx.message}
"""



def call_groq(prompt: str) -> Dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=300,
    )

    raw = response.choices[0].message.content.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "reply": raw,
            "ui_action": None
        }


@app.post("/chat-stream")
def chat_stream(ctx: ChatContext):
    print("CTX RECEIVED:", ctx.dict())

    def stream():
        result = call_groq(build_prompt(ctx))

        if result.get("ui_action"):
            yield "__ACTION__" + json.dumps(result["ui_action"]) + "\n"
            time.sleep(0.05)

        reply = result.get("reply", "")
        for token in reply.split(" "):
            yield token + " "
            time.sleep(0.02)

    return StreamingResponse(stream(), media_type="text/plain")
