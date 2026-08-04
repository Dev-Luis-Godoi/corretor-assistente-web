const API_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Não foi possível conectar à API. Verifique se o backend está em execução.",
    );
  }
  if (!response.ok) {
    const payload = (await response
      .json()
      .catch(() => ({}))) as ApiErrorPayload;
    if (response.status === 401)
      window.dispatchEvent(
        new Event(
          path.startsWith("/platform-admin")
            ? "admin-auth:unauthorized"
            : "auth:unauthorized",
        ),
      );
    throw new ApiError(
      response.status,
      payload.error ?? "REQUEST_ERROR",
      payload.message ?? "Não foi possível concluir a solicitação.",
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
