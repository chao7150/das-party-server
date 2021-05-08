import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });
const clients: { [key: string]: Array<WebSocket> } = {};

wss.on("connection", (ws, req) => {
  if (!req.url) {
    return undefined;
  }
  const url = new URL(req.url, "ws://hoge:8080");
  const roomId = url.searchParams.get("roomid");
  if (!roomId) {
    return undefined;
  }
  if (roomId in clients) {
    clients[roomId].push(ws);
  } else {
    clients[roomId] = [ws];
  }

  ws.on("message", (message) => {
    if (message === "ping") {
      ws.send("pong");
      return;
    }
    clients[roomId].forEach((client) => {
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
