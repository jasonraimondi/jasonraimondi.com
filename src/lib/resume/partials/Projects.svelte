<script lang="ts">
  export let publications: Publication[];
</script>

<section id="projects" class="projects print-hide section">
  <header class="resume-grid">
    <h3 class="left-column section-title">Projects</h3>
  </header>

  {#each publications as publication}
    <article class="resume-grid item">
      <div class="left-column">
        {#if publication.website}
          <a class="item-title" href={publication.website} target="_blank" rel="noopener"
            >{publication.name}</a
          >
        {:else}
          <a class="item-title">{publication.company}</a>
        {/if}
        <p class="item-date">
          {new Date(publication.releaseDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </p>
      </div>
      <ul class="main-column item-list">
        <li>
          <p>{@html publication.summary}</p>
          <br />
          <a class="small" href={publication.website}>{publication.website}</a>
        </li>
      </ul>
    </article>
  {/each}
</section>
