import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder

# Global cache to track original numeric columns
original_numeric_columns = []

def drop_constant(df: pd.DataFrame) -> pd.DataFrame:
    return df.loc[:, df.apply(pd.Series.nunique) > 1]

def drop_high_cardinality(df: pd.DataFrame, threshold: int = 50) -> pd.DataFrame:
    for col in df.select_dtypes(include='object').columns:
        if df[col].nunique() > threshold:
            df.drop(columns=[col], inplace=True)
    return df

def handle_missing(df: pd.DataFrame, strategy: str, text_placeholder: str = "missing") -> pd.DataFrame:
    valid_strategies = ["drop", "mean", "median", "mode", "zero"]
    if strategy not in valid_strategies:
        raise ValueError(f"Invalid strategy. Expected one of: {valid_strategies}")
    
    df = df.copy()
    
    if strategy == "drop":
        return df.dropna()
    
    # Handle numeric columns
    numeric_cols = df.select_dtypes(include=np.number).columns
    for col in numeric_cols:
        if strategy == "mean":
            df[col].fillna(df[col].mean(), inplace=True)
        elif strategy == "median":
            df[col].fillna(df[col].median(), inplace=True)
        elif strategy == "mode":
            df[col].fillna(df[col].mode()[0], inplace=True)
        elif strategy == "zero":
            df[col].fillna(0, inplace=True)
    
    # Handle text/object columns
    text_cols = df.select_dtypes(include='object').columns
    for col in text_cols:
        if strategy == "mode":
            df[col].fillna(df[col].mode()[0], inplace=True)
        else:
            df[col].fillna(text_placeholder, inplace=True)
    
    return df

def encode_categorical(df: pd.DataFrame, method: str) -> pd.DataFrame:
    if method == "label":
        for col in df.select_dtypes(include='object').columns:
            df[col] = LabelEncoder().fit_transform(df[col])
    elif method == "onehot":
        df = pd.get_dummies(df, drop_first=True)
    return df

def track_original_numeric(df: pd.DataFrame):
    """
    Call this before any encoding to record original numeric columns.
    """
    global original_numeric_columns
    original_numeric_columns = df.select_dtypes(include=np.number).columns.tolist()

def get_tracked_numeric_cols():
    """
    Returns the numeric columns as tracked before encoding.
    """
    return original_numeric_columns

def split_features_target(df: pd.DataFrame):
    global original_numeric_columns

    target = df.columns[-1]  # Assume last column is target

    # Remove target if in numeric columns (to avoid including it in X)
    features = [col for col in original_numeric_columns if col != target]

    X = df[features]
    y = df[target]

    return X, y, X.columns

def scale_features(X, scaler: str):
    if scaler == "standard":
        return StandardScaler().fit_transform(X)
    if scaler == "minmax":
        return MinMaxScaler().fit_transform(X)
    if scaler == "robust":
        return RobustScaler().fit_transform(X)
    return X
