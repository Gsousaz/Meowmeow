import { db } from "../database/database.conection.js";

export async function newModel(req, res) {
  try {
    const authorization = req.headers["authorization"];
    const { nome, url, descricao, cor, brinquedo_favorito } = req.body;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .send("Você precisa estar logado para acessar esta página");
    }

    const user = await db.query(`SELECT * FROM sessions where token = $1`, [
      token,
    ]);

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
    const result = await db.query(`
      SELECT models.*, fotos.url as main_photo_url
      FROM models 
      LEFT JOIN fotos ON models.id = fotos.model_id AND fotos.is_main = TRUE
      ORDER BY models.id DESC
    `);

    res.status(200).send(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Failed to fetch models." });
  }
}

export async function showModelDetails(req, res) {
  const modelId = req.params.id;

  try {
    const modelResult = await db.query(
      `
          SELECT 
              models.*,
              fotos.url as main_photo_url,
              users.email as owner_email,
              users.telefone as owner_telefone
          FROM 
              models
          LEFT JOIN 
              fotos ON models.id = fotos.model_id AND fotos.is_main = TRUE
          JOIN
              users ON models.user_id = users.id
          WHERE 
              models.id = $1;
      `,
      [modelId]
    );

    const fotosResult = await db.query(
      `
          SELECT 
              url
          FROM 
              fotos
          WHERE 
              model_id = $1 AND is_main = FALSE;
      `,
      [modelId]
    );

    res.status(200).send({
      miaudelo: modelResult.rows[0],
      fotos: fotosResult.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Failed to fetch model details." });
  }
}
