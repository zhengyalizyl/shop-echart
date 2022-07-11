const WebSocket = require('ws');
const path = require('path')
const fileUtils = require('../utils/file_utils')

//创建websocket服务端的对象
const wss = new WebSocket.Server({
    port: 9998
});

const listen = () => {
    wss.on('connection', client => {
        console.log('有客户端连接');
        client.on('message', async msg => {
            // console.log('客户端发送数据过来了')
            console.log('客户端发送数据给服务端了: ' + msg)
            let payload = JSON.parse(msg)
            const action = payload.action
            if (action === 'getData') {
                let filePath = '../data/' + payload.chartName + '.json'
                    // payload.chartName // trend seller map rank hot stock
                filePath = path.join(__dirname, filePath)
                const ret = await fileUtils.getFileJsonData(filePath)
                    // 需要在服务端获取到数据的基础之上, 增加一个data的字段
                    // data所对应的值,就是某个json文件的内容
                console.log(ret, 'ret')
                payload.data = ret
                client.send(JSON.stringify(payload))
            } else {
                // 原封不动的将所接收到的数据转发给每一个处于连接状态的客户端
                // wss.clients // 所有客户端的连接
                wss.clients.forEach(client => {
                    // console.log(wss.clients)
                    // client.send(msg)
                    client.send(JSON.stringify(JSON.parse(msg)))
                });
            }
            // client.send('hello socket')
        });
    });
}

module.exports = { listen };