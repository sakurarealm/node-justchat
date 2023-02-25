import net from 'node:net';
import events from 'node:events';
import { Client, ServerConfig } from './types';
import { parseBody } from './utils';

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
            : 100;
        this.server.on('connection', (socket) => {
            socket.on('data', (data) => {
                const body = parseBody(data);
                if (body.type === 1) {
                    const cli: Client = {
                        name: body.name,
                        id: body.id
                    };
                    this.clients.push(cli);
                } else this.emit('message', body);
            });
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
