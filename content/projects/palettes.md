## Palettes → Color Palette Generator

Palettes is a browser-based color palette generator built with TypeScript, HTML, and CSS. It lets users explore color combinations, keep the colors they like, and export a finished palette as an image.

Each visit starts with one of five preset palettes. Users can generate new colors, lock individual swatches, adjust their shades, and build a palette with up to eight colors.

## How it works

Generating a palette replaces each unlocked swatch with a random RGB color while preserving locked colors. Users can also enter a hexadecimal color directly or press the space bar to generate another combination.

The app keeps palette state separate from its interface and color calculations. Changes are recorded as snapshots, allowing users to undo an entire palette change or restore a previous value for an individual color. Reset returns to the preset selected at the start of the visit.

## Editing colors

The shade editor converts a color to HSL and adjusts its lightness to produce lighter and darker variations. Users can refine a swatch while keeping its hue and saturation consistent.

Color names are provided through Name that Color. Swatch labels switch between black and white based on the background's relative luminance to help keep them readable.

## Exporting palettes

Users can copy color values to the clipboard or download the palette as a PNG. Image export creates a separate layout containing the swatches, hexadecimal values, and color names, then renders it with html2canvas.

Palette generation and editing run in the browser, without an application backend. Vite handles development and production builds.

## Source

- [Open Palettes](https://palettes.danncd.com)
- [View Palettes on GitHub](https://github.com/danncd/palettes)
