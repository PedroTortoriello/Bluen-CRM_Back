// routes/chatwootRouter.js
import express from 'express';
import { ChatwootController } from '../controllers/ChatwootController.js';
const router = express.Router();

// Rota unificada para o frontend
router.get("/", async (req, res) => {
  try {
    // Chama diretamente o axios do Chatwoot, sem passar pelo res.json() do controller
    const inboxId = req.query.inbox_id;
    const url = inboxId ? `/conversations?inbox_id=${inboxId}` : "/conversations";
    const response = await ChatwootController.api.get(url);

    // Retorna o resultado para o frontend
    res.json({ conversations: response.data });
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    res.status(500).json({ error: "Erro ao buscar conversas" });
  }
});

export default router;
