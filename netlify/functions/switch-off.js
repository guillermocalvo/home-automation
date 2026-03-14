export async function handler(event) {

  const { key, id } = event.queryStringParameters ?? {};

  if (!key) {
    return { statusCode: 400, body: "Missing 'key' parameter", };
  }

  if (!id) {
    return { statusCode: 400, body: "Missing 'id' parameter", };
  }

  const url = `https://api.smartthings.com/v1/devices/${encodeURIComponent(id)}/commands`;
  const payload = {
    "commands": [
      {
        "component": "main",
        "capability": "switch",
        "command": "off"
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await response.text();

    return { statusCode: response.status, body, };
  } catch {
    return { statusCode: 500, body: "Upstream request failed", };
  }
}
