<script lang="ts">
  import "$styles/resume/style.css";
  import Resume from "$lib/resume/Resume.svelte";

  export let data: {
    resume: Resume;
  };
</script>

<Resume resume={data.resume} />
