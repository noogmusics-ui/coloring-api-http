export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY não configurada." });
    }

    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    let parsed;
    try {
      parsed = JSON.parse(body || "{}");
    } catch (e) {
      return res.status(400).json({ error: "Body inválido, deve ser JSON." });
    }

    const extraPrompt = parsed.extraPrompt || "";

    const basePrompt = `
      Crie um desenho de contorno em preto e branco,
      no estilo página de colorir infantil,
      com traço inspirado em quadrinhos (tipo Liga da Justiça),
      simples e limpo para crianças pintarem.
      Fundo totalmente branco, linhas pretas fortes e sem sombras realistas.
    `;

    const fullPrompt = extraPrompt
      ? basePrompt + "\nDetalhe extra: " + extraPrompt
      : basePrompt;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: fullPrompt,
        size: "1024x1024",
        n: 1
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Erro da OpenAI:", errText);
      return res.status(500).json({ error: "Falha ao gerar imagem na OpenAI." });
    }

    const data = await response.json();
    const imageBase64 = data.data?.[0]?.b64_json;
    if (!imageBase64) {
      return res.status(500).json({ error: "Resposta sem imagem da OpenAI." });
    }

    return res.status(200).json({ image: imageBase64 });
  } catch (err) {
    console.error("Erro interno:", err);
    return res.status(500).json({ error: "Erro interno ao gerar desenho." });
  }
}