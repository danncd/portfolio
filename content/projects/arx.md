Arx is a terminal coding agent written in Go. It connects to language models, streams their responses, and lets them request shell commands.

## How it works

Commands go through a permission-checking flow before execution. The shell tool also has timeouts, limits on output, and a filtered environment.

The project includes tests for command approval, streaming responses, and tool execution.

## Source

[View Arx on GitHub](https://github.com/danncd/arx)
