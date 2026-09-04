from recommendations import get_recommendations
from priority_engine import get_priority_summary


def generate_factor_insights(data):
    """
    Analyze actual project values and generate human-readable
    explanations for major contributing factors.
    """

    insights = []

    # ---------------------------------------------------
    # COMPENSATION
    # ---------------------------------------------------
    compensation = float(data.get("compensation_pending_percent", 0))

    if compensation >= 60:
        insights.append({
            "factor": "Compensation Pending",
            "value": f"{compensation}%",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"{compensation}% of compensation remains pending. "
                "A large pending compensation backlog can delay settlement "
                "with affected landowners and slow the overall acquisition process."
            )
        })

    elif compensation >= 30:
        insights.append({
            "factor": "Compensation Pending",
            "value": f"{compensation}%",
            "severity": "High",
            "impact": "Medium",
            "explanation": (
                f"{compensation}% compensation is still pending. "
                "If unresolved, this backlog may become a significant "
                "land acquisition bottleneck."
            )
        })

    # ---------------------------------------------------
    # PENDING APPROVALS
    # ---------------------------------------------------
    approvals = float(data.get("pending_approvals", 0))

    if approvals >= 5:
        insights.append({
            "factor": "Pending Approvals",
            "value": int(approvals),
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"{int(approvals)} approvals are pending. Multiple unresolved "
                "administrative approvals can block downstream acquisition "
                "and project execution activities."
            )
        })

    elif approvals >= 2:
        insights.append({
            "factor": "Pending Approvals",
            "value": int(approvals),
            "severity": "Medium",
            "impact": "Medium",
            "explanation": (
                f"{int(approvals)} approvals remain pending. These require "
                "continuous tracking to prevent administrative delays."
            )
        })

    # ---------------------------------------------------
    # LEGAL CASES
    # ---------------------------------------------------
    legal_cases = float(data.get("legal_cases", 0))

    if legal_cases >= 5:
        insights.append({
            "factor": "Legal Cases",
            "value": int(legal_cases),
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"{int(legal_cases)} active legal cases are associated with "
                "the project. Legal disputes can restrict acquisition or "
                "possession of affected land parcels."
            )
        })

    elif legal_cases >= 1:
        insights.append({
            "factor": "Legal Cases",
            "value": int(legal_cases),
            "severity": "High",
            "impact": "Medium",
            "explanation": (
                f"{int(legal_cases)} legal case(s) remain active. "
                "Unresolved disputes may introduce uncertainty and delay "
                "the acquisition process."
            )
        })

    # ---------------------------------------------------
    # LAND ACQUIRED
    # ---------------------------------------------------
    land_acquired = float(data.get("land_acquired_percent", 100))

    if land_acquired < 40:
        insights.append({
            "factor": "Land Acquisition Progress",
            "value": f"{land_acquired}%",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"Only {land_acquired}% of the required land has been acquired. "
                "Low acquisition progress indicates that major acquisition "
                "activities are still incomplete and may affect the project schedule."
            )
        })

    elif land_acquired < 70:
        insights.append({
            "factor": "Land Acquisition Progress",
            "value": f"{land_acquired}%",
            "severity": "Medium",
            "impact": "Medium",
            "explanation": (
                f"Land acquisition is currently {land_acquired}% complete. "
                "Progress should be monitored to ensure remaining land is acquired "
                "within planned timelines."
            )
        })

    # ---------------------------------------------------
    # R&R
    # ---------------------------------------------------
    rr_completed = float(data.get("rr_completed_percent", 100))

    if rr_completed < 40:
        insights.append({
            "factor": "R&R Completion",
            "value": f"{rr_completed}%",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"Only {rr_completed}% of rehabilitation and resettlement activities "
                "are complete. Low R&R progress can create social and administrative "
                "barriers to completing land acquisition and possession."
            )
        })

    elif rr_completed < 70:
        insights.append({
            "factor": "R&R Completion",
            "value": f"{rr_completed}%",
            "severity": "Medium",
            "impact": "Medium",
            "explanation": (
                f"R&R completion is {rr_completed}%. Remaining rehabilitation activities "
                "should be closely monitored to avoid future project delays."
            )
        })

    # ---------------------------------------------------
    # POSSESSION
    # ---------------------------------------------------
    possession = float(data.get("possession_percent", 100))

    if possession < 40:
        insights.append({
            "factor": "Land Possession",
            "value": f"{possession}%",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"Only {possession}% land possession has been completed. "
                "Even if land acquisition progresses, low possession availability "
                "can prevent construction or project activities from starting."
            )
        })

    elif possession < 70:
        insights.append({
            "factor": "Land Possession",
            "value": f"{possession}%",
            "severity": "Medium",
            "impact": "Medium",
            "explanation": (
                f"Land possession is {possession}% complete. "
                "Remaining handovers should be tracked to avoid execution delays."
            )
        })

    # ---------------------------------------------------
    # PREVIOUS DELAYS
    # ---------------------------------------------------
    previous_delay = float(data.get("previous_delay_days", 0))

    if previous_delay >= 90:
        insights.append({
            "factor": "Previous Project Delays",
            "value": f"{int(previous_delay)} days",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                f"The project has already experienced {int(previous_delay)} days "
                "of delay. This indicates a history of significant schedule issues "
                "and increases the importance of addressing recurring bottlenecks."
            )
        })

    elif previous_delay >= 30:
        insights.append({
            "factor": "Previous Project Delays",
            "value": f"{int(previous_delay)} days",
            "severity": "High",
            "impact": "Medium",
            "explanation": (
                f"The project has experienced {int(previous_delay)} previous delay days. "
                "Historical causes should be reviewed to prevent recurring schedule issues."
            )
        })

    # ---------------------------------------------------
    # CLEARANCES
    # ---------------------------------------------------
    environmental = str(
        data.get("environmental_clearance", "")
    ).strip().lower()

    if environmental in ["pending", "no", "not approved"]:
        insights.append({
            "factor": "Environmental Clearance",
            "value": "Pending",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                "Environmental clearance is pending. Regulatory approval delays "
                "can block or restrict planned project activities."
            )
        })

    forest = str(
        data.get("forest_clearance", "")
    ).strip().lower()

    if forest in ["pending", "no", "not approved"]:
        insights.append({
            "factor": "Forest Clearance",
            "value": "Pending",
            "severity": "Critical",
            "impact": "High",
            "explanation": (
                "Forest clearance is pending. Delays in required forest approvals "
                "may significantly affect acquisition and project execution timelines."
            )
        })

    return insights


def generate_insights(data, delay_probability=None, predicted_delay_days=None):
    """
    Main function used by FastAPI or Streamlit.
    """

    factor_insights = generate_factor_insights(data)

    recommendations = get_recommendations(data)

    priority_summary = get_priority_summary(recommendations)

    # Critical factors first
    severity_order = {
        "Critical": 1,
        "High": 2,
        "Medium": 3,
        "Low": 4
    }

    factor_insights.sort(
        key=lambda x: severity_order.get(x["severity"], 5)
    )

    return {
        "prediction_summary": {
            "delay_probability": delay_probability,
            "predicted_delay_days": predicted_delay_days,
            "overall_action_priority":
                priority_summary["overall_priority"]
        },

        "ai_summary": priority_summary["message"],

        "top_contributing_factors":
            factor_insights[:5],

        "recommended_actions":
            priority_summary["recommendations"]
    }