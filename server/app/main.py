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

        # Drop high-cardinality text columns (like names/IDs)
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

        # Encoding categorical
        if encoding == "label":
            for col in df.select_dtypes(include='object').columns:
                df[col] = LabelEncoder().fit_transform(df[col])

        # Feature/target split
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        # Scale data
        if scaler == "standard":
            X = StandardScaler().fit_transform(X)
        elif scaler == "minmax":
            X = MinMaxScaler().fit_transform(X)
        elif scaler == "robust":
            X = RobustScaler().fit_transform(X)

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=(1 - splitRatio), random_state=42)

        # Model selection
        model_map = {
            "LinearRegression": LinearRegression(),
            "RandomForest": RandomForestRegressor(),
            "DecisionTree": DecisionTreeRegressor()
        }
        selected_model = model_map.get(model, LinearRegression())
        selected_model.fit(X_train, y_train)

        # Predictions and metrics
        y_pred = selected_model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)

        # Feature importance plot (only for tree-based models)
        def get_plot(model, columns):
            if hasattr(model, "feature_importances_"):
                plt.figure(figsize=(8, 6))
                plt.barh(columns, model.feature_importances_)
                plt.xlabel("Importance")
                plt.title("Feature Importance")
                buf = io.BytesIO()
                plt.savefig(buf, format="png")
                plt.close()
                buf.seek(0)
                return base64.b64encode(buf.read()).decode("utf-8")
            return None

        feature_names = df.columns[:-1]
        plot = get_plot(selected_model, feature_names)

        return JSONResponse(content={
            "metrics": {
                "rmse": rmse,
                "r2": r2,
                "mae": mae
            },
            "visualization": plot,
            "columns": list(feature_names),
            "rows": pd.DataFrame(X).head(5).tolist()
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/test")
def test():
    return {"message": "Backend is working!"}