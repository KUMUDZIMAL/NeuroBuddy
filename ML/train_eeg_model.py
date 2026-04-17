"""
Train EEG disorder prediction model using BRMH dataset.
Uses band power features (delta, theta, alpha, beta, gamma) across 19 electrodes.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Paths
BASE_DIR = Path(__file__).parent.parent
BRMH_PATH = BASE_DIR / "EEG Dataset" / "EEG.machinelearing_data_BRMH.csv"
MODEL_PATH = Path(__file__).parent / "eeg_disorder_model.pkl"
ENCODER_PATH = Path(__file__).parent / "label_encoder.pkl"

print("="*60)
print("EEG Disorder Model Training - BRMH Dataset")
print("="*60)

# Load BRMH dataset
print(f"\nLoading dataset from: {BRMH_PATH}")
df = pd.read_csv(BRMH_PATH)
print(f"Dataset shape: {df.shape}")
print(f"\nColumn names (first 10): {list(df.columns[:10])}")

# Target column - disorder label
target_col = 'specific.disorder'
if target_col not in df.columns:
    print(f"[ERROR] Target column '{target_col}' not found!")
    print(f"Available columns: {df.columns.tolist()}")
    exit(1)

y = df[target_col]

# Get all EEG band power features (AB.* columns)
eeg_columns = [col for col in df.columns if col.startswith('AB.')]
print(f"\nFound {len(eeg_columns)} EEG band power features")
print(f"Feature examples: {eeg_columns[:5]}")

# Keep only numeric EEG features
X = df[eeg_columns].select_dtypes(include=[np.number])
print(f"Using {X.shape[1]} numeric features")

# Check for missing values
if X.isnull().sum().sum() > 0:
    print(f"\n[WARNING] Found {X.isnull().sum().sum()} missing values, filling with 0")
    X = X.fillna(0)

# Disorder distribution
print("\nDisorder distribution:")
disorder_counts = y.value_counts()
for disorder, count in disorder_counts.items():
    print(f"  {disorder}: {count} samples")

# Encode labels
print("\nEncoding disorder labels...")
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
print(f"Number of classes: {len(encoder.classes_)}")
print(f"Classes: {encoder.classes_}")

# Train-test split (80-20)
print("\nSplitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)
print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")

# Train Random Forest model
print("\nTraining Random Forest Classifier...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

model.fit(X_train, y_train)
print("[OK] Model training completed")

# Evaluate model
print("\nEvaluating model performance...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=encoder.classes_, zero_division=0))

# Feature importance (top 10)
print("\nTop 10 Most Important Features:")
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.head(10).iterrows():
    print(f"  {row['feature']}: {row['importance']:.4f}")

# Save model and encoder
print(f"\nSaving model to: {MODEL_PATH}")
joblib.dump(model, MODEL_PATH)
print(f"Saving encoder to: {ENCODER_PATH}")
joblib.dump(encoder, ENCODER_PATH)

print("\n" + "="*60)
print("[SUCCESS] Model trained and saved successfully!")
print("="*60)
print(f"\nModel summary:")
print(f"  - Features: {model.n_features_in_}")
print(f"  - Classes: {len(encoder.classes_)}")
print(f"  - Accuracy: {accuracy*100:.2f}%")
print(f"  - Model file: {MODEL_PATH.name}")
print(f"  - Encoder file: {ENCODER_PATH.name}")
print("="*60)
