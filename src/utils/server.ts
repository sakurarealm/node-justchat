import Buffer from 'buffer';
import net from 'net';

function onConnection(socket: net.Socket) {
    socket.on('data',(data)=>{

    })
}

function parseBody(data: Buffer.Buffer) {

}
