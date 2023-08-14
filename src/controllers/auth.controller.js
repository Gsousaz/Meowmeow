import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { db } from "../database/database.conection.js";

export async function signup(req, res) {
  try {
    const { name, email, password, cpf, telefone } = req.body;

    if (!password) {
      return res.status(400).send("Senha não informada!");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await db.query(
      `INSERT INTO users (name, email, password, cpf, telefone) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, passwordHash, cpf, telefone]
    );

    res.status(201).send("Usuário criado com sucesso!");
  } catch (err) {
    if (err.code === "23505") {
      if (err.detail.includes("email")) {
        return res.status(400).send("E-mail já cadastrado");
      }
      if (err.detail.includes("cpf")) {
        return res.status(400).send("CPF já cadastrado");
      }
    }

    res.status(500).send("Erro ao criar usuário.");
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.query(`SELECT id, name, password FROM users WHERE email = $1`, [
      email,
    ]);

    if (user.rowCount === 0) {
      return res.status(401).send("E-mail não encontrado");
    }

    const comparePassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!comparePassword) {
      return res.status(401).send("Senha incorreta!");
    }

    const token = uuid();

    await db.query('INSERT INTO sessions (user_id, "token") VALUES ($1, $2)', [
      user.rows[0].id,
      token,
    ]);
    res.status(200).send({user: user.rows[0].name, token: token});
  } catch (err) {
    res.status(500).send(err.message);
    console.error(err.message);
  }
}
