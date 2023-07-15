import { Router } from "express"
import { getProducts, getProductsById, getCart, addItemCart, removeItemCart } from "../controllers/products.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const buyRouter = Router();

buyRouter.use(validateAuth);

buyRouter.get("/products", validateAuth, getProducts);
buyRouter.get("/products/:id", validateAuth, getProductsById);
buyRouter.get("/cart", validateAuth, getCart);
buyRouter.post("/cart/:productId", validateAuth, addItemCart);
buyRouter.delete("/cart/:productId", validateAuth, removeItemCart);

export default buyRouter