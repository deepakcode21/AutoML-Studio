# app/routes/data_routes.py
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from app.services.train_service import train_model_service
from app.services.adanceCleaning import AdvancedDataCleaner
import json

router = APIRouter()

@router.post("/train")
async def train(
    file: UploadFile = File(...),
    model: str = Form(...),
    scaler: str = Form(...),
    splitRatio: float = Form(...),
    missing: str = Form(...),
    encoding: str = Form(...)
):
    try:
        result = await train_model_service(file, model, scaler, splitRatio, missing, encoding)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/clean")
async def clean_data(
    file: UploadFile = File(...),
    preprocessing: str = Form(...)
):
    try:
        # Parse preprocessing JSON
        preprocessing_config = json.loads(preprocessing)
        # print(preprocessing_config)
        
        # Initialize cleaner and process data
        cleaner = AdvancedDataCleaner(file, preprocessing_config)
        result = await cleaner.clean_data()
        
        return JSONResponse(content=result)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid preprocessing JSON")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test")
def test():
    return {"message": "Backend is working!"}