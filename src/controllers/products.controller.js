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

export async function getCart(req,res) {
    const { email } = res.locals.session;

    try {
        const cartUser = await db.collection("cart").findOne({ email });
        return res.status(200).send(cartUser);
    } catch (error) {
        return res.status(500).send(error.message);
    }    
}

export async function addItemCart(req,res) {
    const { email } = res.locals.session;
    const productId = req.params.productId;


    try {
        const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).send("Produto não existe!");
        }

        const cart = await db.collection("cart").findOne({ email });
        cart.itens.push(productId);

        await db
        .collection("cart")
        .updateOne(
            { email },
            {
                $set: {
                    itens: cart.itens,
                },
            }
        );    
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function removeItemCart(req,res) {
    const { email } = res.locals.session;
    const productId = req.params.productId;

    let changeBalance;

    try {
        const product = await db.collection("products").findOne({ productId });

        if (!product) {
            return res.status(404).send("Produto não existe!");
        }

        const cart = await db.collection("cart").findOne({ email });
        let indexToRemove = -1;
        for (let i = 0; i < cart.itens.length; i++) {
            if (cart.itens[i].productId === productId) {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove !== -1) {
            cart.itens.splice(indexToRemove, 1);
        }

        await db
        .collection("cart")
        .updateOne(
            { email },
            {
                $set: {
                    itens: cart.itens,
                    balance: cart.balance - product.price,
                },
            }
        );    
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }

}
