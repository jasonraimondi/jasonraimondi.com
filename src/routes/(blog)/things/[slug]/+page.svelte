<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import EditOnGitHub from "$lib/components/EditOnGitHub.svelte";
  import JsonLd from "$lib/components/JsonLd.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const siteUrl = "https://jasonraimondi.com";
  const pageUrl = $derived(`${siteUrl}/things/${data.metadata.slug}/`);
  const imageUrl = $derived(
    data.metadata.images?.[0]
      ? data.metadata.images[0].startsWith("http")
        ? data.metadata.images[0]
        : `${siteUrl}${data.metadata.images[0]}`
      : null,
  );

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatISODate(dateString: string): string {
    return new Date(dateString).toISOString();
  }

  const breadcrumbItems = $derived([
    { label: "Things", href: "/things/" },
    { label: data.metadata.title },
  ]);

  const jsonLd = $derived({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data.metadata.title,
    description: data.metadata.description,
    url: pageUrl,
    datePublished: formatISODate(data.metadata.date),
    author: {
      "@type": "Person",
      name: "Jason Raimondi",
      url: siteUrl,
    },
    ...(imageUrl && { image: imageUrl }),
    ...(data.metadata.tags?.length && { keywords: data.metadata.tags.join(", ") }),
  });
</script>

<svelte:head>
  <title>{data.metadata.title} | Jason Raimondi</title>
  <meta name="description" content={data.metadata.description} />
  <link rel="canonical" href={pageUrl} />

  <!-- OpenGraph -->
  <meta property="og:title" content={data.metadata.title} />
  <meta property="og:description" content={data.metadata.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:site_name" content="Jason Raimondi" />
  {#if imageUrl}
    <meta property="og:image" content={imageUrl} />
  {/if}

  <!-- Twitter Card -->
  <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
  <meta name="twitter:title" content={data.metadata.title} />
  <meta name="twitter:description" content={data.metadata.description} />
  {#if imageUrl}
    <meta name="twitter:image" content={imageUrl} />
  {/if}
</svelte:head>

<JsonLd data={jsonLd} />

<Breadcrumbs items={breadcrumbItems} />

<article class="single" itemscope itemtype="http://schema.org/CreativeWork">
  <header class="single--header">
    <h1 class="single--title" itemprop="name">
      {data.metadata.title}
      <div class="hidden" itemprop="author" itemscope itemtype="http://schema.org/Person">
        <span itemprop="name">Jason Raimondi</span>
      </div>
    </h1>
  </header>

  <section class="single--post">
    <section class="single--post--block1">
      {#if data.metadata.categories?.length || data.metadata.tags?.length}
        <ul class="single--post--tags">
          {#each data.metadata.categories ?? [] as category (category)}
            <li><span class="label inline">{category}</span></li>
          {/each}
          {#each data.metadata.tags ?? [] as tag (tag)}
            <li><span class="label">{tag}</span></li>
          {/each}
        </ul>
      {/if}
      <EditOnGitHub filePath="things/{data.metadata.slug}.svx" />
    </section>

    <section>
      <p class="single--date">
        Published:
        <time datetime={data.metadata.date} itemprop="datePublished">
          {formatDate(data.metadata.date)}
        </time>
      </p>
    </section>

    <article class="single--post-body" itemprop="description">
      <data.content />
    </article>
  </section>
</article>

<style>
  .hidden {
    display: none;
  }
</style>
