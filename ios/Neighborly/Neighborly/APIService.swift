import Foundation

enum APIError: Error, LocalizedError {
    case invalidURL
    case serverError(statusCode: Int)
    case noData

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .serverError(let code):
            return "Server error (\(code))"
        case .noData:
            return "No data returned"
        }
    }
}

enum APIService {
    private static let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        return d
    }()

    static func searchProducts(
        query: String,
        page: Int = 1,
        pageSize: Int = 20
    ) async throws -> ProductSearchResponse {
        var components = URLComponents(
            url: AppConfig.apiBaseURL.appendingPathComponent("products"),
            resolvingAgainstBaseURL: false
        )
        components?.queryItems = [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "page", value: String(page)),
            URLQueryItem(name: "page_size", value: String(pageSize)),
        ]

        guard let url = components?.url else {
            throw APIError.invalidURL
        }

        let (data, response) = try await URLSession.shared.data(from: url)

        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw APIError.serverError(statusCode: http.statusCode)
        }

        return try decoder.decode(ProductSearchResponse.self, from: data)
    }

    static func getProduct(id: String) async throws -> Product {
        let url = AppConfig.apiBaseURL
            .appendingPathComponent("products")
            .appendingPathComponent(id)

        let (data, response) = try await URLSession.shared.data(from: url)

        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw APIError.serverError(statusCode: http.statusCode)
        }

        return try decoder.decode(Product.self, from: data)
    }
}
