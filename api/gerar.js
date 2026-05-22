export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt, cameraMotion, duration, aspectRatio } = req.body;

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const SEEDANCE_KEY = process.env.SEEDANCE_API_KEY;

    let promptMelhorado = prompt;

    // Bloco protegido: Se o Gemini falhar (Erro 400), o código não quebra e usa o seu prompt original
    try {
      if (GEMINI_KEY) {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Melhore este prompt para geração de vídeo IA mantendo o sentido original de forma direta e concisa: ${prompt}` }] }]
          })
        });
        
        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          promptMelhorado = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || prompt;
        }
      }
    } catch (e) {
      console.log("A otimização do Gemini falhou, usando prompt original.");
    }

    // Envio para o Seedance 2.0
    const seedanceResponse = await fetch('https://api.seedance.io/v2/video/generate', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SEEDANCE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: promptMelhorado,
        motion: cameraMotion,
        duration: parseInt(duration),
        aspect_ratio: aspectRatio
      })
    });

    const seedanceData = await seedanceResponse.json();

    return res.status(200).json({
      success: true,
      promptUsado: promptMelhorado,
      videoUrl: seedanceData.video_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" 
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor: ' + error.message });
  }
}