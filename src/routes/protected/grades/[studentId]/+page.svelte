<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let student = null;
    let curricula = [];
    let grades = [];
    let newGrade = {
        curriculum_id: '',
        score: '',
        comment: ''
    };

    onMount(async () => {
        await Promise.all([
            loadStudent(),
            loadCurricula(),
            loadGrades()
        ]);
    });

    async function loadStudent() {
        const response = await fetch(`/api/students/${$page.params.studentId}`);
        if (response.ok) {
            student = await response.json();
        } else {
            console.error('Failed to load student:', await response.text());
        }
    }

    async function loadCurricula() {
        const response = await fetch('/api/curriculum');
        if (response.ok) {
            curricula = await response.json();
            // Filter curricula to match student's grade level
            curricula = curricula.filter(c => c.grade_level === student?.grade_level);
        } else {
            console.error('Failed to load curricula:', await response.text());
        }
    }

    async function loadGrades() {
        const response = await fetch(`/api/grades?student_id=${$page.params.studentId}`);
        if (response.ok) {
            grades = await response.json();
        } else {
            console.error('Failed to load grades:', await response.text());
        }
    }

    async function addGrade() {
        const response = await fetch('/api/grades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newGrade,
                student_id: $page.params.studentId
            })
        });
        
        if (response.ok) {
            await loadGrades();
            newGrade = {
                curriculum_id: '',
                score: '',
                comment: ''
            };
        } else {
            console.error('Failed to add grade:', await response.text());
        }
    }

    async function updateGrade(id, field, value) {
        const response = await fetch(`/api/grades/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field, value })
        });
        
        if (!response.ok) {
            console.error('Failed to update grade:', await response.text());
        }
    }

    function getGradeColor(score) {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    }
</script>

<div class="container">
    {#if student}
        <h1>Grades for {student.name} (Grade {student.grade_level})</h1>
    {:else}
        <h1>Loading student information...</h1>
    {/if}

    <div class="add-form">
        <h2>Add New Grade</h2>
        <form on:submit|preventDefault={addGrade}>
            <div class="form-group">
                <label for="curriculum">Curriculum:</label>
                <select 
                    id="curriculum"
                    bind:value={newGrade.curriculum_id} 
                    required
                >
                    <option value="">Select curriculum</option>
                    {#each curricula as curriculum}
                        {#if !grades.find(g => g.curriculum_id === curriculum.id)}
                            <option value={curriculum.id}>
                                {curriculum.title}
                            </option>
                        {/if}
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="score">Score (0-100):</label>
                <input 
                    id="score"
                    type="number" 
                    bind:value={newGrade.score}
                    min="0"
                    max="100"
                    required
                />
            </div>

            <div class="form-group">
                <label for="comment">Comment:</label>
                <textarea 
                    id="comment"
                    bind:value={newGrade.comment}
                    rows="3"
                ></textarea>
            </div>

            <button type="submit">Add Grade</button>
        </form>
    </div>

    <div class="grades-list">
        <h2>Current Grades</h2>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Curriculum</th>
                    <th>Score</th>
                    <th>Comment</th>
                    <th>Submitted</th>
                </tr>
            </thead>
            <tbody>
                {#each grades as grade}
                    {@const curriculum = curricula.find(c => c.id === grade.curriculum_id)}
                    <tr>
                        <td>{curriculum?.subject}</td>
                        <td>{curriculum?.title}</td>
                        <td class={getGradeColor(grade.score)}>
                            <input 
                                type="number"
                                value={grade.score}
                                min="0"
                                max="100"
                                on:change={(e) => updateGrade(grade.id, 'score', parseInt(e.target.value))}
                            />
                        </td>
                        <td>
                            <textarea 
                                value={grade.comment}
                                on:change={(e) => updateGrade(grade.id, 'comment', e.target.value)}
                            ></textarea>
                        </td>
                        <td>
                            {new Date(grade.submitted_at).toLocaleDateString()}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .container {
        padding: 1rem;
    }

    .add-form {
        max-width: 600px;
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
    }

    input, select, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
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

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }

    th, td {
        padding: 0.5rem;
        border: 1px solid #ccc;
        text-align: left;
    }

    th {
        background-color: #f5f5f5;
    }

    .text-green-600 { color: #059669; }
    .text-blue-600 { color: #2563eb; }
    .text-yellow-600 { color: #d97706; }
    .text-red-600 { color: #dc2626; }
</style> 