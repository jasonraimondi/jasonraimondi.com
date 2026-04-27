/**
 * Generate _redirects file for Cloudflare Pages from content aliases
 *
 * Reads all posts and things .svx files, extracts aliases from frontmatter,
 * and generates a _redirects file in the static directory.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

function extractFrontmatter(content: string): Record<string, unknown> | null {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return null;

	const yaml = match[1];
	const result: Record<string, unknown> = {};

	// Simple YAML parser for our needs
	let currentKey = '';
	let inArray = false;
	let arrayValues: string[] = [];

	for (const line of yaml.split('\n')) {
		if (line.match(/^[a-zA-Z]/)) {
			// New key
			if (inArray && currentKey) {
				result[currentKey] = arrayValues;
				arrayValues = [];
				inArray = false;
			}
			const colonIdx = line.indexOf(':');
			if (colonIdx > 0) {
				currentKey = line.slice(0, colonIdx).trim();
				let value = line.slice(colonIdx + 1).trim();
				// Strip quotes from values
				if ((value.startsWith('"') && value.endsWith('"')) ||
				    (value.startsWith("'") && value.endsWith("'"))) {
					value = value.slice(1, -1);
				}
				if (value) {
					result[currentKey] = value;
				}
			}
		} else if (line.match(/^- /)) {
			// Array item
			inArray = true;
			const value = line.replace(/^- /, '').trim();
			// Skip Hugo relref syntax
			if (!value.includes('relref')) {
				arrayValues.push(value);
			}
		}
	}

	if (inArray && currentKey) {
		result[currentKey] = arrayValues;
	}

	return result;
}

function getContentAliases(dir: string, type: 'posts' | 'things'): Map<string, string> {
	const redirects = new Map<string, string>();

	if (!fs.existsSync(dir)) {
		return redirects;
	}

	const files = fs.readdirSync(dir);

	for (const file of files) {
		if (!file.endsWith('.svx')) continue;

		const filePath = path.join(dir, file);
		const content = fs.readFileSync(filePath, 'utf-8');
		const frontmatter = extractFrontmatter(content);

		if (!frontmatter) continue;

		const slug = (frontmatter.slug as string) || file.replace('.svx', '');
		const aliases = frontmatter.aliases as string[] | undefined;

		if (aliases && aliases.length > 0) {
			const targetPath = `/${type}/${slug}/`;
			for (const alias of aliases) {
				// Normalize the alias path
				let normalizedAlias = alias.trim();
				if (!normalizedAlias.startsWith('/')) {
					normalizedAlias = '/' + normalizedAlias;
				}
				if (!normalizedAlias.endsWith('/')) {
					normalizedAlias += '/';
				}
				redirects.set(normalizedAlias, targetPath);
			}
		}
	}

	return redirects;
}

function main() {
	const postsDir = path.join(process.cwd(), 'src/content/posts');
	const thingsDir = path.join(process.cwd(), 'src/content/things');
	const outputPath = path.join(process.cwd(), 'static/_redirects');

	const postsRedirects = getContentAliases(postsDir, 'posts');
	const thingsRedirects = getContentAliases(thingsDir, 'things');

	// Merge all redirects
	const allRedirects = new Map([...postsRedirects, ...thingsRedirects]);

	if (allRedirects.size === 0) {
		console.log('No aliases found in content, skipping _redirects generation');
		return;
	}

	// Generate _redirects content
	// Format: /old-path /new-path 301
	const lines = ['# Auto-generated redirects from content aliases'];
	for (const [from, to] of allRedirects) {
		lines.push(`${from} ${to} 301`);
	}

	fs.writeFileSync(outputPath, lines.join('\n') + '\n');
	console.log(`Generated ${allRedirects.size} redirects in static/_redirects`);
}

main();
