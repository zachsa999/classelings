<script>
	import { goto } from '$app/navigation';
	import { validateEmail, validatePassword, validateConfirmPassword } from '$lib/utils/validation';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';
	let isLoading = false;

	async function handleSignup(event) {
		event.preventDefault();
		errorMessage = '';

		// Validate inputs
		if (!validateEmail(email)) {
			errorMessage = 'Please enter a valid email address';
			return;
		}

		if (!validatePassword(password)) {
			errorMessage = 'Password must be at least 8 characters long';
			return;
		}

		if (!validateConfirmPassword(password, confirmPassword)) {
			errorMessage = 'Passwords do not match';
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Signup failed');
			}

			await goto('/login?registered=true');
		} catch (err) {
			errorMessage = err.message || 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="signup-container">
	<h1>Sign Up</h1>

	<form on:submit={handleSignup} class="signup-form">
		<div class="form-group">
			<label for="name">Name:</label>
			<input 
				id="name" 
				type="text" 
				bind:value={name} 
				required 
				disabled={isLoading}
			/>
		</div>

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

		<div class="form-group">
			<label for="confirmPassword">Confirm Password:</label>
			<input 
				id="confirmPassword" 
				type="password" 
				bind:value={confirmPassword} 
				required 
				disabled={isLoading}
			/>
		</div>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		<button type="submit" disabled={isLoading}>
			{isLoading ? 'Creating Account...' : 'Sign Up'}
		</button>
	</form>

	<p class="login-link">
		Already have an account? <a href="/login">Log in</a>
	</p>
</div>
<!-- 
<style>
	.signup-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.error {
		color: red;
		font-size: 0.9rem;
	}

	button {
		padding: 0.5rem;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.login-link {
		text-align: center;
		margin-top: 1rem;
	}
</style> -->
