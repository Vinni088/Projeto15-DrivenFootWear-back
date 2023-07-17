import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { db } from "../database/database.connection.js"

export async function signup(req, res) {
    const { name, email, password } = req.body

    try {
        const invalidUser = await db.collection("users").findOne({ email });

        if (invalidUser) {
            return res.status(409).send("Email já registrado!");
        }

        const hash = bcrypt.hashSync(password, 10);

        await db.collection("users").insertOne({ name, email, password: hash });
        await db.collection("cart").insertOne({ name, email, balance: 0, itens: [] });
        res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function signin(req, res) {
    const { email, password } = req.body

    try {
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(404).send("Usuário não cadastrado");
        }

        console.log(user);
        const invalidPassword = bcrypt.compareSync(password, user.password);

        if (!invalidPassword) {
            return res.status(401).send("Senha incorreta");
        }

        await db.collection("session").deleteMany({ userId: user._id });
        const token = uuid();
        await db.collection("session").insertOne({ token, userId: user._id,email : user.email});

        res.send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function signout(req, res) {
    const { token } = res.locals.session;

    try {
        await db.collection("session").deleteOne({ token });
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function getUser(req, res) {
    const { session } = res.locals;

    console.log(res.locals);

    try {
        const user = await db.collection("users").findOne({ _id: session.userId })

        delete user.password;
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}