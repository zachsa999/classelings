<script>
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    export let data;

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

<div class="welcome-container">
    <header>
        <h1>Welcome, {data.user.name}!</h1>
        <button on:click={handleLogout} class="logout-button">Log Out</button>
    </header>

    <div class="dashboard">
        <div class="card">
            <h2>Curriculum Management</h2>
            <p>Create and manage your curriculum content.</p>
            <a href="/protected/curriculum" class="button">Go to Curriculum</a>
        </div>

        <div class="card">
            <h2>Student Records</h2>
            <p>Manage student information and track progress.</p>
            <a href="/protected/students" class="button">Go to Students</a>
        </div>

        <div class="card">
            <h2>Grade Management</h2>
            <p>Record and review student grades.</p>
            <a href="/protected/grades" class="button">Go to Grades</a>
        </div>
    </div>
</div>

<style>
    .welcome-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .logout-button {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .logout-button:hover {
        background-color: #c82333;
    }

    .dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .card {
        background-color: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
        margin-top: 0;
        color: #333;
    }

    .card p {
        color: #666;
        margin-bottom: 1.5rem;
    }

    .button {
        display: inline-block;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .button:hover {
        background-color: #45a049;
    }
</style>