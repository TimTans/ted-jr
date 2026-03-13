import Foundation

struct ShopRiteItem: Codable, Identifiable, Hashable {
    let name: String
    let price: Double
    let unitSize: String
    let upc: String
    let storeId: String
    let storeZip: String
    let scrapedAt: String

    var id: String { upc }

    enum CodingKeys: String, CodingKey {
        case name, price, upc
        case unitSize = "unit_size"
        case storeId = "store_id"
        case storeZip = "store_zip"
        case scrapedAt = "scraped_at"
    }
}

enum ShopRiteData {
    static func loadProducts() -> [ShopRiteItem] {
        guard let url = Bundle.main.url(forResource: "shoprite_products", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let items = try? JSONDecoder().decode([ShopRiteItem].self, from: data) else {
            return []
        }
        return items
    }
}
