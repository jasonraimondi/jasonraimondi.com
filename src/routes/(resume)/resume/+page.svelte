<script lang="ts">
  import { base } from "$app/paths";
  import JsonLd from "$lib/components/JsonLd.svelte";
  import type { PageData } from "./$types";
  import PdfIcon from "./PdfIcon.svelte";

  let { data }: { data: PageData } = $props();

  const resume = $derived(data.resume);
  const basics = $derived(resume.basics);

  // SEO constants
  const siteUrl = "https://jasonraimondi.com";
  const pageUrl = `${siteUrl}/resume/`;
  const profileImage = `${siteUrl}/misc/me/zombie-ruby-trimmed@2x.png`;
  const pageTitle = $derived(`${basics.name}'s Resume`);

  const jsonLd = $derived({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: pageTitle,
    description: basics.summary,
    url: pageUrl,
    mainEntity: {
      "@type": "Person",
      name: basics.name,
      jobTitle: "Senior Software Engineer",
      url: basics.website,
      email: "jason@raimondi.us",
      image: profileImage,
    },
  });

  function formatDate(dateStr: string): string {
    if (dateStr === "present") return "present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  function shouldHide(value: string | undefined): boolean {
    return !value || value.startsWith("__");
  }

  // Filter visible profiles (not starting with __)
  const visibleProfiles = $derived(basics.profiles.filter(p => !p.network.startsWith("__")));

  // Group consecutive work entries by company for display
  function getWorkEntries() {
    const works = resume.work.filter(w => !shouldHide(w.company));
    const entries: Array<{
      work: (typeof works)[0];
      prev: (typeof works)[0] | null;
      next: (typeof works)[0] | null;
      key: string;
    }> = [];

    for (let i = 0; i < works.length; i++) {
      entries.push({
        work: works[i],
        prev: i > 0 ? works[i - 1] : null,
        next: i < works.length - 1 ? works[i + 1] : null,
        key: `${works[i].company}-${works[i].startDate}`,
      });
    }

    return entries;
  }

  const workEntries = $derived(getWorkEntries());
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={basics.summary} />
  <link rel="canonical" href={pageUrl} />

  <!-- OpenGraph -->
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={basics.summary} />
  <meta property="og:type" content="profile" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:site_name" content="Jason Raimondi" />
  <meta property="og:image" content={profileImage} />
  <meta property="profile:first_name" content="Jason" />
  <meta property="profile:last_name" content="Raimondi" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={basics.summary} />
  <meta name="twitter:image" content={profileImage} />
</svelte:head>

<JsonLd data={jsonLd} />

