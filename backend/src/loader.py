from typing import Any

import cv2


class Loader:
    """
    Load an image or a pdf file.

    Attributes
    ----------
    low_threshold: tuple
        The low threshold of cv2.inRange
    high_threshold: tuple
        The high threshold of cv2.inRange

    Methods
    -------
    get_mask(image: cv.image) -> np.narray
        It read an image or a pdf file page by page.
        It returns the masks that the bright parts are marked as 255, the rest as 0.
    """

    def __init__(
        self, low_threshold=(0, 0, 250), high_threshold=(255, 255, 255)
    ) -> None:
        if self._is_valid(low_threshold):
            self.low_threshold = low_threshold
        if self._is_valid(high_threshold):
            self.high_threshold = high_threshold

    def _is_valid(self, threshold: tuple) -> bool:
        if type(threshold) is not tuple:
            raise Exception("The threshold must be a tuple.")
        if len(threshold) != 3:
            raise Exception("The threshold must have 3 item (h, s, v).")
        for item in threshold:
            if item not in range(0, 256):
                raise Exception("The threshold item must be in the range [0, 255].")
        return True

    def get_mask(self, image) -> Any:
        frame_HSV = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        frame_threshold = cv2.inRange(
            frame_HSV, self.low_threshold, self.high_threshold
        )
        return frame_threshold
