from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import time

app = FastAPI(
    title="Search API",
    description="API for searching application data with keywords and filters.",
    version="1.0.0"
)

# Allow frontend to access backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example data to search (in real app, this would come from a database)
DATA = [
    {
        "id": 1,
        "title": "FastAPI Tutorial",
        "category": "Education",
        "tags": ["python", "api", "fastapi"],
        "is_public": True,
        "owner": "alice"
    },
    {
        "id": 2,
        "title": "React Guide",
        "category": "Education",
        "tags": ["javascript", "react"],
        "is_public": True,
        "owner": "bob"
    },
    {
        "id": 3,
        "title": "Private Notes",
        "category": "Personal",
        "tags": ["notes", "private"],
        "is_public": False,
        "owner": "alice"
    },
    # ... more items
]

# Response model for search results
class SearchResult(BaseModel):
    id: int
    title: str
    category: str
    tags: List[str]

# Simulate user authentication and permissions
def get_current_user():
    # In a real app, you'd get the user from a token/session
    # For demo, we just return a fixed user
    return "alice"

@app.get("/search", response_model=List[SearchResult])
def search(
    keywords: Optional[str] = Query(None, description="Keywords to search for"),
    category: Optional[str] = Query(None, description="Filter by category"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    only_public: bool = Query(True, description="Show only public items"),
    user: str = Depends(get_current_user)
):
    """
    Search application data using keywords and filters.
    Only returns data the user is allowed to view.
    """
    start_time = time.time()
    results = []

    for item in DATA:
        # Permission check: show public items or items owned by the user
        if not item["is_public"] and item["owner"] != user:
            continue

        # Filter by public/private
        if only_public and not item["is_public"]:
            continue

        # Filter by category
        if category and item["category"].lower() != category.lower():
            continue

        # Filter by tags
        if tags:
            if not set(tags).issubset(set(item["tags"])):
                continue

        # Keyword search in title and tags
        if keywords:
            kw = keywords.lower()
            if kw not in item["title"].lower() and not any(kw in t.lower() for t in item["tags"]):
                continue

        # Add to results
        results.append(SearchResult(
            id=item["id"],
            title=item["title"],
            category=item["category"],
            tags=item["tags"]
        ))

    # Performance check: ensure results are returned within 2 seconds
    elapsed = time.time() - start_time
    if elapsed > 2.0:
        raise HTTPException(status_code=503, detail="Search took too long. Please try again.")

    return results

# Simple root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Search API!"}

# To run: uvicorn backend.app.main:app --reload