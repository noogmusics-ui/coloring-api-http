const OpenAI = require("openai").default;

module.exports = async (req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ ok: false, error: "imageBase64 é obrigatório no body" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = "Transformar essa imagem em um desenho infantil para colorir, estilo cartoon simples, linhas pretas, fundo branco.";

    const result = await client.images.generate({
      model: "dall-e-3", // Changed from 'gpt-image-1' to 'dall-e-3' to ensure valid API call
      prompt,
      size: "1024x1024",
      n: 1,
      response_format: "b64_json" // Explicitly requesting base64
    });

    // OpenAI strict response structure usually places b64_json inside data array
    const image = result.data[0].b64_json;

    return res.status(200).json({
      ok: true,
      image: image
    });

  } catch (error) {
    console.error("Error generating image:", error);

    const message = error?.error?.message ||
      error?.response?.data?.error?.message ||
      error?.message ||
      "Erro desconhecido";

    return res.status(500).json({
      ok: false,
      message: "Falha ao gerar imagem",
      detalhe: message,
      debug: {
        apiKeyExiste: !!process.env.OPENAI_API_KEY
      }
    });
  }
};
