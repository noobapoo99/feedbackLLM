from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.responses import StreamingResponse
import time

app = FastAPI()

classifier = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)

class Review(BaseModel):
    text: str

class QueryModel(BaseModel):
    query: str

class ChatContext(BaseModel):
    user: dict
    page: dict
    uiState: dict | None = None
    intent: dict | None = None
    message: str


@app.post("/chat-stream")
def chat_stream(ctx: ChatContext):

    print("CTX RECEIVED IN PYTHON:", ctx.dict())

    def token_generator():
        
        action = None

        if ctx.intent and ctx.intent.get("type") == "sentiment_breakdown":
            action = {
                "type": "ui_action",
                "action": "set_chart",
                "payload": { "chart": "pie" }
            }

        if action:
            yield "__ACTION__" + json.dumps(action) + "\n"
            time.sleep(0.05)

       
        yield f"You are on the {ctx.page['name']} page. "
        time.sleep(0.05)

        yield f"I detected intent: {ctx.intent['type']}. "
        time.sleep(0.05)

        yield f"You asked: {ctx.message}"

    return StreamingResponse(
        token_generator(),
        media_type="text/plain"
    )
      
@app.post("/analyze")
def analyze(review: Review):
    result = classifier(
        review.text,
        truncation=True,   # prevents >512 token error
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
