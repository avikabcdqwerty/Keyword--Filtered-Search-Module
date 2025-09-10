import React, { useState } from "react";

// API endpoint for search
const API_URL = "http://localhost:8000/search";

// Types for search results
type SearchResult = {
  id: number;
  title: string;
  category: string;
  tags: string[];
};

const categories = ["Education", "Personal"];
const allTags = ["python", "api", "fastapi", "javascript", "react", "notes", "private"];

function App() {
  // State for search input and filters
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyPublic, setOnlyPublic] = useState(true);

  // State for results and loading/error
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle tag selection
  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    // Build query params
    const params = new URLSearchParams();
    if (keywords) params.append("keywords", keywords);
    if (category) params.append("category", category);
    if (selectedTags.length > 0) {
      selectedTags.forEach((tag) => params.append("tags", tag));
    }
    params.append("only_public", onlyPublic ? "true" : "false");

    try {
      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Search failed. Try again.");
      }
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Search Application Data</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        {/* Keyword input */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Keywords:{" "}
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Type keywords..."
              style={{ width: 200 }}
            />
          </label>
        </div>

        {/* Category filter */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Category:{" "}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: 150 }}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Tags filter */}
        <div style={{ marginBottom: 12 }}>
          <label>Tags:</label>
          <div>
            {allTags.map((tag) => (
              <label key={tag} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Public/private filter */}
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={onlyPublic}
              onChange={() => setOnlyPublic((v) => !v)}
            />
            Show only public items
          </label>
        </div>

        {/* Search button */}
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error message */}
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

      {/* Results */}
      <div>
        <h2>Results ({results.length})</h2>
        {results.length === 0 && !loading && <div>No results found.</div>}
        <ul>
          {results.map((item) => (
            <li key={item.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
              <strong>{item.title}</strong> <br />
              Category: {item.category} <br />
              Tags: {item.tags.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;