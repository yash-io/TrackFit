# TrackFit

TrackFit is a fitness tracking web application built with **Angular 15** and **ASP.NET Core 8**.

It helps users track fitness activities, workouts, meals, water intake, health information, and fitness progress from one application.

## Tech Stack

- **Frontend:** Angular 15, TypeScript
- **Backend:** ASP.NET Core 8 Web API, C#
- **Database:** Microsoft SQL Server
- **Authentication:** JWT
- **API Documentation:** Swagger
- **AI Assistant:** Azure OpenAI

## Repository

https://github.com/yash-io/TrackFit

## Features

- User registration and login
- Fitness dashboard
- Workout tracking
- Workout plans
- Meal and food tracking
- Water intake tracking
- Weekly activity tracking
- Health dashboard
- Leaderboard
- User profile
- Feedback
- Fitness AI assistant

## Project Structure

The repository contains:

- `TrackFitApp` - Angular frontend
- `TrackFitWebServices` - ASP.NET Core Web API
- `TrackFitDataAccessLayer` - Database and data-access layer
- `TrackFit.sln` - Visual Studio solution

## Requirements

Before running TrackFit, install:

- [Node.js](https://nodejs.org/)
- Angular CLI 15
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Microsoft SQL Server
- SQL Server Management Studio (recommended)

You can check your installed versions with:

```bash
node --version
npm --version
ng version
dotnet --version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yash-io/TrackFit.git
cd TrackFit
```

### 2. Set up the database

TrackFit uses SQL Server.

1. Open SQL Server Management Studio.
2. Create a database named `TrackFitDB`.
3. Open the SQL script:

```text
TrackFitDataAccessLayer/SQLQuery1.sql
```

4. Run the script against the `TrackFitDB` database.

### 3. Configure the backend

Open:

```text
TrackFitWebServices/appsettings.json
```

Update the database connection string to match your SQL Server installation.

For example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=TrackFitDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> Do not use or commit real passwords, API keys, or production secrets in `appsettings.json`.

### 4. Configure Azure OpenAI

TrackFit includes an AI fitness assistant using Azure OpenAI.

Set these environment variables before running the backend:

```text
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
```

The AI assistant also expects the Azure OpenAI deployment configured by the application.

If you do not plan to use the AI assistant, you can remove/disable the related AI functionality from the backend.

### 5. Run the backend

Open a terminal in the repository root:

```bash
cd TrackFitWebServices
dotnet restore
dotnet build
dotnet run
```

The API will start on the URL shown in the terminal.

When running in Development mode, Swagger is available from the API's Swagger URL.

### 6. Run the Angular frontend

Open another terminal:

```bash
cd TrackFitApp
npm install
npm start
```

The Angular application will normally be available at:

```text
http://localhost:4200
```

Make sure the frontend is configured to use the URL of the running ASP.NET Core API.

## Running the Application

You need the following running at the same time:

```text
SQL Server
    ↓
ASP.NET Core 8 API
    ↓
Angular 15 Application
```

Start the backend first:

```bash
cd TrackFitWebServices
dotnet run
```

Then start the frontend:

```bash
cd TrackFitApp
npm start
```

Open:

```text
http://localhost:4200
```

## Useful Commands

### Angular

```bash
npm start
```

Start the development server.

```bash
npm run build
```

Build the frontend.

```bash
npm test
```

Run frontend tests.

### .NET

```bash
dotnet restore
```

Restore backend dependencies.

```bash
dotnet build
```

Build the backend.

```bash
dotnet run
```

Run the API.

## Troubleshooting

### Database connection error

Check that:

- SQL Server is running.
- The `TrackFitDB` database exists.
- `SQLQuery1.sql` has been executed.
- The connection string in `appsettings.json` is correct.

### Frontend cannot connect to the API

Check that:

- The ASP.NET Core API is running.
- The API URL used by Angular is correct.
- The API port matches the configured frontend URL.

### AI assistant is not working

Check that:

```text
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_API_KEY
```

are configured correctly and that the Azure OpenAI deployment used by the application is available.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application.
5. Create a pull request.

## License

No license has been specified for this repository yet.

If you want others to freely use, modify, and distribute TrackFit, consider adding an open-source license such as MIT.

## Author

**Yash**

GitHub: https://github.com/yash-io
