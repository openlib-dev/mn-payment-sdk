export async function fetchWithJson<T>(
  url: string,
  method: string,
  body?: object
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export const f2s = (f: number): string => {
  return f.toFixed(2);
};
