import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import sys

# --- Configuration ---
TARGET_BASE_URL = "https://api.bari.devfest.it/"

# Network Configuration (User Preference)
remote_config = { "name": "Remote", "value": ["127.0.0.1", 8080] }
HOST_IP = remote_config["value"][0]
PORT = remote_config["value"][1]

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        """Sets headers to allow cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    def do_OPTIONS(self):
        """Handle preflight CORS requests."""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_proxy(self):
        """Main proxy logic for all methods."""
        # 1. Build Target URL
        # self.path includes the query string
        target_url = f"{TARGET_BASE_URL}{self.path}"
        print(f"[{self.command}] Forwarding to: {target_url}")

        # 2. Read Request Body (if any)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else None

        # 3. Prepare Headers
        # Filter out headers that confuse the backend or are hop-by-hop
        req_headers = {}
        skipped_headers = ['host', 'content-length']
        for key, value in self.headers.items():
            if key.lower() not in skipped_headers:
                req_headers[key] = value

        # 4. Create Request Object
        req = urllib.request.Request(
            target_url, 
            data=body, 
            headers=req_headers, 
            method=self.command
        )

        try:
            # 5. Send Request
            with urllib.request.urlopen(req) as response:
                self._send_response_to_client(response)
        except urllib.error.HTTPError as e:
            # 6. Handle Backend Errors (404, 500, etc.)
            # HTTPError can be read just like a response object
            self._send_response_to_client(e)
        except Exception as e:
            # 7. Handle Connection Errors
            self.send_error(502, f"Proxy Error: {str(e)}")

    def _send_response_to_client(self, upstream_response):
        """Helper to write the upstream response back to the client."""
        self.send_response(upstream_response.getcode())
        self._send_cors_headers()
        
        # Forward valid headers
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        for key, value in upstream_response.headers.items():
            if key.lower() not in excluded_headers:
                self.send_header(key, value)
        
        self.end_headers()
        
        # Write body
        self.wfile.write(upstream_response.read())

    # Map all standard HTTP verbs to the proxy method
    def do_GET(self): self.do_proxy()
    def do_POST(self): self.do_proxy()
    def do_PUT(self): self.do_proxy()
    def do_DELETE(self): self.do_proxy()
    def do_PATCH(self): self.do_proxy()

if __name__ == "__main__":
    print(f"🚀 DevFest Standard-Lib Proxy running on http://{HOST_IP}:{PORT}")
    print(f"🔗 Forwarding to: {TARGET_BASE_URL}")
    
    # Allow address reuse to prevent "Address already in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer((HOST_IP, PORT), ProxyHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down proxy...")
        sys.exit(0)
