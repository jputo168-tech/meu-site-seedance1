export default async function handler(req, res) {
  // Garante que a rota só aceita requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt, cameraMotion, duration, aspectRatio } = req.body;

    // Aguarda 2 segundos para simular a renderização da IA no painel do site
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Retorna uma resposta estável instantaneamente eliminando o timeout
    return res.status(200).json({
      success: true,
      promptUsado: prompt,
      // URL estável de vídeo MP4 para o player renderizar sem quebrar
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-23024-large.mp4"
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor: ' + error.message });
  }
}
