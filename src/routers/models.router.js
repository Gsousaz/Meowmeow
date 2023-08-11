import { Router } from "express";
import { newModel, showAllModels } from "../controllers/models.controller.js";

const modelsRouter = Router();

modelsRouter.get("/models", showAllModels)
modelsRouter.post("models", newModel)