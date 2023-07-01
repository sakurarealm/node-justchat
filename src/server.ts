import net from 'node:net';
import {
    PacketType,
    Client,
    Message,
    ChatMessage,
    BroadcastMessage,
    ListMessage,
    RegisterMessage,
    ServerConfig,
    SimpleClient,
    SendListMessage,
    SendChatMessage,
    PacketVersion
} from './types';
import { Protocol, serverDefault } from './utils';

class MyServer extends net.Server {
    private clients: Client[] = [];
    private config: ServerConfig;
    // 重写 Server 类的构造函数
    constructor(config: ServerConfig = serverDefault) {
        super();
        this.config = Object.assign(serverDefault, config);
        this.on('connection', this.handleConnection);
    }

    public start() {
        return new Promise<void>((resolve, reject) => {
            try {
                this.listen(this.config.port, () => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    private handleConnection(socket: net.Socket) {
        // 检测客户端是否超时
        this.checkClientTimeout();
        // 检测客户端数量是否超过最大值
        if (
            this.connections >= (this.config.maxConnections || serverDefault.maxConnections) ||
            (this.config.singleMode && this.connections >= 1)
        ) {
            socket.destroy();
            return;
        }
        this.connections++;
        const entry = new Protocol();
        socket.pipe(entry).pipe(socket);
        const client: Client = {
            entry,
            socket,
            lastPulseTime: Date.now() // 初始化 lastPulseTime
        };

        // 将客户端添加到 clients 数组中
        this.clients.push(client);

        // 监听收到数据的事件
        entry.on('message', (packet: Message) => {
            this.handlePacket(client, packet);
        });

        // 发送心跳包
        setInterval(() => {
            const pulsePacket = {
                type: PacketType.PULSE,
                version: PacketVersion
            };
            entry.send(pulsePacket);
        }, 30000); // 每 30 秒发送一个心跳包

        // 监听客户端断开连接的事件
        socket.on('close', () => {
            // 检测客户端是否超时
            this.checkClientTimeout();
            // 将客户端从 clients 数组中移除
            this.clients = this.clients.filter((c) => c !== client);
            this.connections--;
        });
    }
    // 处理包
    private handlePacket(client: Client, packet: Message) {
        // 根据 packet.type 处理不同的包
        switch (packet.type) {
            case PacketType.PULSE:
                // 更新客户端的 lastPulseTime
                client.lastPulseTime = Date.now();
                break;
            case PacketType.REG:
                this.handleReg(packet as RegisterMessage, client);
                break;

            case PacketType.CHAT:
                this.handleChat(packet as ChatMessage, client);
                break;

            case PacketType.BROADCAST:
                this.handleBroadcast(packet as BroadcastMessage, client);
                break;

            case PacketType.LIST:
                this.handleList(packet as ListMessage, client);
                break;

            default:
                throw new Error('Unknown packet type');
        }
    }
    // 检测客户端是否超时
    private checkClientTimeout() {
        if (!this.config.enableTimeout) return;
        const now = Date.now();
        const timeout = 30000; // 超时时间为 30 秒

        this.clients = this.clients.filter((client) => {
            // 如果客户端的 lastPulseTime 距离当前时间超过了超时时间，则销毁该客户端
            if (now - client.lastPulseTime > timeout) {
                console.log(
                    `Connection timeout: ${client.socket.remoteAddress}:${client.socket.remotePort}`
                );
                client.socket.destroy();
                return false;
            }

            return true;
        });
    }
    // 处理注册包
    private handleReg(packet: RegisterMessage, client: Client) {
        client.name = packet.name;
        client.uuid = packet.id;
        this.emit('register', { name: client.name, uuid: client.uuid });
    }
    // 处理聊天包
    private handleChat(packet: ChatMessage, client: Client) {
        const { world, world_display, sender, content } = packet;
        const decodedContent = content.map((c) => {
            const { type, content, ...otherProps } = c;
            const decodedProps = Object.entries(otherProps).reduce((acc, [key, value]) => {
                if (typeof value === 'string' && key !== 'type' && key !== 'function') {
                    return {
                        ...acc,
                        [key]: Buffer.from(value, 'base64').toString('utf-8')
                    };
                }
                return acc;
            }, {});
            return {
                type,
                content: Buffer.from(content, 'base64').toString('utf-8'),
                function: c.function,
                ...decodedProps
            };
        });
        const chatEvent: SendChatMessage = {
            world,
            world_display: Buffer.from(world_display, 'base64').toString('utf-8'),
            sender: Buffer.from(sender, 'base64').toString('utf-8'),
            content: decodedContent
        };
        this.emit('chat', chatEvent, { name: client.name, uuid: client.uuid });
    }
    // 处理广播包
    private handleBroadcast(packet: BroadcastMessage, client: Client) {
        const content = packet.content
            ? Buffer.from(packet.content, 'base64').toString('utf-8')
            : undefined;
        const sender = packet.sender
            ? Buffer.from(packet.sender, 'base64').toString('utf-8')
            : undefined;
        this.emit(
            'broadcast',
            { event: packet.event, content, sender },
            { name: client.name, uuid: client.uuid }
        );
    }
    // 处理列表包
    private handleList(packet: ListMessage, client: Client) {
        const count = packet.count;
        const max = packet.max;
        const playerlist = packet.playerlist?.map((player: string) =>
            Buffer.from(player, 'base64').toString('utf-8')
        );
        const world = packet.world;
        const world_display = packet.world_display
            ? Buffer.from(packet.world_display, 'base64').toString('utf-8')
            : null;
        const sender = packet.sender
            ? Buffer.from(packet.sender, 'base64').toString('utf-8')
            : null;

        // 触发 list 事件
        this.emit(
            'list',
            { count, max, playerlist, world, world_display, sender },
            { name: client.name, uuid: client.uuid }
        );
    }
    // 寻找客户端的函数
    private findClient({ name, uuid }: SimpleClient): Client | undefined {
        return this.clients.find((client) => client.name === name || client.uuid === uuid);
    }

    //可以发送ChatMessage的函数
    public sendChatMessage(message: SendChatMessage, client?: SimpleClient) {
        // 检测客户端是否超时
        this.checkClientTimeout();
        // 根据 name 或 uuid 寻找客户端
        if (client) {
            const target = this.findClient(client);
            if (target) {
                const sendMsg = {
                    version: PacketVersion,
                    type: PacketType.CHAT,
                    // 转换需要转换为 base64 的字段
                    world_display: Buffer.from(message.world_display, 'utf-8').toString('base64'),
                    world: message.world,
                    sender: Buffer.from(message.sender, 'utf-8').toString('base64'),
                    content: message.content.map((c) => {
                        const { type, content, ...otherProps } = c;
                        const encodedProps = Object.entries(otherProps).reduce(
                            (acc, [key, value]) => {
                                if (
                                    typeof value === 'string' &&
                                    key !== 'type' &&
                                    key !== 'function'
                                ) {
                                    return {
                                        ...acc,
                                        [key]: Buffer.from(value, 'utf-8').toString('base64')
                                    };
                                }
                                return acc;
                            },
                            {}
                        );
                        return {
                            type,
                            content: Buffer.from(content, 'utf-8').toString('base64'),
                            function: c.function,
                            ...encodedProps
                        };
                    }),
                    from_server: Buffer.from(
                        this.config.name || serverDefault.name,
                        'utf-8'
                    ).toString('base64')
                };
                target.entry.send(sendMsg);
            } else {
                throw new Error('找不到目标客户端');
            }
        } else if (this.config.singleMode) {
            this.clients.forEach((target) => {
                const sendMsg = {
                    version: PacketVersion,
                    type: PacketType.CHAT,
                    // 转换需要转换为 base64 的字段
                    world_display: Buffer.from(message.world_display, 'utf-8').toString('base64'),
                    world: message.world,
                    sender: Buffer.from(message.sender, 'utf-8').toString('base64'),
                    content: message.content.map((c) => {
                        const { type, content, ...otherProps } = c;
                        const encodedProps = Object.entries(otherProps).reduce(
                            (acc, [key, value]) => {
                                if (
                                    typeof value === 'string' &&
                                    key !== 'type' &&
                                    key !== 'function'
                                ) {
                                    return {
                                        ...acc,
                                        [key]: Buffer.from(value, 'utf-8').toString('base64')
                                    };
                                }
                                return acc;
                            },
                            {}
                        );
                        return {
                            type,
                            content: Buffer.from(content, 'utf-8').toString('base64'),
                            function: c.function,
                            ...encodedProps
                        };
                    }),
                    from_server: Buffer.from(
                        this.config.name || serverDefault.name,
                        'utf-8'
                    ).toString('base64')
                };
                target.entry.send(sendMsg);
            });
        } else {
            throw new Error('未指定目标客户端');
        }
    }

    //可以发送ListMessage的函数
    public sendListMessage(message: SendListMessage, client?: SimpleClient) {
        // 检测客户端是否超时
        this.checkClientTimeout();
        // 根据 name 或 uuid 寻找客户端
        if (client) {
            const target = this.findClient(client);
            if (target) {
                const sendMsg = {
                    version: PacketVersion,
                    type: PacketType.LIST,
                    subtype: 0,
                    world: message.world,
                    //该字段需要转换为base64
                    world_display: Buffer.from(message.world_display, 'utf-8').toString('base64'),
                    sender: Buffer.from(message.sender, 'utf-8').toString('base64')
                };
                target.entry.send(sendMsg);
            } else {
                throw new Error('找不到目标客户端');
            }
        } else if (this.config.singleMode) {
            this.clients.forEach((target) => {
                const sendMsg = {
                    version: PacketVersion,
                    type: PacketType.LIST,
                    subtype: message.subtype,
                    world: message.world,
                    //该字段需要转换为base64
                    world_display: Buffer.from(message.world_display, 'utf-8').toString('base64'),
                    sender: Buffer.from(message.sender, 'utf-8').toString('base64')
                };
                target.entry.send(sendMsg);
            });
        } else {
            throw new Error('未指定目标客户端');
        }
    }
}

export default MyServer;
