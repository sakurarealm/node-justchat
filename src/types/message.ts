import { CQMessage } from './cq';

export enum PacketType {
    PULSE = 0,
    REG = 1,
    BROADCAST = 100,
    CHAT = 101,
    LIST = 200
}
interface MessageBase {
    version: number;
    type: PacketType;
}

interface RegisterMessage extends MessageBase {
    identity: 0 | 1;
    id: string;
    name: string;
}

interface BroadcastMessage extends MessageBase {
    event?: 1 | 2 | 3;
    content?: string;
    sender?: string;
    from_server?: string;
}

interface ChatMessageContent extends CQMessage {
    type: 'text' | 'cqcode';
    content: string;
}
interface ChatMessage extends MessageBase {
    world: string;
    world_display: string;
    sender: string;
    content: Array<ChatMessageContent>;
    from_server?: string;
}

interface ListMessage extends MessageBase {
    subtype: 0 | 1;
    count?: number;
    max?: number;
    playerlist?: string[];
    world: string;
    world_display: string;
    sender: string;
}

interface SendChatMessage {
    world: string;
    world_display: string;
    sender: string;
    content: Array<ChatMessageContent>;
    from_server?: string;
}

interface SendListMessage {
    subtype: 0 | 1;
    count?: number;
    max?: number;
    playerlist?: string[];
    world: string;
    world_display: string;
    sender: string;
}

type Message = RegisterMessage | BroadcastMessage | ChatMessage | ListMessage;

export {
    Message,
    RegisterMessage,
    BroadcastMessage,
    ChatMessage,
    ListMessage,
    SendChatMessage,
    SendListMessage,
    ChatMessageContent
};
