use axum::{
    extract::{Path, Query},
    routing::get,
    Json, Router,
};
use serde::Deserialize;
use serde_json::{json, Value};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/chains", get(get_chains))
        .route("/api/tokens", get(get_tokens))
        .route("/api/pools", get(get_pools))
        .route("/api/pools/:id", get(get_pool_detail))
        .route("/api/swap/quote", get(get_swap_quote))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    tracing::info!("Backend listening on http://0.0.0.0:3001");
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

async fn get_chains() -> Json<Value> {
    Json(json!([
        { "id": "solana",   "name": "Solana",   "symbol": "SOL", "color": "#9945FF" },
        { "id": "ethereum", "name": "Ethereum", "symbol": "ETH", "color": "#627EEA" },
        { "id": "arbitrum", "name": "Arbitrum", "symbol": "ARB", "color": "#12AAFF" },
        { "id": "bsc",      "name": "BSC",      "symbol": "BNB", "color": "#F0B90B" }
    ]))
}

async fn get_tokens() -> Json<Value> {
    Json(json!([
        { "symbol": "BTC",  "name": "Bitcoin",       "price": 103240.50, "change_24h":  1.24, "chain": "ethereum" },
        { "symbol": "ETH",  "name": "Ethereum",      "price":   3841.20, "change_24h": -0.38, "chain": "ethereum" },
        { "symbol": "SOL",  "name": "Solana",        "price":    178.45, "change_24h":  2.15, "chain": "solana"   },
        { "symbol": "ARB",  "name": "Arbitrum",      "price":      1.23, "change_24h":  0.87, "chain": "arbitrum" },
        { "symbol": "BNB",  "name": "BNB",           "price":    612.80, "change_24h":  0.42, "chain": "bsc"      },
        { "symbol": "USDC", "name": "USD Coin",      "price":      1.00, "change_24h":  0.01, "chain": "ethereum" },
        { "symbol": "USDT", "name": "Tether",        "price":      1.00, "change_24h": -0.01, "chain": "ethereum" },
        { "symbol": "RAY",  "name": "Raydium",       "price":      4.85, "change_24h":  3.20, "chain": "solana"   },
        { "symbol": "JUP",  "name": "Jupiter",       "price":      1.42, "change_24h":  1.95, "chain": "solana"   },
        { "symbol": "CAKE", "name": "PancakeSwap",   "price":      3.18, "change_24h": -1.10, "chain": "bsc"      },
        { "symbol": "UNI",  "name": "Uniswap",       "price":     12.40, "change_24h":  0.55, "chain": "ethereum" },
        { "symbol": "WBTC", "name": "Wrapped BTC",   "price": 103180.00, "change_24h":  1.20, "chain": "ethereum" }
    ]))
}

#[derive(Deserialize)]
struct PoolQuery {
    chain: Option<String>,
}

