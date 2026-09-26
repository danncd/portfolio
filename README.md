# Portfolio

**Live at [danncd.com](https://danncd.com)**

Personal website built with Next.js, React, TypeScript, and Tailwind CSS. Content is written in Markdown, with navigation and site settings configured through JSON.

## Adding content to the website

Create a Markdown file inside `content/`, such as `content/projects/my-project.md`:

```
## My Project
Project description.

## Features
Project features.

## Implementation
Project implementation.
```

Then add an item to the appropriate section or parent's children array in config/navigation.json:

```
{
    "id": "my-project",
    "label": "My Project",
    "icon": "list",
    "page": {
        "path": "/projects/coding/my-project",
        "title": "My Project",
        "content": "projects/my-project.md",
        "description": "A short description for the project list."
    }
}
```

## Adding featured projects to Home

Add the project’s ID to the Home item’s featuredProjects array in config/navigation.json:

```
"featuredProjects": ["project-1", "project-2", "my-project"]
```

Project list can be added as a markdown line:

```
::project-list
```
