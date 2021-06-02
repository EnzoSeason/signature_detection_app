import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from src.extractor import Extractor

from src.loader import Loader

app = FastAPI()


@app.post("/api/")
async def signature_detection(file: UploadFile = File(...)):
    if file.content_type != "image/jpeg" and file.content_type != "image/png":
        raise HTTPException(
            status_code=422, detail="File type must be image/png or image/jpeg"
        )

    content = await file.read()
    # convert string data to numpy array
    np_image = np.frombuffer(content, dtype=np.uint8)
    # convert numpy array to image
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    # load the image and create the mask
    loader = Loader(low_threshold=(0, 0, 250), high_threshold=(255, 255, 255))
    mask = loader.get_mask(image)

    # extract the regions from the mask
    extractor = Extractor(
        outlier_weight=3, outlier_bias=100, amplfier=15, min_area_size=10
    )
    labeled_mask = extractor.extract(mask)

    return {"image_size": [mask.shape[1], mask.shape[0]]}
