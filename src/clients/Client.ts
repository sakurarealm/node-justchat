import { Socket } from 'net';
import SimpleClient from './SimpleClient';
import { Protocol } from '../utils';
import { BroadcastMessage, SendChatMessage, SendListMessage } from '../types';

export default class Client extends SimpleClient {
    public entry: Protocol;
    public socket: Socket;
    public lastPulseTime: number;

    constructor(
        entry: Protocol,
        socket: Socket,
        lastPulseTime: number,
        name: string = '',
        uuid: string = '',
        SID: number = 1
    ) {
        super(name, uuid, SID);
        this.entry = entry;
        this.socket = socket;
        this.lastPulseTime = lastPulseTime;
    }

    public on(event: 'chat', listener: (msg: SendChatMessage) => void): this;
    public on(event: 'broadcast', listener: (msg: BroadcastMessage) => void): this;
    public on(event: 'list', listener: (msg: SendListMessage) => void): this;
    public on(event: string, listener: (msg: any) => void): this {
        return super.on(event, listener);
    }

    public once(event: 'chat', listener: (msg: SendChatMessage) => void): this;
    public once(event: 'broadcast', listener: (msg: BroadcastMessage) => void): this;
    public once(event: 'list', listener: (msg: SendListMessage) => void): this;
    public once(event: string, listener: (msg: any) => void): this {
        return super.once(event, listener);
    }

    public emit(event: 'chat', msg: SendChatMessage): any;
    public emit(event: 'broadcast', msg: BroadcastMessage): any;
    public emit(event: 'list', msg: SendListMessage): any;
    public emit(event: string, msg: any) {
        return super.emit(event, msg);
    }
}
