import os

import cv2
import numpy as np
import pytest

from src.loader import Loader


def test_invaild():
    with pytest.raises(Exception) as excinfo:
        Loader("")
        assert "The threshold must be a tuple." == str(excinfo.value)

    with pytest.raises(Exception) as excinfo:
        Loader((0, 0))
        assert "The threshold must have 3 item (h, s, v)." == str(excinfo.value)

    with pytest.raises(Exception) as excinfo:
        Loader((0, 0, -1))
        assert "The threshold item must be in the range [0, 255]." == str(excinfo.value)


def test_two_dim_mask_contains_only_two_values():
    path = os.path.join(os.path.dirname(__file__), "data/signed_image.jpeg")
    image = cv2.imread(path)

    loader = Loader()
    mask = loader.get_mask(image)

    assert len(mask.shape) == 2
    
    mask_list = list(np.unique(mask))
    assert mask_list == [0, 255]
