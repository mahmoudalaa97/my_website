# Postman / newman

End-to-end test collection for the `apps/api-php` Laravel API. The folders run in order; each request has assertions in its **Tests** tab.

## Files

- `my-website-api.postman_collection.json` — the collection (Postman v2.1).
- `local.postman_environment.json` — local env (`baseUrl`, `email`, `password`).

## Run in Postman

Import both files. Open the collection, **Run** → make sure the local env is selected → Run.

## Run from the CLI (newman)

```bash
# one-time
npm i -g newman

# run the whole suite against a running API on :8000
newman run postman/my-website-api.postman_collection.json \
  -e postman/local.postman_environment.json
```

To point at a different host (staging/prod), override `baseUrl`:

```bash
newman run postman/my-website-api.postman_collection.json \
  --env-var baseUrl=https://api.example.com/api \
  --env-var email=admin@example.com \
  --env-var password=...
```

## What it covers

| Folder | Scope |
|---|---|
| Health | `/health`, `/health/live`, `/health/ready` |
| Public reads | `/settings`, `/settings/branding`, `/services`, `/packages`, `/projects`, `/projects/featured` |
| Auth — negative | wrong password, no-token access to protected routes |
| Auth — login | login captures `accessToken` for later requests; verifies `auth/me` |
| Profile | `GET /profile`, `PUT /profile` |
| Settings | happy-path PUT; over-long input → friendly 500 error |
| Services / Packages / Projects | full CRUD with cleanup |
| Messages | anon POST, list, stats, mark read/archive/unarchive, delete |
| Users | list, create, get, update, suspend, activate, reset-password, delete |
| Upload | listing endpoints |
| 404 handling | unknown path returns JSON envelope |
| Auth — logout | revoke token |

## Notes

- The collection captures the bearer token from the login response and reuses it for all authenticated requests via collection-level bearer auth.
- Public endpoints set `auth: noauth` per request so they don't carry the token.
- CRUD folders capture the created resource ID into a collection variable and clean it up with the matching DELETE.
