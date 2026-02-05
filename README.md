# Skills Collection

A curated collection of skills for use with [Claude Code](https://www.anthropic.com/code) and [skills.sh](https://skills.sh).

## What are Skills?

Skills are markdown files that give AI agents specialized knowledge and workflows for specific tasks. They extend Claude Code's capabilities by providing domain-specific expertise, tools, and methodologies.

## Installation

### Using Claude Code CLI

```bash
claude skills install 4ndh4k/skills
```

### Using Git Clone

```bash
git clone https://github.com/4ndh4k/skills.git
```

### As a Git Submodule

```bash
git submodule add https://github.com/4ndh4k/skills.git skills
```

## Available Skills

This is a convenience collection of skills we create and collect for our own usage.

<!-- Skills will be listed here as they are added -->

## Usage

Once installed, skills can be invoked in Claude Code using:

```bash
/skill-name
```

Or referenced in your prompts to give Claude the specialized knowledge contained in the skill.

## Structure

```
skills/           # Individual skill files (.md)
tools/            # Helper scripts and utilities
docs/             # Additional documentation
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.
