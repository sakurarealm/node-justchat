import Buffer from 'node:buffer';

export * from './server';

function parseBody(data: Buffer.Buffer) {
    const head = data.subarray(0, 3);
    const length = data.subarray(3, 7).readUInt32LE();
    const body = data.subarray(8).toString();
    if (!Object.is(head, Buffer.Buffer.of(0x11, 0x45, 0x14))) throw new Error('Head Format Error!');
    if (length != body.length) throw new Error('Length Error!');
    return JSON.parse(body);
}

export { parseBody };
