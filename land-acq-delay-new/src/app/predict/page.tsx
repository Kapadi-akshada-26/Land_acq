// src/app/predict/page.tsx
import PredictForm from "@/components/predict/PredictForm";

export default function PredictPage() {
  return (
    <div className="max-w-[900px] space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-[#172033] leading-tight">
          Predict Delay Risk
        </h1>
        <p className="text-[13px] text-[#687386] mt-1">
          Enter project parameters below. The prediction runs through FastAPI → XGBoost model → SHAP.
          No risk calculation happens in the browser.
        </p>
      </div>
      <PredictForm />
    </div>
  );
}
