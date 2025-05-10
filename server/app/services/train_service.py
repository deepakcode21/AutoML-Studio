import io  # Add this import at the top
import base64
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import (
    mean_squared_error, r2_score, mean_absolute_error,
    explained_variance_score, max_error, mean_absolute_percentage_error
)
from fastapi import UploadFile, HTTPException
from collections import defaultdict
import traceback

from app.utils.visualization import get_visualization_plot, get_prediction_plot
from app.utils.preprocessing import (
    drop_constant, drop_high_cardinality, handle_missing,
    encode_categorical, split_features_target, scale_features,
    track_original_numeric, get_tracked_numeric_cols
)

async def train_model_service(
    file: UploadFile, model: str, scaler: str,
    split_ratio: float, missing: str, encoding: str
):
    try:
        # Validate input parameters
        if split_ratio <= 0 or split_ratio >= 1:
            raise HTTPException(status_code=400, detail="Split ratio must be between 0 and 1")
        
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")

        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # Track preprocessing steps
        preprocessing_stats = defaultdict(dict)
        original_shape = df.shape
        
        # Track missing values before handling
        missing_before = df.isna().sum().to_dict()
        preprocessing_stats['missing_values_before'] = missing_before
        
        # Preprocessing
        df = handle_missing(df, missing)
        df = drop_constant(df)
        df = drop_high_cardinality(df)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="All columns were dropped during preprocessing")
        
        # Track preprocessing changes
        preprocessing_stats['missing_values_after'] = df.isna().sum().to_dict()
        preprocessing_stats['dropped_constant_columns'] = original_shape[1] - df.shape[1]
        preprocessing_stats['final_shape'] = df.shape
        
        track_original_numeric(df)
        df = encode_categorical(df, encoding)
        
        # Preserve raw data sample
        raw_sample_rows = df[get_tracked_numeric_cols()].head(5).to_dict(orient="records")
        
        # Split features and scale
        X, y, feature_names = split_features_target(df)
        X = scale_features(X, scaler)
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=(1 - split_ratio), random_state=42
        )
        
        # Model selection with validation
        model_map = {
            "LinearRegression": LinearRegression(),
            "RandomForest": RandomForestRegressor(),
            "DecisionTree": DecisionTreeRegressor()
        }
        
        if model not in model_map:
            raise HTTPException(status_code=400, detail=f"Invalid model type. Available options: {list(model_map.keys())}")
        
        selected = model_map[model]
        selected.fit(X_train, y_train)
        
        # Predict and evaluate
        y_pred = selected.predict(X_test)
        
        # Enhanced metrics with validation
        metrics = {
            "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred)) if len(y_test) > 0 else float('nan')),
            "r2": float(r2_score(y_test, y_pred)) if len(y_test) > 0 else float('nan'),
            "mae": float(mean_absolute_error(y_test, y_pred)) if len(y_test) > 0 else float('nan'),
            "explained_variance": float(explained_variance_score(y_test, y_pred)) if len(y_test) > 0 else float('nan'),
            "max_error": float(max_error(y_test, y_pred)) if len(y_test) > 0 else float('nan'),
            "mape": float(mean_absolute_percentage_error(y_test, y_pred)) if len(y_test) > 0 else float('nan'),
            "training_samples": int(X_train.shape[0]),
            "testing_samples": int(X_test.shape[0])
        }
        
        # Feature importance handling for different models
        feature_importances = {}
        if hasattr(selected, 'coef_'):  # For linear regression
            feature_importances = {str(k): float(v) for k, v in zip(feature_names, selected.coef_)}
        elif hasattr(selected, 'feature_importances_'):  # For tree-based models
            feature_importances = {str(k): float(v) for k, v in zip(feature_names, selected.feature_importances_)}
        
        if feature_importances:
            metrics['feature_importances'] = feature_importances
        
        # Visualizations
        vis = get_visualization_plot(selected, feature_names, model)
        pred_plot = get_prediction_plot(y_test, y_pred)
        
        # Prepare processed sample
        processed_sample_rows = pd.DataFrame(X, columns=feature_names).head(5).to_dict(orient="records")
        
        # Generate dashboard metrics - improved structure
        dashboard_metrics = {
            "model_performance": {
                "metrics": metrics,
                "plots": {
                    "feature_importance": bool(feature_importances),
                    "prediction_plot": True
                }
            },
            "data_quality": {
                "initial_shape": f"{original_shape[0]} rows × {original_shape[1]} cols",
                "final_shape": f"{df.shape[0]} rows × {df.shape[1]} cols",
                "missing_values": {
                    "before": sum(missing_before.values()),
                    "after": sum(preprocessing_stats['missing_values_after'].values())
                },
                "dropped_columns": preprocessing_stats['dropped_constant_columns'],
                "feature_types": {
                    "numeric": len(get_tracked_numeric_cols()),
                    "categorical": original_shape[1] - len(get_tracked_numeric_cols()) - 1
                }
            },
            "feature_analysis": {
                "importances": feature_importances,
                "top_features": dict(sorted(feature_importances.items(), 
                                          key=lambda item: abs(item[1]), 
                                   reverse=True)[:5] if feature_importances else {})
            }
        }
        
        return {
            "metrics": metrics,
            "preprocessing_stats": preprocessing_stats,
            "visualization": vis,
            "prediction_plot": pred_plot,
            "columns": list(feature_names),
            "rows": processed_sample_rows,
            "raw_rows": raw_sample_rows,
            "model_type": model,
            "scaler_type": scaler,
            "dashboard_metrics": dashboard_metrics
        }
        
    except HTTPException:
        raise  # Re-raise FastAPI HTTP exceptions
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The CSV file appears to be empty or corrupt")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()  # Log the full traceback
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )