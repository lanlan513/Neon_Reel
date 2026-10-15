const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';

/** Error carrying the HTTP status so pages can distinguish 404 from a dead server. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/** Thin JSON fetch wrapper: normalises the API's `{ error: { code, message } }` envelope. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      ...init,
    });
  } catch {
    throw new ApiError(0, '無法連接伺服器，請確認後端服務已啟動。', 'NETWORK_ERROR');
  }

  if (!response.ok) {
    let message = `請求失敗（HTTP ${response.status}）`;
    let code: string | undefined;
    try {
      const body = (await response.json()) as { error?: { code?: string; message?: string } };
      if (body.error?.message) message = body.error.message;
      code = body.error?.code;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new ApiError(response.status, message, code);
  }

  return (await response.json()) as T;
}
