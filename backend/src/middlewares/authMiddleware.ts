import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Adiciona a propriedade usuarioId ao tipo Request
export interface authRequest extends Request {
    usuarioId?: string;
}

// Middleware para verificar o token JWT
export const protect = (req: authRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Extrai o token do cabeçalho de autorização
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Caso o token não exista, aborta imediatamente
  if (!token) {
    res.status(401).json({ erro: "Token não fornecido, acesso não autorizado" });
    return;
  }

  // Verifica o token e extrai o ID do usuário, caso seja inválido, retorna um erro
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.usuarioId = decoded.id as string;
    next();
  } catch (error) {
    res.status(401).json({ erro: "Token inválido, acesso não autorizado" });
  }
};
    