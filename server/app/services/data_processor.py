# app/services/data_processor.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

def process_data(file_path):
    try:
        df = pd.read_csv(file_path)

        # Handle missing values
        df.fillna(df.mean(numeric_only=True), inplace=True)
        df.fillna("Unknown", inplace=True)

        # Encode categoricals
        label_encoders = {}
        for col in df.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            label_encoders[col] = le

        # Scale data
        scaler = StandardScaler()
        df[df.columns] = scaler.fit_transform(df[df.columns])

        # Save processed file if needed
        df.to_csv(file_path, index=False)

        return df, "CSV uploaded and processed successfully!"
    
    except Exception as e:
        return None, f"Error: {str(e)}"
