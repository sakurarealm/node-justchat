# node-justchat
A node.js client and server lib for [JustChat](https://github.com/ParaParty/JustChat).

## Install
Using npm:  
`npm install --save-dev node-justchat`  
Using yarn:  
`yarn add --dev node-justchat` 

## Usage
### Server
```typescript
import { JustChatServer } from 'node-justchat';
const server = new JustChatServer({
    // Server name
    name: 'JustChat Server',
    // Server uuid
    id: '123'
    // Server port
    port: 8080,
    // if the pulse should be enabled
    enableTimeout: true,
    // if the server should be in single mode
    singleMode: false,
});

// Listen for Chat Messages
server.on('chat', (message) => {
    console.log(message);
});

// Listen for Broadcast Messages
server.on('broadcast', (message) => {
    console.log(message);
});

// Listen for List Messages
server.on('list', (message) => {
    console.log(message);
});

// Send Chat Messages
const chatMsg = {
    world: '576493373',
    world_display: 'Bot tests',
    sender: 'Bot tester',
    content: [
        {
            type: 'text',
            content: 'Hello world!',
        }
    ]
}
server.sendChatMessage(chatMsg, {
    name: 'Client',
    id: '321',
});

// Send List Messages
const listMsg = {
    world: '576493373',
    world_display: 'Bot tests',
    sender: 'Bot tester',
}
server.sendListMessage(listMsg, {
    name: 'Client',
    id: '321',
});
```
### Client
```typescript
import { JustChatClient } from 'node-justchat';

const client = new JustChatClient({
    address: 'localhost',
    port: 8080,
    name: 'Client',
    id: '321',
})

// Listen for Chat Messages
client.on('chat', (message) => {
    console.log(message);
});

// Listen for Broadcast Messages
client.on('broadcast', (message) => {
    console.log(message);
});

// Listen for List Messages
client.on('list', (message) => {
    console.log(message);
});

// Send Chat Messages
const chatMsg = {
    world: '576493373',
    world_display: 'Bot tests',
    sender: 'Bot tester',
    content: [
        {
            type: 'text',
            content: 'Hello world!',
        }
    ]
};
client.sendChat(chatMsg);

// Send List Messages
const listMsg = {
    world: '576493373',
    world_display: 'Bot tests',
    sender: 'Bot tester',
};
client.sendList(listMsg);
```