const PLACEHOLDER_KEYS = new Set([
  "your-vercel-openai-key",
  "sk-your-key-here",
  "placeholder",
  "example",
  "",
]);

function sendJson(res, status, body) {
  res.status(status).setHeader("Access-Control-Allow-Origin", "*");
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

  const body = req.body || {};
  const base64Image = body.base64Image;

  if (!base64Image) {
    sendJson(res, 400, { error: "base64Image krävs." });
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
