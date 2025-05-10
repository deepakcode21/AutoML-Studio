from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from app.services.train_service import train_model_service

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

@router.get("/test")
def test():
    return {"message": "Backend is working!"}