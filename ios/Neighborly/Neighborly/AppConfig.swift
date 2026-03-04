import Foundation

enum AppConfig {
    static let supabaseURL: URL = {
        guard let urlString = Bundle.main.infoDictionary?["SUPABASE_URL"] as? String,
              !urlString.isEmpty,
              urlString != "YOUR_PROJECT_REF.supabase.co",
              let url = URL(string: urlString) else {
            fatalError(
                "SUPABASE_URL not configured. "
                + "Copy Config/Secrets.xcconfig.template to Config/Secrets.xcconfig "
                + "and fill in your Supabase project URL."
            )
        }
        return url
    }()

    static let supabaseAnonKey: String = {
        guard let key = Bundle.main.infoDictionary?["SUPABASE_ANON_KEY"] as? String,
              !key.isEmpty,
              key != "your_anon_key_here" else {
            fatalError(
                "SUPABASE_ANON_KEY not configured. "
                + "Copy Config/Secrets.xcconfig.template to Config/Secrets.xcconfig "
                + "and fill in your Supabase anon key."
            )
        }
        return key
    }()
}
