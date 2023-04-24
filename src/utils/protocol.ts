import { Duplex } from 'stream';

interface JustChatPacket {
    body: string;
}

class JustChatProtocol extends Duplex {
    private _buffer: Buffer; // 缓存区
    private _offset: number; // 偏移量

    constructor() {
        super();

        this._buffer = Buffer.alloc(0);
        this._offset = 0;
    }

    _read(size: number) {
        return size;
    }

    _write(chunk: Buffer, encoding: string, callback: () => void) {
        // 将新数据块追加到缓存区中
        this._buffer = Buffer.concat([this._buffer, chunk]);
        // 解析数据包
        this.parsePackets();
        // 调用回调函数
        callback();
    }

    private parsePackets() {
        while (this._buffer.length > 0) {
            if (this._buffer.length < 7) {
                // 不足一个完整数据包的长度
                break;
            }

            const header = this._buffer.slice(0, 4);
            if (!header.equals(Buffer.from([0x11, 0x45, 0x14, 0x00]))) {
                // 协议头不正确
                this.emit('error', new Error('Invalid header'));
                return;
            }

            const bodyLength = this._buffer.readInt32BE(4);
            if (this._buffer.length < bodyLength + 7) {
                // 数据包不完整
                break;
            }

            const body = this._buffer.slice(7, bodyLength + 7).toString('ascii');
            // 发送message事件，传递解析后的JSON对象
            this.emit('message', JSON.parse(body));

            // 更新缓存区
            this._buffer = this._buffer.slice(bodyLength + 7);
        }
    }

    send(packet: JustChatPacket) {
        const body = Buffer.from(JSON.stringify(packet.body), 'ascii');
        const bodyLength = Buffer.alloc(4);
        bodyLength.writeInt32BE(body.length);

        const header = Buffer.from([0x11, 0x45, 0x14, 0x00]);
        const packetData = Buffer.concat([header, bodyLength, body]);

        // 将打包后的数据块写入缓存区
        this.push(packetData);
    }
}

export default JustChatProtocol;
