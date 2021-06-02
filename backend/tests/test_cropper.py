import os

import cv2
import numpy as np

from src.cropper import Cropper
from src.extractor import Extractor
from src.loader import Loader

def test_cropped_regions_and_masks():
    path = os.path.join(os.path.dirname(__file__), "data/signed_image.jpeg")
    image = cv2.imread(path)
    loader = Loader()
    mask = loader.get_mask(image)

    extractor = Extractor()
    labeled_mask = extractor.extract(mask)

    cropper = Cropper()
    results = cropper.run(labeled_mask)

    for res in results.values():
        assert len(res["cropped_region"]) == 4

        mask_list = list(np.unique(res["cropped_mask"]))
        assert mask_list == [0, 255]

def test_boxes2regions():
    cropper = Cropper()
    boxes = [[0, 0, 10, 10], [9, 9, 5, 5], [20, 20, 1, 1]]
    regions = cropper.boxes2regions(boxes)

    assert len(regions) == 2

    assert regions[0] == [0, 0, 14, 14]
    assert regions[1] == [20, 20, 1, 1]

def test_is_intersected():
    cropper = Cropper()
    box_b = [10, 10, 1, 1]
    
    # y_a > y_b + h_b
    box_a = [0, 20, 1, 1]
    assert cropper.is_intersected(box_a, box_b) == False

    # y_a + h_a < y_b
    box_a = [0, 0, 1, 1]
    assert cropper.is_intersected(box_a, box_b) == False

    # x_a > x_b + w_b
    box_a = [20, 10, 1, 1]
    assert cropper.is_intersected(box_a, box_b) == False

    # x_a + w_a < x_b
    box_a = [0, 10, 1, 1]
    assert cropper.is_intersected(box_a, box_b) == False