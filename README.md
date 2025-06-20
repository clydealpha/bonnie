# Bonnie 2.0

This repository contains a prototype web application that demonstrates the "Execution Intelligence Engine" concept described in the Polycassava blueprint.  The front‑end dashboard lives in the `sei-dashboard` folder and can be served locally using a small Node server.

## Running the prototype

1. Install [Node.js](https://nodejs.org/) (v18 or later).
2. From the project root run `node server.js`.
3. Open `http://localhost:3000` in your browser.

The server serves the static files from `sei-dashboard` and exposes a few example API endpoints:

* `GET /api/plantations` – returns sample sensor data.
* `POST /api/decision` – records a decision in memory.
* `GET /api/decisions` – retrieves the stored decision log.

The dashboard (originally exported from Google AI Studio) is a single‑page application written in TypeScript.  To modify it directly you can open the files inside the `sei-dashboard` directory.  The build tooling (Vite) is included, but you can run the app without a build step using the provided server.

The `.env.local` file under `sei-dashboard` contains a placeholder Gemini API key.  Replace it with your own key if you plan to connect to the Gemini API.
