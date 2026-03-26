"""tests for the /routes/optimize endpoint."""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _dummy_result():
    return {
        "total_cost": 10.00,
        "total_distance": 2.5,
        "stops": [],
        "items_not_found": [],
    }


def test_optimize_defaults_to_cost_mode():
    with patch(
        "app.routes.routes.optimize_lowest_cost",
        new_callable=AsyncMock,
        return_value=_dummy_result(),
    ) as mock:
        resp = client.post("/routes/optimize", json={"product_ids": ["p1"]})
    assert resp.status_code == 200
    mock.assert_called_once()


def test_optimize_stops_mode():
    with patch(
        "app.routes.routes.optimize_fewest_stops",
        new_callable=AsyncMock,
        return_value=_dummy_result(),
    ) as mock:
        resp = client.post(
            "/routes/optimize",
            json={"product_ids": ["p1"], "mode": "stops"},
        )
    assert resp.status_code == 200
    mock.assert_called_once()


def test_optimize_distance_mode():
    with patch(
        "app.routes.routes.optimize_shortest_distance",
        new_callable=AsyncMock,
        return_value=_dummy_result(),
    ) as mock:
        resp = client.post(
            "/routes/optimize",
            json={"product_ids": ["p1"], "mode": "distance"},
        )
    assert resp.status_code == 200
    mock.assert_called_once()


def test_optimize_empty_product_ids():
    resp = client.post("/routes/optimize", json={"product_ids": []})
    assert resp.status_code == 400


def test_optimize_invalid_mode():
    resp = client.post(
        "/routes/optimize",
        json={"product_ids": ["p1"], "mode": "invalid"},
    )
    # pydantic validation rejects invalid literal
    assert resp.status_code == 422
