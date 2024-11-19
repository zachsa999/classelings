<script>
    import { onMount } from 'svelte';

    let classes = [];
    let newClass = {
        name: '',
        description: ''
    };
    
    let students = [];
    let newStudent = {
        name: '',
        gradeLevel: 1,
        classId: null
    };

    // Available grade levels
    const gradeLevels = Array.from({ length: 12 }, (_, i) => i + 1);

    onMount(async () => {
        console.log('Component mounted');
        await loadClasses();
        await loadStudents();
    });

    async function loadClasses() {
        try {
            console.log('Loading classes...');
            const response = await fetch('/api/classes');
            console.log('Response status:', response.status);
            
            if (response.ok) {
                classes = await response.json();
                console.log('Loaded classes:', classes);
            } else {
                const errorText = await response.text();
                console.error('Failed to load classes:', response.status, errorText);
                
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            }
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    }

    async function loadStudents() {
        const response = await fetch('/api/students');
        if (response.ok) {
            students = await response.json();
            console.log('Loaded students:', students);
        } else {
            console.error('Failed to load students:', await response.text());
        }
    }

    async function addClass() {
        const response = await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClass)
        });
        
        if (response.ok) {
            await loadClasses();
            newClass = { name: '', description: '' };
        } else {
            console.error('Failed to add class:', await response.text());
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
            newStudent = { name: '', gradeLevel: 1, classId: null };
        } else {
            console.error('Failed to add student:', await response.text());
        }
    }
</script>

<div class="container">
    <h2>Class Management</h2>

    <section class="add-class">
        <h3>Add New Class</h3>
        <form on:submit|preventDefault={addClass}>
            <div class="form-group">
                <label for="className">Class Name:</label>
                <input 
                    id="className"
                    type="text" 
                    bind:value={newClass.name}
                    placeholder="e.g., Class 7A"
                    required
                />
            </div>

            <div class="form-group">
                <label for="classDescription">Description:</label>
                <textarea
                    id="classDescription"
                    bind:value={newClass.description}
                    placeholder="Class description"
                    rows="3"
                />
            </div>

            <button type="submit">Add Class</button>
        </form>
    </section>

    <section class="class-list">
        <h3>Current Classes</h3>
        {#if classes.length === 0}
            <p>No classes found. Create your first class above.</p>
        {:else}
            {#each classes as cls}
                <div class="class-card">
                    <h4>{cls.name}</h4>
                    {#if cls.description}
                        <p class="description">{cls.description}</p>
                    {/if}
                    <div class="stats">
                        <span>Students: {cls.student_count || 0}</span>
                        <span>Grade Levels: {cls.grade_levels?.join(', ') || 'None'}</span>
                    </div>
                    
                    <div class="students-list">
                        <h5>Enrolled Students</h5>
                        {#if students.filter(s => s.class_id === cls.id).length === 0}
                            <p>No students enrolled</p>
                        {:else}
                            <ul>
                                {#each students.filter(s => s.class_id === cls.id) as student}
                                    <li>{student.name} (Grade {student.grade_level})</li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </section>

    <section class="add-student">
        <h3>Add New Student</h3>
        <form on:submit|preventDefault={addStudent}>
            <div class="form-group">
                <label for="studentName">Student Name:</label>
                <input 
                    id="studentName"
                    type="text" 
                    bind:value={newStudent.name}
                    required
                />
            </div>

            <div class="form-group">
                <label for="gradeLevel">Grade Level:</label>
                <select id="gradeLevel" bind:value={newStudent.gradeLevel}>
                    {#each gradeLevels as grade}
                        <option value={grade}>Grade {grade}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="classSelect">Assign to Class:</label>
                <select id="classSelect" bind:value={newStudent.classId}>
                    <option value={null}>Select a class...</option>
                    {#each classes as cls}
                        <option value={cls.id}>{cls.name}</option>
                    {/each}
                </select>
            </div>

            <button type="submit">Add Student</button>
        </form>
    </section>
</div>
<!-- 
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

    .class-card {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: #f9f9f9;
    }

    .class-card h4 {
        margin: 0 0 0.5rem 0;
    }

    .description {
        color: #666;
        margin-bottom: 1rem;
    }

    .stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .students-list ul {
        list-style: none;
        padding: 0;
    }

    .students-list li {
        padding: 0.25rem 0;
    }

    section {
        margin-bottom: 2rem;
    }
</style> -->
