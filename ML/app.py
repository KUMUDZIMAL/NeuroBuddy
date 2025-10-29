from flask import Flask, render_template, request
import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

MODEL_PATH = "mental_disorder_model.pkl"
DATA_PATH = "Mental disorder symptoms (1).xlsx"


# 🧠 Train model if not available
def train_model():
    df = pd.read_excel(DATA_PATH)

    # Fix typo in column name
    if "ag+1:629e" in df.columns:
        df.rename(columns={"ag+1:629e": "age"}, inplace=True)

    if "Disorder" not in df.columns:
        raise ValueError("❌ 'Disorder' column not found!")

    # Separate input and target
    X = df.drop(columns=["Disorder"])
    y = df["Disorder"]

    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=150, random_state=42)
    model.fit(X_train, y_train)

    joblib.dump(model, MODEL_PATH)
    print("✅ Model trained and saved successfully!")
    return model


# 🧩 Load or train model
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ Loaded existing model.")
else:
    model = train_model()

# Get all feature names for input mapping
expected_features = list(model.feature_names_in_)

# 🧩 14 key questions mapped to actual dataset columns
questions = {
    "feeling.nervous": "Do you often feel nervous or anxious?",
    "panic": "Do you experience panic attacks or sudden fear?",
    "breathing.rapidly": "Do you breathe rapidly during stressful moments?",
    "sweating": "Do you sweat excessively even when not physically active?",
    "trouble.in.concentration": "Do you have trouble concentrating on tasks?",
    "having.trouble.in.sleeping": "Do you face trouble sleeping?",
    "hopelessness": "Do you feel hopeless or helpless often?",
    "anger": "Do you get angry or irritated easily?",
    "change.in.eating": "Have you noticed major changes in your eating habits?",
    "suicidal.thought": "Do you sometimes have suicidal thoughts?",
    "feeling.tired": "Do you feel tired even after resting well?",
    "avoids.people.or.activities": "Do you avoid people or activities you once enjoyed?",
    "feeling.negative": "Do you feel negative or guilty without reason?",
    "hallucinations": "Do you experience hallucinations or see things not there?"
}


@app.route("/")
def home():
    return render_template("index.html", questions=questions)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        age = int(request.form.get("age", 0))
    except ValueError:
        age = 0

    # Get user's answers (convert Yes/No → 1/0)
    input_data = {col: 0 for col in expected_features}
    if "age" in expected_features:
        input_data["age"] = age

    for key in questions.keys():
        answer = request.form.get(key)
        if answer == "Yes" and key in input_data:
            input_data[key] = 1

    # Create DataFrame for prediction
    input_df = pd.DataFrame([[input_data[f] for f in expected_features]], columns=expected_features)

    # Predict the disorder
    prediction = model.predict(input_df)[0]

    result = f"🧠 Based on your responses, you may be showing signs of **{prediction}**."

    return render_template("result.html", result=result)


if __name__ == "__main__":
    app.run(debug=True)
