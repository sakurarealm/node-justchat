import net from 'node:net';
import events from 'node:events';
import { Client, ServerConfig } from './types';
import { parseBody, Protocol } from './utils';

class Server extends events.EventEmitter {
    private server: net.Server = net.createServer();
    private config: ServerConfig;
    private clients: Client[] = [];
    public constructor(config: ServerConfig) {
        super();
        this.config = config;
        this.server.maxConnections = this.config.singleMode
            ? 1
            : this.config.maxConnections
            ? this.config.maxConnections
            : 1024;
        this.server.on('connection', (socket) => {
            const jPipe = new Protocol();
            jPipe.on('message', (msg) => {
                this.emit('message', msg);
            });
            socket.pipe(jPipe).pipe(socket);
        });
    }
    public start() {
        const port = this.config.port || 35580;
        this.server.listen(port, () => {
            console.log('Start Listening!');
        });
    }
}

export default Server;
