def get_priority_summary(recommendations):
    """
    Analyze all recommendations and determine
    the overall action priority for the project.
    """

    priority_rank = {
        "ACT NOW": 1,
        "HIGH PRIORITY": 2,
        "MONITOR": 3,
        "STABLE": 4
    }

    # If no recommendations are available
    if not recommendations:
        return {
            "overall_priority": "STABLE",
            "message": (
                "No major risk factors were detected. "
                "Continue regular monitoring of the project."
            ),
            "recommendations": []
        }

    # Sort recommendations according to priority
    sorted_recommendations = sorted(
        recommendations,
        key=lambda item: priority_rank.get(
            item.get("priority", "STABLE"), 5
        )
    )

    # Highest priority recommendation
    highest_priority = sorted_recommendations[0]["priority"]

    # Count risk levels
    critical_count = sum(
        1 for item in recommendations
        if item.get("severity") == "Critical"
    )

    high_count = sum(
        1 for item in recommendations
        if item.get("severity") == "High"
    )

    medium_count = sum(
        1 for item in recommendations
        if item.get("severity") == "Medium"
    )

    # Generate intelligent overall summary
    if highest_priority == "ACT NOW":

        if critical_count >= 3:
            message = (
                f"Critical intervention is required. "
                f"{critical_count} major risk factors are currently "
                "affecting the land acquisition process. "
                "Immediate action should be taken to prevent significant project delays."
            )
        else:
            message = (
                f"Immediate attention is required. "
                f"{critical_count} critical risk factor(s) have been detected. "
                "The responsible departments should begin corrective action immediately."
            )

    elif highest_priority == "HIGH PRIORITY":
        message = (
            f"The project has {high_count} high-risk factor(s). "
            "These issues should be addressed on priority before they "
            "develop into major schedule delays."
        )

    elif highest_priority == "MONITOR":
        message = (
            f"The project currently has {medium_count} moderate risk factor(s). "
            "No immediate critical intervention is required, but continuous "
            "monitoring is recommended."
        )

    else:
        message = (
            "The project appears stable based on the currently analyzed "
            "risk factors. Continue regular monitoring."
        )

    return {
        "overall_priority": highest_priority,
        "message": message,
        "recommendations": sorted_recommendations
    }