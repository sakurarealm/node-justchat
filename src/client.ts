import net from 'node:net';
import { BroadcastMessage, ChatMessage, ClientConfig, ListMessage, RegisterMessage } from './types';
import events from 'node:events';
type Message = RegisterMessage | BroadcastMessage | ChatMessage | ListMessage;
class Client extends events.EventEmitter {
    private socket: net.Socket;
    private config: ClientConfig;

    public constructor(config: ClientConfig = { enable: true, port: 39980 }) {
        super();
        this.config = config;
        const address = config.address ? config.address : 'localhost';
        this.socket = net.createConnection(address).connect(config.port);
        this.socket.on('data', (data) => this.emit('message', JSON.parse(data.toString())));
        setInterval(() => {
            const heartbeat = {
                version: 4,
                type: 0
            };
            this.socket.write(JSON.stringify(heartbeat));
        }, 5000);
    }
    public connect = () => this.socket.connect(this.config.port);
    public send(message: Message) {
        this.socket.write(JSON.stringify(message));
    }
}

export default Client;
