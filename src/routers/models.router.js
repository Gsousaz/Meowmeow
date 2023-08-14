import { Router } from "express";
import { newModel, showAllModels, showModelDetails } from "../controllers/models.controller.js";

const modelsRouter = Router();

modelsRouter.get("/meowdels", showAllModels);
modelsRouter.get("/meowdels/:id", showModelDetails)
modelsRouter.post("/meowdels", newModel);

export default modelsRouter;
