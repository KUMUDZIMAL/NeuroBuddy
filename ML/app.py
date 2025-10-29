from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
from flask_cors import CORS
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app, supports_credentials=True,
     origins=["http://localhost:3000", "http://127.0.0.1:3000"])

MODEL_PATH = "mental_disorder_model.pkl"
DATA_PATH = "Mental disorder symptoms (1).xlsx"


# 🧠 Train model if not available
def train_model():
    df = pd.read_excel(DATA_PATH)

    # Fix typo if any
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

expected_features = list(model.feature_names_in_)

# 🧩 All 28 questions (mapped to dataset columns)
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
    "hallucinations": "Do you experience hallucinations or see things not there?",
    "excessive.worry": "Do you worry excessively about everyday matters?",
    "difficulty.relaxing": "Do you find it hard to relax even in calm situations?",
    "fear.of.losing.control": "Do you fear losing control or going crazy?",
    "social.withdrawal": "Do you withdraw from social activities or gatherings?",
    "irritability": "Do you get irritated by small things frequently?",
    "feeling.empty": "Do you often feel emotionally empty or numb?",
    "lack.of.motivation": "Do you lack motivation to start or finish tasks?",
    "racing.thoughts": "Do you experience racing or uncontrollable thoughts?",
    "low.self.esteem": "Do you often feel worthless or not good enough?",
    "feeling.disconnected": "Do you feel disconnected from reality or people?",
    "trouble.making.decisions": "Do you have trouble making even simple decisions?",
    "restlessness": "Do you feel restless most of the time?",
    "difficulty.remembering": "Do you have difficulty remembering recent things?",
    "excessive.fatigue": "Do you feel tired almost all the time?"
}


@app.route("/")
def home():
    return render_template("index.html", questions=questions)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    try:
        age = int(data.get("age", 0))
    except (ValueError, TypeError):
        age = 0

    # initialize all features with 0
    input_data = {col: 0 for col in expected_features}
    if "age" in expected_features:
        input_data["age"] = age

    # map answers
    for i, key in enumerate(questions.keys(), start=1):
        ans = data.get(f"q{i}")
        if ans and ans.lower() == "yes" and key in input_data:
            input_data[key] = 1

    # create dataframe
    input_df = pd.DataFrame([[input_data[f] for f in expected_features]], columns=expected_features)

    # make prediction
    prediction = model.predict(input_df)[0]
    result = f"🧠 Based on your responses, you are showing signs of {prediction}."

    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True)
