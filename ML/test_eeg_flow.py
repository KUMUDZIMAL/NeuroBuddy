import sys
import os
import io
import json

# Add ML directory to path so we can import main
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from main import app

def test_flow(condition="Depression", confidence=95):
    print(f"\n=== Testing Flow for '{condition}' ===")
    client = app.test_client()
    
    # --- Step 1: Generate EEG Data ---
    payload = {
        "disorders": [
            {"condition": condition, "confidence": 100} # Use 100 to get zero variance
        ]
    }
    
    gen_response = client.post('/generate_eeg', json=payload)
    if gen_response.status_code != 200:
        print(f"FAILED to generate data: {gen_response.data}")
        return
        
    csv_data = gen_response.data
    
    # --- Step 2: Analyze Generated EEG Data ---
    upload_data = {
        'file': (io.BytesIO(csv_data), 'synthetic_eeg.csv')
    }
    
    analyze_response = client.post('/analyze_eeg', data=upload_data, content_type='multipart/form-data')
    
    if analyze_response.status_code == 200:
        result = analyze_response.get_json()
        print(f"Predicted: {result.get('predicted_disorder')} (Confidence: {result.get('confidence')}%)")
    else:
        print(f"FAILED to analyze data: {analyze_response.data}")

if __name__ == "__main__":
    test_flow("Depression", 95)
    test_flow("Anxiety", 85)
    test_flow("ADHD", 90)
    test_flow("Schizophrenia", 99)
    test_flow("Autism", 80)