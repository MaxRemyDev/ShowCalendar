# SHOWCALENDAR

[VERSION_BADGE]: https://img.shields.io/badge/version-WIP-blue.svg
[LICENSE_BADGE]: https://img.shields.io/badge/license-MIT-blue.svg
[LICENSE_URL]: LICENSE
[TOTAL_STABILITY]: https://img.shields.io/badge/Total%20Stability-100%25-blue
[CHANGELOG_BADGE]: https://img.shields.io/badge/CHANGELOG-blue.svg
[CHANGELOG_URL]: CHANGELOG.md
[TODO_BADGE]: https://img.shields.io/badge/TODO-blue.svg
[TODO_URL]: TODO.md
[DOCS_BADGE]: https://img.shields.io/badge/DOCS-blue.svg
[DOCS_URL]: docs/

![Version][VERSION_BADGE] [![License][LICENSE_BADGE]][LICENSE_URL] ![Stability][TOTAL_STABILITY] [![CHANGELOG][CHANGELOG_BADGE]][CHANGELOG_URL] [![TODO][TODO_BADGE]][TODO_URL] [![Documentation][DOCS_BADGE]][DOCS_URL]

**ShowCalendar** is an open-source solution designed to integrate your personal and professional calendars into a **fully customizable** structure.  
Unlike standard scheduling tools, ShowCalendar offers you **total freedom**: adapt the UI, customize internal workflows, control hosting (self-hosted or managed), and design a completely tailored calendar experience.

## Choose your level of flexibility

- **Fast Integration**: hosted by ShowCalendar, with ready-to-use templates for instant deployment.
- **Custom Integration**: hosted by ShowCalendar, but fully designed and integrated your own way.
- **Developer-Friendly Structure**: fully self-hosted, completely customizable, with or without technical assistance.

Designed for companies, freelancers, developers, and individuals, ShowCalendar lets you **display**, **share**, or **synchronize** your availabilities directly on your website, portfolio, or privately with friends, family, or colleagues - **with a fully personalized touch**.

ShowCalendar also acts as a **Unified Calendar Hub**:  
You can connect multiple calendars from different providers (Google, Microsoft, Apple, and more), manage all your personal, professional, and academic calendars in one single dashboard, and share your availability with others in a centralized and easy-to-use interface.

Others can view your real-time availability across all your connected calendars, and schedule meetings or appointments with you seamlessly, through either your self-hosted instance or our hosted service.

Whether you're looking to embed a simple calendar on your site, build a complex availability management system, or share multiple calendars privately, **ShowCalendar is ready to use, fully self-hostable, and 100% customizable**.

---

## Key Features

- **Connect multiple calendar providers** Google Calendar, Microsoft Outlook, Apple iCloud, and more
- **Fully customizable** UI and workflows
- **Share your availability across** personal, professional, and academic calendars
- **Self-hosted** or hosted solutions
- **Developer-friendly** architecture with modular microservices
- **Mobile apps** for iOS and Android
- **Web** user dashboard, and admin panel ready

---

## Architecture Overview

ShowCalendar is composed of several modular microservices:

- **ShowCalendar.API** : C# - ASP.NET Core - Backend API exposing unified calendar endpoints

- **ShowCalendar.Database** : C# - MySQL - Centralized database for users, events, logs, and settings

- **ShowCalendar.App** : Mobile clients

  - **iOS** : built with SwiftUI or Flutter
  - **Android** : built with Kotlin or Flutter

- **ShowCalendar.Web** : Web Clients (Next.js & Tailwind CSS)
  - **Landing Page** : Public marketing website & user onboarding
  - **Dashboard** : User dashboard to manage and view calendars
  - **Admin Panel** : Internal admin interface for monitoring users, events, and system stats

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
