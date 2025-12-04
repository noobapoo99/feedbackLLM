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
