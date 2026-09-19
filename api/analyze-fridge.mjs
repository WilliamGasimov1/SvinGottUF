const PLACEHOLDER_KEYS = new Set([
  "your-vercel-openai-key",
  "sk-your-key-here",
  "placeholder",
  "example",
  "",
]);

function sendJson(res, status, body) {
  res.status(status);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.json(body);
}

function parseOpenAIResponse(body) {
  try {
    const payload = JSON.parse(body || "{}");
    const responseText = payload.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(responseText);
    return Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
  } catch {
    return [];
  }
}

async function readRequestBody(req) {
  if (req.body) {
    return typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Only POST is allowed." });
    return;
  }

  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  const hasValidApiKey =
    Boolean(apiKey) && !PLACEHOLDER_KEYS.has(apiKey.toLowerCase());

  if (!hasValidApiKey) {
    sendJson(res, 500, {
      error:
        "OPENAI_API_KEY saknas eller är en platshållare. Lägg in en riktig nyckel i Vercel miljövariabler.",
    });
    return;
  }

  const body = await readRequestBody(req);
  const base64Image = String(body.base64Image || "")
    .replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "")
    .trim();

  if (!base64Image) {
    sendJson(res, 400, { error: "base64Image krävs." });
    return;
  }

  const approximateBytes = Math.ceil((base64Image.length * 3) / 4);
  if (approximateBytes > 1_600_000) {
    sendJson(res, 413, {
      error:
        "Bilden är för stor för att analysera. Ta ett nytt foto med mindre storlek eller bättre ljus.",
    });
    return;
  }

  try {
    const payload = {
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
    };

    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const rawText = await openAiResponse.text();

    if (!openAiResponse.ok) {
      throw new Error(rawText || `OpenAI returned ${openAiResponse.status}`);
    }

    const ingredients = parseOpenAIResponse(rawText);
    sendJson(res, 200, { ingredients });
  } catch (error) {
    sendJson(res, 502, {
      error: error.message || "Analysen misslyckades.",
    });
  }
}
