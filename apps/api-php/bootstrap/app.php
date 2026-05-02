<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \App\Http\Middleware\AuthenticateFromCookie::class,
        ]);
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);

        // For JSON APIs, "" from the client means "clear this field" — don't
        // coerce to null (breaks NOT NULL columns) or trim user input.
        $apiExcept = fn ($request) => $request->is('api/*');
        $middleware->convertEmptyStringsToNull(except: [$apiExcept]);
        $middleware->trimStrings(except: [$apiExcept]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not found',
                ], 404);
            }
        });

        $exceptions->render(function (\Illuminate\Database\QueryException $e, $request) {
            if (!$request->is('api/*')) {
                return null;
            }
            \Illuminate\Support\Facades\Log::error('API database error', [
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'message' => $e->getMessage(),
            ]);

            $sqlState = $e->errorInfo[0] ?? null;
            $code = $e->errorInfo[1] ?? null;

            $message = match (true) {
                $sqlState === '23000' && in_array($code, [1062], true)
                    => 'This entry already exists.',
                $sqlState === '23000' && in_array($code, [1451, 1452], true)
                    => 'This change conflicts with related records.',
                $sqlState === '23000'
                    => 'Some required fields are missing or invalid.',
                $sqlState === '22001'
                    => 'One of the values is too long.',
                $sqlState === '42S02', $sqlState === '42S22'
                    => 'The server is misconfigured. Please contact support.',
                default => 'We could not complete your request. Please try again.',
            };

            return response()->json([
                'success' => false,
                'message' => $message,
                ...(config('app.debug') ? ['debug' => $e->getMessage()] : []),
            ], 500);
        });

        $exceptions->render(function (\Throwable $e, $request) {
            if (!$request->is('api/*')) {
                return null;
            }
            // Let HttpException-derived responses (4xx) flow through unchanged.
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                return null;
            }
            \Illuminate\Support\Facades\Log::error('API unhandled error', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'file' => $e->getFile().':'.$e->getLine(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.',
                ...(config('app.debug') ? ['debug' => $e->getMessage()] : []),
            ], 500);
        });
    })->create();
