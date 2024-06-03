<script>
	const navLinks = [
		{ name: 'Home', path: '/' },
		{ name: 'Projects', path: '/projects' },
		{ name: 'Issues', path: '/report/issues' },
		{ name: 'Users', path: '/users' }
	];
</script>

<header class="mx-auto p-3 shadow-md">
	<nav class="container flex items-center justify-between gap-3">
		<h1 class="logo">JRM</h1>
		<ul class="flex items-center justify-end gap-2">
			{#each navLinks as link}
				<li class="rounded px-2 py-1 hover:bg-neutral-100">
					<a href={link.path}>{link.name}</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.logo {
		font-family: 'Rock Salt', sans-serif;
		@apply text-3xl tracking-widest text-primary;
	}
</style>
