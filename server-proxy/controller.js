const { socket } = require("./socket");

class Controller {
  constructor(payload) {
    this.input = JSON.parse(payload);
    console.log(this.input);
  }

  async on(type, callback) {
    try {
      if (this.input?.type === type) {
        const result = await callback?.(this.input?.data ?? {});
        this.okResponse(this.input.id, result);
      }
    } catch (ex) {
      this.errorResponse(this.input.id, ex);
    }
    return this;
  }

  okResponse(id, result) {
    socket.emit(
      "message",
      JSON.stringify({
        id: id,
        result,
        status: "ok",
      })
    );
  }

  errorResponse(id, ex) {
    socket.emit(
      "message",
      JSON.stringify({
        id: id,
        result: ex.message,
        status: "error",
      })
    );
  }

  static from(payload) {
    return new Controller(payload);
  }
}

module.exports = { Controller };
