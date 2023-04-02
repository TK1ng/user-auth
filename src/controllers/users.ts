import prisma from '../db';
import { hashPassword, createJWT, comparePasswords } from '../modules/auth';

export const createNewUser = async (req, res) => {
    const { username, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (existingUser) {
        res.status(400);
        return res.json({ message: 'User already exists. Try logging in' })
    }

    const newUser = await prisma.user.create({
        data: {
            username,
            name,
            password: await hashPassword(password)
        }
    });

    const token = createJWT({
        name: newUser.name,
        email: newUser.username,
        apiKey: newUser.apiKey,
        version: 1

    });

    const url = new URL(process.env.HUB_URL);
    url.searchParams.set('auth_token', token);
    res.status(200);
    return res.json({ data: url });
}

export const signIn = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        }
    });

    if (user) {
        const isValid = await comparePasswords(req.body.password, user.password);

        if (!isValid) {
            res.status(401);
            return res.json({ message: 'Unable to login' });
        }

        const rdmeUser = {
            name: user.name,
            email: user.username,
            apiKey: user.apiKey,
            version: 1
        }

        const token = createJWT(rdmeUser);
        const url = new URL(process.env.HUB_URL);
        url.searchParams.set('auth_token', token);
        res.status(200);
        return res.json({ data: url });
    }

    res.status(400);
    return res.json({ message: 'Unable to login.' });
}