# app/schemas/request_models.py
from pydantic import BaseModel
from typing import List

class TrainRequest(BaseModel):
    file_path: str
    target_column: str
    model_type: str  # "linear", "decision_tree", "random_forest"
