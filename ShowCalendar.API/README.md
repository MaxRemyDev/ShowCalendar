# ShowCalendar.API - Google Calendar Integration

This microservice API allows fetching calendar data from Google Calendar (Apple and Microsoft Calendar support planned).

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

### Calendar Endpoints

```
GET /api/calendar/events
```

Fetching calendar events from the past 30 days to the next 30 days.

```
GET /api/calendar/events?startDate={startDate}&endDate={endDate}&provider={provider}
```

Parameters:

- `startDate`: Start date for events (ISO format)
- `endDate`: End date for events (ISO format)
- `provider`: Optional - Filter by provider (e.g., "Google")

Example:

```
GET /api/calendar/events?startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z
```

### Test Endpoints

```
GET /api/test/calendar/status
```

Shows the configuration status of the Google Calendar integration.

```
GET /api/test/calendar/events
```

Tests fetching calendar events from the past 30 days to the next 30 days.

### Provider Information

```
GET /api/calendar/providers
```

Returns a list of available calendar providers.
