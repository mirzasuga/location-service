const WebSocket = require('ws');
const port = process.env.PORT || 5000;
// const host = process.env.HOST || '127.0.0.4';
const url = require('url');
const jwt = require('jsonwebtoken');
const secret = process.env.CLIENT_SECRET || 'uNnnkDGbuxSlsGiBjzfQLuWIhWOKBwl0P06qnOJI';

const EventEmitter = require('events');
// import RequestSchema from './src/schema/request';

class ChannelEmitter extends EventEmitter {}
const channelEmitter = new ChannelEmitter();

const verifyToken = (token, done) => {

    // jwt.verify(token, secret, (err, decoded) => {
    //     console.log(token);
    //     if (err) return done(false,403, 'Not Valid Token');
    //     done(true);
    // })
    // NOT IMPLEMENT YET
    done(true);
}

const authenticate = (info, done) => {
    const query = url.parse(info.req.url, true).query;
    const token = 'Bearer '+query.token;
    verifyToken(token, done);
};

const wss = new WebSocket.Server({
    port: port,
    // host: host,
    // verifyClient: authenticate
});


const handleSocketOnConnection = (msg) => {

}

const handleSocketOnMessage = (msg) => {

    const data = JSON.parse(msg);
    const {event} = data;
    const {channel} = data;
    const {message} = data;
    console.log('NEW MESSAGE %s', message);

    channelEmitter.emit(channel, event, message);

}

const broadcastToChannel = (msg) => {

}

wss.on('connection', (ws) => {
    console.log('Client connected: ');
    
    ws.on('message', handleSocketOnMessage);

    
});
console.log('Sipmen-location-service Connection ready on port: %s', port);


courierLocationUpdated = (data) => {
    wss.clients.forEach(client => {
        const message = {
            channel: 'courier-location',
            event: 'courierLocationUpdated',
            message: data
        };
        client.send(JSON.stringify(message));
    });
    console.log('new message: %s', data);
}



/**
 * ROUTE CHANNELS
 */
const channels = require('./src/channels');
channels.routes.forEach(route => {
    channelEmitter.on(route.channel, (event, payload) => {
        
        if (event === route.event) {
            const handler = route.handler;
            global[handler](payload);
        }
    });
});