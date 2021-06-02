import numpy as np

from src.judger import Judger


def test_invaild_mask():
    judger = Judger()
    mask = np.array([[0,0,0,0]])

    assert judger.judge(mask) == False