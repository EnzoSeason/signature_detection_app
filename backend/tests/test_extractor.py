import pytest
import cv2
import os
import numpy as np

from src.loader import Loader
from src.extractor import Extractor


def test_two_dim_labeled_mask_contains_only_two_values():
    path = os.path.join(os.path.dirname(__file__), "data/signed_image.jpeg")
    image = cv2.imread(path)

    loader = Loader()
    mask = loader.get_mask(image)

    extractor = Extractor()
    labeled_mask = extractor.extract(mask)
    mask_list = list(np.unique(labeled_mask))

    assert len(mask.shape) == 2

    mask_list = list(np.unique(mask))
    assert mask_list == [0, 255]

def test_no_region_found():
    extractor = Extractor()

    mask = np.array([[0, 255, 0], [0, 255, 0]], dtype="uint8")
    labeled_mask = extractor.extract(mask)

    assert labeled_mask.all() == mask.all()