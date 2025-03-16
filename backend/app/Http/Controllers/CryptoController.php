<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class CryptoController extends Controller
{
    public function getCryptos(): JsonResponse
    {
        $response = Http::get('https://api.coingecko.com/api/v3/coins/markets', [
            'vs_currency' => 'usd',
            'order' => 'market_cap_desc',
            'per_page' => 20,
            'page' => 1,
            'sparkline' => false
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Unable to fetch data'], 500);
        }

        $data = $response->json();

        $cryptos = array_map(function ($crypto) {
            return [
                'id' => $crypto['id'],
                'name' => $crypto['name'],
                'price_usd' => $crypto['current_price'],
                'market_cap_usd' => $crypto['market_cap'],
                'volume_usd_24h' => $crypto['total_volume']
            ];
        }, $data);

        return response()->json($cryptos);
    }
}