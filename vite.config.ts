import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		cssCodeSplit: false,
		rollupOptions: {
			input: {
				// index: path.resolve(__dirname, 'index.html'), // 🖼️ HTML entry
				'service-worker': path.resolve(__dirname, 'src/service-worker.js'), // 🧠 service_worker
				'content-script': path.resolve(__dirname, 'src/content-script.js'), // 👁️ injected script
				// options: path.resolve(__dirname, 'src/options.html'), // ⚙️ optional: options page
			},
			output: {
				entryFileNames: '[name].js',
				assetFileNames(chunkInfo) {
					return '[name][extname]';
				},
			},
		},
	},
});
