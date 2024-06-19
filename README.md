# dependency_analyzer

`dependency_analyzer` is a CLI tool written in TypeScript to help you find dependency conflicts and circular dependencies in your NodeJS projects. It analyzes the dependencies as described in the `package.json` of your NodeJS project.

## Features

- Detects dependency conflicts in your project.
- Identifies circular dependencies among your project dependencies.
- Provides a detailed analysis based on the `package.json` file.

## Installation

Install `dependency_analyzer` globally using npm:

```sh
$ npm install -g dependency_analyzer
```

Or clone this repo and use the link script:

```sh
$ git clone https://github.com/brkncookie/dependency_analyzer
$ cd dependency_analyzer && npm install && npm run link
```

## Usage

Run `dependency_analyzer` in the root directory of your NodeJS project:

```sh
$ dependency_analyzer
### Dependency Conflicts:


1. **Conflict 1:**
   - Package Name: combined-stream
   - First Dependent: Main Project
     - Required Version: 1.0.0
   - Second Dependent: axios -> form-data
     - Required Version: 1.0.8


2. **Conflict 2:**
   - Package Name: delayed-stream
   - First Dependent: combined-stream
     - Required Version: 0.0.5
   - Second Dependent: axios -> form-data -> combined-stream
     - Required Version: 1.0.0


### Circular Dependencies:


1. **Circular Dependency 1:**
   - First Package: combined-stream
   - Second Package: delayed-stream
   - Direct: Yes
```

#### Explanation of the above output

this is the `dependencies` property part of our `package.json`:

```json
 "dependencies": {
    "combined-stream": "1.0.0",
    "axios": "1.7.2"
  }
```

as can be seen our main project depends on two packages:

- `combined-stream`
- `axios`

the problem here is that the axios package itself dependes on a different version of the `combined-stream` package thus resulting in a dependency conflict, and if the two different versions of `combined-stream` also have their own dependencies they may result in a deep dependency conflict as it is the case for the `delayed-stream` package which is a dependency of the `combined-stream` package.

we also have an intentionally made direct circualr dependency _(by manually modifying the lockfile)_ between `combined-stream` and `delayed-stream`.
