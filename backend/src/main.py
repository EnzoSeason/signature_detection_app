from fastapi import FastAPI

app = FastAPI()


@app.get("/api/")
def read_api():
    return {"api": "hi :)"}


@app.get("/api/signature-detect/")
def read_signature_detect():
    return {"signature": "Found"}
