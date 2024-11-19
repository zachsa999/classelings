<script>
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let title = 'Classelings Homepage';
	if (dev == true) {
		title = 'DEV: Classelings';
	}

	export let data;

	$: isAuthenticated = !!data?.user;
	$: currentPath = $page.url.pathname;

	async function handleLogout() {
		try {
			const response = await fetch('/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				auth.clearUser();
				await goto('/login');
			} else {
				console.error('Logout failed:', await response.text());
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="layout">
	<nav>
		<div class="nav-brand">
			<a href="/" class="brand">ClassElings</a>
		</div>
		
		<div class="nav-links">
			{#if isAuthenticated}
				<a 
					href="/protected/classes" 
					class:active={currentPath === '/protected/classes'}
				>
					Classes
				</a>
				<a 
					href="/protected/curriculum" 
					class:active={currentPath === '/protected/curriculum'}
				>
					Curriculum
				</a>
				<button on:click={handleLogout} class="logout-btn">Log Out</button>
			{:else}
				<a 
					href="/login" 
					class:active={currentPath === '/login'}
				>
					Log In
				</a>
				<a 
					href="/signup" 
					class="signup-btn" 
					class:active={currentPath === '/signup'}
				>
					Sign Up
				</a>
			{/if}
		</div>
	</nav>

	<main>
		<slot />
	</main>

	<footer>
		<p>© {new Date().getFullYear()} ClassElings. All rights reserved.</p>
	</footer>
</div>
<!-- 
<style>
	.layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	nav {
		background-color: #2c3e50;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
	}

	.nav-brand {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.brand {
		color: white;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.nav-links a {
		color: #ecf0f1;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.nav-links a:hover {
		background-color: #34495e;
	}

	.nav-links a.active {
		background-color: #3498db;
	}

	.signup-btn {
		background-color: #2ecc71;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		text-decoration: none;
	}

	.signup-btn:hover {
		background-color: #27ae60;
	}

	.logout-btn {
		background-color: #e74c3c;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.logout-btn:hover {
		background-color: #c0392b;
	}

	main {
		flex: 1;
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	footer {
		background-color: #2c3e50;
		color: white;
		text-align: center;
		padding: 1rem;
		margin-top: auto;
	}
</style> -->
