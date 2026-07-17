import { mount } from 'svelte';
import '$lib/shadcn-colors.css';
import SidePanel from '$lib/components/side-panel.svelte';

const target = document.getElementById('app');

if (target) {
	mount(SidePanel, { target });
}
