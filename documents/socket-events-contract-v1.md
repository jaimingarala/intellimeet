# IntelliMeet Socket Events Contract v1 (Execution Draft)

Transport: Socket.io
Namespace: `/`
Auth: token at connection handshake

## Client -> Server

### `meeting:join`
- Payload:
```json
{
  "meetingId": "string",
  "joinToken": "string"
}
```

### `meeting:leave`
- Payload:
```json
{
  "meetingId": "string"
}
```

### `signal`
- Payload (WebRTC signaling envelope):
```json
{
  "meetingId": "string",
  "targetPeerId": "string",
  "type": "offer|answer|ice",
  "data": {}
}
```

### `chat:message`
- Payload:
```json
{
  "meetingId": "string",
  "text": "string"
}
```

### `chat:typing`
- Payload:
```json
{
  "meetingId": "string",
  "isTyping": true
}
```

## Server -> Client

### `chat:new-message`
- Payload:
```json
{
  "meetingId": "string",
  "message": {
    "id": "string",
    "senderId": "string",
    "text": "string",
    "timestamp": "ISO-8601"
  }
}
```

### `participant:update`
- Payload:
```json
{
  "meetingId": "string",
  "participants": []
}
```

### `ai:transcription`
- Payload:
```json
{
  "meetingId": "string",
  "chunk": "string",
  "isFinal": false
}
```

### `ai:summary-ready`
- Payload:
```json
{
  "meetingId": "string",
  "summaryId": "string"
}
```

### `notification:new`
- Payload:
```json
{
  "type": "mention|action-item|system",
  "title": "string",
  "body": "string"
}
```
