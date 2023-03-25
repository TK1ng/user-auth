import cors from 'cors';
import express from 'express';
import { createNewUser, signIn } from './controllers/users';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', createNewUser);
app.post('/signin', signIn)


app.use((err, req, res, next) => {
    console.log(err);
    res.json({ message: 'oops, there was an error!' });
});

export default app;