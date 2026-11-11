## Install Dependencies

Install all required packages:

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the root directory.

```
MONGO_URI= <mongo_uri>
PORT= <port>
CORS_ALLOWED_ORIGINS= <comma_separated_origins>  # optional

# Authentication (required for write operations)
JWT_SECRET= <long_random_secret>
ADMIN_USERNAME= <admin_username>
ADMIN_PASSWORD= <admin_password>
JWT_EXPIRES_IN_SECONDS= <token_ttl_seconds>  # optional, defaults to 8 hours
```

CORS requests from the same host as the backend (for example the frontend dev
server on `http://localhost:5173` or `http://<your-lan-ip>:5173`) are always
allowed. Add any extra origins, such as other deployed domains, to
`CORS_ALLOWED_ORIGINS`.

`JWT_SECRET` and `ADMIN_PASSWORD` must be set for login to work. Until they are
configured, `POST /auth/login` returns `503` and write requests remain blocked.

## Authentication

Reading festivals is public. Creating, updating and deleting require a bearer
token obtained from the login endpoint.

- `POST /auth/login` with `{ "username": "...", "password": "..." }` returns
  `{ "data": { "token": "...", "user": { "username": "..." } } }`.
- `GET /auth/me` with `Authorization: Bearer <token>` returns the current user.
- `POST`, `PUT` and `DELETE /festival` require the same
  `Authorization: Bearer <token>` header.

## Run the Project
```bash
npm start
```