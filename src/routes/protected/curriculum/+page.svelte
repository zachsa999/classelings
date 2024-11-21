<script>
    import Data from '$lib/components/Data.svelte';
    import { onMount } from 'svelte';
    let curricula = [];

    // Define columns for the Data component
    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'subject', label: 'Subject' },
        { key: 'grade_level', label: 'Grade Level' },
        { key: 'description', label: 'Description' }
    ];

    onMount(loadCurricula);

    async function loadCurricula() {
        const response = await fetch('/api/curriculum');
        if (response.ok) {
            curricula = await response.json();
        } else {
            console.error('Failed to load curricula:', await response.text());
        }
    }

    async function handleCellChange(event) {
        const { rowIndex, columnKey, newValue } = event.detail;
        const curriculumId = curricula[rowIndex].id;

        const response = await fetch(`/api/curriculum/${curriculumId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [columnKey]: newValue })
        });

        if (!response.ok) {
            console.error('Failed to update curriculum:', await response.text());
            // You might want to add error handling here
        }
    }

    async function handleDeleteRow(event) {
        const { id } = event.detail;
        
        const response = await fetch(`/api/curriculum/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            curricula = curricula.filter(c => c.id !== id);
        } else {
            console.error('Failed to delete curriculum:', await response.text());
        }
    }
</script>

<div class="container">
    <h2>Current Curricula</h2>
    <Data 
        data={curricula}
        {columns}
        on:cellChange={handleCellChange}
        on:deleteRow={handleDeleteRow}
    />
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }
</style>        