export async function handler(event) {

  const { key, id } = event.queryStringParameters ?? {};

  if (!key) {
    return { statusCode: 400, body: "Missing 'key' parameter", };
  }

  if (!id) {
    return { statusCode: 400, body: "Missing 'id' parameter", };
  }

  const statusUrl = `https://api.smartthings.com/v1/devices/${encodeURIComponent(id)}/status`;
  const url = `https://api.smartthings.com/v1/devices/${encodeURIComponent(id)}/commands`;

  try {
    const statusRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${key}`,
      },
    });

    if (!statusRes.ok) {
      return { statusCode: 502, body: "Status request failed", };
    }

    const statusJson = await statusRes.json();
    const currentValue = statusJson?.components?.main?.switch?.switch?.value;
    const payload = {
      "commands": [
        {
          "component": "main",
          "capability": "switch",
          "command": currentValue === "on" ? "off" : "on"
        }
      ]
    };

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
