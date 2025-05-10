import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder

def drop_constant(df: pd.DataFrame) -> pd.DataFrame:
    return df.loc[:, df.apply(pd.Series.nunique) > 1]

def drop_high_cardinality(df: pd.DataFrame, threshold: int = 50) -> pd.DataFrame:
    for col in df.select_dtypes(include='object').columns:
        if df[col].nunique() > threshold:
            df.drop(columns=[col], inplace=True)
    return df

def handle_missing(df: pd.DataFrame, strategy: str) -> pd.DataFrame:
    if strategy == "drop":
        return df.dropna()
    for col in df.select_dtypes(include=np.number).columns:
        if strategy == "mean":
            df[col].fillna(df[col].mean(), inplace=True)
        elif strategy == "median":
            df[col].fillna(df[col].median(), inplace=True)
        elif strategy == "zero":
            df[col].fillna(0, inplace=True)
    return df

def encode_categorical(df: pd.DataFrame, method: str) -> pd.DataFrame:
    if method == "label":
        for col in df.select_dtypes(include='object').columns:
            df[col] = LabelEncoder().fit_transform(df[col])
    elif method == "onehot":
        df = pd.get_dummies(df, drop_first=True)
    return df

def split_features_target(df: pd.DataFrame):
    target = df.columns[-1]
    X = df.drop(columns=[target])
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