import { db } from "../database/database.conection";

export async function newModel(req, res) {
  try {
    const authorization = req.headers['authorization'];
    const { nome, url, descricao, cor, brinquedo_favorito } = req.body;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send("Você precisa estar logado para acessar esta página");
    }

    const user = await db.query(`SELECT * FROM sessions where token = $1`, [token]);

    if (user.rows.length === 0) {
      return res.status(401).send("Token inválido ou usuário não encontrado");
    }

    await db.query(
      `INSERT INTO models (nome, imagem, dono, descricao, cor, brinquedo_favorito) VALUES ($1, $2, $3, $4, $5, $6)`,
      [nome, url, user.rows[0].id, descricao, cor, brinquedo_favorito]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Falha ao adicionar o modelo." });
  }
}


export async function showAllModels(req, res) {
  try {
    const allModels = await db.query(`SELECT * FROM modelos ORDER BY id DESC`);
    res.status(200).send(allModels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Failed to fetch models." });
  }
}
