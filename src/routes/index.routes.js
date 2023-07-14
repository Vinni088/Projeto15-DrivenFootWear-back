import { Router } from "express"
import buyRouter from "./buy.routes.js"
import userRouter from "./user.routes.js"

const router = Router();

router.use(userRouter);
router.use(buyRouter);

export default router