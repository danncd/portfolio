## Arx → Coding Agent

Arx is a local coding agent written in Go for the backend and TypeScript for the desktop electron app. It connects to local models through the app, streams their responses, and lets them use tools such as files, web, and even content generation such as video, image, and speech.

## How it works

Each task starts with a message, a selected model, and the conversation's permission settings. Arx prepares the relevant history and available tools, then streams the model response into the interface.

When the model requests a tool, the backend validates the request and applies the active permission policy. After execution, the result returns to the model as context. The model can then continue investigating, take another action, or deliver its answer.

The loop continues until Arx completes the task making it an agent.

## Running models locally

Arx can import or download supported GGUF models and run them through a managed local inference runtime. It also connects to loaded models served through LM Studio.

The app checks the selected model’s capabilities, including tool use, image input, and context limits. While a reply is running, Arx keeps its local model loaded; when idle, it can release the model according to the configured timeout.

## Image, Video, and Speech generation

Media generation uses dedicated models and Python workers coordinated by the Go backend. Generation runs as a tracked job, with progress, cancellation, and saved output displayed in the conversation.

When needed, Arx can temporarily unload the local chat model to free memory for generation, then restore it afterward. Generated images, audio, and video are saved as artifacts that remain accessible from the chat.

Current local generation targets Apple Silicon.

## Source

[View Arx on GitHub](https://github.com/danncd/arx)
