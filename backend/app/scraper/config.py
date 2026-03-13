"""
multi-store, multi-category scrape configuration.

category_id and url_path come from shoprite.com — browse to a category with
your store selected and extract from the URL:

/sm/planning/rsid/{store_id}/categories/{url_path}-id-{category_id}?f=Breadcrumb:...

stores are defined with their shoprite rsid and zip code.
"""

from dataclasses import dataclass
from urllib.parse import quote


@dataclass
class CategoryConfig:
    """a shoprite product category to scrape."""
    name: str
    category_id: str
    url_path: str
    breadcrumb: str
    slug: str


@dataclass
class StoreInfo:
    """a shoprite store location."""
    store_id: str
    zip_code: str
    name: str
    chain: str = "shoprite"

STORES = [
    StoreInfo(store_id="218", zip_code="11230", name="ShopRite Brooklyn"),
    StoreInfo(store_id="204", zip_code="11356", name="ShopRite Queens"),
]

CATEGORIES = [
    CategoryConfig(
        name="Milk",
        category_id="520592",
        url_path="dairy/milk",
        breadcrumb="grocery/dairy/milk",
        slug="milk",
    ),
    CategoryConfig(
        name="Water",
        category_id="520161",
        url_path="beverages/water",
        breadcrumb="grocery/beverages/water",
        slug="water",
    ),
    CategoryConfig(
        name="Yogurt",
        category_id="520598",
        url_path="dairy/yogurt",
        breadcrumb="grocery/dairy/yogurt",
        slug="yogurt",
    ),
    CategoryConfig(
        name="Bread",
        category_id="520567",
        url_path="bread-bakery/bread",
        breadcrumb="grocery/bread & bakery/bread",
        slug="bread",
    ),
    CategoryConfig(
        name="Chicken",
        category_id="519882",
        url_path="meat/chicken",
        breadcrumb="grocery/meat/chicken",
        slug="chicken",
    ),
    CategoryConfig(
        name="Turkey",
        category_id="519886",
        url_path="meat/turkey",
        breadcrumb="grocery/meat/turkey",
        slug="turkey",
    ),
    CategoryConfig(
        name="Cereal",
        category_id="520744",
        url_path="breakfast-cereal/cereal",
        breadcrumb="grocery/breakfast & cereal/cereal",
        slug="cereal",
    ),
    CategoryConfig(
        name="Eggs",
        category_id="520591",
        url_path="dairy/eggs",
        breadcrumb="grocery/dairy/eggs",
        slug="eggs",
    ),
    CategoryConfig(
        name="Cheese",
        category_id="520599",
        url_path="dairy/cheese",
        breadcrumb="grocery/dairy/cheese",
        slug="cheese",
    ),
    CategoryConfig(
        name="Fresh Fruit",
        category_id="520537",
        url_path="produce/fresh-fruit",
        breadcrumb="grocery/produce/fresh fruit",
        slug="fresh-fruit",
    ),
    CategoryConfig(
        name="Fresh Vegetables",
        category_id="520538",
        url_path="produce/fresh-vegetables",
        breadcrumb="grocery/produce/fresh vegetables",
        slug="fresh-vegetables",
    ),
    CategoryConfig(
        name="Pasta, Rice & Grains",
        category_id="520626",
        url_path="pantry/pasta-rice-grains",
        breadcrumb="grocery/pantry/pasta, rice & grains",
        slug="pasta-rice-grains",
    ),
    CategoryConfig(
        name="Chips",
        category_id="520166",
        url_path="snacks/chips",
        breadcrumb="grocery/snacks/chips",
        slug="chips",
    ),
    CategoryConfig(
        name="Canned & Packaged Foods",
        category_id="520625",
        url_path="pantry/canned-packaged-foods",
        breadcrumb="grocery/pantry/canned & packaged foods",
        slug="canned-packaged-foods",
    ),
    CategoryConfig(
        name="Frozen Vegetables",
        category_id="520614",
        url_path="frozen/frozen-vegetables",
        breadcrumb="grocery/frozen/frozen vegetables",
        slug="frozen-vegetables",
    ),
]


def build_browse_url(store: StoreInfo, category: CategoryConfig) -> str:
    """
    construct the full shoprite browse URL for a store + category.

    example output:
    https://www.shoprite.com/sm/planning/rsid/204/categories/dairy/milk-id-520592?f=Breadcrumb%3Agrocery%2Fdairy%2Fmilk
    """
    encoded_breadcrumb = quote(category.breadcrumb, safe="")
    return (
        f"https://www.shoprite.com/sm/planning/rsid/{store.store_id}"
        f"/categories/{category.url_path}-id-{category.category_id}"
        f"?f=Breadcrumb%3A{encoded_breadcrumb}"
    )
