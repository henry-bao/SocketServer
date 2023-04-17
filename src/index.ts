import net from 'net';
import dgram from 'dgram';
import { quotes } from './quotes';

const TCP_PORT = 17;
const UDP_PORT = 17;

function getRandomQuote() {
    const { text, author } = quotes[Math.floor(Math.random() * quotes.length)];
    return `${text}\n- ${author}`;
}

// TCP Server
const tcpServer = net.createServer((socket) => {
    console.log('[TCP] Connection from', socket.remoteAddress);
    socket.write(getRandomQuote() + '\r\n');
    socket.end();
    console.log('[TCP] Connection closed');
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`[TCP] Server listening on port ${TCP_PORT}`);
});

// UDP Server
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (_, rinfo) => {
    console.log('[UDP] Message from', rinfo.address);
    const quote = Buffer.from(getRandomQuote() + '\r\n');
    udpServer.send(quote, 0, quote.length, rinfo.port, rinfo.address);
    console.log('[UDP] Message sent');
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`[UDP] Server listening on port ${address.port}`);
});

udpServer.bind(UDP_PORT);
