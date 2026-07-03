<?php

namespace App\Support;

class StorageUrl
{
    public static function toPublicUrl(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return $url;
        }

        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        if (str_starts_with($url, '/storage/')) {
            return rtrim((string) config('app.url'), '/').$url;
        }

        return $url;
    }

    public static function toStoragePath(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: $url;

        if (str_starts_with($path, '/storage/')) {
            return ltrim(substr($path, strlen('/storage/')), '/');
        }

        return ltrim($path, '/');
    }

    public static function isStoragePath(?string $url): bool
    {
        if ($url === null || $url === '') {
            return false;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: $url;

        return str_starts_with($path, '/storage/');
    }
}
