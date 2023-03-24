import * as dotenv from 'dotenv';
import app from './server';
dotenv.config();

app.listen(4040, () => {
    console.log('Jamming on http://localhost:4040');
});