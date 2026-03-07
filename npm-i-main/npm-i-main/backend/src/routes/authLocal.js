import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const MOCK_USER = {
  id: 1,
  name: "Admin",
  email: "admin@alpha.com",
  password: "123456",
};

router.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email e senha são obrigatórios." });
  }

  if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
    return res.status(401).json({ ok: false, message: "Credenciais inválidas." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ ok: false, message: "JWT_SECRET não configurado no .env" });
  }

  const token = jwt.sign(
    { sub: MOCK_USER.id, email: MOCK_USER.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );

  return res.json({
    ok: true,
    token,
    user: { id: MOCK_USER.id, name: MOCK_USER.name, email: MOCK_USER.email },
  });
});

export default router;
