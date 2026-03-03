import Foundation
import Supabase

final class SupabaseManager {
    static let shared = SupabaseManager()

    private let supabaseURL = URL(string: "https://ucsbrvkmlfmcteexoeiy.supabase.co")!
    private let supabaseAnonKey = "sb_publishable_U3fsSzgmd6TozDc_sJ8xRw_fs8XehHH"

    let client: SupabaseClient

    private init() {
        client = SupabaseClient(
            supabaseURL: supabaseURL,
            supabaseKey: supabaseAnonKey
        )
    }
}
