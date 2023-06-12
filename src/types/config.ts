interface Config {
    version?: number;
    name?: string;
    id?: string;
    global?: {
        events?: Record<string, boolean>;
    };
}

interface ServerConfig extends Config {
    host?: string;
    port: number;
    enable?: boolean;
    enableTimeout?: boolean;
    singleMode?: boolean;
    maxConnections?: number;
}

interface ClientConfig extends Config {
    address: string;
    port: number;
    enable?: boolean;
}

export { ServerConfig, ClientConfig };
