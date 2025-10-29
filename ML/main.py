# # =====================================================
# #   EEG Focus–Stress–Relaxation Metrics (ADHD vs Control)
# # =====================================================

# from scipy.io import loadmat
# from scipy.signal import welch
# import numpy as np
# import matplotlib.pyplot as plt

# # --- 1. Load Dataset Files ---
# adhd_data = loadmat("FADHD.mat")["FADHD"]   # Filtered ADHD EEGs
# ctrl_data = loadmat("FC.mat")["FC"]         # Filtered Control EEGs

# # --- 2. Select one subject from each group ---
# adhd_subject = adhd_data[0, 0]
# ctrl_subject = ctrl_data[0, 0]

# # --- 3. Convert to numeric arrays ---
# adhd_signal = np.array(adhd_subject).squeeze()
# ctrl_signal = np.array(ctrl_subject).squeeze()

# print("✅ Data Loaded Successfully")
# print("ADHD signal shape:", adhd_signal.shape)
# print("Control signal shape:", ctrl_signal.shape)

# # --- 4. Sampling rate ---
# fs = 256  # Hz (adjust if dataset specifies differently)

# # --- 5. Function for band power computation ---
# def compute_bandpowers(signal, fs):
#     f, Pxx = welch(signal, fs=fs, nperseg=min(1024, len(signal)))

#     def bandpower(Pxx, f, fmin, fmax):
#         idx = np.logical_and(f >= fmin, f <= fmax)
#         return np.trapz(Pxx[idx], f[idx])

#     theta = bandpower(Pxx, f, 4, 8)
#     alpha = bandpower(Pxx, f, 8, 13)
#     beta  = bandpower(Pxx, f, 13, 30)
#     gamma = bandpower(Pxx, f, 30, 45)
#     return theta, alpha, beta, gamma

# # --- 6. Select one subject & one channel ---
# subject_index = 0   # change 0→10 for other subjects
# channel_index = 0   # 0 or 1 (since you have 2 channels)

# adhd_one = adhd_signal[subject_index, :, channel_index]
# ctrl_one = ctrl_signal[subject_index, :, channel_index]

# print(f"Using ADHD subject {subject_index+1}, channel {channel_index+1}")
# print("Signal lengths:", len(adhd_one), len(ctrl_one))

# # --- 7. Compute Band Powers ---
# theta_a, alpha_a, beta_a, gamma_a = compute_bandpowers(adhd_one, fs)
# theta_c, alpha_c, beta_c, gamma_c = compute_bandpowers(ctrl_one, fs)

# # --- 8. Compute Metrics ---
# focus_a = beta_a / (theta_a + 1e-6)
# focus_c = beta_c / (theta_c + 1e-6)
# stress_a = beta_a + gamma_a
# stress_c = beta_c + gamma_c
# relax_a = alpha_a
# relax_c = alpha_c

# # --- 9. Print Results ---
# print("\n===== EEG-Derived Metrics =====")
# print(f"ADHD Subject → Focus: {focus_a:.4f}, Stress: {stress_a:.4f}, Relaxation: {relax_a:.4f}")
# print(f"Control Subject → Focus: {focus_c:.4f}, Stress: {stress_c:.4f}, Relaxation: {relax_c:.4f}")

# # --- 10. Plot EEG signals ---
# plt.figure(figsize=(12, 4))
# plt.plot(adhd_one[:2000], label="ADHD (Ch1)", alpha=0.7)
# plt.plot(ctrl_one[:2000], label="Control (Ch1)", alpha=0.7)
# plt.title("EEG Signal Comparison (First 2000 Samples)")
# plt.xlabel("Time")
# plt.ylabel("EEG Amplitude (µV)")
# plt.legend()
# plt.tight_layout()
# plt.show()

# # --- 11. Plot comparison of metrics ---
# metrics = ['Focus', 'Stress', 'Relaxation']
# adhd_vals = [focus_a, stress_a, relax_a]
# ctrl_vals = [focus_c, stress_c, relax_c]

# x = np.arange(len(metrics))
# plt.figure(figsize=(8, 5))
# plt.bar(x - 0.2, adhd_vals, width=0.4, label="ADHD", color='salmon')
# plt.bar(x + 0.2, ctrl_vals, width=0.4, label="Control", color='skyblue')
# plt.xticks(x, metrics)
# plt.ylabel("Value")
# plt.title("EEG-Based Cognitive Metrics: ADHD vs Control")
# plt.legend()
# plt.tight_layout()
# plt.show()
# app.py
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from scipy.signal import welch
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return "EEG Analyzer API is running ✅"

@app.route('/analyze_eeg', methods=['POST'])
def analyze_eeg():
    try:
        print("➡️ Request received for /analyze_eeg")

        if 'file' not in request.files:
            print("❌ No file part in request")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        print(f"📄 Uploaded file: {file.filename}")

        if not file.filename.endswith('.xlsx'):
            return jsonify({"error": "Invalid file type"}), 400

        # Read Excel
        df = pd.read_excel(file, header=None)
        print(f"✅ Loaded Excel. Shape: {df.shape}")

        # Extract all numbers from nested arrays or mixed cells
        all_numbers = []
        for col in df.columns:
            for val in df[col]:
                if pd.isna(val):
                    continue
                # Convert values like "[[12.3 -4.5] [7.1 8.2]]" → list of floats
                numbers = re.findall(r"[-+]?\d*\.\d+|\d+", str(val))
                if numbers:
                    all_numbers.extend(map(float, numbers))

        eeg_data = np.array(all_numbers)
        print(f"📊 Extracted EEG samples: {len(eeg_data)}")

        if eeg_data.size == 0:
            return jsonify({"error": "No valid EEG data found"}), 400

        fs = 250  # assumed sampling rate
        freqs, psd = welch(eeg_data, fs=fs, nperseg=1024)

        def band_power(low, high):
            idx = np.logical_and(freqs >= low, freqs <= high)
            return np.trapz(psd[idx], freqs[idx])

        theta = band_power(4, 8)
        alpha = band_power(8, 13)
        beta = band_power(13, 30)
        gamma = band_power(30, 45)

        total = theta + alpha + beta + gamma
        if total == 0:
            return jsonify({"error": "EEG signal too weak"}), 400

        focus = round((beta / total) * 100, 2)
        relax = round((alpha / total) * 100, 2)
        stress = round((theta / total) * 100, 2)

        print(f"✅ Focus: {focus}%, Relax: {relax}%, Stress: {stress}%")

        return jsonify({
            "focus": focus,
            "relax": relax,
            "stress": stress,
            "bands": {
                "theta": round(theta, 4),
                "alpha": round(alpha, 4),
                "beta": round(beta, 4),
                "gamma": round(gamma, 4)
            }
        })

    except Exception as e:
        print("🔥 Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

