# ==========================================
# FinTegrity AI FastAPI Server Entrypoint
# Python REST API Server
# ==========================================

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from model import AICreditRiskModel

app = FastAPI(
    title="FinTegrity AI Heuristics Risk Core",
    description="REST endpoints providing credit model evaluations, anomaly identification, and debt decision trees.",
    version="1.0.0"
)

# Configure CORS for integration flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Request Models Schema
class CreditAssessmentRequest(BaseModel):
    cibil_score: int = Field(..., ge=300, le=900, description="Customer credit bureau score (CIBIL metric).")
    monthly_income: float = Field(..., gt=0, description="Assessed monthly liquid cash flows.")

class AssessmentResponse(BaseModel):
    status: str
    cibil_score: int
    monthly_income: float
    confidence_ratio: float
    rules_passed: dict

# 2. Endpoints API Routing
@app.get("/health", status_code=status.HTTP_200_OK)
def check_health():
    """Returns core health check and AI model runtime bounds status."""
    return {
        "status": "healthy",
        "service": "FinTegrity AI Risk core",
        "engine_version": "1.0.0-PROT"
    }

@app.post("/predict", response_model=AssessmentResponse, status_code=status.HTTP_200_OK)
def evaluate_loan_risk(payload: CreditAssessmentRequest):
    """
    Evaluates credit suitability constraints based on inputs.
    Returns credit decision status APPROVED/REJECTED and evaluation statistics.
    """
    try:
        prediction = AICreditRiskModel.evaluate_profile(
            cibil_score=payload.cibil_score,
            monthly_income=payload.monthly_income
        )
        return prediction
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(val_err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred within the AI evaluation layer: {str(err)}"
        )

if __name__ == "__main__":
    import uvicorn
    # Serves the service locally on Port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
