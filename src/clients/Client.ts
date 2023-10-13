import { Socket } from 'net';
import SimpleClient from './SimpleClient';
import { Protocol } from '../utils';

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
}
