import { Socket, io } from 'socket.io-client';

export class SocketAsyncCalls {
  private _socket!: Socket;
  private _requests: { id: string; res: any; rej: any }[] = [];

  constructor(url: string) {
    this._socket = io(url);

    this._socket.on('message', (payload: string) => {
      try {
        const data = JSON.parse(payload);
        const promise = this._requests.find((x) => x.id === data.id);

        if (promise) {
          if (data.status === 'ok') {
            promise.res(data.result);
          } else {
            promise.rej(new Error(data.result));
          }

          // this._requests = this._requests.filter((r) => r === promise);
        }
      } catch (err: any) {
        console.error(err);
      }
    });
  }

  call<T>(type: string, data?: T) {
    const id = crypto.randomUUID();

    return new Promise<T>((res, rej) => {
      this._socket.emit(
        'message',
        JSON.stringify({
          type: type,
          id: id,
          data: data,
        })
      );

      this._requests.push({
        id,
        res,
        rej,
      });
    });
  }
}
