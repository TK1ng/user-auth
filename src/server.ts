import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());

// TODO: Register endpoints
// app.post('/signup', signup)
// app.post('/signin', signin)


app.use((err, req, res, next) => {
    console.log(err);
    res.json({ message: 'oops, there was an error!' });
});

export default app;