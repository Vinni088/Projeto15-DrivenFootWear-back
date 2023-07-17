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

export async function checkout(req,res) {
    const { email } = res.locals.session;
    const { payment } = req.body;

    try {
        const cart = await db.collection("cart").findOne({ email });

        let products_list = [];
        let balance_cart = 0;

        for (let i = 0; i < cart.itens.length; i++) {
            const product = await db.collection("products").findOne({_id: new ObjectId(cart.itens[i])});
            if (!product) {
                return res.status(404).send("Produto não existe!");
            }
            products_list.push(product);
            balance_cart += product.price;
        }

        console.log(products_list);

        const shopping = {
            list_products: products_list,
            balance : balance_cart,
            payment : payment,
        }

        const shopping_user = await db.collection("shopping").findOne({ email });
        shopping_user.itens.push(shopping);

        await db
        .collection("shopping")
        .updateOne(
            { email },
            {
                $set: {
                    itens: shopping_user.itens,
                },
            }
        );

        cart.itens = [];
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

    try {
        const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).send("Produto não existe!");
        }

        const cart = await db.collection("cart").findOne({ email });
        let indexToRemove = -1;
        for (let i = 0; i < cart.itens.length; i++) {
            if (cart.itens[i] === productId) {
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
                },
            }
        );    
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }

}

export async function getShopping(req,res) {
    const { email } = res.locals.session;

    try {
        const userShopping = await db.collection("shopping").findOne({ email });
        return res.status(200).send(userShopping);
    } catch (error) {
        return res.status(500).send(error.message);
    }    
}
