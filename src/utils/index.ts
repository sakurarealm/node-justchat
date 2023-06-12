import JustChatProtocol from './protocol';
import { v4 as uuid } from 'uuid';

const serverDefault = {
    version: 2,
    name: 'JustChat Server',
    id: uuid(),
    enable: true,
    host: '0.0.0.0',
    port: 35580,
    singleMode: false,
    maxConnections: 128
};

export { JustChatProtocol as Protocol, serverDefault };
