# coloring-api-http

API extremamente simples para gerar desenhos de contorno em preto e branco
(páginas de colorir) usando o endpoint HTTP de imagens da OpenAI.

## Endpoint

POST /api/coloring

Body JSON:
{
  "extraPrompt": "texto opcional para detalhar o desenho"
}

Resposta:
{
  "image": "BASE64_DA_IMAGEM_GERADA"
}

É necessário definir a variável de ambiente OPENAI_API_KEY na Vercel.