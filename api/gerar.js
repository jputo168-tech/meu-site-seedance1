export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt, cameraMotion, duration, aspectRatio } = req.body;
    const SEEDANCE_KEY = process.env.SEEDANCE_API_KEY;

    // Conectando com a API real do Seedance
    const seedanceResponse = await fetch('https://api.seedance.io/v2/video/generate', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SEEDANCE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        motion: cameraMotion,
        duration: parseInt(duration),
        aspect_ratio: aspectRatio
      })
    });

    const seedanceData = await seedanceResponse.json();

    // Devolve a URL real que o Seedance gerou para o seu site
    return res.status(200).json({
      success: true,
      promptUsado: prompt,
      videoUrl: seedanceData.video_url || seedanceData.url 
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor: ' + error.message });
  }
}
