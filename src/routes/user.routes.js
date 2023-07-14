import { Router } from "express"
import { getUser, signin, signup, signout } from "../controllers/user.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { validateAuth } from "../middlewares/validateAuth.js"
import { signinSchema, signupSchema } from "../schemas/user.schemas.js"

const userRouter = Router();

userRouter.post("/sign-up", validateSchema(signupSchema), signup);
userRouter.post("/sign-in", validateSchema(signinSchema), signin);
userRouter.get("/usuario-logado", validateAuth, getUser);
userRouter.delete("/sign-out", validateAuth, signout);

export default userRouter