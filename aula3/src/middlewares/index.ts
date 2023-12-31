import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

// cria um token usando os dados do usuário e a chave armazenada na variável de ambiente JWT_SECRET
export const generateToken = async (usuario: any) =>
    jwt.sign(usuario, process.env.JWT_SECRET as string);

// Verifica se o usuário possui autorização
export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    // O token precisa ser enviado pelo cliente no header da req

    const authorization: any = req.headers.authorization;

    try {
        const [, token] = authorization.split(" ");

        const decoded = <any>jwt.verify(token, process.env.JWT_SECRET as string);

        if (!decoded) {
            res.status(401).json({ error: "Não autorizado" });
        }
        else {
            res.locals = decoded;
        }
    }
    catch (error) {
        return res.status(401).send({ error: "Não autorizado!" });
    }
    return next();
};

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Obtem dados do nível anterior da middleware
    // Evita ler novamente req.headers.authorization

    const { profile } = res.locals;

    if (profile !== 'admin') {
        return res.status(401).send({ error: "Sem autorização para acessar o recurso" })
    }
    return next();
}