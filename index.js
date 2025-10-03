import express from "express";
import cors from "cors";


import leadsRoutes from "./src/routes/leads.js";
import authRoutes from "./src/routes/auth.js";
import chatwootRouter from './src/routes/chat.js';

const app = express();

// Middleware para CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://bluen-crm.onrender.com'],
  credentials: true, // Permite o envio de cookies e cabeçalhos de autorização
  allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(cors(corsOptions)); // Correção aqui

app.use(express.json());

// Rotas
app.use("/api/leads", leadsRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/chatwoot', chatwootRouter);

// Rota de saúde
app.get("/", (req, res) => {
  res.json({ message: "API rodando 🚀" });
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
