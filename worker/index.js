import { File } from "megajs";

export default {
  async fetch(request) {

    const url = new URL(request.url);

    if (url.pathname !== "/stream") {
      return new Response("Not Found", { status: 404 });
    }

    const megaUrl =
      "https://mega.nz/file/hvZECBoa#Cg935GATLXKhENQWS95k2RcCpXgCH0ejIMFZ1bxVsgs";

    try {

      const file = File.fromURL(megaUrl);

      await file.loadAttributes();

      const stream = file.download();

      return new Response(stream, {
        headers: {
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (e) {

      return new Response(
        JSON.stringify({
          error: e.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
