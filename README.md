# 🚀 Land Acquisition Delay Prediction Platform

### Smart India Hackathon (SIH) 2026 – Problem Statement PS26017

> **AI-powered Decision Support Platform for Predicting Land Acquisition Delays**

![SIH](https://img.shields.io/badge/SIH-2026-blue)
![Status](https://img.shields.io/badge/Status-MVP-success)
![Python](https://img.shields.io/badge/Python-3.11+-yellow)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Streamlit](https://img.shields.io/badge/Streamlit-Dashboard-red)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📌 Overview

Land acquisition is one of the biggest causes of delays in infrastructure projects across India. Manual monitoring makes it difficult to identify high-risk projects before delays become critical.

Our solution is an **AI-enabled decision support platform** that predicts potential land acquisition delays, identifies risky projects, explains the reasons behind predictions, visualizes affected locations on maps, and generates actionable reports for faster decision-making.

The platform combines **Machine Learning, GIS visualization, Explainable AI, and interactive analytics** into one unified dashboard.

---

## 🎯 Problem Statement

**PS26017 – AI-Based Predictive Platform for Land Acquisition Delays**

### Expected Solution

The platform should:

* Predict project delays using AI/ML.
* Identify projects with high delay probability.
* Generate project-wise risk scores.
* Provide explainable insights behind predictions.
* Visualize affected regions geographically.
* Support faster government decision-making.

---

## ✨ Key Features

### 🤖 AI Delay Prediction

* Predicts whether a project is likely to face delays.
* Generates probability scores.
* Risk categorization:

  * 🟢 Low
  * 🟡 Medium
  * 🔴 High

### 📊 Smart Analytics Dashboard

* Real-time project statistics
* Delay distribution
* Risk trends
* District-wise summaries
* Interactive charts

### 🗺 GIS Project Mapping

* OpenStreetMap integration
* Project location visualization
* Color-coded risk markers
* Regional delay hotspots

### 🧠 Explainable AI

Instead of only saying **"High Risk"**, the system explains **why**.

Example:

> "Delay risk increased because compensation approval is pending and legal dispute probability is high."

### 📄 Automated Reports

Generate downloadable reports containing:

* Risk score
* Prediction
* Key insights
* Project summary

---

## 🏗 System Architecture

<pre>
                Historical Project Data
                         │
                         ▼
                Data Preprocessing
                         │
                         ▼
               Machine Learning Model
                  (Random Forest)
                         │
        ┌────────────────┴──────────────┐
        ▼                               ▼
   Risk Prediction                Explainable AI
        │                               │
        └──────────────┬────────────────┘
                       ▼
                 FastAPI Backend
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Dashboard        GIS Map       PDF Reports
(Streamlit)      (Folium)       (ReportLab)
</pre>

---

## 🛠 Technology Stack

| Category | Technology             |
| -------- | ---------------------- |
| Frontend | Streamlit              |
| Backend  | FastAPI                |
| ML       | Scikit-learn           |
| Language | Python                 |
| Data     | Pandas, NumPy          |
| Maps     | Folium + OpenStreetMap |
| Charts   | Plotly                 |
| Reports  | ReportLab              |
| Model    | Random Forest          |

---

## 📂 Project Structure

<pre>
land-acquisition-dashboard/
│
├── backend/
│   ├── main.py
│   ├── model.pkl
│   ├── scaler.pkl
│   └── utils.py
│
├── frontend/
│   ├── app.py
│   ├── dashboard.py
│   └── components/
│
├── model/
│   ├── train_model.py
│   ├── preprocessing.py
│   └── notebooks/
│
├── data/
│   ├── sample_data.csv
│   └── processed_data.csv
│
├── reports/
│
├── assets/
│   ├── screenshots/
│   └── logo.png
│
├── requirements.txt
├── README.md
└── LICENSE
</pre>

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/land-acquisition-dashboard.git

cd land-acquisition-dashboard
```

### Create Virtual Environment

```bash
python -m venv .venv
```

Activate it:

**Windows**

```bash
.venv\Scripts\activate
```

**Linux/Mac**

```bash
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶ Running the Project

### Start FastAPI Backend

```bash
uvicorn backend.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

API Docs:

```text
http://127.0.0.1:8000/docs
```

### Launch Streamlit Dashboard

```bash
streamlit run frontend/app.py
```

---

## 📈 Machine Learning Pipeline

### Steps

1. Data Collection
2. Data Cleaning
3. Feature Engineering
4. Model Training
5. Risk Prediction
6. Explainable Insights
7. Dashboard Visualization

### Input Features

Examples include:

* Project Cost
* Project Type
* District
* Compensation Status
* Legal Dispute Status
* Approval Status
* Land Area
* Previous Delay History

### Model Output

| Output      | Example              |
| ----------- | -------------------- |
| Prediction  | Delay Likely         |
| Probability | 87%                  |
| Risk Score  | High                 |
| Explanation | Compensation pending |

---

## 🌍 GIS Visualization

The platform uses **Folium** with **OpenStreetMap** to display project locations.

Features include:

* District markers
* Risk-colored pins
* Regional delay clusters
* Interactive popups

---

## 📊 Dashboard Modules

* Project Overview
* Risk Distribution
* Delay Predictions
* District Analytics
* GIS Map
* AI Insights
* Report Download

---

## 🔌 API Endpoints

### Health Check

```http
GET /
```

### Predict Delay

```http
POST /predict
```

Example request:

```json
{
  "project_cost": 1200,
  "land_area": 45,
  "legal_dispute": 1,
  "compensation_pending": 1
}
```

Example response:

```json
{
  "prediction": "High Risk",
  "probability": 0.87,
  "reason": "Compensation approval is pending."
}
```

---

## 📸 Screenshots

> Replace these with actual project screenshots before submission.

### Dashboard

<img src="assets/screenshots/dashboard.png" width="100%" alt="Dashboard"/>

### GIS Map

<img src="assets/screenshots/map.png" width="100%" alt="Map"/>

### Prediction Page

<img src="assets/screenshots/prediction.png" width="100%" alt="Prediction"/>

---

## 👥 Team Technologic

| Member             | Responsibility                                    |
| ------------------ | ------------------------------------------------- |
| **Akshada Kapadi** | Team Lead • Backend Development • API Integration |
| **Atharva**        | AI/ML Model Development                           |
| **Divya**          | Frontend & Dashboard                              |
| **Riya**           | GIS & Mapping                                     |
| **Ayush**          | Explainable AI                                    |
| **Maithili**       | Data Processing & Documentation                   |

---

## 🚀 Future Scope

* Real PM Gati Shakti integration
* Government dashboard deployment
* Live project monitoring
* Satellite imagery support
* LLM-powered policy recommendations
* Mobile application
* Multi-language support

---

## 🏆 Why Our Solution is Different

Unlike conventional dashboards that only display project status, our platform proactively predicts delays before they become critical.

**Unique Highlights**

* AI-based early delay prediction
* Explainable AI reasoning
* GIS hotspot visualization
* Risk prioritization
* Interactive decision-support dashboard
* Automated reporting

---

## 📜 License

This project is developed for **Smart India Hackathon 2026**.

Licensed under the **MIT License**.

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

> **Built with AI, Data Science, and GIS for SIH 2026 by Team Technologic.**
