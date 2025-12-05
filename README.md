# Coloring API

Este projeto é uma API Node.js minimalista pronta para Vercel, sem dependências externas.
Expõe a rota `/api/coloring` que transforma imagens em desenhos para colorir usando a OpenAI.

## 🚀 Estrutura
- **Sem dependências npm**: Usa apenas recursos nativos do Node.js (como `fetch`).
- **Pronto para Vercel**: Estrutura otimizada para Serverless Functions.

## ☁️ Configuração na Vercel

1. Importe este repositório na Vercel.
2. Vá em **Settings → Environment Variables**.
3. Adicione a variável:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Sua chave de API da OpenAI (`sk-...`).
4. Faça o **Redeploy**.

> **Nota**: Verifique se o Node.js está configurado para a versão 18.x ou superior no painel da Vercel (General > Node.js Version) para garantir suporte nativo ao `fetch`.

## 🔌 Exemplo de Uso (cURL)

```bash
curl -X POST https://seu-projeto.vercel.app/api/coloring \
  -H "Content-Type: application/json" \
  -d "{\"imageBase64\":\"TESTE_BASE64...\"}"
```

### Resposta

Sucesso:
```json
{
  "ok": true,
  "image": "BASE64_DA_IMAGEM_GERADA..."
}
```

Erro:
```json
{
  "ok": false,
  "message": "Falha ao gerar imagem",
  "detalhe": "Descrição do erro",
  "debug": { "apiKeyExiste": true }
}
```