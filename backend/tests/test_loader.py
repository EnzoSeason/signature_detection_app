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
