<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { validateEmail } from '$lib/utils/validation';

	let email = '';
	let password = '';
	let errorMessage = '';
	let isLoading = false;

	async function handleSubmit(event) {
		event.preventDefault();

		if (!validateEmail(email)) {
			errorMessage = 'Please enter a valid email address';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const res = await fetch('/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			if (res.ok) {
				auth.setUser(data);
				await goto('/protected');
			} else {
				errorMessage = data.error || 'Invalid credentials';
			}
		} catch (error) {
			console.error('Error logging in:', error);
			errorMessage = 'An unexpected error occurred';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="login-container">
	<h1>Login</h1>

	<form on:submit={handleSubmit} class="login-form">
		<div class="form-group">
			<label for="email">Email:</label>
			<input 
				id="email" 
				type="email" 
				bind:value={email} 
				required 
				disabled={isLoading}
			/>
		</div>

		<div class="form-group">
			<label for="password">Password:</label>
			<input 
				id="password" 
				type="password" 
				bind:value={password} 
				required 
				disabled={isLoading}
			/>
		</div>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		<button type="submit" disabled={isLoading}>
			{isLoading ? 'Logging in...' : 'Log In'}
		</button>
	</form>
</div>
<!-- 
<style>
	.login-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: white;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.error {
		color: red;
		font-size: 0.9rem;
	}

	button {
		background-color: #3498db;
		color: white;
		padding: 0.75rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.signup-link {
		text-align: center;
		margin-top: 1rem;
	}
</style> -->
