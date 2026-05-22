export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;
    // A Vercel vai continuar puxando sua chave normalmente
    const OPENROUTER_KEY = process.env.SEEDANCE_API_KEY; 

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://seu-site-seedance.vercel.app', // O OpenRouter exige um Referer
        'X-Title': 'Gerador Seedance'
      },
      body: JSON.stringify({
        model: "bytedance/seedance-2.0",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    
    // O OpenRouter devolve a resposta no formato de chat
    const respostaTexto = data.choices?.[0]?.message?.content || "";
    
    // Filtra o link do vídeo (.mp4) dentro da resposta
    const videoMatch = respostaTexto.match(/https?:\/\/[^\s"']+\.mp4/);
    const videoUrl = videoMatch ? videoMatch[0] : null;

    if (!videoUrl) {
      // Se não for instantâneo, ele pode devolver um status de carregamento
      return res.status(400).json({ error: 'Sem vídeo direto. Resposta do OpenRouter: ' + respostaTexto });
    }

    return res.status(200).json({
      success: true,
      promptUsado: prompt,
      videoUrl: videoUrl
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor: ' + error.message });
  }
}