fn all_pools() -> Value {
    json!([
        {
            "id": "sol-usdc-1",
            "chain": "solana",
            "token_a": "SOL",  "token_b": "USDC",
            "token_a_price": 178.45, "token_b_price": 1.00,
            "liquidity": 18_450_000, "tvl": 18_450_000,
            "volume_24h": 4_320_000, "fee": 0.0025, "apy": 14.2
        },
        {
            "id": "sol-ray-1",
            "chain": "solana",
            "token_a": "SOL",  "token_b": "RAY",
            "token_a_price": 178.45, "token_b_price": 4.85,
            "liquidity": 6_200_000, "tvl": 6_200_000,
            "volume_24h": 980_000, "fee": 0.003, "apy": 18.7
        },
        {
            "id": "jup-usdc-1",
            "chain": "solana",
            "token_a": "JUP",  "token_b": "USDC",
            "token_a_price": 1.42, "token_b_price": 1.00,
            "liquidity": 3_100_000, "tvl": 3_100_000,
            "volume_24h": 540_000, "fee": 0.003, "apy": 22.4
        },
        {
            "id": "eth-usdc-1",
            "chain": "ethereum",
            "token_a": "ETH",  "token_b": "USDC",
            "token_a_price": 3841.20, "token_b_price": 1.00,
            "liquidity": 42_800_000, "tvl": 42_800_000,
            "volume_24h": 12_600_000, "fee": 0.003, "apy": 8.9
        },
        {
            "id": "eth-wbtc-1",
            "chain": "ethereum",
            "token_a": "ETH",  "token_b": "WBTC",
            "token_a_price": 3841.20, "token_b_price": 103180.00,
            "liquidity": 28_500_000, "tvl": 28_500_000,
            "volume_24h": 7_200_000, "fee": 0.003, "apy": 6.1
        },
        {
            "id": "uni-usdc-1",
            "chain": "ethereum",
            "token_a": "UNI",  "token_b": "USDC",
            "token_a_price": 12.40, "token_b_price": 1.00,
            "liquidity": 9_400_000, "tvl": 9_400_000,
            "volume_24h": 2_100_000, "fee": 0.003, "apy": 11.3
        },
        {
            "id": "eth-usdc-arb",
            "chain": "arbitrum",
            "token_a": "ETH",  "token_b": "USDC",
            "token_a_price": 3841.20, "token_b_price": 1.00,
            "liquidity": 14_200_000, "tvl": 14_200_000,
            "volume_24h": 3_800_000, "fee": 0.0025, "apy": 12.6
        },
        {
            "id": "arb-usdc-1",
            "chain": "arbitrum",
            "token_a": "ARB",  "token_b": "USDC",
            "token_a_price": 1.23, "token_b_price": 1.00,
            "liquidity": 5_600_000, "tvl": 5_600_000,
            "volume_24h": 1_400_000, "fee": 0.003, "apy": 19.8
        },
        {
            "id": "bnb-usdt-1",
            "chain": "bsc",
            "token_a": "BNB",  "token_b": "USDT",
            "token_a_price": 612.80, "token_b_price": 1.00,
            "liquidity": 22_300_000, "tvl": 22_300_000,
            "volume_24h": 5_900_000, "fee": 0.002, "apy": 9.4
        },
        {
            "id": "cake-bnb-1",
            "chain": "bsc",
            "token_a": "CAKE", "token_b": "BNB",
            "token_a_price": 3.18, "token_b_price": 612.80,
            "liquidity": 8_100_000, "tvl": 8_100_000,
            "volume_24h": 2_300_000, "fee": 0.0025, "apy": 31.5
        }
    ])
}

// Deterministic history: seed varies per pool id character sum
fn generate_history(pool_id: &str) -> Value {
    let seed: u64 = pool_id.bytes().map(|b| b as u64).sum::<u64>();
    let base_tvl = match pool_id {
        id if id.contains("eth-usdc") && id.contains("eth") && !id.contains("arb") => 42_000_000.0,
        id if id.contains("bnb") => 22_000_000.0,
        id if id.contains("sol-usdc") => 18_000_000.0,
        id if id.contains("eth-wbtc") => 28_000_000.0,
        id if id.contains("eth-usdc-arb") => 14_000_000.0,
        id if id.contains("uni") => 9_000_000.0,
        id if id.contains("sol-ray") => 6_000_000.0,
        id if id.contains("arb-usdc") => 5_500_000.0,
        id if id.contains("jup") => 3_000_000.0,
        id if id.contains("cake") => 8_000_000.0,
        _ => 5_000_000.0,
    };

    let mut history = Vec::new();
    for i in 0..30u64 {
        let day = 29 - i;
        // pseudo-random variation ±8%
        let r = ((seed.wrapping_mul(6364136223846793005).wrapping_add(i.wrapping_mul(1442695040888963407))) >> 33) as f64
            / u32::MAX as f64;
        let tvl = base_tvl * (0.92 + r * 0.16);
        let vol = tvl * (0.08 + ((seed.wrapping_add(i.wrapping_mul(31337))) % 100) as f64 / 1000.0);
        history.push(json!({
            "day": day,
            "tvl": (tvl * 100.0).round() / 100.0,
            "volume": (vol * 100.0).round() / 100.0
        }));
    }
    json!(history)
}

