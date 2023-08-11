import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { signin, signup } from "../controllers/auth.controller.js";
import { userSchema } from "../schemas/userSchema.js";
import { authSchema } from "../schemas/authSchema.js";
const authRouter = Router();

authRouter.post("/signup", validateSchema(userSchema), signup);
authRouter.post("/signin", validateSchema(authSchema), signin);

export default authRouter;
