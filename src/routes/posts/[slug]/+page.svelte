<script lang="ts">
  import type { PageData } from "./types";

  export let data: PageData;
</script>

<div>
  <article>
    <header>
      <h1>{data.post.title}</h1>
    </header>

    <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
    <!-- render the post -->
    <div>
      <!--      <svelte:component this={data.component} />-->
      {@html data.post.content}
    </div>
  </article>
</div>
