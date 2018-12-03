

var exampleSocket = new WebSocket("ws://127.0.0.1:8080/chat?pseudo=NOM", "http");
exampleSocket.addEventListener('open', function (event) {
    console.log('Hello Server!');
});