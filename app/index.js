exports.handler =  async function(event, context) {
    const message = process.env.RESPONSE_MESSAGE || "Hello, world!";
    return {
        statusCode: 200,
        body: message
    };
  }