<script>
  export let data;
</script>

<ul class="links">
  {#each data.posts as post}
    <li>
      <a href={`posts/${post.slug}`}>{post.title}</a>
    </li>
  {/each}
</ul>
