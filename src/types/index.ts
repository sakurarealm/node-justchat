import net from 'node:net';
import { Protocol } from '../utils';

export * from './config';
export * from './message';

export interface Client {
    name?: string;
    uuid?: string;
    entry: Protocol;
    socket: net.Socket;
    lastPulseTime: number;
    SID?: number;
}

export interface SimpleClient {
    name?: string;
    uuid?: string;
    SID?: number;
}

export const PacketVersion = 4;
