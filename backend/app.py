import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.predict_routes import router as predict_router
from backend.routes.analytics_routes import router as analytics_router
from backend.utils.logger import logger

app = FastAPI(
    title="WhatsApp Notification Router API",
    description="Multimodal AI-Powered Notification Routing, Scam Detection & Personalization Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api", tags=["Predict"])
app.include_router(analytics_router, prefix="/api", tags=["Analytics"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "WhatsApp AI Notification Router"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
