import base64
import io
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from fastapi import APIRouter, File, Form, UploadFile
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

router = APIRouter()

@router.post("/preprocess")
async def preprocess(
    file: UploadFile = File(...),
    missing: str = Form("drop"),
    encoding: str = Form("none"),
    scaler: str = Form("standard"),
    model: str = Form("LinearRegression"),
    splitRatio: float = Form(0.8),
):
    # Read CSV
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # Handle missing values
    if missing == "drop":
        df.dropna(inplace=True)
    elif missing == "mean":
        df.fillna(df.mean(numeric_only=True), inplace=True)

    # Select numeric columns for simplicity
    df = df.select_dtypes(include=[np.number])
    if df.shape[1] < 2:
        return {"error": "Not enough numeric columns to train a model."}

    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    # Scale data
    scaler_obj = StandardScaler() if scaler == "standard" else MinMaxScaler()
    X_scaled = scaler_obj.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=1 - splitRatio, random_state=42)

    # Model selection
    if model == "LinearRegression":
        model_obj = LinearRegression()
    elif model == "DecisionTree":
        model_obj = DecisionTreeRegressor()
    elif model == "RandomForest":
        model_obj = RandomForestRegressor()
    else:
        return {"error": f"Model '{model}' not supported."}

    # Train and evaluate
    model_obj.fit(X_train, y_train)
    y_pred = model_obj.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    # Feature importance or coefficients
    fig, ax = plt.subplots(figsize=(8, 4))
    if hasattr(model_obj, "feature_importances_"):
        importances = model_obj.feature_importances_
        ax.bar(X.columns, importances)
        ax.set_title("Feature Importance")
    elif hasattr(model_obj, "coef_"):
        coef = model_obj.coef_
        ax.bar(X.columns, coef)
        ax.set_title("Model Coefficients")
    else:
        ax.text(0.5, 0.5, "No visualization available", ha="center")
    ax.set_ylabel("Importance")
    ax.set_xticklabels(X.columns, rotation=45, ha="right")

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()
    plt.close()

    return {
        "metrics": {
            "rmse": rmse,
            "r2": r2,
            "mae": mae,
        },
        "visualization": image_base64,
        "columns": list(df.columns),
        "rows": df.head(5).values.tolist(),
    }
