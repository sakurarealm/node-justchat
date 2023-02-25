import { CQMessage } from './cq';

type types = 0 | 1 | 100 | 101 | 200;
interface Message {
    version: number;
    type: types;
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

export { RegisterMessage, BroadcastMessage, ChatMessage, ListMessage };
