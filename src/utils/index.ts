import JustChatProtocol from './protocol';
import { v4 as uuid } from 'uuid';

export * from './server';

const serverDefault = {
    version: 2,
    name: 'JustChat Server',
    id: uuid(),
    enable: true,
    port: 35580,
    singleMode: false,
    maxConnections: 128
};

export { JustChatProtocol as Protocol, serverDefault };
