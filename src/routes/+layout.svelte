<script>
	import "../app.css";
	import { page } from '$app/state';

	let { children } = $props();
</script>

{@render children()}

<div style="display:none">
</div>