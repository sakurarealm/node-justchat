interface Config {
    version?: number;
    name?: string;
    id?: string;
    global?: {
        events?: Record<string, boolean>;
    };
}

interface ServerConfig extends Config {
    enable: boolean;
    port: number;
    singleMode?: boolean;
    maxConnections?: number;
}

interface ClientConfig extends Config {
    enable: boolean;
    address?: string;
    port: string;
}

interface Client {
    name: string;
    id: string;
}

export { ServerConfig, ClientConfig, Client };
