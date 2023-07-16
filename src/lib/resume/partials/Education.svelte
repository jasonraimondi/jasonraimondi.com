<script lang="ts">
  import { format } from "date-fns";

  export let educations: Education[];

  function formatDate(date) {
    return format(new Date(date), "MMM yyyy");
  }
</script>

<section id="educations" class="section">
  <article class="resume-grid">
    <h3 class="left-column section-title"><strong>Education</strong></h3>
  </article>
  {#each educations as education (education.institution)}
    <article class="resume-grid">
      <div class="left-column">
        <p class="item-title">{education.institution}</p>
        <p class="item-date">{formatDate(education.endDate)}</p>
      </div>
      <div class="main-column">
        <p class="item-subtitle">{education.area}</p>
        <p class="item-subtitle">{education.studyType}</p>
      </div>
    </article>
  {/each}
</section>
