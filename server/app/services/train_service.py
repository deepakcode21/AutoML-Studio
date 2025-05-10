import io
import base64
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from fastapi import UploadFile
from app.utils.preprocessing import (
    drop_constant, drop_high_cardinality, handle_missing,
    encode_categorical, split_features_target, scale_features
)
from app.utils.visualization import get_visualization_plot, get_prediction_plot

async def train_model_service(
    file: UploadFile, model: str, scaler: str,
    split_ratio: float, missing: str, encoding: str
):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # Preprocessing
    df = drop_constant(df)
    df = drop_high_cardinality(df)
    df = handle_missing(df, missing)
    df = encode_categorical(df, encoding)

    # Split
    X, y, feature_names = split_features_target(df)
    X = scale_features(X, scaler)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=(1 - split_ratio), random_state=42
    )

    # Model selection & training
    model_map = {
        "LinearRegression": LinearRegression(),
        "RandomForest": RandomForestRegressor(),
        "DecisionTree": DecisionTreeRegressor()
    }
    selected = model_map.get(model, LinearRegression())
    selected.fit(X_train, y_train)

    # Predict & metrics
    y_pred = selected.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    # Visualization & sample data
    vis = get_visualization_plot(selected, feature_names, model)
    pred_plot = get_prediction_plot(y_test, y_pred)
    sample_rows = pd.DataFrame(X, columns=feature_names).head(5).to_dict(orient="records")

    return {
        "metrics": {"rmse": rmse, "r2": r2, "mae": mae},
        "visualization": vis,
        "prediction_plot": pred_plot,
        "columns": list(feature_names),
        "rows": sample_rows
    }