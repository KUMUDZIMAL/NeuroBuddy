import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("disorders_eeg_dataset.csv")

print("Columns:", df.columns)

# Target column
y = df["disorder/diagnosis"]

# Drop label column
X = df.drop("disorder/diagnosis", axis=1)

# Keep only numeric columns
X = X.select_dtypes(include=['number'])

print("Features used:", X.columns)

# Encode labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# Save model
joblib.dump(model, "eeg_disorder_model.pkl")
joblib.dump(encoder, "label_encoder.pkl")

print("Model trained successfully")