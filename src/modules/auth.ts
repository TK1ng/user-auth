import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createJWT = (user) => {
    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, process.env.JWT_SECRET);

    return token;
}

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
}

export const isValidPass = (password, hash) => {
    return bcrypt.compare(password, hash);
}

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401);
        res.json({ message: 'Not authorized' });
        return;
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        res.status(401);
        res.json({ message: 'Not authorized' });
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (e) {
        res.status(401);
        res.json({ message: 'Not authorized' });
        return;
    }
}