fn mock_transactions(pool_id: &str) -> Value {
    let seed: u64 = pool_id.bytes().map(|b| b as u64).sum::<u64>();
    let wallets = [
        "7xKX...3mPq", "Bz9R...4nWs", "3aLM...9kTv", "FqP2...7jYu",
        "9wCN...2hRe", "KmD4...5oAb", "1sQT...8pLx", "Gh6V...0cFd",
    ];
    let mut txs = Vec::new();
    for i in 0..10u64 {
        let r = (seed.wrapping_mul(6364136223846793005).wrapping_add(i.wrapping_mul(1442695040888963407)) >> 33) as usize;
        let is_buy = r % 2 == 0;
        let amount_usd = 500.0 + (r % 50000) as f64;
        let mins_ago = 2 + (r % 120);
        txs.push(json!({
            "type": if is_buy { "Buy" } else { "Sell" },
            "amount_usd": (amount_usd * 100.0).round() / 100.0,
            "wallet": wallets[r % wallets.len()],
            "mins_ago": mins_ago
        }));
    }
    json!(txs)
}

async fn get_pools(Query(params): Query<PoolQuery>) -> Json<Value> {
    let pools = all_pools();
    let arr = pools.as_array().unwrap();

    if let Some(chain) = &params.chain {
        if chain != "all" {
            let filtered: Vec<&Value> = arr
                .iter()
                .filter(|p| p["chain"].as_str().unwrap_or("") == chain.as_str())
                .collect();
            return Json(json!(filtered));
        }
    }

    Json(json!(arr))
}

async fn get_pool_detail(Path(id): Path<String>) -> Json<Value> {
    let pools = all_pools();
    let pool = pools
        .as_array()
        .unwrap()
        .iter()
        .find(|p| p["id"].as_str().unwrap_or("") == id.as_str())
        .cloned()
        .unwrap_or(json!(null));

    if pool.is_null() {
        return Json(json!({ "error": "Pool not found" }));
    }

    let history = generate_history(&id);
    let transactions = mock_transactions(&id);

    Json(json!({
        "pool": pool,
        "history": history,
        "transactions": transactions
    }))
}

#[derive(Deserialize)]
struct SwapQuery {
    from: String,
    to: String,
    amount: f64,
}

async fn get_swap_quote(Query(params): Query<SwapQuery>) -> Json<Value> {
    // Token prices map
    let prices: std::collections::HashMap<&str, f64> = [
        ("BTC", 103240.50), ("ETH", 3841.20), ("SOL", 178.45),
        ("ARB", 1.23), ("BNB", 612.80), ("USDC", 1.00), ("USDT", 1.00),
        ("RAY", 4.85), ("JUP", 1.42), ("CAKE", 3.18), ("UNI", 12.40), ("WBTC", 103180.00),
    ]
    .into();

    let from_price = prices.get(params.from.as_str()).copied().unwrap_or(1.0);
    let to_price = prices.get(params.to.as_str()).copied().unwrap_or(1.0);

    let usd_value = params.amount * from_price;
    let price_impact = if usd_value > 100_000.0 { 0.8 } else if usd_value > 10_000.0 { 0.3 } else { 0.05 };
    let fee = 0.25; // 0.25%
    let output = (usd_value / to_price) * (1.0 - (price_impact + fee) / 100.0);
    let rate = output / params.amount;

    Json(json!({
        "from": params.from,
        "to": params.to,
        "amount_in": params.amount,
        "amount_out": (output * 1_000_000.0).round() / 1_000_000.0,
        "rate": (rate * 1_000_000.0).round() / 1_000_000.0,
        "price_impact": price_impact,
        "fee_pct": fee,
        "route": format!("{} → {} via DEXO Pool", params.from, params.to)
    }))
}
