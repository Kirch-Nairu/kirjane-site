import http from 'node:http';
// Consume the response and close each probe. Python's HTTP/1.0 server can
// trigger an Undici parser assertion on Node 24 when polled during startup.
export function httpReady(url) {
  return new Promise(resolve => {
    const request = http.get(url, {agent:false}, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode === 200));
    });
    request.on('error', () => resolve(false));
    request.setTimeout(1500, () => {request.destroy(); resolve(false);});
  });
}
