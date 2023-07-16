<script lang="ts">
  import Me from "$lib/resume/partials/Me.svelte";
  import Contact from "$lib/resume/partials/Contact.svelte";
  import Summary from "$lib/resume/partials/Summary.svelte";
  import Experience from "$lib/resume/partials/Experience.svelte";
  import Education from "$lib/resume/partials/Education.svelte";
  import Projects from "$lib/resume/partials/Projects.svelte";
  import Skill from "$lib/resume/partials/Skill.svelte";

  export let resume: Resume;
</script>

<div class="container center">
  <Me me={resume.basics} />
  <Contact me={resume.basics} />
  <Summary me={resume.basics} />
  <Experience works={resume.work} />
  <Education educations={resume.education} />
  <Projects publications={resume.publications} />
  <Skill skills={resume.skills} />
</div>
