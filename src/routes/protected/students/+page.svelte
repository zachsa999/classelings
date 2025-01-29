<script>
    import { onMount } from 'svelte';
    
    let students = [];
    let newStudent = {
        name: '',
        grade_level: 0,
        parent_name: '',
        gender: '',
        birth_date: ''
    };
    
    const grades = Array.from({ length: 12 }, (_, i) => i + 1);
    const genders = ['male', 'female', 'other'];

    let newCurriculumId = '';
    let availableCurricula = [];

    onMount(async () => {
        await Promise.all([
            loadStudents(),
            loadAvailableCurricula()
        ]);
    });

    async function loadStudents() {
        const response = await fetch('/api/students');
        if (response.ok) {
            students = await response.json();
            students.sort((a, b) => a.grade_level - b.grade_level || a.name.localeCompare(b.name));
        } else {
            console.error('Failed to load students:', await response.text());
        }
    }

    async function loadAvailableCurricula() {
        const response = await fetch('/api/curriculum');
        if (response.ok) {
            availableCurricula = await response.json();
        }
    }

    async function addStudent() {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newStudent,
            })
        });
        
        if (response.ok) {
            await loadStudents();
            newStudent = {
                name: '',
                grade_level: 1,
                parent_name: '',
                gender: '',
                birth_date: ''
            };
        } else {
            console.error('Failed to add student:', await response.text());
        }
    }

    async function updateStudent(id, field, value) {
        const response = await fetch(`/api/students/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field, value })
        });
        
        if (!response.ok) {
            console.error('Failed to update student:', await response.text());
        }
    }

    async function deleteStudent(id) {
        if (!confirm('Are you sure you want to delete this student?')) {
            return;
        }

        const response = await fetch(`/api/students/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            students = students.filter(s => s.id !== id);
        } else {
            console.error('Failed to delete student:', await response.text());
        }
    }

    async function linkCurriculum(studentId, curriculumId) {
        if (!curriculumId) return;
        
        const response = await fetch(`/api/students/${studentId}/curriculum/${curriculumId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            await loadStudents();
            newCurriculumId = '';
        }
    }

    async function unlinkCurriculum(studentId, curriculumId) {
        const response = await fetch(`/api/students/${studentId}/curriculum/${curriculumId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadStudents();
        }
    }
</script>

<div class="container">
    <h1>Student Management</h1>

    <div class="add-form">
        <h2>Add New Student</h2>
        <form on:submit|preventDefault={addStudent}>
            <div class="form-group">
                <label for="name">Student Name:</label>
                <input 
                    id="name"
                    type="text" 
                    bind:value={newStudent.name} 
                    required
                />
            </div>

            <div class="form-group">
                <label for="grade">Grade Level:</label>
                <select 
                    id="grade"
                    bind:value={newStudent.grade_level} 
                    required
                >
                    {#each grades as grade}
                        <option value={grade}>{grade}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="parent">Parent/Guardian Name:</label>
                <input 
                    id="parent"
                    type="text" 
                    bind:value={newStudent.parent_name}
                />
            </div>

            <div class="form-group">
                <label for="gender">Gender:</label>
                <select 
                    id="gender"
                    bind:value={newStudent.gender} 
                    required
                >
                    <option value="">Select gender</option>
                    {#each genders as gender}
                        <option value={gender}>{gender}</option>
                    {/each}
                </select>
            </div>
            <div class="form-group">
                <label for="birth_date">Birth Date:</label>
                <input 
                    id="birth_date"
                    type="date" 
                    bind:value={newStudent.birth_date}
                />
            </div>

            <button type="submit" on:click|preventDefault={addStudent}>Add Student</button>
        </form>
    </div>

    <div class="students-list">
        <h2>Current Students</h2>
        {#each students as student}
            <div class="student-card">
                <div class="student-info">
                    <div class="info-grid">
                        <div class="info-group">
                            <label>Name:</label>
                            <input 
                                type="text" 
                                value={student.name}
                                on:change={(e) => updateStudent(student.id, 'name', e.target.value)}
                            />
                        </div>
                        <div class="info-group">
                            <label>Grade:</label>
                            <select 
                                value={student.grade_level}
                                on:change={(e) => updateStudent(student.id, 'grade_level', parseInt(e.target.value))}
                            >
                                {#each grades as grade}
                                    <option value={grade}>{grade}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="info-group">
                            <label>Parent/Guardian:</label>
                            <input 
                                type="text" 
                                value={student.parent_name}
                            />
                        </div>
                        <div class="info-group">
                            <label>Gender:</label>
                            <input 
                                type="text" 
                                value={student.gender}
                            />      
                        </div>
                        <div class="info-group">
                            <label>Birth Date:</label>
                            <input 
                                type="date" 
                                value={student.birth_date}
                            />
                        </div>
                        
                        <!-- Add other student fields similarly -->
                    </div>
                    
                    <div class="curriculum-section">
                        <h3>Assigned Curricula</h3>
                        {#if student.curricula?.length}
                            <ul class="curriculum-list">
                                {#each student.curricula as curriculum}
                                    <li class="curriculum-item">
                                        <span>{curriculum.title} ({curriculum.subject})</span>
                                        <button 
                                            class="remove-btn"
                                            on:click={() => unlinkCurriculum(student.id, curriculum.id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <p class="no-curriculum">No curriculum assigned</p>
                        {/if}
                        
                        <div class="add-curriculum">
                            <select bind:value={newCurriculumId}>
                                <option value="">Select curriculum...</option>
                                {#each availableCurricula as curriculum}
                                    <option value={curriculum.id}>{curriculum.title}</option>
                                {/each}
                            </select>
                            <button 
                                on:click={() => linkCurriculum(student.id, newCurriculumId)}
                                disabled={!newCurriculumId}
                            >
                                Add Curriculum
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
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

    input, select {
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

    a {
        color: #2196F3;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .delete-btn {
        background-color: #dc3545;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .delete-btn:hover {
        background-color: #c82333;
    }

    .student-card {
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 1rem;
        padding: 1rem;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .curriculum-section {
        border-top: 1px solid #ddd;
        margin-top: 1rem;
        padding-top: 1rem;
    }

    .curriculum-list {
        list-style: none;
        padding: 0;
    }

    .curriculum-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: #f5f5f5;
        margin-bottom: 0.5rem;
        border-radius: 4px;
    }

    .remove-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }
</style>