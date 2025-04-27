# ShowCalendar.API Architecture

## Overview

This microservice handles calendar integration across Google, Apple, and Microsoft. It follows a Provider-Based Microservice pattern, balancing modularity and provider independence with the simplicity and consistency of a monolith. All provider communication is fully asynchronous, leveraging the Task/await pattern end-to-end across the service layer.

## Table of Contents

- [Overview](#overview)
- [Architecture Pattern: Provider-Based Microservice](#architecture-pattern-provider-based-microservice)
- [Current Directory Structure](#current-directory-structure)
- [Core Components](#core-components)
- [Provider Architecture](#provider-architecture)
- [Data Flow](#data-flow)
- [Configuration](#configuration)
- [Provider Registration System](#provider-registration-system)
- [Conclusion](#conclusion)

## Architecture Pattern: Provider-Based Microservice

- Modular Provider System
- Factory-Based Selection
- Configuration-Driven Activation

The Provider-Based Microservice pattern is characterized by:

1. **Modular Provider System**

   - Each calendar provider is a self-contained module
   - Providers can be enabled/disabled independently
   - Common interface (`ICalendarService`) for all providers
   - Base class (`CalendarServiceBase`) for shared functionality

2. **Factory-Based Provider Selection**

   - Factory pattern for provider management and discovery
   - Dynamic provider selection at runtime
   - Provider filtering and status reporting

3. **Configuration-Driven Activation**
   - Environment variables or configuration files control provider activation
   - Providers can be enabled/disabled without code changes
   - Loose coupling between components

## Current Directory Structure

```
ShowCalendar.API/
├── Controllers/                        # API ENDPOINTS
│   ├── AuthController.cs               # AUTHENTICATION ENDPOINTS
│   ├── CalendarController.cs           # CALENDAR EVENT ENDPOINTS
│   ├── TestController.cs               # TESTING ENDPOINTS
│   └── TokenController.cs              # TOKEN VALIDATION ENDPOINTS
├── Services/                           # BUSINESS LOGIC
│   ├── Common/                         # SHARED SERVICES
│   │   ├── CalendarServiceBase.cs      # BASE PROVIDER IMPLEMENTATION
│   │   └── CalendarServiceFactory.cs   # PROVIDER FACTORY
│   └── Providers/                      # PROVIDER IMPLEMENTATION
│       ├── Google/                     # GOOGLE CALENDAR IMPLEMENTATION
│       ├── Apple/                      # APPLE CALENDAR IMPLEMENTATION
│       └── Microsoft/                  # MICROSOFT CALENDAR IMPLEMENTATION
├── Models/                             # DATA MODELS
│   ├── Common/                         # SHARED MODELS
│   │   └── CalendarEvent.cs            # COMMON EVENT MODEL
│   ├── CalendarProvidersConfig.cs      # ROOT CONFIGURATION
│   └── Providers/                      # PROVIDER-SPECIFIC MODELS
│       ├── Google/                     # GOOGLE MODELS
│       ├── Apple/                      # APPLE MODELS
│       └── Microsoft/                  # MICROSOFT MODELS
├── Interfaces/                         # SERVICE INTERFACES
│   └── ICalendarService.cs             # CALENDAR SERVICE INTERFACE
├── Extensions/                         # SERVICE EXTENSIONS
└── DOCS/                               # DOCUMENTATION
```

## Core Components

### 1. API Layer (Controllers)

- **CalendarController**: Manages calendar event retrieval
- **AuthController**: Handles provider authentication
- **TestController**: Provides testing and status endpoints
- **TokenController**: Validates and tests access tokens

### 2. Service Layer

- **CalendarServiceBase**: Abstract base class for all calendar providers
- **CalendarServiceFactory**: Factory class for provider management
- **Provider Implementations**: Specific logic for each calendar provider
- **Provider Auth Services**: Authentication services for providers (MicrosoftAuthService)

### 3. Models

- **Common Models**: Shared data structures (CalendarEvent)
- **Provider-Specific Models**: Models specific to each provider
- **Configuration Models**: Provider configuration classes

## Provider Architecture

```
┌─────────────────────────────────────────────────────┐
│                 CalendarController                  │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│               CalendarServiceFactory                │
└───────┬─────────────────┬──────────────────┬────────┘
        │                 │                  │
        ▼                 ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│Google Calendar│ │Apple Calendar │ │Microsoft      │
│   Service     │ │   Service     │ │Calendar       │
│               │ │               │ │Service        │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                  │
        ▼                 ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│Google Calendar│ │Apple Calendar │ │Microsoft      │
│     API       │ │     API       │ │Calendar API   │
└───────────────┘ └───────────────┘ └───────────────┘
```

## Data Flow

### Request Flow

```
┌────────┐    ┌────────────┐    ┌────────────────┐    ┌─────────────┐    ┌─────────┐
│ Client │───►│ Controller │───►│ Service Factory│───►│ Provider(s) │───►│ External│
│        │    │            │    │                │    │             │    │ API     │
└────────┘    └────────────┘    └────────────────┘    └─────────────┘    └─────────┘
```

### Response Flow

```
┌────────┐    ┌────────────┐    ┌────────────────┐    ┌─────────────┐    ┌─────────┐
│ Client │◄───│ Controller │◄───│ Service Factory│◄───│ Provider(s) │◄───│ External│
│        │    │            │    │                │    │             │    │ API     │
└────────┘    └────────────┘    └────────────────┘    └─────────────┘    └─────────┘
```

## Configuration

The service uses a hybrid configuration approach:

### Environment Variables

Used for sensitive information and provider-specific settings:

```
# GOOGLE CALENDAR
GCP_CLIENT_ID
GCP_CLIENT_SECRET
GCP_APPLICATION_NAME
GCP_REFRESH_TOKEN
GCP_ENABLED

# APPLE CALENDAR
APPLE_CLIENT_ID
APPLE_CLIENT_SECRET
APPLE_REFRESH_TOKEN
APPLE_ENABLED

# MICROSOFT CALENDAR
MS_CLIENT_ID
MS_CLIENT_SECRET
MS_TENANT_ID
MS_APPLICATION_NAME
MS_REFRESH_TOKEN
MS_ENABLED
```

### Configuration Files (appsettings.json)

Used for general settings and provider activation:

```
{
  "CalendarProviders": {
    "Google": {
      "Enabled": true
    },
    "Apple": {
      "Enabled": false
    },
    "Microsoft": {
      "Enabled": false
    }
  }
}
```

## Provider Registration System

Provider services are registered via IServiceCollection extensions, enabling clean DI configuration.

```
┌────────────────────────────┐
│ ServiceCollectionExtensions│
└──────────────┬─────────────┘
               │
               ▼
┌──────────────────────────┐
│   Configure Providers    │
│                          │
│ ┌─────────┐ ┌─────────┐  │
│ │Configure│ │Configure│  │
│ │Provider1│ │Provider2│  │
│ └────┬────┘ └────┬────┘  │
└──────┼───────────┼───────┘
       │           │
       ▼           ▼
┌──────────┐  ┌──────────┐
│Provider 1│  │Provider 2│
│Service   │  │Service   │
└──────────┘  └──────────┘
```

## Conclusion

This architecture ensures extensibility, testability, and performance across multiple calendar providers, with minimal coupling and full async flow from controller to external API.
