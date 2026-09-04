
import os
import sys
from pathlib import Path
from typing import Dict, Any, List

import joblib
import pandas as pd
from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest

router = APIRouter()

# Dynamically add AI_prediction/ai_insights to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
AI_INSIGHTS_PATH = BASE_DIR / "AI_prediction" / "ai_insights"
if str(AI_INSIGHTS_PATH) not in sys.path:
    sys.path.insert(0, str(AI_INSIGHTS_PATH))

from insights import generate_insights

# Load ML models with absolute paths
ML_DIR = Path(__file__).resolve().parent.parent / "ml"
risk_model = joblib.load(ML_DIR / "delay_risk_model.pkl")
delay_model = joblib.load(ML_DIR / "delay_days_model.pkl")
preprocessor = joblib.load(ML_DIR / "land_preprocessor.pkl")


def get_risk_level(probability: float) -> str:
    if probability <= 25:
        return "Low"
    elif probability <= 50:
        return "Medium"
    elif probability <= 75:
        return "High"
    else:
        return "Critical"


@router.post("/predict")
def predict(data: PredictionRequest):
    # 1. Prepare features from request
    feature_dict = data.get_feature_dict()
    project_df = pd.DataFrame([feature_dict])

    # 2. Run ML models
    project_processed = preprocessor.transform(project_df)

    risk_probability = float(risk_model.predict_proba(project_processed)[0][1])
    risk_percentage = round(risk_probability * 100, 2)
    risk_level = get_risk_level(risk_percentage)

    raw_delay = float(delay_model.predict(project_processed)[0])
    predicted_delay = int(round(max(0.0, raw_delay)))

    # 3. Generate AI Insights & Recommendations
    ai_results = generate_insights(
        data=feature_dict,
        delay_probability=risk_percentage,
        predicted_delay_days=predicted_delay
    )

    top_factors = ai_results.get("top_contributing_factors", [])
    top_risk_factor_names = [f["factor"] for f in top_factors] if top_factors else ["Land Acquisition Progress"]

    # Calculate SHAP-like feature impacts for explainability visualization
    severity_weights = {
        "Critical": 0.35,
        "High": 0.25,
        "Medium": 0.15,
        "Low": 0.05
    }
    shap_values: Dict[str, float] = {}
    for f in top_factors:
        factor_name = f.get("factor", "")
        sev = f.get("severity", "Medium")
        shap_values[factor_name] = round(severity_weights.get(sev, 0.15) * (risk_percentage / 100.0), 3)

    if not shap_values:
        shap_values = {"Land Acquisition Progress": 0.25, "Compensation Pending": 0.20}

    # 4. Construct unified response compatible with frontend
    ai_priority = ai_results.get("prediction_summary", {}).get("overall_action_priority", "MONITOR")
    ai_summary = ai_results.get("ai_summary", "")
    recommended_actions = ai_results.get("recommended_actions", [])

    return {
        # Standard backend naming
        "delay_probability": float(risk_percentage),
        "risk_level": risk_level,
        "predicted_delay_days": predicted_delay,
        "expected_delay_days": predicted_delay,

        # Frontend camelCase naming
        "delayProbability": round(risk_percentage / 100.0, 4),
        "riskLevel": risk_level,
        "expectedDelayDays": predicted_delay,
        "topRiskFactors": top_risk_factor_names,
        "top_risk_factors": top_risk_factor_names,
        "shapValues": shap_values,
        "shap_values": shap_values,

        # AI Insights & Recommendations
        "ai_priority": ai_priority,
        "aiPriority": ai_priority,
        "ai_summary": ai_summary,
        "aiSummary": ai_summary,
        "top_contributing_factors": top_factors,
        "recommended_actions": recommended_actions,
        "prediction_summary": ai_results.get("prediction_summary", {})
    }