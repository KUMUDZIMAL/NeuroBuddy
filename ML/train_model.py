import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# === 1️⃣ Load the dataset ===
file_path = "Mental disorder symptoms (1).xlsx"
df = pd.read_excel(file_path)

print("✅ Dataset loaded successfully!")
print(f"Shape: {df.shape}")
print("Columns:", df.columns.tolist())

# === 2️⃣ Clean column names ===
# Fix the typo in 'ag+1:629e'
if 'ag+1:629e' in df.columns:
    df.rename(columns={'ag+1:629e': 'age'}, inplace=True)

# Ensure target column exists
if 'Disorder' not in df.columns:
    raise ValueError("❌ 'Disorder' column not found. Please check your Excel file.")

# === 3️⃣ Separate features (X) and target (y) ===
X = df.drop(columns=['Disorder'])
y = df['Disorder']

print(f"✅ Features shape: {X.shape}, Target shape: {y.shape}")
print("\nClass distribution:\n", y.value_counts())

# === 4️⃣ Split the dataset ===
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# === 5️⃣ Train the Random Forest model ===
rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight='balanced'  # ✅ handles class imbalance
)
rf_model.fit(X_train, y_train)

# === 6️⃣ Evaluate model ===
y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print("\n🎯 Model Evaluation")
print(f"Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:\n", report)

# === 7️⃣ Save the trained model ===
joblib.dump(rf_model, "mental_disorder_model.pkl")
print("💾 Model saved as 'mental_disorder_model.pkl'")
