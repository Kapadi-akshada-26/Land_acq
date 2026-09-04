from insights import generate_insights


# Sample land acquisition project data
sample_data = {
    "compensation_pending_percent": 70,
    "pending_approvals": 6,
    "legal_cases": 4,
    "land_acquired_percent": 35,
    "rr_completed_percent": 45,
    "possession_percent": 30,
    "previous_delay_days": 120,
    "environmental_clearance": "Pending",
    "forest_clearance": "Approved"
}


# Simulated prediction from ML model
delay_probability = 82
predicted_delay_days = 150


# Generate AI insights
result = generate_insights(
    data=sample_data,
    delay_probability=delay_probability,
    predicted_delay_days=predicted_delay_days
)


# -----------------------------------------
# PRINT RESULTS
# -----------------------------------------

print("\n" + "=" * 60)
print("LAND ACQUISITION AI INSIGHTS REPORT")
print("=" * 60)


# Prediction summary
print("\nPREDICTION SUMMARY")
print("-" * 60)

prediction = result["prediction_summary"]

print(f"Delay Probability: {prediction['delay_probability']}%")
print(f"Predicted Delay Days: {prediction['predicted_delay_days']}")
print(f"Overall Action Priority: {prediction['overall_action_priority']}")


# AI summary
print("\nAI SUMMARY")
print("-" * 60)
print(result["ai_summary"])


# Contributing factors
print("\nTOP CONTRIBUTING FACTORS")
print("-" * 60)

for index, factor in enumerate(
    result["top_contributing_factors"],
    start=1
):
    print(f"\n{index}. {factor['factor']}")
    print(f"   Current Value: {factor['value']}")
    print(f"   Severity: {factor['severity']}")
    print(f"   Impact: {factor['impact']}")
    print(f"   Why it matters: {factor['explanation']}")


# Recommended actions
print("\n" + "=" * 60)
print("RECOMMENDED ACTIONS")
print("=" * 60)

for index, recommendation in enumerate(
    result["recommended_actions"],
    start=1
):
    print(f"\n{index}. {recommendation['factor']}")
    print(f"   Priority: {recommendation['priority']}")
    print(f"   Severity: {recommendation['severity']}")
    print(f"   Action: {recommendation['action']}")
    print(f"   Responsible Team: {recommendation['responsible_team']}")

    print("\n   Steps:")
    for step_number, step in enumerate(
        recommendation["steps"],
        start=1
    ):
        print(f"      {step_number}. {step}")

    print(
        f"\n   Expected Benefit: "
        f"{recommendation['expected_benefit']}"
    )


print("\n" + "=" * 60)
print("AI INSIGHTS MODULE TEST COMPLETED SUCCESSFULLY")
print("=" * 60) 