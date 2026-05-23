<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  interface Props {
    /** Full HTML document written into the embed iframe. */
    srcdoc: string;
    /** Accessible title for the iframe. */
    title: string;
    /** Reserved height (px) so the placeholder doesn't cause layout shift. */
    minHeight: number;
    /** Placeholder shown until the embed loads; receives the current loading state. */
    placeholder: Snippet<[boolean]>;
  }

  let { srcdoc, title, minHeight, placeholder }: Props = $props();

  let container: HTMLElement;
  let loaded = $state(false);
  let loading = $state(false);
  let resizeObserver: ResizeObserver | undefined;

  function load() {
    if (loaded || loading) return;
    loading = true;

    // The embedded scripts use document.write, so capture their output in an iframe.
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("title", title);

    // eslint-disable-next-line svelte/no-dom-manipulating -- Required for iframe-based embedding
    container.innerHTML = "";
    // eslint-disable-next-line svelte/no-dom-manipulating -- Required for iframe-based embedding
    container.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      loading = false;
      return;
    }

    iframeDoc.open();
    iframeDoc.write(srcdoc);
    iframeDoc.close();

    // Resize iframe to fit content
    resizeObserver = new ResizeObserver(() => {
      const height = iframeDoc.body?.scrollHeight;
      if (height) {
        iframe.style.height = `${height}px`;
      }
    });

    iframe.onload = () => {
      loaded = true;
      loading = false;
      if (iframeDoc.body) {
        resizeObserver?.observe(iframeDoc.body);
        // Initial resize
        const height = iframeDoc.body.scrollHeight;
        if (height) {
          iframe.style.height = `${height}px`;
        }
      }
    };
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            load();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px", // Start loading slightly before it enters viewport
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
    };
  });
</script>

<div class="lazy-embed" bind:this={container} style:min-height="{minHeight}px">
  {#if !loaded}
    {@render placeholder(loading)}
  {/if}
</div>

<style>
  .lazy-embed {
    margin: 1.5rem 0;
  }
</style>
