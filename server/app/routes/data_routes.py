# app/routes/data_routes.py

from fastapi import APIRouter, UploadFile, File, Form
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import tempfile

router = APIRouter()

@router.post("/preprocess")
async def preprocess_data(
    file: UploadFile = File(...),
    missing: str = Form(...),
    encoding: str = Form(...),
    scaler: str = Form(...)
):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        df = pd.read_csv(tmp_path)

        # Missing values
        if missing == "mean":
            imputer = SimpleImputer(strategy="mean")
            df[df.columns] = imputer.fit_transform(df)
        elif missing == "drop":
            df = df.dropna()

        # Encoding
        if encoding == "label":
            for col in df.select_dtypes(include=["object"]).columns:
                df[col] = LabelEncoder().fit_transform(df[col])

        # Scaling
        if scaler == "standard":
            scaler_model = StandardScaler()
            df[df.columns] = scaler_model.fit_transform(df)

        # You may want to save preprocessed df to disk or session

        return {"columns": list(df.columns), "rows": df.head(5).to_dict(orient="records")}

    except Exception as e:
        return {"error": str(e)}
