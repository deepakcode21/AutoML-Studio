# app/routes/model_routes.py
from fastapi import APIRouter
from app.services.model_trainer import train_model
from app.schemas.request_models import TrainRequest

router = APIRouter(prefix="/model", tags=["Model"])

@router.post("/train")
def train_model_route(req: TrainRequest):
    metrics, message = train_model(req)
    return {"message": message, "metrics": metrics}
