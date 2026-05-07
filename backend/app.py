import json
from http.server import BaseHTTPRequestHandler, HTTPServer

from config import DB_PATH, HOST, PORT
from models import init_db, list_users


class AppHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/":
            self._send_json(
                {
                    "message": "Backend online",
                    "endpoints": ["/health", "/users"],
                }
            )
            return

        if self.path == "/health":
            self._send_json({"status": "ok"})
            return

        if self.path == "/users":
            self._send_json({"items": list_users(DB_PATH)})
            return

        self._send_json({"error": "Not found"}, status=404)


def main() -> None:
    init_db(DB_PATH)
    server = HTTPServer((HOST, PORT), AppHandler)
    print(f"Backend running at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
