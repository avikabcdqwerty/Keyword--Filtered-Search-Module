# Search Application

This project lets users search application data using keywords and filters, making it easy to find relevant information quickly.

## Features

- **Keyword Search:** Type keywords to find matching data.
- **Filter by Category and Tags:** Refine results using category and tags.
- **Public/Private Data:** Only see data you are allowed to view.
- **Fast Results:** Search returns results within 2 seconds under normal load.

## Project Structure

```
backend/
  app/
    main.py        # FastAPI backend entrypoint
frontend/
  src/
    App.tsx        # Main React frontend entrypoint
README.md          # This file
```

## How It Works

- The **backend** uses FastAPI to provide a `/search` API endpoint.
- The **frontend** is a React app with a simple search form and results list.
- Users can enter keywords, select categories, choose tags, and filter public/private data.
- Only authorized data is shown in results.

---

## Getting Started

### Prerequisites

- **Backend:** Python 3.9+ and `pip`
- **Frontend:** Node.js 18+ and `npm` or `yarn`

---

### 1. Run the Backend (FastAPI)

1. Install dependencies:

    ```bash
    cd backend
    pip install fastapi uvicorn
    ```

2. Start the server:

    ```bash
    uvicorn app.main:app --reload
    ```

- The backend runs at `http://localhost:8000`

---

### 2. Run the Frontend (React)

1. Install dependencies:

    ```bash
    cd frontend
    npm install
    ```

2. Start the app:

    ```bash
    npm start
    ```

- The frontend runs at `http://localhost:3000`

---

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Enter keywords, select category, choose tags, and set public/private filter.
3. Click **Search** to see results.

---

## API Reference

### `GET /search`

Search application data.

**Query Parameters:**

- `keywords` (string): Search keywords
- `category` (string): Filter by category
- `tags` (array of string): Filter by tags
- `only_public` (boolean): Show only public items

**Example:**

```
/search?keywords=react&category=Education&tags=javascript&only_public=true
```

**Response:**

```json
[
  {
    "id": 2,
    "title": "React Guide",
    "category": "Education",
    "tags": ["javascript", "react"]
  }
]
```

---

## Filter Options

- **Categories:** Education, Personal
- **Tags:** python, api, fastapi, javascript, react, notes, private
- **Public/Private:** Toggle to show only public items or include private items you own

---

## Notes

- This is a demo project. In a real app, data would come from a database and authentication would be implemented.
- For development, CORS is enabled for all origins.

---

## License

MIT