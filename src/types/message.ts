import { CQMessage } from './cq';

export enum PacketType {
    PULSE = 0,
    REG = 1,
    CHAT = 100,
    BROADCAST = 101,
    LIST = 200
}
interface Message {
    version: number;
    type: PacketType;
}

interface RegisterMessage extends Message {
    identity: 0 | 1;
    id: string;
    name: string;
}

interface BroadcastMessage extends Message {
    event?: 1 | 2 | 3;
    content?: string;
    sender?: string;
    from_server?: string;
}

interface ChatMessageContent extends CQMessage {
    type: 'text' | 'cqcode';
    content: string;
}
interface ChatMessage extends Message {
    world: string;
    world_display: string;
    sender: string;
    content: Array<ChatMessageContent>;
    from_server?: string;
}

interface ListMessage extends Message {
    subtype: 0 | 1;
    count: number;
    max: number;
    playerlist: string[];
    world: string;
    world_display: string;
    sender: string;
}

export { Message, RegisterMessage, BroadcastMessage, ChatMessage, ListMessage };
