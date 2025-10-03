import { Router } from "express";
import { authOperations } from "../controllers/authOperations.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authOperations.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const user = await authOperations.register(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
