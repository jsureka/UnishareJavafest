export const HTTP_METHODS = [
  "GET",
  "HEAD",
  "OPTIONS",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
];

export default async function fetchAsync(
  url,
  method = "GET",
  body,
  headers,
  signal
) {
  const requestOptions = {
    method: method,
    headers: {
      ...(headers || {}),
      ...(body && body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
    body:
      typeof body === "undefined"
        ? undefined
        : typeof body === "string"
        ? body
        : body instanceof FormData
        ? body
        : JSON.stringify(body),
    signal: signal,
  };

  const response = await fetch(url, requestOptions);

  if (!response || !response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}
