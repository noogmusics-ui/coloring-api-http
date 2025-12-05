import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({
        ok: false,
        error: "imageBase64 é obrigatório",
      });
    }

    const prompt = "Transforme essa foto em um desenho infantil para colorir.";

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
      n: 1,
    });

    const base64Image = result.data[0].b64_json;

    return res.status(200).json({
      ok: true,
      image: base64Image,
    });

  } catch (error) {
    console.error("ERRO COMPLETO:", error);

    // CAPTURA TODAS AS FORMAS POSSÍVEIS DE ERRO DE OPENAI
    const openaiError =
      error?.error ||
      error?.response?.data?.error ||
      error;

    return res.status(500).json({
      ok: false,
      message: "Erro ao chamar OpenAI",
      detalhe: {
        message: openaiError?.message || null,
        type: openaiError?.type || null,
        code: openaiError?.code || null,
      },
      // para debug
      debug: {
        apiKeyExiste: !!process.env.OPENAI_API_KEY,
      }
    });
  }
}
