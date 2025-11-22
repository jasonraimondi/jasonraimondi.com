# AGENTS.md

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with preheat script
- `pnpm build` - Build production application (runs svelte build + file copying)
- `pnpm check` - Run TypeScript type checking

## Code Style and Conventions

### Naming Conventions
- **Components**: PascalCase for `.svelte` files (e.g., `ShowCard.svelte`)
- **Variables/Functions**: snake_case for variables, functions, and props
- **Constants**: UPPER_CASE for true constants only
- **Types**: PascalCase for TypeScript interfaces

### Svelte 5 Patterns
- Use `$state` for reactive state declarations
- Use `$derived` for computed values
- Use `$effect` for side effects and lifecycle
- Use `$props` for component props with destructuring
- Use `$bindable` for two-way bindable props
- Use classes for complex state management (state machines)

### File Organization
- **Components**: Group related components in `/src/lib/`
- **Routes**: Use SvelteKit's file-based routing with layout groups
- **State**: Svelte stores in `/src/state/` for global state
- **Server**: All server-side logic in `/src/server/`

## Common Patterns

### State Management
```typescript
// For complex state, use classes
class PlayerState {
  currentShow = $state<Show | null>(null);
  isPlaying = $state(false);
  
  play() {
    this.isPlaying = true;
  }
}

export const playerState = new PlayerState();
```
