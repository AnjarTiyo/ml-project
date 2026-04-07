import json
import logging
import joblib
import numpy as np
import skfuzzy as fuzz

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ===============================
# LOAD MODEL
# ===============================

scaler = joblib.load("../model/scaler.pkl")
logger.debug("scaler loaded: %s", scaler)
pca = joblib.load("../model/pca.pkl")
logger.debug("pca loaded: %s", pca)
centers = np.load("../model/centers.npy")
logger.debug("centers shape: %s", centers.shape)

with open("../model/config.json") as f:
    config = json.load(f)
logger.debug("config: %s", config)

features = config["features"]
m = config["m"]
logger.debug("features: %s, m: %s", features, m)

# ===============================
# FASTAPI INIT
# ===============================

app = FastAPI(title="UMKM Cluster API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# REQUEST SCHEMA
# ===============================

class UMKMData(BaseModel):
    Modal: float
    Omset: float
    Aset: float
    Laba_Bersih: float
    Total_Karyawan: int
    Lama_Usaha: int


# ===============================
# PREDICTION FUNCTION
# ===============================

def predict_cluster(data):

    x = [
        data["Modal"],
        data["Omset"],
        data["Aset"],
        data["Laba Bersih"],
        data["Total Karyawan"],
        data["Lama Usaha"],
    ]
    logger.debug("raw input vector: %s", x)

    x_scaled = scaler.transform([x])
    logger.debug("scaled input: %s", x_scaled)
    
    # Use scaled data directly (not PCA) as centers have 6 features
    u, _, _, _, _, _ = fuzz.cluster.cmeans_predict(
        x_scaled.T,
        centers,
        m=m,
        error=0.005,
        maxiter=1000
    )
    logger.debug("membership matrix u: %s", u)

    cluster = int(np.argmax(u))
    logger.debug("predicted cluster: %d", cluster)

    return {
        "cluster": cluster,
        "membership": u.flatten().tolist()
    }


# ===============================
# API ENDPOINT
# ===============================

@app.get("/")
def root():
    return {"message": "UMKM Clustering API Ready"}

@app.post("/predict")
def predict(data: UMKMData):
    logger.debug("received /predict request: %s", data)

    input_data = {
        "Modal": data.Modal,
        "Omset": data.Omset,
        "Aset": data.Aset,
        "Laba Bersih": data.Laba_Bersih,
        "Total Karyawan": data.Total_Karyawan,
        "Lama Usaha": data.Lama_Usaha
    }

    result = predict_cluster(input_data)
    logger.debug("predict result: %s", result)

    return result