# Tesli

Tesli is a web application built to help small private tutoring businesses to manage administrative tasks such as maintaining student profiles, managing lesson schedules, and keeping track of attendance and payments.

The application has an Angular 6 front-end and a .NET Core 2.1 (RESTful Web API) back-end. Data is stored in a SQLite database.

## Features

The current **version 0.1** is a minimum viable product and has 2 main features - Student Profiles and Calendar.

- **Student Profiles** is where details about learners are stored. These include Name and Contact Information, Schooling Details, and Goals.

- **Calendar** allows users to schedule and manage lessons, keep track of attendance, payments, and pricing.
    - Month and day views are available, and lessons can be rescheduled by dragging and dropping them or via a dialog.
    - Lessons can be repeated a number of times at a desired interval of days.
    - Lessons can be cancelled and restored.
    - Prices are automatically calculated, according to a sliding scale based on the number of learners attending the lesson. Manual prices can be captured as needed.

## Roadmap

These are future features envisioned for Tesli

- **Finances** 
    - Capture payments received.
    - Keep financial history in per student accounts.
    - Generate monthly invoices.

- **Users**
    - Users that can log in with their Facebook/Google accounts, allowing for different roles and permissions on the system

- **Tutors**
    - Keep a tutor database, so that multiple tutors may be managed through the system. 
        - Financial accounts and rates for tutors.
        - Calendar schedules per tutor.

- **Subjects**
    - Allow for lessons to be given in a number of subjects.

- **Deployment to the Web**
    - Currently the app is deployed to the user's own network/computer. Eventually the aim is to make it public-facing on the Web.

- **Self-Administration**
    - Allow multiple tutors/companies to manage their own student databases, schedules and finances. 
    - Allow students/parents/guardians to manage their information, schedules and find tutors.

- **Reports**
    - Various reports on finances, learner progress and lesson analytics

## Build

There is a build PowerShell script in the root of the project, which can be used for Continuous Integration.

This script performs the following tasks 
* Run back-end tests using `dotnet test`
* Run front-end tests using `ng test`
* Publish back-end to a configurable deploy folder using `dotnet publish`
* Update the published SQLite database, running EFCore migrations and applying any custom scripts using a custom tool (Tesli.Database.Sqlite)
* Build front-end using `ng build` and publish to deploy folder

The build artifacts, published to the deployRoot parameter of the build script, are manually configured to run on IIS (or a web server of choice)

There are environment specific settings files (front-end/src/environments/environment.\*.ts and back-end/Tesli.Api/web.\*.config and appsettings.\*.json) that can be modified as needed. The current build environments are "staging" and "production" (eg run `.\build.ps1 staging` for a staging build)

## Feedback

Please provide feedback, bug reports and feature suggestions in the issues section, but please be aware that this is a hobby project that only gets a handful of hours per week. 
If you can contribute to the code-base, you are wholeheartedly encouraged to do so 😊