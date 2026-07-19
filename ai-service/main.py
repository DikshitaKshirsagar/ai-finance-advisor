from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os
import json

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


class Insight(BaseModel):
    type: str
    title: str
    message: str


class SpendingAnalysisResponse(BaseModel):
    insights: list[Insight]


class ChatRequest(BaseModel):
    question: str
    totalIncome: float
    totalExpense: float
    totalSavings: float
    categoryBreakdown: list[CategorySpend]


class ChatResponse(BaseModel):
    answer: str


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
    ) or "- No expenses recorded yet"

    savings = request.totalIncome - request.totalExpense
    savings_rate = (savings / request.totalIncome * 100) if request.totalIncome > 0 else 0

    prompt = f"""You are a sharp, friendly personal finance advisor analyzing a user's monthly data.

Total Income: Rs.{request.totalIncome:.2f}
Total Expenses: Rs.{request.totalExpense:.2f}
Savings Rate: {savings_rate:.1f}%

Spending by category:
{category_lines}

Return EXACTLY a JSON array of 2 to 3 insight objects, nothing else, no markdown, no explanation outside the JSON. Each object must have:
- "type": one of "tip", "warning", "praise", "trend"
- "title": a punchy 3-5 word title
- "message": ONE short sentence (max 18 words), specific and actionable, referencing actual numbers where possible

Rules:
- If expenses exceed 80% of income, include a "warning" insight
- If savings rate is healthy (above 20%), include a "praise" insight
- If one category dominates spending, include a "trend" insight naming it
- Always include at least one "tip" with a concrete action
- Output ONLY the raw JSON array, e.g. [{{"type":"tip","title":"...","message":"..."}}]"""

    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.6,
        max_tokens=400,
    )

    raw = completion.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        parsed = json.loads(raw)
        insights = [Insight(**item) for item in parsed]
    except Exception:
        insights = [Insight(
            type="tip",
            title="Keep Tracking",
            message="Keep logging your expenses regularly to unlock more personalized insights."
        )]

    return SpendingAnalysisResponse(insights=insights)


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    category_lines = "\n".join(
        [f"- {c.category}: Rs.{c.amount:.2f}" for c in request.categoryBreakdown]
    ) or "- No expenses recorded yet"

    prompt = f"""You are a helpful, conversational personal finance advisor chatbot. Answer the user's question directly and concisely (max 3-4 sentences), using their real financial data below. Be specific with numbers when relevant. Do not use markdown formatting.

User's current financial snapshot this month:
- Total Income: Rs.{request.totalIncome:.2f}
- Total Expenses: Rs.{request.totalExpense:.2f}
- Total Savings: Rs.{request.totalSavings:.2f}
- Spending by category:
{category_lines}

User's question: "{request.question}"

Answer helpfully and specifically based on the numbers above."""

    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=200,
    )

    answer = completion.choices[0].message.content.strip()
    return ChatResponse(answer=answer)