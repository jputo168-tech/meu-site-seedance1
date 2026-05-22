export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt, cameraMotion, duration, aspectRatio } = req.body;

    // Aguarda 2 segundos para a barra de progresso encher lindamente no seu site
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Retorna uma resposta com um vídeo público do Google que nunca falha
    return res.status(200).json({
      success: true,
      promptUsado: prompt,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor: ' + error.message });
  }
}
