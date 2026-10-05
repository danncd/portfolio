## Item Frame Cache → Minecraft Mod

Item Frame Cache is a client-side Minecraft mod written in Java for Fabric. It keeps previously seen item frames visible when a multiplayer server stops tracking them at a distance.

The project addresses a visual issue on servers where item frames disappear while the surrounding terrain remains visible. By caching frame data locally, the mod can continue displaying those frames without requiring a server-side installation.

## How it works

The mod listens to Fabric's entity and chunk lifecycle events. When an item frame loads, it records its position, facing direction, frame type, and displayed item. Cached entries are organized by server and dimension, then grouped by chunk and block position.

When the server unloads a frame, the client can render a cached copy using Minecraft's entity renderer. Once the real frame returns, normal rendering takes over after a short transition intended to reduce flickering.

## Saving frames locally

The cache stores serialized frame data in Minecraft's NBT format. It is written to a compressed file when the player disconnects or closes the game, then loaded when the mod starts again.

Saved entries can be reconstructed as regular or glowing item frames as chunks load. An in-memory cache retains those objects for reuse during rendering.

## Rendering and cache updates

Cached rendering checks nearby chunks, camera distance, and the camera's visible area before drawing frames. It uses the game's entity-distance setting to limit how far cached frames are displayed and samples world lighting for their appearance.

The mod also removes cached entries when it observes an empty frame and checks for missing frames near the player to help clear stale data.

## Source

- [Download on CurseForge](https://www.curseforge.com/minecraft/mc-mods/item-frame-cache)
- [View the source on GitHub](https://github.com/danncd/item-frame-cache)
