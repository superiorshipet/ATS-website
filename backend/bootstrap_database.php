<?php

$databaseUrl = getenv('DATABASE_URL');

if (!$databaseUrl) {
    exit(0);
}

$parsed = parse_url($databaseUrl);
if (!$parsed || empty($parsed['host']) || empty($parsed['path']) || empty($parsed['user'])) {
    fwrite(STDERR, "Invalid DATABASE_URL\n");
    exit(1);
}

$host = $parsed['host'];
$port = $parsed['port'] ?? 5432;
$database = ltrim($parsed['path'], '/');
$user = $parsed['user'];
$password = $parsed['pass'] ?? '';
$sslMode = str_contains($host, 'railway.internal') || str_contains($host, 'rlwy.net') ? 'require' : 'prefer';

$dsn = "pgsql:host=$host;port=$port;dbname=$database;user=$user;password=$password;sslmode=$sslMode";

try {
    new PDO($dsn);
    exit(0);
} catch (PDOException $exception) {
    if ($exception->getCode() !== '08006' || stripos($exception->getMessage(), 'does not exist') === false) {
        fwrite(STDERR, "Database connection failed before migrations\n");
        exit(1);
    }
}

$maintenanceDsn = "pgsql:host=$host;port=$port;dbname=postgres;user=$user;password=$password;sslmode=$sslMode";
$maintenance = new PDO($maintenanceDsn);
$quotedDatabase = '"' . str_replace('"', '""', $database) . '"';
$maintenance->exec("CREATE DATABASE $quotedDatabase");

echo "Created missing PostgreSQL database: $database\n";