<div id="resume" class="container center">
  <!-- Me Section -->
  <div id="me" class="resume-grid section">
    <div class="left-column">
      <h1 class="hidden">{basics.name}</h1>
      <p class="first name">
        <a href={basics.website} class="unstyled">Jason</a>
      </p>
    </div>

    <div class="main-column about-me">
      <p class="last name">
        <a href={basics.website} class="unstyled">Raimondi</a>
      </p>
      <h2 class="job-title">Senior Software Engineer</h2>
      <a href="{base}/resume.pdf" class="downloader" title="Download PDF Resume">
        <PdfIcon />
        <p>PDF</p>
      </a>
    </div>
  </div>

  <!-- Contact Section -->
  <div class="contact resume-grid section">
    <h3 class="left-column section-title contact">Contact</h3>
    <div class="main-column contact-section">
      <ul class="contact-details">
        <li class="email">
          <a href="mailto:jason@raimondi.us" class="unstyled">jason@raimondi.us</a>
        </li>
        <li class="web">
          <a href={basics.website} class="unstyled">{basics.website}</a>
        </li>
      </ul>
      <ul class="contact-external-links">
        {#each visibleProfiles as profile (profile.network)}
          <li>
            <a href={profile.url} target="_blank" rel="noopener">{profile.network}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Summary Section -->
  {#if !shouldHide(basics.summary)}
    <section id="summary" class="section">
      <div class="resume-grid">
        <h3 class="left-column section-title">Summary</h3>
        <p class="main-column">{basics.summary}</p>
      </div>
    </section>
  {/if}

  <!-- Experience Section -->
  <section id="experiences" class="section">
    <header class="resume-grid">
      <h3 class="left-column section-title">Experience</h3>
    </header>

    {#each workEntries as { work, prev, next, key } (key)}
      <article class="resume-grid item" class:short-col={prev && work.company === prev.company}>
        <div class="left-column">
          {#if !prev || work.company !== prev.company}
            <p class="item-title">
              {#if work.website}
                <a href={work.website} target="_blank" rel="noopener">{work.company}</a>
              {:else}
                <span>{work.company}</span>
              {/if}
            </p>
            <p class="item-subtitle">{work.position}</p>
            <p class="item-date">
              {formatDate(work.startDate)} - {formatDate(work.endDate)}
            </p>

            {#if next && work.company === next.company}
              <p class="item-subtitle additional">{next.position}</p>
              <p class="item-date">
                {formatDate(next.startDate)} - {formatDate(next.endDate)}
              </p>
            {/if}
          {/if}
        </div>
        <ul class="main-column item-list">
          {#each work.highlights as highlight, idx (`${key}-highlight-${idx}`)}
            {#if !shouldHide(highlight)}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -- Resume highlights contain markdown links from JSON -->
              <li>{@html highlight}</li>
            {/if}
          {/each}
        </ul>
      </article>
    {/each}
  </section>

  <!-- Education Section -->
  <section id="educations" class="section">
    <header class="resume-grid">
      <h3 class="left-column section-title">Education</h3>
    </header>
    {#each resume.education as edu (edu.institution)}
      <article class="resume-grid">
        <div class="left-column">
          <p class="item-title">{edu.institution}</p>
          <p class="item-date">{formatDate(edu.endDate)}</p>
        </div>
        <div class="main-column">
          <p class="item-subtitle">{edu.area}</p>
          <p class="item-subtitle">{edu.studyType}</p>
        </div>
      </article>
    {/each}
  </section>

  <!-- Projects Section -->
  <section id="projects" class="projects print-hide section">
    <header class="resume-grid">
      <h3 class="left-column section-title">Projects</h3>
    </header>
    {#each resume.publications as pub (pub.name)}
      <article class="resume-grid item">
        <div class="left-column">
          {#if pub.website}
            <a class="item-title" href={pub.website} target="_blank" rel="noopener">{pub.name}</a>
          {:else}
            <span class="item-title">{pub.name}</span>
          {/if}
          <p class="item-date">{formatDate(pub.releaseDate)}</p>
        </div>
        <ul class="main-column item-list">
          <li>
            {pub.summary}
            <br />
            <a class="small" href={pub.website}>{pub.website}</a>
          </li>
        </ul>
      </article>
    {/each}
  </section>

  <!-- Skills Section -->
  <section id="skills" class="skills section">
    <header class="resume-grid">
      <h3 class="left-column section-title">Skills</h3>
    </header>
    {#each resume.skills as skill (skill.name)}
      <div class="resume-grid item">
        <h4 class="left-column item-title">{skill.name}</h4>
        <ul class="main-column skill-section-list">
          {#each skill.keywords as keyword (keyword)}
            <li class="skill-item">
              <a
                class="label"
                href="https://www.google.com/search?q={encodeURIComponent(keyword)}"
                target="_blank"
                rel="noopener">{keyword}</a
              >
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>
</div>

<style>
  #resume {
    font-weight: 500;
  }

  .hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  @media print {
    .print-hide {
      display: none;
    }
  }

  .section {
    padding-bottom: 1rem;

    @media print {
      padding-bottom: 0.25rem;
    }
  }

  .section-title {
    text-transform: uppercase;
    font-weight: var(--font-black);
    font-size: var(--text-md);
    margin: 0;
  }

  .item-title {
    font-weight: var(--font-bold);
    margin-top: 0;
    margin-bottom: 0;
    line-height: var(--resume-line-height);
  }

  .item-subtitle {
    font-weight: var(--font-medium);
    font-size: var(--text-md);
    line-height: var(--resume-line-height);
  }

  .item-date {
    font-weight: var(--font-normal);
    font-size: var(--text-md);
    line-height: var(--resume-line-height);
  }

  .item {
    padding-bottom: 1rem;

    @media print {
      padding-bottom: 0.5rem;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  .item-list li::before {
    content: "-";
    padding-right: 0.25rem;
  }

  .item-list li {
    padding-top: 0.5rem;
    line-height: var(--resume-line-height);

    @media (--medium) {
      padding-top: 0;
    }

    @media print {
      padding-top: 0;
      padding-bottom: 0.5rem;
    }
  }

  @media (--medium) {
    .resume-grid {
      display: grid;
      grid-template-areas: "left-column main-column";
      grid-template-columns: 33.33% minmax(0, 1fr);
      column-gap: 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .main-column {
      grid-area: main-column;
    }

    .left-column {
      grid-area: left-column;
      direction: rtl;
      text-align: right;
      white-space: nowrap;
    }
  }

  @media print {
    .resume-grid {
      display: flex;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .left-column {
      width: 33%;
      direction: rtl;
      text-align: right;
      white-space: initial;
    }

    .main-column {
      flex: 1;
      padding-left: 15px;
    }
  }

  @media (--large) {
    .resume-grid {
      row-gap: 1rem;
    }
  }

  #me {
    padding: 1rem 0 0.5rem;

    @media (--medium) {
      padding: 2rem 0 0;
      position: relative;
    }

    @media print {
      padding-bottom: 0;
    }
  }

  .name {
    text-transform: uppercase;
    line-height: 1;
    font-size: 4rem;

    @media (--medium) {
      font-size: 5rem;
      height: 5rem;
    }

    @media (--large) {
      font-size: 5rem;
      height: 5rem;
    }

    @media (--xlarge) {
      font-size: 7rem;
      height: 7rem;
    }

    @media print {
      font-size: 5.25rem;
      height: 5.25rem;
    }
  }

  .first {
    font-weight: var(--font-medium);

    @media (--medium) {
      position: relative;
      left: 8px;
    }
  }

  .last {
    font-weight: var(--font-black);

    @media (--medium) {
      transform: scaleX(1.0125);
    }
  }

  .job-title {
    margin: 0.25rem 0;
    font-size: var(--text-lg);
    text-transform: uppercase;

    @media (--medium) {
      margin: 0 0 0.5rem;
      height: var(--text-lg);
    }
  }

  @media (--medium) {
    .last a,
    .job-title {
      display: flex;
      justify-content: space-between;
    }
  }

  @media print {
    .last a,
    .job-title {
      display: flex;
      justify-content: space-between;
    }
  }

  .downloader {
    position: absolute;
    top: 2rem;
    right: 1.5rem;

    @media (--medium) {
      right: -5rem;
      padding-top: 1rem;
    }

    @media print {
      display: none;
    }
  }

  .downloader p {
    font-size: 0.8rem;
    position: relative;
    left: 0.2rem;
    top: -0.3rem;
  }

  .downloader :global(svg) {
    fill: currentColor;
    max-width: 2rem;
  }

  .contact-section {
    display: flex;
  }

  .contact-details,
  .contact-external-links {
    line-height: 1.4;
  }

  .contact-details {
    flex: 1;

    @media (--medium) {
      flex: initial;
    }
  }

  .contact-external-links {
    text-align: right;

    @media (--medium) {
      text-align: initial;
      padding-left: 2rem;
    }

    @media print {
      display: none;
    }
  }

  @media print {
    .skills {
      display: none;
    }
  }

  .skill-section-list {
    display: flex;
    flex-wrap: wrap;
  }

  .skills .label {
    font-size: var(--text-md);
    margin-right: 0.5em;
    margin-bottom: 0.5em;

    @media print {
      padding: 0;
      margin: 0;
    }
  }

  @media print {
    .skill-item {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
</style>
