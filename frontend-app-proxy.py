from flask import Flask, request, Response
import requests

app = Flask(__name__)

# The target upstream service you want to proxy
TARGET_URL = 'https://app.bari.devfest.it'

# Headers to exclude from the response to avoid conflicts (e.g., encoding issues)
EXCLUDED_HEADERS = [
    'content-encoding', 
    'content-length', 
    'transfer-encoding', 
    'connection'
]

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
def proxy(path):
    """
    Catches all traffic, forwards it to the target URL, and returns the result.
    """
    
    # 1. Construct the URL for the upstream request
    url = f"{TARGET_URL}/{path}"

    # 2. Prepare headers (filter out Host to let requests set it automatically)
    headers = {key: value for (key, value) in request.headers if key != 'Host'}
    
    # Optional: If you need to mimic a specific origin to bypass simple checks
    headers['Origin'] = TARGET_URL
    headers['Referer'] = TARGET_URL

    # 3. Forward the request to the target
    try:
        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=request.get_data(),
            cookies=request.cookies,
            params=request.args,
            allow_redirects=False # We want to pass redirects back to the client
        )

        # 4. Filter response headers
        response_headers = [
            (name, value) for (name, value) in resp.headers.items()
            if name.lower() not in EXCLUDED_HEADERS
        ]

        # 5. Return the response to the client
        return Response(resp.content, resp.status_code, response_headers)

    except requests.exceptions.RequestException as e:
        return Response(f"Proxy Error: {str(e)}", 502)

if __name__ == '__main__':
    print(f"Starting proxy for {TARGET_URL} on http://localhost:5000")
    app.run(debug=True, port=5001)



