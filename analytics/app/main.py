from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
classifier = pipeline("sentiment-analysis")

class Review(BaseModel):
    text: str

@app.post("/analyze")
def analyze(review: Review):
    result = classifier(review.text)[0]
    return {
        "label": result["label"],
        "score": str(round(result["score"], 4))
    }
