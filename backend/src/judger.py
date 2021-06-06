from typing import Any
import numpy as np


class Judger:
    """
    read the cropped mask and identify if it's a signature

    Attributes:
    -----------
    - size_ratio: [low, high]

        low < max(h, w) / min(h, w) < high.

        h, w are the heigth and width of the input mask.

    - max_pixel_ratio: [low, high]

       low < the number of 0 / the number of 255 < high.

       The mask should only have 2 value, 0 and 255.

    Methods:
    --------
    - judge(mask: numpy array) -> bool

       identify if the mask is a signature

    - run(results: dict) -> list

        judge all cropper's results
    """

    def __init__(self, size_ratio=[1, 4], pixel_ratio=[0.01, 1]) -> None:
        self.size_ratio = size_ratio
        self.pixel_ratio = pixel_ratio

    def judge(self, mask: Any) -> bool:
        if set(np.unique(mask)) == set([0, 255]):
            size_ratio = max(mask.shape) / min(mask.shape)
            bincounts = np.bincount(mask.ravel())
            pixel_ratio = bincounts[0] / bincounts[255]

            return (
                self.size_ratio[0] <= size_ratio <= self.size_ratio[1]
                and self.pixel_ratio[0] <= pixel_ratio <= self.pixel_ratio[1]
            )

        return False

    def run(self, results: dict) -> list:
        regions = []
        for idx, result in results.items():
            is_signed = self.judge(result["cropped_mask"])
            regions.append(
                {
                    "id": idx + 1,
                    "signed": True if is_signed else False,
                    "box": [int(x) for x in result["cropped_region"]],
                }
            )
        return regions
