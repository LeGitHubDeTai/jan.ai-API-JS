# Jan.ai API Wrapper for JavaScript
This repository provides a simple JavaScript wrapper for interacting with the Jan.ai API. The wrapper allows you to make various API requests easily in your JavaScript applications.

## Example Usage

```js
const janApi = require('./janApi'); // Replace with the actual file path

// Get a list of available models
const models = await janApi.endpoints.models.Listmodels();
console.log(models);

// Complete a chat interaction
const chatResponse = await janApi.endpoints.chat.CompleteChat();
console.log(chatResponse);

// List available assistants
const assistants = await janApi.chat.assistants.ListAssistants();
console.log(assistants);

// Create a new thread
const newThread = await janApi.chat.threads.CreateThread("New Thread", "jan", "Jan", "Hi, how are you?");
console.log(newThread);
```

## API Endpoints
### Models
- Listmodels: Get a list of available models.
- GetModel(name): Get details about a specific model.
### Chat
- CompleteChat(name): Get a completion for a chat interaction.
### Chat Assistants
- ListAssistants: Get a list of available assistants.
- GetAssistant(name): Get details about a specific assistant.
### Chat Messages
- ListMessages(threadID): Get a list of messages in a thread.
- CreateMessage(threadID, role, message): Create a new message in a thread.
- RetrieveMessage(threadID, messageID): Get details about a specific message.
### Chat Threads
- CreateThread(title, assistant_id, assistant_name, instructions, model_id, model_settings, model_parameters, model_engine, metadata): Create a new thread.
- ListThreads: Get a list of available threads.
- RetrieveThread(threadID): Get details about a specific thread.
- ModifyThread(threadID, new_title): Modify the title of a thread.
- DeleteThread(threadID): Delete a thread.

Feel free to adapt the code according to your application's requirements.