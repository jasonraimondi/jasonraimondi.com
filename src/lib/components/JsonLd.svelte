<script lang="ts">
  interface Props {
    data: Record<string, unknown>;
  }

  let { data }: Props = $props();

  // Split the closing tag so the script element isn't terminated early.
  const json = $derived(
    '<script type="application/ld+json">' + JSON.stringify(data) + "</" + "script>",
  );
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD data is trusted -->
  {@html json}
</svelte:head>
