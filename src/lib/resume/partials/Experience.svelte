<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";

  export let works: Work[] = [];
</script>

<section id="experiences" class="section">
  <header class="resume-grid">
    <h3 class="left-column section-title">Experience</h3>
  </header>

  {#each works as work, idx}
    {#if !work.company.startsWith("__")}
      <article
        class="resume-grid item {works[idx - 1] && work.company === works[idx - 1].company
          ? 'short-col'
          : ''}"
      >
        <div class="left-column">
          {#if !(works[idx - 1] && work.company === works[idx - 1].company)}
            <p class="item-title">
              {#if work.website}
                <a href={work.website} target="_blank" rel="noopener">{work.company}</a>
              {:else}
                <a>{work.company}</a>
              {/if}
            </p>
            <p class="item-subtitle">{work.position}</p>
            <p class="item-date">
              {work.startDate} - {work.endDate === "present" ? "present" : work.endDate}
            </p>

            {#if works[idx + 1] && work.company === works[idx + 1].company}
              <p class="item-subtitle additional">{works[idx + 1].position}</p>
              <p class="item-date">
                {works[idx + 1].startDate}
                - {works[idx + 1].endDate === "present" ? "present" : works[idx + 1].endDate}
              </p>
            {/if}
          {/if}
        </div>
        <ul class="main-column item-list">
          {#if work.summary && !work.summary.startsWith("__")}
            <li class="item-subtitle">{work.summary}</li>
          {/if}

          {#each work.highlights as highlight}
            {#if !highlight.startsWith("__")}
              <li>&dash; <SvelteMarkdown source={highlight} /></li>
            {/if}
          {/each}
        </ul>
      </article>
    {/if}
  {/each}
</section>
