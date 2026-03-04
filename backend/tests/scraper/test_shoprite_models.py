from app.scraper.shoprite import ShopRiteProduct, StoreConfig, _parse_preloaded_products, _dedup_products


def test_shoprite_product_to_dict_full():
    product = ShopRiteProduct(
        name="Organic Whole Milk",
        price=4.99,
        unit_size="1 gal",
        upc="041303018644",
        store_id="139",
        store_zip="07030",
        scraped_at="2026-02-26T12:00:00",
    )
    d = product.to_dict()
    assert d["name"] == "Organic Whole Milk"
    assert d["price"] == 4.99
    assert d["unit_size"] == "1 gal"
    assert d["upc"] == "041303018644"
    assert d["store_id"] == "139"
    assert d["store_zip"] == "07030"
    assert d["scraped_at"] == "2026-02-26T12:00:00"


def test_shoprite_product_to_dict_null_upc():
    product = ShopRiteProduct(
        name="Store Brand Apples",
        price=2.49,
        unit_size="3 lb bag",
        upc=None,
        store_id="139",
        store_zip="07030",
        scraped_at="2026-02-26T12:00:00",
    )
    d = product.to_dict()
    assert d["upc"] is None


def test_store_config_fields():
    config = StoreConfig(
        store_id="139",
        zip_code="07030",
        category_id="520592",
        breadcrumb="grocery/dairy/milk",
        browse_url="https://www.shoprite.com/sm/pickup/rsid/139/categories/dairy/milk-id-520592?f=Breadcrumb%3Agrocery%2Fdairy%2Fmilk",
    )
    assert config.store_id == "139"
    assert config.zip_code == "07030"
    assert config.category_id == "520592"
    assert config.breadcrumb == "grocery/dairy/milk"
    assert "milk-id-520592" in config.browse_url


# fixture matches __PRELOADED_STATE__.search.productCardDictionary shape
# from the live shoprite.com site (confirmed via devtools)
FIXTURE_CONFIG = StoreConfig(
    store_id="139",
    zip_code="07030",
    category_id="520592",
    breadcrumb="grocery/dairy/milk",
    browse_url="https://www.shoprite.com/sm/pickup/rsid/139/categories/dairy/milk-id-520592?f=Breadcrumb%3Agrocery%2Fdairy%2Fmilk",
)

FIXTURE_PRODUCT_DICT = {
    "00041190467150": {
        "name": "Bowl & Basket Whole Milk, one gallon",
        "price": "$4.09",
        "brand": "Bowl & Basket",
        "sku": "00041190467150",
        "unitOfSize": {"label": "Gallon", "size": 1, "type": "gallonUS", "abbreviation": "gal"},
        "description": "Bowl & Basket Whole Milk, one gallon",
    },
    "00041190467167": {
        "name": "Bowl & Basket 2% Reduced Fat Milk, half gallon",
        "price": "$2.49",
        "brand": "Bowl & Basket",
        "sku": "00041190467167",
        "unitOfSize": {"label": "Half Gallon", "size": 0.5, "type": "gallonUS", "abbreviation": "gal"},
    },
    "NOSKUPRODUCT": {
        "name": "Generic Apples",
        "price": "$3.99",
        "unitOfSize": {},
    },
}


def test_parse_preloaded_returns_products():
    products = _parse_preloaded_products(FIXTURE_PRODUCT_DICT, FIXTURE_CONFIG)
    assert len(products) == 3


def test_parse_preloaded_maps_fields_correctly():
    products = _parse_preloaded_products(FIXTURE_PRODUCT_DICT, FIXTURE_CONFIG)
    milk = next(p for p in products if p.upc == "00041190467150")
    assert milk.name == "Bowl & Basket Whole Milk, one gallon"
    assert milk.price == 4.09
    assert milk.unit_size == "1 gal"
    assert milk.store_id == "139"
    assert milk.store_zip == "07030"


def test_parse_preloaded_strips_dollar_sign():
    products = _parse_preloaded_products(FIXTURE_PRODUCT_DICT, FIXTURE_CONFIG)
    half_gal = next(p for p in products if p.upc == "00041190467167")
    assert half_gal.price == 2.49


def test_parse_preloaded_empty_dict():
    products = _parse_preloaded_products({}, FIXTURE_CONFIG)
    assert products == []


def test_parse_preloaded_malformed_item_is_skipped():
    bad_dict = {
        "GOOD": {"name": "Milk", "price": "$4.09", "unitOfSize": {"size": 1, "abbreviation": "gal"}},
        "BAD": {"broken": "item"},
    }
    products = _parse_preloaded_products(bad_dict, FIXTURE_CONFIG)
    assert len(products) == 1
    assert products[0].name == "Milk"


def test_dedup_removes_duplicate_upcs():
    products = [
        ShopRiteProduct("Milk", 4.99, "1 gal", "041303018644", "139", "07030", "2026-02-26T12:00:00"),
        ShopRiteProduct("Milk", 4.99, "1 gal", "041303018644", "139", "07030", "2026-02-26T12:00:00"),
        ShopRiteProduct("Apples", 2.49, "3 lb", "012345678901", "139", "07030", "2026-02-26T12:00:00"),
    ]
    result = _dedup_products(products)
    assert len(result) == 2


def test_dedup_uses_name_when_upc_is_none():
    products = [
        ShopRiteProduct("Store Apples", 2.49, "3 lb", None, "139", "07030", "2026-02-26T12:00:00"),
        ShopRiteProduct("Store Apples", 2.49, "3 lb", None, "139", "07030", "2026-02-26T12:00:00"),
    ]
    result = _dedup_products(products)
    assert len(result) == 1


def test_dedup_preserves_order():
    products = [
        ShopRiteProduct("Milk", 4.99, "1 gal", "111", "139", "07030", "2026-02-26T12:00:00"),
        ShopRiteProduct("Eggs", 3.49, "12 ct", "222", "139", "07030", "2026-02-26T12:00:00"),
        ShopRiteProduct("Bread", 2.99, "20 oz", "333", "139", "07030", "2026-02-26T12:00:00"),
    ]
    result = _dedup_products(products)
    assert [p.name for p in result] == ["Milk", "Eggs", "Bread"]
