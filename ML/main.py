from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from scipy.signal import welch
from scipy.integrate import trapezoid
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

# --- Load ML & Embedding Models ---
try:
    model = joblib.load("eeg_disorder_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    # Embedding model for RAG
    embed_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ All Models (ML + Embeddings) Loaded")
except Exception as e:
    print(f"⚠️ Model Error: {e}")

# Helper for EEG Metrics
def calculate_metrics(eeg_data, fs=250):
    if len(eeg_data) < 10: return None
    nperseg = min(256, len(eeg_data))
    freqs, psd = welch(eeg_data, fs=fs, nperseg=nperseg)
    def band_pwr(l, h):
        idx = (freqs >= l) & (freqs <= h)
        return trapezoid(psd[idx], freqs[idx]) if np.sum(idx) > 0 else 0
    t, a, b, g = band_pwr(4,8), band_pwr(8,13), band_pwr(13,30), band_pwr(30,45)
    total = t + a + b + g
    if total <= 0: return None
    return {"focus": round((b/total)*100, 2), "relax": round((a/total)*100, 2), "stress": round(((g+t)/total)*100, 2)}

@app.route('/analyze_eeg', methods=['POST'])
def analyze():
    try:
        file = request.files['file']
        df = pd.read_csv(file) if file.filename.endswith('.csv') else pd.read_excel(file)
        cog = {"focus": 0, "stress": 0, "relax": 0}
        if 'EEG_Electrode_1' in df.columns:
            raw_val = df['EEG_Electrode_1'].iloc[0]
            raw = np.fromstring(raw_val.strip('[]'), sep=',') if isinstance(raw_val, str) else np.array(raw_val)
            cog = calculate_metrics(raw) or cog
        
        feats = df.select_dtypes(include=[np.number])
        # Prediction Logic...
        pred = model.predict(feats.iloc[[0]].values)
        probs = model.predict_proba(feats.iloc[[0]].values)[0]
        disorder = label_encoder.inverse_transform(pred)[0]
        
        return jsonify({
            "predicted_disorder": disorder,
            "confidence": round(np.max(probs)*100, 2),
            "focus": cog["focus"], "stress": cog["stress"], "relax": cog["relax"],
            "timestamp": pd.Timestamp.now().isoformat()
        })
    except Exception as e: return jsonify({"error": str(e)}), 500

# 🔥 NEW: Endpoint for Chatbot to get Vector Embeddings
@app.route('/get_embedding', methods=['POST'])
def get_embedding():
    data = request.json
    text = data.get('text', '')
    if not text: return jsonify({"error": "No text provided"}), 400
    vector = embed_model.encode(text).tolist()
    return jsonify({"vector": vector})

if __name__ == '__main__':
    app.run(debug=True, port=5000)