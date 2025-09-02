const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
export async function getCatalog(q = "", limit = 50) {
  const url = new URL(`${API_BASE}/catalog`);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("limit", limit);
  const r = await fetch(url);
  return r.json();
}
export async function getSimilar(movieId, topN = 10) {
  const url = new URL(`${API_BASE}/recommend/similar`);
  url.searchParams.set("movie_id", movieId);
  url.searchParams.set("top_n", topN);
  const r = await fetch(url);
  return r.json();
}
export async function getHealth() {
  const r = await fetch(`${API_BASE}/health`);
  return r.json();
}
export async function recommendByForm(data) {
  const r = await fetch(`${API_BASE}/recommend/by_form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
