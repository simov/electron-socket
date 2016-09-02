
# Environment Variables

```bash
WS_PORT=3011 EL_PORT=3012 EL_APP=/path/to/app
```

# WebSocket Messages

- `connect` - used for spawing the electron process from a web(ws)-server, returns a `connected` message
- `disconnect` - used for closing the spawned electron window and web socket, returns a `disconnected` message
