import http from "node:http";
import https from "node:https";

const port = Number(process.env.PORT || 8787);
const PLACEHOLDER_KEYS = new Set([
  "your-vercel-openai-key",
  "sk-your-key-here",
  "placeholder",
  "example",
  "",
]);
const apiKey = (
  process.env.OPENAI_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_KEY ||
  ""
).trim();
const hasValidApiKey =
  Boolean(apiKey) && !PLACEHOLDER_KEYS.has(apiKey.toLowerCase());

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 25_000_000) reject(new Error("Request too large"));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function askOpenAI(base64Image) {
  const payload = JSON.stringify({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'Identifiera alla synliga matvaror i kylskåpet. Returnera endast JSON i formatet {"ingredients":[{"name":"tomat","quantity":"4 st","emoji":"tomat","expiring":false}]}. Gissa inte om du inte ser varan.',
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` },
          },
        ],
      },
    ],
  });

  return new Promise((resolve, reject) => {
    const request = https.request(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`OpenAI returned ${response.statusCode}`));
            return;
          }
          try {
            const result = JSON.parse(body);
            const content = JSON.parse(
              result.choices?.[0]?.message?.content || "{}",
            );
            resolve(
              Array.isArray(content.ingredients) ? content.ingredients : [],
            );
          } catch {
            reject(new Error("Invalid AI response"));
          }
        });
      },
    );
    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { ok: true, aiConfigured: Boolean(apiKey) });
    return;
  }
  if (request.method === "POST" && request.url === "/analyze-fridge") {
    if (!hasValidApiKey) {
      sendJson(response, 500, {
        error:
          "OPENAI_API_KEY saknas eller är en platshållare. Lägg in en riktig nyckel i .env innan du kör analysen.",
      });
      return;
    }
    try {
      const body = JSON.parse(await readBody(request));
      if (!body.base64Image) {
        sendJson(response, 400, { error: "base64Image krävs." });
        return;
      }
      const ingredients = await askOpenAI(body.base64Image);
      sendJson(response, 200, { ingredients });
    } catch (error) {
      sendJson(response, 502, {
        error: error.message || "Analysen misslyckades.",
      });
    }
    return;
  }
  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`FoodApp backend kör på http://localhost:${port}`);
});
