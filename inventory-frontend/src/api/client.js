// Thin fetch wrapper used by every API module.
// - Builds query strings (skips empty values)
// - Sends JSON or multipart bodies
// - Turns failed responses into ApiError with a readable message

export const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, fieldErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function buildQuery(params) {
  if (!params) return '';
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    qs.append(key, value);
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// Spring error bodies vary. Handle the common shapes:
//   { message }, { error }, { errors: { field: msg } }, { errors: [{ field, message }] }
function readFieldErrors(body) {
  const raw = body?.errors ?? body?.fieldErrors;
  if (!raw) return null;

  if (Array.isArray(raw)) {
    const map = {};
    raw.forEach((e) => {
      if (e?.field) map[e.field] = e.defaultMessage || e.message || 'Invalid value';
    });
    return Object.keys(map).length ? map : null;
  }

  if (typeof raw === 'object') {
    const map = {};
    Object.entries(raw).forEach(([field, msg]) => {
      map[field] = Array.isArray(msg) ? msg[0] : String(msg);
    });
    return Object.keys(map).length ? map : null;
  }

  return null;
}

async function toApiError(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* response had no JSON body */
  }

  const fieldErrors = readFieldErrors(body);
  const firstField = fieldErrors ? Object.values(fieldErrors)[0] : null;
  const message =
    body?.message ||
    firstField ||
    body?.detail ||
    body?.error ||
    `Request failed (${res.status})`;

  return new ApiError(message, res.status, fieldErrors);
}

export async function request(path, { method = 'GET', params, json, formData, signal } = {}) {
  const init = { method, signal, headers: { Accept: 'application/json' } };

  if (json !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(json);
  } else if (formData) {
    // Do not set Content-Type: the browser adds the multipart boundary.
    init.body = formData;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}${buildQuery(params)}`, init);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the server. Check that the backend is running.', 0);
  }

  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
