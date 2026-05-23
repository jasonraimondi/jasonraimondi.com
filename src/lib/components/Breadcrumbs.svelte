<script lang="ts">
  import { base } from "$app/paths";

  interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  interface Props {
    items: BreadcrumbItem[];
  }

  let { items }: Props = $props();
</script>

<nav aria-label="Breadcrumb">
  <ul class="breadcrumbs">
    <li>
      <a href="{base}/">
        <svg
          class="breadcrumbs--home"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          aria-hidden="true"
        >
          <g
            ><path
              d="M500,71.3l-490,490l91.9,91.9l91.9-91.9L255,928.8h183.8V745h122.5v183.8H745l61.3-367.5l91.9,91.9l91.9-91.9L500,71.3z"
            /></g
          >
        </svg>
        <span class="visually-hidden">Home</span>
      </a>
    </li>
    {#each items as item, index (index)}
      <li class:active={!item.href}>
        {#if item.href}
          <a href="{base}{item.href}">{item.label}</a>
        {:else}
          <span aria-current="page">{item.label}</span>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  .breadcrumbs {
    scrollbar-width: none;
    line-height: 1.5;
    white-space: nowrap;
    list-style-type: none;
    font-size: 0.8rem;
    overflow-x: auto;
    margin: 2em 0 1em;

    &::-webkit-scrollbar {
      display: none;
    }

    & li {
      display: inline-block;

      &::after {
        content: "/";
        margin: 0 0.15em;
      }

      &:last-child::after {
        content: none;
      }
    }
  }

  .breadcrumbs--home {
    fill: currentColor;
    height: 1em;
    position: relative;
    top: 2px;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
