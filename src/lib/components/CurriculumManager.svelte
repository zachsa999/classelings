<script>

        
    let newCurriculum = {
        title: '',
        subject: '',
        grade_level: 1,
        description: ''
    };
    
    const subjects = ['Math', 'Science', 'English', 'History'];
    const grades = Array.from({ length: 12 }, (_, i) => i + 1);

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
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <textarea
                id="description"
                bind:value={newCurriculum.description}
                rows="3"
            />
        </div>

        <button type="submit">Add Curriculum</button>
    </form>
</div>