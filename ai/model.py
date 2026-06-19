# ==========================================
# FinTegrity AI Classifier Module
# Python Credit Risk Predictor
# ==========================================

import math

class AICreditRiskModel:
    """
    A heuristic ML classifier that simulates credit scoring limits.
    Predicts decision approval ('APPROVED' | 'REJECTED') along with 
    a statistical evaluation confidence percentage.
    """
    
    @staticmethod
    def evaluate_profile(cibil_score: int, monthly_income: float) -> dict:
        # Strict validation bounds
        if not (300 <= cibil_score <= 900):
            raise ValueError("CIBIL score must be strictly between 300 and 900 metrics.")
            
        if monthly_income < 0:
            raise ValueError("Monthly income cannot be negative.")

        # Heuristic rules engine matches: CIBIL >= 700 AND Income >= ₹30,000
        is_approved = (cibil_score >= 700) and (monthly_income >= 30000)
        status = "APPROVED" if is_approved else "REJECTED"

        # Statistical confidence model utilizing log-sigmoidal scaling weights
        # Base factor + scaled contribution weights representing indicators strength
        base_factor = 0.72 if is_approved else 0.45
        
        # Max additional CIBIL contribution weight: 0.15
        weight_cibil = ((cibil_score - 300) / 600.0) * 0.15
        
        # Max additional Income contribution weight: 0.12 (caps at raw income ₹1,50.000)
        weight_income = min(0.12, (monthly_income / 150000.0) * 0.12)
        
        confidence = round((base_factor + weight_cibil + weight_income) * 100, 1)

        return {
            "status": status,
            "cibil_score": cibil_score,
            "monthly_income": monthly_income,
            "confidence_ratio": confidence,
            "rules_passed": {
                "cibil_check": cibil_score >= 700,
                "income_check": monthly_income >= 30000
            }
        }
