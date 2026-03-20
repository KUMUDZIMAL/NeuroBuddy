import pandas as pd

# Load dataset
df = pd.read_csv("disorders_eeg_dataset.csv")

# Get first 5 records
top5 = df.head(5)

# Save to Excel
top5.to_excel("top5_records.xlsx", index=False)

print("Top 5 records saved to top5_records.xlsx")