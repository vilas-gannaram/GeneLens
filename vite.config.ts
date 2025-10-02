import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib'),
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: false,
		rollupOptions: {
			input: {
				'service-worker': path.resolve(__dirname, 'src/service-worker.ts'),
				'content-script': path.resolve(__dirname, 'src/content-script.ts'),
			},
			output: { entryFileNames: '[name].js', assetFileNames: '[name].[ext]' }, // Force inline for content scripts - no external chunks// inlineDynamicImports: true,
		},
	},
});
