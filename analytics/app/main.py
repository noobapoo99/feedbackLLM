from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from groq import Groq
import os
import json
import time
from typing import Optional, Dict

app = FastAPI()

# ===============================
# 🔐 Groq Client
# ===============================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# ===============================
# 📦 Schemas
# ===============================

class ChatContext(BaseModel):
    user: Dict
    page: Dict
    uiState: Optional[Dict] = {}
    message: str


# ===============================
# 🧠 Prompt Builder
# ===============================

def build_prompt(ctx: ChatContext) -> str:
    return f"""
You are an AI assistant embedded inside a web dashboard.

You MUST respond in valid JSON ONLY.

Schema:
{{
  "reply": string,
  "ui_action": null | {{
    "type": "set_chart",
    "chart": "pie" | "bar" | "line"
  }}
}}

Rules:
- If the user asks to visualize data, include ui_action
- If no UI change is needed, set ui_action to null
- Do not include markdown
- Do not include explanations outside JSON

Context:
- Page: {ctx.page.get("name")}
- Route: {ctx.page.get("route")}

User message:
{ctx.message}
"""


# ===============================
# 🤖 Groq Call
# ===============================

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
        # Fallback safety
        return {
            "reply": raw,
            "ui_action": None
        }


# ===============================
# 🌊 Streaming Endpoint
# ===============================

@app.post("/chat-stream")
def chat_stream(ctx: ChatContext):
    print("CTX RECEIVED:", ctx.dict())

    def stream():
        result = call_groq(build_prompt(ctx))

        # 1️⃣ Send UI action first (if exists)
        if result.get("ui_action"):
            yield "__ACTION__" + json.dumps(result["ui_action"]) + "\n"
            time.sleep(0.05)

        # 2️⃣ Stream reply text token-by-token
        reply = result.get("reply", "")
        for token in reply.split(" "):
            yield token + " "
            time.sleep(0.02)

    return StreamingResponse(stream(), media_type="text/plain")
  
""" @app.post("/analyze")
def analyze(review: Review):
    result = classifier(
        review.text,
        truncation=True,   
        max_length=512
    )[0]

    return {
        "sentiment": result["label"].lower(),
        "score": float(result["score"])
    }
@app.post("/chat-intent")
def analyze_intent(query: QueryModel):
    text = query.query.lower()

    if "nps" in text:
        return { "intent": "nps", "chart": "bar" }

    if "sentiment" in text:
        return { "intent": "sentiment_breakdown", "chart": "pie" }

    if "trend" in text:
        return { "intent": "rating_trend", "chart": "line" }

    return { "intent": "unknown" }
 """