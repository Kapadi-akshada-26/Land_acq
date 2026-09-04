
import joblib
import pandas as pd
from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest

router = APIRouter()

risk_model = joblib.load("app/ml/delay_risk_model.pkl")
delay_model = joblib.load("app/ml/delay_days_model.pkl")
preprocessor = joblib.load("app/ml/land_preprocessor.pkl")


def get_risk_level(probability):
    if probability <= 25:
        return "LOW"
    elif probability <= 50:
        return "MEDIUM"
    elif probability <= 75:
        return "HIGH"
    else:
        return "CRITICAL"


@router.post("/predict")
def predict(data: PredictionRequest):

    project = pd.DataFrame([{
        "state": data.state,
        "project_type": data.project_type,
        "total_land_required_hectares": data.total_land_required_hectares,
        "land_acquired_percent": data.land_acquired_percent,
        "pending_approvals": data.pending_approvals,
        "compensation_pending_percent": data.compensation_pending_percent,
        "legal_cases": data.legal_cases,
        "affected_families": data.affected_families,
        "rr_completed_percent": data.rr_completed_percent,
        "possession_percent": data.possession_percent,
        "planned_duration_months": data.planned_duration_months,
        "environmental_clearance": data.environmental_clearance,
        "forest_clearance": data.forest_clearance,
        "previous_delay_days": data.previous_delay_days,
        "project_status": data.project_status
    }])

    project_processed = preprocessor.transform(project)

    risk_probability = risk_model.predict_proba(project_processed)[0][1]
    risk_percentage = round(risk_probability * 100, 2)

    risk_level = get_risk_level(risk_percentage)

    predicted_delay = delay_model.predict(project_processed)[0]
    predicted_delay = round(max(0, predicted_delay))

    return {
        "delay_probability": risk_percentage,
        "risk_level": risk_level,
        "predicted_delay_days": predicted_delay
    }