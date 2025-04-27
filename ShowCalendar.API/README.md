# ShowCalendar.API - Calendar Integration

This microservice API allows fetching calendar data from multiple providers (Google, Apple, Microsoft).

## Documentation

- [ARCHITECTURE](DOCS\ARCHITECTURE.md)

## API Endpoints

### Authentication Endpoints

```
GET /api/auth/google/login
```

Redirects to Google OAuth2 flow to authenticate and authorize the application.

```
GET /api/auth/google/callback
```

Callback endpoint for Google OAuth2 process. Returns the refresh token.

```
GET /api/auth/microsoft/login
```

Redirects to Microsoft OAuth2 flow to authenticate and authorize the application.

```
GET /api/auth/microsoft/callback
```

Callback endpoint for Microsoft OAuth2 process. Returns the refresh token.

### Calendar Endpoints

```
GET /api/calendar/events
```

Fetching calendar events from all enabled providers from the past 30 days to the next 30 days.

```
GET /api/calendar/events?startDate={startDate}&endDate={endDate}&provider={provider}
```

Parameters:

- `startDate`: Start date for events (ISO format)
- `endDate`: End date for events (ISO format)
- `provider`: Optional - Filter by provider (e.g., "Google", "Apple", "Microsoft")

Example:

```
GET /api/calendar/events?startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z
```

### Test Endpoints

```
GET /api/test/calendar/status
```

Shows the configuration status of all enabled calendar providers.

```
GET /api/test/calendar/events
```

Tests fetching calendar events from the past 30 days to the next 30 days.

### Token Endpoints

```
GET /api/token/test?accessToken={accessToken}&provider={provider}
```

Tests the validity of an access token for the specified provider. Provider can be:

- A specific provider name ("Google", "Apple", "Microsoft")
- "auto" to automatically detect the provider (default if not specified)

```
GET /api/token/env
```

Shows the environment variables configured for all enabled providers. (EXCLUSIVE DEBUGGING)

### Provider Information

```
GET /api/calendar/providers
```

Returns a list of all enabled calendar providers.

```
GET /api/calendar/status
```

Returns the status and configuration details of all calendar providers including provider name, enabled status, and associated email.
