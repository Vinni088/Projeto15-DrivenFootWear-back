import { db } from "../database/database.connection.js"
import { ObjectId } from "mongodb"

export async function getProducts(req, res) {
    try {
        const product = await db.collection("products").find().toArray();
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getProductsById(req, res) {
    const { id } = req.params;

    try {
        const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRecipe(req, res) {
    const { id } = req.params

    try {
        const result = await db.collection("receitas").deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 0) return res.status(404).send("Essa receita não existe!")

        res.status(204).send("Receita deletada com sucesso!")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRecipesByIngredients(req, res) {
    const { filtroIngredientes } = req.params

    try {
        await db.collection("receitas").deleteMany({ ingredientes: filtroIngredientes })
        res.sendStatus(204)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function editRecipe(req, res) {
    const { id } = req.params
    const { titulo, preparo, ingredientes } = req.body

    try {
        const result = await db.collection('receitas').updateOne(
            { _id: new ObjectId(id) },
            { $set: { titulo, preparo, ingredientes } }
        )
        if (result.matchedCount === 0) return res.status(404).send("esse item não existe!")
        res.send("Receita atualizada!")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function editRecipesByIngridients(req, res) {
    const { filtroIngredientes } = req.params
    const { titulo, ingredientes, preparo } = req.body

    try {
        await db.collection('receitas').updateMany(
            { ingredientes: { $regex: filtroIngredientes, $options: 'i' } },
            { $set: { titulo } }
        )
        res.sendStatus(200)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}