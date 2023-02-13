import express, { Express } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {
  BroadCastTypes,
  ClientToServerEvents,
  ServerToClientEvents
} from './types';

class App {
  private app: Express;
  private port: number;
  private httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  private io: Server<
    ClientToServerEvents,
    ServerToClientEvents
  >;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents
    >(this.httpServer, {
      cors: {
        origin: '*',
      },
    });
  }

  start() {
    this.io.on('connection', (socket) => {
      socket.on(BroadCastTypes.NEW_CONNECTION, () => {
        this.io.emit(BroadCastTypes.NEW_CONNECTION);
      });
      socket.on(BroadCastTypes.GET_DATA_FOR_NEW_CONNECTION, (data) => {
        if (data.players && data.players.length > 0) {
          this.io.emit(BroadCastTypes.GET_PLAYERS, data.players);
        }
        if (data.progress) {
          this.io.emit(BroadCastTypes.APP_PROGRESS, data.progress);
        }
        if (data.itemInUse) {
          this.io.emit(BroadCastTypes.UPDATE_ITEM_IN_USE, data.itemInUse);
        }
      });

      socket.on(BroadCastTypes.GET_PLAYERS, (data) => {
        this.io.emit(BroadCastTypes.GET_PLAYERS, data);
      });

      socket.on(BroadCastTypes.APP_PROGRESS, (data) => {
        this.io.emit(BroadCastTypes.APP_PROGRESS, data);
      });

      socket.on(BroadCastTypes.UPDATE_ITEM_IN_USE, (data) => {
        this.io.emit(BroadCastTypes.UPDATE_ITEM_IN_USE, data);
      });
    });

    this.httpServer.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }
}

new App(3000).start();
