import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
	themes: ['github-dark', 'github-light'],
	langs: [
		'typescript',
		'javascript',
		'html',
		'css',
		'json',
		'bash',
		'shell',
		'yaml',
		'markdown',
		'python',
		'go',
		'rust',
		'sql',
		'php',
		'ruby',
		'java',
		'c',
		'cpp',
		'csharp',
		'swift',
		'kotlin',
		'dockerfile',
		'nginx',
		'graphql',
		'vue',
		'svelte',
		'jsx',
		'tsx'
	]
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx'],
	highlight: {
		highlighter: async (code, lang) => {
			const html = highlighter.codeToHtml(code, {
				lang: lang || 'text',
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				}
			});
			return `{@html \`${html.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		alias: {
			$content: 'src/content',
			$components: 'src/lib/components',
			$styles: 'src/styles'
		}
	}
};

export default config;
