const API_URL = "http://localhost:9696";

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Error en la petición");
  }

  return await response.json();
}
