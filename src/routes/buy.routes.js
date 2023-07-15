import { Router } from "express"
import { getProducts, getProductsById } from "../controllers/products.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { validateAuth } from "../middlewares/validateAuth.js"

const buyRouter = Router();

buyRouter.use(validateAuth);

buyRouter.get("/products", validateAuth, getProducts);
buyRouter.get("/products/:id", validateAuth, getProductsById)
//buyRouter.post("/receitas", validateSchema(schemaReceita), createRecipe);
//buyRouter.delete("/receitas/:id", deleteRecipe);
//buyRouter.delete("/receitas/muitas/:filtroIngredientes", deleteRecipesByIngredients);
//buyRouter.put("/receitas/:id", validateSchema(schemaReceita), editRecipe);
//buyRouter.put("/receitas/muitas/:filtroIngredientes", editRecipesByIngridients);

export default buyRouter