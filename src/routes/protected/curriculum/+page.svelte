<script>
    import { onMount } from 'svelte';
    
    let curricula = [];
    let newCurriculum = {
        title: '',
        subject: '',
        grade_level: 1,
        description: ''
    };
    
    const subjects = ['Math', 'Science', 'English', 'History'];
    const grades = Array.from({ length: 12 }, (_, i) => i + 1);

    onMount(loadCurricula);

    async function loadCurricula() {
        const response = await fetch('/api/curriculum');
        if (response.ok) {
            curricula = await response.json();
        } else {
            console.error('Failed to load curricula:', await response.text());
        }
    }

    async function addCurriculum() {
        const response = await fetch('/api/curriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCurriculum)
        });
        
        if (response.ok) {
            await loadCurricula();
            newCurriculum = {
                title: '',
                subject: '',
                grade_level: 1,
                description: ''
            };
        } else {
            console.error('Failed to add curriculum:', await response.text());
        }
    }

    async function updateCurriculum(id, field, value) {
        const response = await fetch(`/api/curriculum/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field, value })
        });
        
        if (!response.ok) {
            console.error('Failed to update curriculum:', await response.text());
        }
    }
</script>

<div class="container">
    <h1>Curriculum Management</h1>

    <div class="add-form">
        <h2>Add New Curriculum</h2>
        <form on:submit|preventDefault={addCurriculum}>
            <div class="form-group">
                <label for="title">Title:</label>
                <input 
                    id="title"
                    type="text" 
                    bind:value={newCurriculum.title} 
                    required
                />
            </div>

            <div class="form-group">
                <label for="subject">Subject:</label>
                <select 
                    id="subject"
                    bind:value={newCurriculum.subject} 
                    required
                >
                    <option value="">Select a subject</option>
                    {#each subjects as subject}
                        <option value={subject}>{subject}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="grade">Grade Level:</label>
                <select 
                    id="grade"
                    bind:value={newCurriculum.grade_level} 
                    required
                >
                    {#each grades as grade}
                        <option value={grade}>{grade}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="description">Description:</label>
                <textarea
                    id="description"
                    bind:value={newCurriculum.description}
                    rows="3"
                />
            </div>

            <button type="submit">Add Curriculum</button>
        </form>
    </div>

    <div class="curriculum-list">
        <h2>Current Curricula</h2>
        {#each curricula as curriculum}
            <div class="curriculum-item">
                <h3>{curriculum.title}</h3>
                <p>Subject: {curriculum.subject}</p>
                <p>Grade Level: {curriculum.grade_level}</p>
                <p>Description: {curriculum.description}</p>
                <button on:click={() => updateCurriculum(curriculum.id, 'title', prompt('Enter new title'))}>Update Title</button>
                <button on:click={() => updateCurriculum(curriculum.id, 'subject', prompt('Enter new subject'))}>Update Subject</button>
                <button on:click={() => updateCurriculum(curriculum.id, 'grade_level', prompt('Enter new grade level'))}>Update Grade Level</button>
                <button on:click={() => updateCurriculum(curriculum.id, 'description', prompt('Enter new description'))}>Update Description</button>
                <button on:click={() => deleteCurriculum(curriculum.id)}>Delete Curriculum</button>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
    }

    input, select, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    section {
        margin-bottom: 2rem;
    }
</style> 