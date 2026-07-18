from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()

app = FastAPI(title="Finance Advisor AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class CategorySpend(BaseModel):
    category: str
    amount: float


class SpendingAnalysisRequest(BaseModel):
    totalIncome: float
    totalExpense: float
    categoryBreakdown: list[CategorySpend]


class SpendingAnalysisResponse(BaseModel):
    insight: str


@app.get("/")
def read_root():
    return {"message": "AI Service is running"}


@app.get("/health")
def health_check():
    groq_key_exists = bool(os.getenv("GROQ_API_KEY"))
    return {"status": "healthy", "groq_key_configured": groq_key_exists}


@app.post("/analyze-spending", response_model=SpendingAnalysisResponse)
def analyze_spending(request: SpendingAnalysisRequest):
    category_lines = "\n".join(
        [f"- {c.category}: Rs.{c.amount:.2f}" for c in request.categoryBreakdown]
    )

    prompt = f"""You are a helpful personal finance advisor. Analyze this user's monthly finances and give a short, friendly, actionable insight (2-3 sentences max, no markdown formatting).

Total Income: Rs.{request.totalIncome:.2f}
Total Expenses: Rs.{request.totalExpense:.2f}

Spending by category:
{category_lines}

Give one specific, encouraging insight or suggestion based on this data."""

    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=150,
    )

    insight = completion.choices[0].message.content

    return SpendingAnalysisResponse(insight=insight)