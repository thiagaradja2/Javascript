const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use(function (req, res) {
    res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(data) {
        // On récupère le pseudo de l'emeteur
        const emetteur = url.parse(req.url, true).query.pseudo

        console.log('Nouveau message de %s : %s', emetteur, data);

        // Pour chaque message reçu, nous le rediffusons aux autres
        wss.clients.forEach(function each(client) {
            // Rediffuser seulement aux autres et seulement si la websocket est encore ouverte
            if (client.readyState === WebSocket.OPEN) {
                // On envoi les données en json puisqu'il n'est pas possible de faire transiter des objets complexes.
                client.send(JSON.stringify({emetteur: emetteur, texte: data}));
            }
        });
    });
});

server.listen(8080, function listening() {
    console.log('En écoute sur le port %d', server.address().port);
});