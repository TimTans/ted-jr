import Foundation
import SwiftData

@Model
final class GroceryListItem {
    var name: String
    var price: Double
    var unitSize: String
    var upc: String
    var quantity: Int
    var dateAdded: Date

    init(name: String, price: Double, unitSize: String, upc: String, quantity: Int = 1) {
        self.name = name
        self.price = price
        self.unitSize = unitSize
        self.upc = upc
        self.quantity = quantity
        self.dateAdded = Date()
    }

    convenience init(from shopRiteItem: ShopRiteItem) {
        self.init(
            name: shopRiteItem.name,
            price: shopRiteItem.price,
            unitSize: shopRiteItem.unitSize,
            upc: shopRiteItem.upc
        )
    }
}
