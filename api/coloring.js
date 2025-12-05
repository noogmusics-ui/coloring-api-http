module.exports = async (req, res) => {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ ok: false, error: "imageBase64 é obrigatório" });
    }

    // Call OpenAI API using native fetch
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3", // Using a valid model instead of gpt-image-1
        prompt: "Transformar essa imagem em um desenho infantil para colorir, estilo cartoon simples, linhas pretas e fundo branco.",
        size: "1024x1024",
        n: 1,
        response_format: "b64_json"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro na API da OpenAI");
    }

    const image = data.data[0].b64_json;

    return res.status(200).json({
      ok: true,
      image: image
    });

  } catch (error) {
    console.error("Error generating image:", error);

    return res.status(500).json({
      ok: false,
      message: "Falha ao gerar imagem",
      detalhe: error.message || "Erro desconhecido",
      debug: {
        apiKeyExiste: !!process.env.OPENAI_API_KEY
      }
    });
  }
};
