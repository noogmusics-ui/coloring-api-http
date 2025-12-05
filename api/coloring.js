// api/coloring.js

const OpenAI = require("openai").default;

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({
        ok: false,
        error: "imageBase64 é obrigatório no body",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt =
      "Transforme essa imagem em um desenho infantil para colorir, com traços simples, bordas pretas e estilo cartoon.";

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 1,
    });

    const image = result.data[0].b64_json;

    return res.status(200).json({
      ok: true,
      image,
    });
  } catch (error) {
    console.error("ERRO DA OPENAI:", error);

    // Captura mensagens úteis
    const errorMessage =
      error?.error?.message ||
      error?.response?.data?.error?.message ||
      error?.message ||
      "Erro desconhecido";

    return res.status(500).json({
      ok: false,
      message: "Falha ao gerar imagem",
      detalhe: errorMessage,
      debug: {
        apiKeyExiste: !!process.env.OPENAI_API_KEY,
      },
    });
  }
};
