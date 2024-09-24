
import 'dotenv/config'

const port = process.env.PORT || 1337;

import express from 'express';
import bodyParser from 'body-parser';
import { openConnection, closeConnection } from "./db/database.mjs";
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

openConnection().then(() => {
    app.listen(port, () => {
        console.log(`running`);
    });
});

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach( (sig) => {
    process.on(sig, () => {
        closeConnection().then( () => {
            process.exit(1);
        });
    })
});







