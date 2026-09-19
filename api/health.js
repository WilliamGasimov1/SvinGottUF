export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  res.status(200).json({
    ok: true,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
}
