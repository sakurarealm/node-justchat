import { JustChatClient, JustChatServer, SendChatMessage } from '../src';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';

describe('JustChat', () => {
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
    const msg: SendChatMessage = {
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
    beforeAll(async () => {
        await server.start();
        await client.start();
    });
    beforeEach(async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    }, 5500);
    test('It Should correctly send Chat Messages C2S', (done) => {
        client.sendChat(msg);
        server.on('chat', (rmsg, client) => {
            expect(rmsg.content[0].content).toBe('This is a test message');
            expect(client.name).toBe('Jest Client');
            expect(client.uuid).toBe('123');
            done();
        });
    }, 30000);
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
    }, 30000);
    afterAll(async () => {
        client.destroy();
        server.close();
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    });
});
