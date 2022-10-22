import net from 'node:net';

class Client {
    private socket: net.Socket;
    private config: Record<string, never>;
    public constructor(config: Record<string, never> = {}) {
        this.config = config;
        this.socket = net.createConnection(config.path);
    }
}

export default Client;
