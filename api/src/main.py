from fastapi import FastAPI

app = FastAPI()

@app.get("/api/")
def read_api():
    return {"api": "hi :)"}
