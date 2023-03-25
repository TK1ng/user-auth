import prisma from '../db';
import { hashPassword, createJWT, comparePasswords } from '../modules/auth';

export const createNewUser = async (req, res) => {
    const { username, password, name } = req.body;
    const newUser = await prisma.user.create({
        data: {
            username,
            name,
            password: await hashPassword(password)
        }
    });

    const token = createJWT(newUser);
    res.json({ token });
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

        const token = createJWT(user);
        res.status(200);
        return res.json({ token });
    }

    res.status(400);
    return res.json({ message: 'Unable to login.' });
}