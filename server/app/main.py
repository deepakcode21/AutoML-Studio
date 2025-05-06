

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sklearn.model_selection import train_test_split
from app.routes import data_routes
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pandas as pd
import numpy as np
import io
import matplotlib.pyplot as plt
import base64

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_routes.router)

@app.post("/train")
async def train_model(
    file: UploadFile = File(...),
    model: str = Form(...),
    scaler: str = Form(...),
    splitRatio: float = Form(...),
    missing: str = Form(...),
    encoding: str = Form(...)
):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        # Drop constant columns
        df = df.loc[:, df.apply(pd.Series.nunique) > 1]

        # Drop high-cardinality text columns
        for col in df.select_dtypes(include='object').columns:
            if df[col].nunique() > 50:
                df.drop(columns=[col], inplace=True)

        # Handle missing values
        if missing == "drop":
            df.dropna(inplace=True)
        else:
            for col in df.select_dtypes(include=np.number).columns:
                if missing == "mean":
                    df[col].fillna(df[col].mean(), inplace=True)
                elif missing == "median":
                    df[col].fillna(df[col].median(), inplace=True)
                elif missing == "zero":
                    df[col].fillna(0, inplace=True)

        # Label encoding
        # Save target column name
        target_col = df.columns[-1]

        # One-Hot or Label Encoding
        if encoding == "label":
            for col in df.select_dtypes(include='object').columns:
                df[col] = LabelEncoder().fit_transform(df[col])
        elif encoding == "onehot":
            df = pd.get_dummies(df, drop_first=True)

        # Split features and target after encoding
        X = df.drop(columns=[target_col])
        y = df[target_col]


        feature_names = df.columns[:-1]

        # Scale features
        if scaler == "standard":
            X = StandardScaler().fit_transform(X)
        elif scaler == "minmax":
            X = MinMaxScaler().fit_transform(X)
        elif scaler == "robust":
            X = RobustScaler().fit_transform(X)

        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=(1 - splitRatio), random_state=42)

        # Model selection
        model_map = {
            "LinearRegression": LinearRegression(),
            "RandomForest": RandomForestRegressor(),
            "DecisionTree": DecisionTreeRegressor()
        }
        selected_model = model_map.get(model, LinearRegression())
        selected_model.fit(X_train, y_train)

        # Predictions
        y_pred = selected_model.predict(X_test)

        # Metrics
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)

        # Visualization (feature importance or coefficients)
        def get_visualization_plot(model, columns, model_name):
            plt.figure(figsize=(8, 6))
            if model_name in ["RandomForest", "DecisionTree"] and hasattr(model, "feature_importances_"):
                plt.barh(columns, model.feature_importances_)
                plt.xlabel("Importance")
                plt.title("Feature Importance")
            elif model_name == "LinearRegression" and hasattr(model, "coef_"):
                plt.barh(columns, model.coef_)
                plt.xlabel("Coefficient Value")
                plt.title("Linear Regression Coefficients")
            else:
                return None

            buf = io.BytesIO()
            plt.tight_layout()
            plt.savefig(buf, format="png")
            plt.close()
            buf.seek(0)
            return base64.b64encode(buf.read()).decode("utf-8")

        def get_prediction_plot(y_true, y_pred):
            plt.figure(figsize=(8, 5))
            y_true = y_true.values if hasattr(y_true, "values") else y_true
            plt.plot(y_true, label="Actual", marker='o')
            plt.plot(y_pred, label="Predicted", marker='x')
            plt.title("Actual vs Predicted")
            plt.xlabel("Sample")
            plt.ylabel("Value")
            plt.legend()
            buf = io.BytesIO()
            plt.tight_layout()
            plt.savefig(buf, format="png")
            plt.close()
            buf.seek(0)
            return base64.b64encode(buf.read()).decode("utf-8")

        table_data = pd.DataFrame(X, columns=feature_names).head(5).to_dict(orient="records")

        return JSONResponse(content={
            "metrics": {
                "rmse": rmse,
                "r2": r2,
                "mae": mae
            },
            "visualization": get_visualization_plot(selected_model, feature_names, model),
            "prediction_plot": get_prediction_plot(y_test, y_pred),
            "columns": list(feature_names),
            "rows": table_data
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/test")
def test():
    return {"message": "Backend is working!"}
