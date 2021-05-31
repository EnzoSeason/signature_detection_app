from fastapi import FastAPI, File, UploadFile, HTTPException

app = FastAPI()


@app.post("/api/")
async def create_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    print(file.content_type)
    if file.content_type != "image/jpeg" and file.content_type != "image/png":
        raise HTTPException(
            status_code=404, detail="File type must be image/png or image/jpeg"
        )

    return {"filename": file.filename}
