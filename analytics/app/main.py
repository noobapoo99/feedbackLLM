from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

classifier = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)

class Review(BaseModel):
    text: str

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
