# Data Model: Chatbot UI Integration

## Entities

### Chat Message
- **id**: Unique identifier for the message
- **sender**: Enum (USER | SYSTEM) - identifies who sent the message
- **content**: String - the actual message text
- **timestamp**: DateTime - when the message was sent/received
- **conversationId**: String - reference to the conversation session
- **status**: Enum (SENT | DELIVERED | READ | ERROR) - message delivery status

### Conversation Session
- **id**: Unique identifier for the session
- **userId**: String - identifier for the user (if available)
- **sessionId**: String - unique session identifier for tracking
- **createdAt**: DateTime - when the session was created
- **lastActiveAt**: DateTime - when the last message was sent
- **currentPage**: String - URL of the page when session started
- **status**: Enum (ACTIVE | INACTIVE | ENDED) - current state of the session
- **messages**: Array[Chat Message] - collection of messages in the session

### User Input
- **id**: Unique identifier for the input
- **content**: String - the user's message text
- **timestamp**: DateTime - when the input was submitted
- **currentPage**: String - URL of the page where input was made
- **context**: Object - additional context information about the current page
- **sessionId**: String - reference to the conversation session

### Chatbot Response
- **id**: Unique identifier for the response
- **content**: String - the chatbot's response text
- **timestamp**: DateTime - when the response was received
- **originalQuery**: String - the original user query that generated this response
- **confidence**: Number (0-1) - confidence score of the response
- **source**: String - source of the information (documentation, general knowledge, etc.)
- **sessionId**: String - reference to the conversation session

## Relationships
- Conversation Session 1:M Chat Message (a session contains multiple messages)
- User Input 1:1 Chatbot Response (each user input generates a response)
- Conversation Session 1:M User Input (a session contains multiple user inputs)
- Conversation Session 1:M Chatbot Response (a session contains multiple responses)

## Validation Rules
- Chat Message content must not exceed 2000 characters
- Conversation Session must be active to accept new messages
- User Input content must not be empty or contain only whitespace
- Chatbot Response must be linked to a valid conversation session
- Timestamps must be in ISO 8601 format

## State Transitions

### Conversation Session
- ACTIVE → INACTIVE (after 10 minutes of inactivity)
- ACTIVE → ENDED (when user closes chat or explicitly ends session)
- INACTIVE → ACTIVE (when user sends a new message)
- ENDED → (cannot transition back to other states)

## Data Flow
1. User Input is created when user submits a message
2. User Input is associated with a Conversation Session
3. Chat Message is created for the user's input
4. Chatbot Response is generated based on the input
5. Chat Message is created for the chatbot's response
6. All messages are stored in the Conversation Session