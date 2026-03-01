// AIService.js
// Plug-and-Play AI Integration Module (LLMs, vision, custom AI)

const DEFAULT_TIMEOUT_MS = 15000;

async function postJson(url, payload, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const contentType = response.headers.get("content-type") || "";
    let parsed;
    if (contentType.includes("application/json")) {
      parsed = await response.json();
    } else {
      parsed = { text: await response.text() };
    }

    if (!response.ok) {
      const message = parsed?.error || parsed?.message || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}

function resolveText(data, fallback) {
  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  return data.response || data.result || data.output || data.text || fallback;
}

export default class AIService {
  static async callLLM(prompt) {
    const endpoint = import.meta.env.VITE_LLM_API_URL;
    if (endpoint) {
      const result = await postJson(endpoint, { prompt });
      return resolveText(result, `LLM response for: ${prompt}`);
    }

    return `LLM response for: ${prompt}`;
  }

  static async callVisionAPI(imageData) {
    const endpoint = import.meta.env.VITE_VISION_API_URL;
    if (endpoint) {
      const result = await postJson(endpoint, { imageData });
      return resolveText(result, "Vision API response for image data.");
    }

    return "Vision API response for image data.";
  }

  static async customModel(input) {
    const endpoint = import.meta.env.VITE_CUSTOM_MODEL_API_URL;
    if (endpoint) {
      const result = await postJson(endpoint, { input });
      return resolveText(result, `Custom model response for: ${input}`);
    }

    return `Custom model response for: ${input}`;
  }
}
