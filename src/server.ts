import net from 'net';

class Server {
    private server: net.Server;
    private config: Record<string, never>;
    public constructor(config: Record<string, never> = {}) {
        this.config = config;
        this.server = net.createServer();
    }
    public start() {
        const port = this.config.port || 35580;
        this.server.listen(port, () => {
            console.log('Start Listening!');
        });
    }
}

export default Server;
