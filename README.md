# Coloring API

Este projeto é uma API Node.js pronta para Vercel, expondo a rota `/api/coloring` que transforma imagens em desenhos para colorir usando a OpenAI.

## 🚀 Instalação Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Para rodar localmente, você pode usar o `vercel dev` (se tiver a CLI da Vercel instalada) ou criar um script de teste simples.

## ☁️ Configuração na Vercel

1. Importe este repositório na Vercel.
2. Vá em **Settings → Environment Variables**.
3. Adicione uma nova variável:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Sua chave de API da OpenAI (começa com `sk-...`).
4. Faça o **Redeploy** (ou aguarde o próximo commit).

## 🔌 Uso da API

A API aceita requisições `POST` com um corpo JSON contendo a imagem em Base64.

### Exemplo com cURL

```bash
curl -X POST https://seu-projeto.vercel.app/api/coloring \
  -H "Content-Type: application/json" \
  -d "{\"imageBase64\":\"TESTE_BASE64_AQUI\"}"
```

### Formato da Resposta

Sucesso (`200 OK`):
```json
{
  "ok": true,
  "image": "BASE64_DA_IMAGEM_GERADA..."
}
```

Erro (`400`, `405`, `500`):
```json
{
  "ok": false,
  "message": "Falha ao gerar imagem",
  "detalhe": "Descrição do erro (ex: invalid_api_key)",
  "debug": {
    "apiKeyExiste": true
  }
}
```

> **Nota**: Se `ok` for `false`, verifique o campo `detalhe` para entender o problema (chave inválida, falta de créditos, etc).