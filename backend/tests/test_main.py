from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_signature_detection_no_image():
    with open("/backend/tests/data/test.txt", "rb") as f:
        response = client.post(
            "/api/",
            files={"file": ("test.txt", f, "text/plain")},
        )
    assert response.status_code == 422


def test_signature_detection_success():
    with open("/backend/tests/data/signed_image.jpeg", "rb") as f:
        response = client.post(
            "/api/",
            files={"file": ("test.txt", f, "image/jpeg")},
        )
    assert response.status_code == 200

    data = response.json()
    assert data["image_size"] == [1190, 1683]
    assert len(data["regions"]) == 1

    region = data["regions"][0]
    assert region["id"] == 1
    assert region["signed"] == True
    assert region["box"] == [738, 1028, 217, 58]
