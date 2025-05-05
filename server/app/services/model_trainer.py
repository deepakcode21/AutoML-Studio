# app/services/model_trainer.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import math

def train_model(request):
    try:
        df = pd.read_csv(request.file_path)
        X = df.drop(columns=[request.target_column])
        y = df[request.target_column]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

        if request.model_type == "linear":
            model = LinearRegression()
        elif request.model_type == "decision_tree":
            model = DecisionTreeRegressor()
        elif request.model_type == "random_forest":
            model = RandomForestRegressor()
        else:
            return {}, "Invalid model type selected."

        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        rmse = math.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        metrics = {
            "RMSE": round(rmse, 3),
            "R² Score": round(r2, 3)
        }

        return metrics, f"{request.model_type} model trained successfully."

    except Exception as e:
        return {}, f"Training failed: {str(e)}"
