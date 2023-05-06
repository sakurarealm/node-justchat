import Buffer from 'node:buffer';
import JustChatProtocol from './protocol';
import { ServerConfig } from '../types';
import { v4 as uuid } from 'uuid';

export * from './server';

function parseBody(data: Buffer.Buffer) {
    const head = data.subarray(0, 3);
    const length = data.subarray(3, 7).readUInt32LE();
    const body = data.subarray(8).toString();
    if (!Object.is(head, Buffer.Buffer.of(0x11, 0x45, 0x14))) throw new Error('Head Format Error!');
    if (length != body.length) throw new Error('Length Error!');
    return JSON.parse(body);
}

const serverDefault = {
    version: 2,
    name: 'JustChat Server',
    id: uuid(),
    enable: true,
    port: 35580,
    singleMode: false,
    maxConnections: 128
};

export { parseBody, JustChatProtocol as Protocol, serverDefault };
