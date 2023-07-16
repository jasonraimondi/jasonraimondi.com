<script lang="ts">
  export let me: Basics;
</script>

<div class="contact resume-grid section">
  <h3 class="left-column section-title contact">Contact</h3>
  <div class="main-column contact-section">
    <ul class="contact-details">
      <li class="email"><a href="mailto:{me.email}" class="unstyled">{me.email}</a></li>
      <li class="web"><a href={me.website} class="unstyled">{me.website}</a></li>
      <li>{me.location.city}, {me.location.region}</li>
    </ul>
    <ul class="contact-external-links">
      {#each me.profiles as profile (profile.network)}
        {#if !profile.network.startsWith("__")}
          <li><a href={profile.url} target="_blank" rel="noopener">{profile.network}</a></li>
        {/if}
      {/each}
    </ul>
  </div>
</div>
