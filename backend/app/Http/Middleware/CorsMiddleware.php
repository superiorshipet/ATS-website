<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $request->isMethod('OPTIONS')
            ? response('', 204)
            : $next($request);

        $allowedOrigins = array_filter(array_map('trim', explode(',', env(
            'CORS_ALLOWED_ORIGINS',
            'https://ats-website-flax.vercel.app,https://ats-website-ats.up.railway.app'
        ))));

        $origin = $request->headers->get('Origin');
        if ($origin && in_array($origin, $allowedOrigins, true)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Vary', 'Origin');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

        return $response;
    }
}
