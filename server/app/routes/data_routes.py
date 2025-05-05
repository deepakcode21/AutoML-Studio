# app/routes/data_routes.py
from fastapi import APIRouter, UploadFile, File
from app.services import data_processor
import os

router = APIRouter(prefix="/data", tags=["Data"])

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    file_location = f"data/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    
    df, msg = data_processor.process_data(file_location)
    return {"message": msg, "columns": df.columns.tolist()}
