export function withAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.substring(7);
    const decoded = authOperations.verifyToken(token);

    req.user = decoded; // adiciona o usuário no request
    next(); // segue para a rota
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
