/*----------------------------------------------------------------------------------------------\
|  _____      _   __ _             _ _         ____   ___ ____  _    ______   ___ ____  _  _    |
| /__   \__ _(_) / _\ |_ _   _  __| (_) ___   |___ \ / _ \___ \/ |  / /___ \ / _ \___ \| || |   |
|   / /\/ _` | | \ \| __| | | |/ _` | |/ _ \    __) | | | |__) | | / /  __) | | | |__) | || |_  |
|  / / | (_| | | _\ \ |_| |_| | (_| | | (_) |  / __/| |_| / __/| |/ /  / __/| |_| / __/|__   _| |
|  \/   \__,_|_| \__/\__|\__,_|\__,_|_|\___/  |_____|\___/_____|_/_/  |_____|\___/_____|  |_|   |
|                                                                                               |
\----------------------------------------------------------------------------------------------*/
const http = require('http');
var baseURL = "http://127.0.0.1:1337";

function sendRequest(method, url, data) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    return new Promise((resolve, reject) => {
        const req = http.request(`${baseURL}/${url}`, options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve(parsedData);
                } catch (error) {
                    console.error('Erreur lors de la conversion JSON :', error.message);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Erreur lors de la requête :', error.message);
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function post(url, data) {
    return sendRequest('POST', url, data);
}

async function patch(url, data) {
    return sendRequest('PATCH', url, data);
}

async function del(url) {
    return sendRequest('DELETE', url);
}

async function get(url) {
    return sendRequest('GET', url);
}

async function Listmodels() {
    var models = await get('v1/models');
    return models;
}

async function GetModel(name) {
    var model = await get(`v1/models/${name}`);
    return model;
}

async function CompleteChat({instructions, message, model, stream, max_tokens, stop, frequency_penalty, presence_penalty, temperature, top_p}) {
    var chat = await post(`v1/chat/completions`, {
        "messages": [
            {
                "content": instructions || "You are a helpful assistant.",
                "role": "system"
            },
            {
                "content": message || "Hello!",
                "role": "user"
            }
        ],
        "model": model || "mistral-ins-7b-q4",
        "stream": stream || false,
        "max_tokens": max_tokens ||1024,
        "stop": stop || [],
        "frequency_penalty": frequency_penalty || 0,
        "presence_penalty": presence_penalty || 0,
        "temperature": temperature || 0.7,
        "top_p": top_p || 0.95
    }
    );
    return chat;
}

async function ListAssistants() {
    var assistants = await get('v1/assistants');
    return assistants;
}

async function GetAssistant(name) {
    var assistant = await get(`v1/assistants/${name}`);
    return assistant;
}

async function ListMessages(threadID) {
    var messages = await get(`v1/threads/${threadID}/messages`);
    return messages;
}

async function CreateMessage(threadID, role, message) {
    var message = await post(`v1/threads/${threadID}/messages`, {
        "role": role || "user",
        "content": message || "How does AI work? Explain it in simple terms."
    });
    return message;
}

async function RetrieveMessage(threadID, messageID) {
    var message = await get(`v1/threads/${threadID}/messages/${messageID}`);
    return message;
}

async function CreateThread(title, assistant_id, assistant_name, instructions, model_id, model_settings, model_parameters, model_engine, metadata) {
    var thread = await post('v1/threads', {
        "object": "thread",
        "title": title || "Automated Thread",
        "assistants": [
            {
                "assistant_id": assistant_id || "jan",
                "assistant_name": assistant_name || "Jan",
                "instructions": instructions || "hi how are you ?",
                "model": {
                    "id": model_id || "mistral-ins-7b-q4",
                    "settings": model_settings || {},
                    "parameters": model_parameters || {},
                    "engine": model_engine || "nitro"
                }
            }
        ],
        "metadata": metadata || {}
    });
    return thread;
}

async function ListThreads() {
    var threads = await get('v1/threads');
    return threads;
}

async function RetrieveThread(threadID) {
    var thread = await get(`v1/threads/${threadID}`);
    return thread;
}

async function ModifyThread(threadID, new_title) {
    var thread = await patch(`v1/threads/${threadID}`, {
        "title": new_title || "Automated NEW TITLE"
    });
    return thread;
}

async function DeleteThread(threadID) {
    var thread = await del(`v1/threads/${threadID}`);
    return thread;
}

module.exports = {
    "endpoints": {
        "models": {
            Listmodels,
            GetModel
        },
        "chat": {
            CompleteChat
        }
    },
    "chat": {
        "assistants": {
            ListAssistants,
            GetAssistant
        },
        "messages": {
            ListMessages,
            CreateMessage,
            RetrieveMessage
        },
        "threads": {
            CreateThread,
            ListThreads,
            RetrieveThread,
            ModifyThread,
            DeleteThread
        }
    }
}
