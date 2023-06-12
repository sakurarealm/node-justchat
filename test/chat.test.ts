import { JustChatClient, JustChatServer } from '../src';
import { describe, expect, test } from '@jest/globals';
import { ChatMessage, PacketType } from '../src/types';

describe('JustChat', async () => {
    const client = new JustChatClient({
        address: 'localhost',
        port: 38080,
        name: 'Jest Client',
        id: '123'
    });
    const server = new JustChatServer({
        port: 38080,
        name: 'Jest Server',
        id: '321'
    });
    const msg: ChatMessage = {
        version: 4,
        type: PacketType.CHAT,
        world: '123',
        world_display: 'test',
        sender: 'Jest',
        content: [
            {
                type: 'text',
                content: 'This is a test message'
            }
        ]
    };
    server.start();
    client.start();
    test('It Should correctly send Chat Messages C2S', (done) => {
        client.sendChat(msg);
        server.on('chat', (rmsg, client) => {
            expect(rmsg.content[0].content).toBe('This is a test message');
            expect(client.name).toBe('Jest Client');
            expect(client.uuid).toBe('123');
            done();
        });
    }, 1000000);
    test('It Should correctly send Chat Messages S2C', (done) => {
        server.sendChatMessage(msg, {
            name: 'Jest Client',
            uuid: '123'
        });
        client.on('chat', (rmsg) => {
            expect(rmsg.content[0].content).toBe('This is a test message');
            expect(rmsg.from_server).toBe('Jest Server');
            done();
        });
    }, 1000000);
});
