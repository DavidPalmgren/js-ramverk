
import 'dotenv/config';

const port = process.env.PORT || 1337;

import express from 'express';
import bodyParser from 'body-parser';
import { openConnection, closeConnection } from "./Infrastructure/db/database.mjs";
import morgan from 'morgan';
import docRouter from "./ControllerLayer/documentsRouter.mjs";


const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', docRouter);
app.use((err, req, res, next) => {
    const errorCode = err.statusCode || 500;
    res.status(errorCode).send('Something broke!');
})

const startServer = async () => {
    openConnection().then(() => {
        app.listen(port, () => {
            console.log(`running`);
        });
    });
}

const closeServer = async () => {
    closeConnection().then( () => {
        process.exit(1);
    });
}

export {startServer, closeServer};

export default app;







