<script>
    import { onMount } from 'svelte';
    
    let students = [];
    let newStudent = {
        name: '',
        grade_level: 1,
        parent_name: '',
        gender: ''
    };
    
    const grades = Array.from({ length: 12 }, (_, i) => i + 1);
    const genders = ['male', 'female', 'other'];

    onMount(loadStudents);

    async function loadStudents() {
        const response = await fetch('/api/students');
        if (response.ok) {
            students = await response.json();
            students.sort((a, b) => a.grade_level - b.grade_level || a.name.localeCompare(b.name));
        } else {
            console.error('Failed to load students:', await response.text());
        }
    }

    async function addStudent() {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
        
        if (response.ok) {
            await loadStudents();
            newStudent = {
                name: '',
                grade_level: 1,
                parent_name: '',
                gender: ''
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

            <button type="submit">Add Student</button>
        </form>
    </div>

    <div class="students-list">
        <h2>Current Students</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Parent/Guardian</th>
                    <th>Gender</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each students as student}
                    <tr>
                        <td>
                            <input 
                                type="text" 
                                value={student.name}
                                on:change={(e) => updateStudent(student.id, 'name', e.target.value)}
                            />
                        </td>
                        <td>
                            <select 
                                value={student.grade_level}
                                on:change={(e) => updateStudent(student.id, 'grade_level', parseInt(e.target.value))}
                            >
                                {#each grades as grade}
                                    <option value={grade}>{grade}</option>
                                {/each}
                            </select>
                        </td>
                        <td>
                            <input 
                                type="text" 
                                value={student.parent_name}
                                on:change={(e) => updateStudent(student.id, 'parent_name', e.target.value)}
                            />
                        </td>
                        <td>
                            <select 
                                value={student.gender}
                                on:change={(e) => updateStudent(student.id, 'gender', e.target.value)}
                            >
                                {#each genders as gender}
                                    <option value={gender}>{gender}</option>
                                {/each}
                            </select>
                        </td>
                        <td>
                            <a href="/protected/grades/{student.id}">View Grades</a>
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
</style>
