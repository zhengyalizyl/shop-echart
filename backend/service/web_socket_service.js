const WebSocket = require('ws');
//创建websocket服务端的对象
const wss = new WebSocket.Server({
    port: 9998
});

const listen = () => {
    wss.on('connection', client => {
        console.log('有客户端连接');
        client.on('message', msg => {
            console.log('客户端发送数据过来了')
        });
        client.send('hello socket')
    });
}

module.exports = { listen };