import { Router } from "express";
import authRouter from "./auth.router.js";
import modelsRouter from "./models.router.js";

const router = Router();

router.use(authRouter);
router.use(modelsRouter);

export default router;
