type BackendResult = {
  message?: string;
  url?: string;
  downloadUrl?: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

async function parseBackendResponse(response: Response): Promise<BackendResult> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const message = await response.text();
    return { message };
  }

  return (await response.json()) as BackendResult;
}

async function requestBackend(path: string, init?: RequestInit): Promise<BackendResult> {
  const response = await fetch(`${apiBaseUrl}${path}`, init);
  const payload = await parseBackendResponse(response);

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export function getBackend(path: string) {
  return requestBackend(path);
}

export function postJson(path: string, body: Record<string, unknown>) {
  return requestBackend(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function postForm(path: string, formData: FormData) {
  return requestBackend(path, {
    method: "POST",
    body: formData,
  });
}
