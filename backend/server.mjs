import {startServer ,closeServer} from "./app.mjs";

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach( (sig) => {
    process.on(sig, async () => {
        await closeServer();
    })
});

await startServer();