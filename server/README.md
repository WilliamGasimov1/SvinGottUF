# Lokal backend

Starta från projektroten:

```powershell
node --env-file=.env server/index.mjs
```

Testa sedan `http://localhost:8787/health`.

Backend läser helst `OPENAI_API_KEY`. Den kan även tillfälligt läsa det befintliga `EXPO_PUBLIC_OPENAI_KEY` från `.env`, men frontend skickar aldrig nyckeln längre.
