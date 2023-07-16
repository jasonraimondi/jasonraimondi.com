<script>
  export let author;
  export let link;
  export let quote;
</script>

<blockquote cite={link}>
  {quote}
  <footer>
    {author}
  </footer>
</blockquote>
