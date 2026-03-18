from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import json
from scipy.signal import welch
from scipy.integrate import trapezoid

app = Flask(__name__)
CORS(app)

# -------------------------
# Load ML model
# -------------------------
try:
    model = joblib.load("eeg_disorder_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    model_loaded = True
    # The model remembers exactly which column names it was trained on
    model_features = model.feature_names_in_.tolist() if hasattr(model, 'feature_names_in_') else None
    print(f"✅ Model loaded. Expecting {model.n_features_in_} features.")
except Exception as e:
    model_loaded = False
    print(f"⚠️ Model error: {e}")

# -------------------------
# Helpers
# -------------------------
def parse_eeg_string(val):
    if isinstance(val, str):
        try:
            cleaned = val.replace('[', '').replace(']', '').split(',')
            return np.array([float(x.strip()) for x in cleaned if x.strip()])
        except:
            return np.array([])
    return np.array([val]) if isinstance(val, (int, float)) else np.array([])

def calculate_cognitive_metrics(eeg_data, fs=250):
    if len(eeg_data) < 10: return None
    nperseg = min(256, len(eeg_data))
    freqs, psd = welch(eeg_data, fs=fs, nperseg=nperseg)

    def band_power(low, high):
        idx = (freqs >= low) & (freqs <= high)
        if np.sum(idx) == 0: return 0
        return trapezoid(psd[idx], freqs[idx])

    theta = band_power(4, 8)
    alpha = band_power(8, 13)
    beta = band_power(13, 30)
    gamma = band_power(30, 45)
    total = theta + alpha + beta + gamma

    if total <= 0: return None

    return {
        "focus": round((beta / total) * 100, 2),
        "calmness": round((alpha / total) * 100, 2),
        "stress": round(((gamma + theta) / total) * 100, 2),
        "bands": {"theta": round(theta, 4), "alpha": round(alpha, 4), "beta": round(beta, 4), "gamma": round(gamma, 4)}
    }

@app.route('/analyze_eeg', methods=['POST'])
def analyze_eeg():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        df = pd.read_csv(file) if file.filename.endswith('.csv') else pd.read_excel(file)

        # 1. Welch Metrics (Always works as long as column exists)
        raw_eeg_col = 'EEG_Electrode_1'
        cognitive_data = None
        if raw_eeg_col in df.columns:
            eeg_series = parse_eeg_string(df[raw_eeg_col].iloc[0])
            cognitive_data = calculate_cognitive_metrics(eeg_series)

        # 2. ML Prediction - Strict Alignment Logic
        if not model_loaded:
            return jsonify({"error": "Model not loaded"}), 500

        # Filter numeric columns exactly like training script
        features_df = df.select_dtypes(include=[np.number])

        # If model has saved feature names, we force the input to match those exactly
        if model_features:
            # Drop columns that weren't in training, add missing ones as 0
            existing_cols = [c for c in model_features if c in features_df.columns]
            final_features = features_df[existing_cols].copy()
            for col in model_features:
                if col not in final_features.columns:
                    final_features[col] = 0
            # Ensure correct order
            final_features = final_features[model_features]
        else:
            # Fallback if feature names aren't available: 
            # Drop common target/ID columns and hope the count matches
            if "disorder/diagnosis" in features_df.columns:
                features_df = features_df.drop(columns=["disorder/diagnosis"])
            final_features = features_df

        actual_count = final_features.shape[1]
        expected_count = model.n_features_in_

        if actual_count == expected_count:
            input_data = final_features.iloc[[0]].values
            prediction = model.predict(input_data)
            probabilities = model.predict_proba(input_data)[0]
            
            disorder = label_encoder.inverse_transform(prediction)[0]
            confidence = round(np.max(probabilities) * 100, 2)
            probs = {label: round(probabilities[i] * 100, 2) for i, label in enumerate(label_encoder.classes_)}
        else:
            disorder = f"Feature Mismatch: Model needs {expected_count} numeric cols, got {actual_count}"
            confidence = 0
            probs = {}

        # 3. Final Response
        return jsonify({
            "predicted_disorder": disorder,
            "confidence": confidence,
            "probabilities": probs,
            "focus": cognitive_data["focus"] if cognitive_data else 0,
            "stress": cognitive_data["stress"] if cognitive_data else 0,
            "relax": cognitive_data["calmness"] if cognitive_data else 0,
            "bands": cognitive_data["bands"] if cognitive_data else {}
        })

    except Exception as e:
        print(f"❌ ERROR: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)