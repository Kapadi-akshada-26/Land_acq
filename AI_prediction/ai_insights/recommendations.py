def get_recommendations(data):
    """
    Generate detailed, actionable recommendations for land acquisition risks.
    """

    recommendations = []

    # ---------------------------------------------------
    # 1. COMPENSATION PENDING
    # ---------------------------------------------------
    compensation = float(data.get("compensation_pending_percent", 0))

    if compensation >= 60:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "High Compensation Pending",
            "severity": "Critical",

            "action": "Launch an immediate compensation clearance drive.",

            "steps": [
                "Identify all pending compensation cases.",
                "Verify incomplete bank, ownership and claim documents.",
                "Prioritize cases affecting the largest land area.",
                "Coordinate with finance authorities for faster disbursement.",
                "Review compensation clearance progress every week."
            ],

            "responsible_team": "Land Acquisition Officer and Finance Department",

            "expected_benefit":
                "Faster compensation settlement can reduce resistance from landowners and accelerate acquisition progress."
        })

    elif compensation >= 30:
        recommendations.append({
            "priority": "HIGH PRIORITY",
            "factor": "Moderate Compensation Pending",
            "severity": "High",

            "action": "Prepare a time-bound compensation clearance plan.",

            "steps": [
                "Categorize pending cases by age and amount.",
                "Resolve documentation-related delays.",
                "Set deadlines for compensation verification.",
                "Track unresolved cases through periodic reviews."
            ],

            "responsible_team": "Land Acquisition Office",

            "expected_benefit":
                "Prevent moderate compensation backlog from becoming a major project bottleneck."
        })

    # ---------------------------------------------------
    # 2. PENDING APPROVALS
    # ---------------------------------------------------
    approvals = float(data.get("pending_approvals", 0))

    if approvals >= 5:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Multiple Pending Approvals",
            "severity": "Critical",

            "action": "Escalate pending approvals through an inter-departmental coordination process.",

            "steps": [
                "List every pending approval and its responsible department.",
                "Identify approvals blocking further acquisition activity.",
                "Assign deadlines to responsible authorities.",
                "Escalate approvals that exceed the expected processing time.",
                "Conduct weekly approval status reviews."
            ],

            "responsible_team": "Project Management Unit and Concerned Government Departments",

            "expected_benefit":
                "Reducing approval backlog can remove administrative bottlenecks and prevent project execution delays."
        })

    elif approvals >= 2:
        recommendations.append({
            "priority": "MONITOR",
            "factor": "Pending Approvals",
            "severity": "Medium",

            "action": "Monitor pending approvals through milestone-based tracking.",

            "steps": [
                "Assign expected completion dates.",
                "Track approval status weekly.",
                "Send alerts when deadlines are exceeded."
            ],

            "responsible_team": "Project Monitoring Team",

            "expected_benefit":
                "Early monitoring can prevent approvals from becoming critical delays."
        })

    # ---------------------------------------------------
    # 3. LEGAL CASES
    # ---------------------------------------------------
    legal_cases = float(data.get("legal_cases", 0))

    if legal_cases >= 5:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "High Number of Legal Cases",
            "severity": "Critical",

            "action": "Create a dedicated legal risk resolution strategy.",

            "steps": [
                "Categorize cases based on their impact on land acquisition.",
                "Prioritize cases blocking possession or acquisition.",
                "Verify land records and ownership documents.",
                "Coordinate with legal authorities for case tracking.",
                "Maintain a case-wise resolution dashboard."
            ],

            "responsible_team": "Legal Department and Land Records Authority",

            "expected_benefit":
                "Faster resolution of high-impact cases can unblock stalled acquisition activities."
        })

    elif legal_cases >= 1:
        recommendations.append({
            "priority": "HIGH PRIORITY",
            "factor": "Active Legal Cases",
            "severity": "High",

            "action": "Monitor and prioritize legal disputes affecting critical land parcels.",

            "steps": [
                "Identify acquisition activities affected by each case.",
                "Track court hearing dates.",
                "Prioritize cases affecting high-value project sections."
            ],

            "responsible_team": "Legal Department",

            "expected_benefit":
                "Focused case management can reduce the risk of prolonged legal delays."
        })

    # ---------------------------------------------------
    # 4. LOW LAND ACQUISITION
    # ---------------------------------------------------
    land_acquired = float(data.get("land_acquired_percent", 100))

    if land_acquired < 40:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Low Land Acquisition Progress",
            "severity": "Critical",

            "action": "Perform an immediate acquisition bottleneck analysis.",

            "steps": [
                "Identify villages or parcels with the lowest acquisition progress.",
                "Separate compensation, ownership and legal issues.",
                "Prioritize land parcels critical for project execution.",
                "Assign officers to unresolved acquisition clusters.",
                "Set weekly land acquisition targets."
            ],

            "responsible_team": "Land Acquisition Officer and Project Management Unit",

            "expected_benefit":
                "Targeted intervention can accelerate acquisition of land required for critical project activities."
        })

    elif land_acquired < 70:
        recommendations.append({
            "priority": "MONITOR",
            "factor": "Moderate Land Acquisition Progress",
            "severity": "Medium",

            "action": "Strengthen progress monitoring and milestone tracking.",

            "steps": [
                "Set weekly acquisition targets.",
                "Identify slow-performing regions.",
                "Review progress against the project schedule."
            ],

            "responsible_team": "Project Monitoring Team",

            "expected_benefit":
                "Continuous monitoring can prevent the project from falling behind schedule."
        })

    # ---------------------------------------------------
    # 5. LOW R&R COMPLETION
    # ---------------------------------------------------
    rr_completed = float(data.get("rr_completed_percent", 100))

    if rr_completed < 40:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Low Rehabilitation and Resettlement Completion",
            "severity": "Critical",

            "action": "Accelerate rehabilitation and resettlement implementation.",

            "steps": [
                "Identify affected families awaiting rehabilitation support.",
                "Verify pending rehabilitation benefits.",
                "Prioritize displaced families.",
                "Track R&R completion through family-level milestones."
            ],

            "responsible_team": "R&R Department and District Administration",

            "expected_benefit":
                "Improved R&R completion can reduce social and administrative barriers to land possession."
        })

    elif rr_completed < 70:
        recommendations.append({
            "priority": "MONITOR",
            "factor": "Moderate R&R Progress",
            "severity": "Medium",

            "action": "Track R&R milestones and prevent further backlog.",

            "steps": [
                "Review pending families.",
                "Set monthly completion targets.",
                "Escalate delayed benefit delivery."
            ],

            "responsible_team": "R&R Department",

            "expected_benefit":
                "Early intervention can prevent rehabilitation backlog from delaying possession."
        })

    # ---------------------------------------------------
    # 6. LOW POSSESSION
    # ---------------------------------------------------
    possession = float(data.get("possession_percent", 100))

    if possession < 40:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Low Land Possession Progress",
            "severity": "Critical",

            "action": "Identify and resolve barriers preventing transfer of land possession.",

            "steps": [
                "Identify parcels where acquisition is complete but possession is pending.",
                "Check for legal or compensation-related barriers.",
                "Coordinate with district authorities.",
                "Prioritize possession of land required for immediate construction."
            ],

            "responsible_team": "Land Acquisition Authority and District Administration",

            "expected_benefit":
                "Increasing possession availability can enable project construction activities to begin on time."
        })

    # ---------------------------------------------------
    # 7. PREVIOUS DELAYS
    # ---------------------------------------------------
    previous_delay = float(data.get("previous_delay_days", 0))

    if previous_delay >= 90:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Major Previous Delays",
            "severity": "Critical",

            "action": "Conduct a root-cause analysis of historical delays.",

            "steps": [
                "Identify the causes of previous delays.",
                "Determine whether the same issues are still active.",
                "Assign ownership for unresolved bottlenecks.",
                "Create a corrective action plan.",
                "Track recurring risks weekly."
            ],

            "responsible_team": "Project Management Unit",

            "expected_benefit":
                "Addressing recurring delay causes can prevent the project from repeating previous failures."
        })

    elif previous_delay >= 30:
        recommendations.append({
            "priority": "HIGH PRIORITY",
            "factor": "History of Project Delays",
            "severity": "High",

            "action": "Review historical delays and implement preventive controls.",

            "steps": [
                "Analyze previous delay patterns.",
                "Monitor recurring bottlenecks.",
                "Set early-warning thresholds."
            ],

            "responsible_team": "Project Monitoring Team",

            "expected_benefit":
                "Historical analysis can help identify risks before they become major delays."
        })

    # ---------------------------------------------------
    # 8. ENVIRONMENTAL CLEARANCE
    # ---------------------------------------------------
    environmental = str(
        data.get("environmental_clearance", "")
    ).strip().lower()

    if environmental in ["pending", "no", "not approved"]:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Environmental Clearance Pending",
            "severity": "Critical",

            "action": "Accelerate environmental clearance coordination.",

            "steps": [
                "Identify missing clearance requirements.",
                "Complete pending documentation.",
                "Coordinate with the concerned environmental authority.",
                "Track application status and expected approval date."
            ],

            "responsible_team": "Environmental Compliance Team",

            "expected_benefit":
                "Timely clearance can prevent regulatory restrictions from delaying project activities."
        })

    # ---------------------------------------------------
    # 9. FOREST CLEARANCE
    # ---------------------------------------------------
    forest = str(
        data.get("forest_clearance", "")
    ).strip().lower()

    if forest in ["pending", "no", "not approved"]:
        recommendations.append({
            "priority": "ACT NOW",
            "factor": "Forest Clearance Pending",
            "severity": "Critical",

            "action": "Initiate priority coordination for forest clearance.",

            "steps": [
                "Verify forest land requirements.",
                "Check pending compliance documents.",
                "Coordinate with the Forest Department.",
                "Monitor approval status through milestone tracking."
            ],

            "responsible_team": "Project Authority and Forest Department Coordination Team",

            "expected_benefit":
                "Resolving forest clearance issues can prevent major regulatory delays."
        })

    # ---------------------------------------------------
    # NO MAJOR RISK
    # ---------------------------------------------------
    if not recommendations:
        recommendations.append({
            "priority": "STABLE",
            "factor": "No Major Risk Factor Detected",
            "severity": "Low",

            "action": "Continue regular project monitoring.",

            "steps": [
                "Track key acquisition metrics regularly.",
                "Monitor for new legal or approval issues.",
                "Review project progress against planned milestones."
            ],

            "responsible_team": "Project Monitoring Team",

            "expected_benefit":
                "Regular monitoring helps maintain stable project execution."
        })

    return recommendations