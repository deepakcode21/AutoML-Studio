# app/routes/model_routes.py
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import tempfile

router = APIRouter()

@router.post("/process/")
async def process_all(
    file: UploadFile = File(...),
    model: str = Form(...),
    scaler: str = Form(...),
    splitRatio: float = Form(...),
    missing: str = Form(...),
    encoding: str = Form(...)
):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        df = pd.read_csv(tmp_path)

        # Missing value handling
        if missing == "mean":
            df[df.columns] = SimpleImputer(strategy="mean").fit_transform(df)
        elif missing == "drop":
            df = df.dropna()

        # Encoding
        if encoding == "label":
            for col in df.select_dtypes(include=["object"]).columns:
                df[col] = LabelEncoder().fit_transform(df[col])

        # Scaling
        if scaler == "standard":
            df[df.columns] = StandardScaler().fit_transform(df)

        # Split
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=splitRatio)

        # Model
        if model == "linear":
            reg = LinearRegression()
        elif model == "tree":
            reg = DecisionTreeRegressor()
        elif model == "forest":
            reg = RandomForestRegressor()
        else:
            return JSONResponse({"error": "Unsupported model"}, status_code=400)

        reg.fit(X_train, y_train)
        preds = reg.predict(X_test)

        return {
            "rmse": mean_squared_error(y_test, preds, squared=False),
            "r2_score": r2_score(y_test, preds),
            "message": "Success",
            "model_used": model
        }

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
