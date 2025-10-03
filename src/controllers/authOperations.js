import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export const authOperations = {
  async login(email, password) {
    // Buscar usuário
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Senha incorreta");
    }

    // Gerar token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async register(userData) {
  if (userData.password !== userData.confirmPassword) {
    throw new Error("As senhas não coincidem");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert([
      {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "vendedor",
        company: userData.company || null,
        phone: userData.phone || null,
        createdAt: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error("Erro ao criar usuário: " + error.message);
  }

  return user;
},


  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Token inválido");
    }
  },
};
