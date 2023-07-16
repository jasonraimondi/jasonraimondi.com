<script lang="ts">
  export let skills: Skill[];
</script>

<ul id="skills" class="skills section">
  <li class="resume-grid">
    <h3 class="left-column section-title">Skills</h3>
  </li>

  {#each skills as skill}
    <li class="resume-grid item">
      <h4 class="left-column item-title">{skill.name}</h4>
      <ul class="main-column skill-section-list">
        {#each skill.keywords as keyword}
          <li class="skill-item">
            <a
              class="label"
              href={`https://www.google.com/search?q=${keyword}`}
              target="_blank"
              rel="noopener">{keyword}</a
            >
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>
