import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile

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

    return {"image_size": [mask.shape[1], mask.shape[0]]}
