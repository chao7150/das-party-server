import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });
const clients = [] as Array<WebSocket>;
wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("message", (message) => {
    clients.forEach((client) => {
      if (client.readyState !== ws.OPEN) {
        return undefined;
      }
      // 送ってきたクライアント自身には返送しない
      if (client === ws) {
        return undefined;
      }
      client.send(message);
    });
  });
});
