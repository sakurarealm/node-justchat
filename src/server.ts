import net from 'net';
import {
    PacketType,
    Client,
    Message,
    ChatMessage,
    BroadcastMessage,
    ListMessage,
    RegisterMessage,
    ServerConfig,
    SearchClient
} from './types';
import { Protocol, serverDefault } from './utils';

class MyServer extends net.Server {
    private clients: Client[] = [];
    private config: ServerConfig;
    constructor(config: ServerConfig = serverDefault) {
        super();
        this.config = config;
        this.on('connection', (socket: net.Socket) => {
            const entry = new Protocol();
            const client: Client = {
                entry,
                socket,
                lastPulseTime: Date.now() // 初始化 lastPulseTime
            };

            // 将客户端添加到 clients 数组中
            this.clients.push(client);

            // 监听收到数据的事件
            entry.on('packet', (packet: Message) => {
                this.handlePacket(client, packet);
            });

            // 发送心跳包
            setInterval(() => {
                const pulsePacket = {
                    type: PacketType.PULSE,
                    version: 1
                };
                entry.send(pulsePacket);

                // 更新客户端的 lastPulseTime
                client.lastPulseTime = Date.now();
            }, 30000); // 每 30 秒发送一个心跳包

            // 设置超时检测
            setInterval(() => {
                this.checkClientTimeout();
            }, 5000); // 每 5 秒检测一次超时
        });
    }

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

    private checkClientTimeout() {
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

    private handleReg(packet: RegisterMessage, client: Client) {
        client.name = packet.name;
        client.uuid = packet.id;
    }

    private handleChat(packet: ChatMessage, client: Client) {
        const { world, world_display, sender, content } = packet;
        const decodedContent = content.map((c) => {
            const { type, content, ...otherProps } = c;
            return {
                type,
                content: Buffer.from(content, 'base64').toString('utf-8'),
                ...otherProps
            };
        });
        const chatEvent = {
            world,
            world_display: Buffer.from(world_display, 'base64').toString('utf-8'),
            sender: Buffer.from(sender, 'base64').toString('utf-8'),
            content: decodedContent
        };
        this.emit('chat', chatEvent, client);
    }

    private handleBroadcast(packet: BroadcastMessage, client: Client) {
        const content = packet.content
            ? Buffer.from(packet.content, 'base64').toString('utf-8')
            : undefined;
        const sender = packet.sender
            ? Buffer.from(packet.sender, 'base64').toString('utf-8')
            : undefined;
        this.emit('broadcast', { event: packet.event, content, sender }, client);
    }

    private handleList(packet: ListMessage, client: Client) {
        const count = packet.count;
        const max = packet.max;
        const playerlist = packet.playerlist.map((player: string) =>
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
        this.emit('list', { count, max, playerlist, world, world_display, sender }, client);
    }

    private findClient({ name, uuid }: SearchClient): Client | undefined {
        return this.clients.find((client) => client.name === name || client.uuid === uuid);
    }
}

export default MyServer;
