<script>
    // @ts-ignore
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();

    export let data = [];
    export let columns = [];
    let cells;

    onMount(() => {
        cells = document.querySelectorAll('td:not(.actions)');
    });


    let debug = false;
    
    let activeCell = { row: 1, col: 1 };
    let editingCell = null;
    let editValue = '';

    function handleKeyDown(event, rowIndex, colIndex) {
        if (editingCell) {
            if (event.key === 'Escape') {
                event.preventDefault();
                cancelEdit();
            }
            if (event.key === 'Enter') {
                event.preventDefault();
                saveEdit();
            } 
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            startEdit(rowIndex, colIndex);
            return;
        }

        if (event.key === 'F2') {
            event.preventDefault();
            startEdit(rowIndex, colIndex);
            return;
        }

        if (event.key.startsWith('Arrow') && !editingCell) {
            event.preventDefault();
            let newRow = rowIndex;
            let newCol = colIndex;
            
            // if (editingCell) return;

            switch(event.key) {
                case 'ArrowUp':
                    newRow = rowIndex > 1 ? rowIndex - 1 : 1;
                    newCol = colIndex;
                    break;
                case 'ArrowDown':
                    newRow = rowIndex < data.length ? rowIndex + 1 : data.length;
                    newCol = colIndex;
                    break;
                case 'ArrowLeft':
                    newCol = colIndex > 1 ? colIndex - 1 : 1;
                    newRow = rowIndex;  
                    break;  
                case 'ArrowRight':
                    newCol = colIndex < columns.length ? colIndex + 1 : columns.length;
                    newRow = rowIndex;  
                    break; 
            }
            
            activateCell(newRow, newCol, cells);
            return;
        } 
        
        if (event.key.length === 1 && !editingCell) {
            event.preventDefault();
        }
    }

    function setTargetCell(rowIndex, colIndex, cells) {
        const targetCell = cells[(rowIndex - 1) * columns.length  + (colIndex - 1)];
        targetCell?.focus();
    }

    function activateCell(rowIndex, colIndex, cells) {
        activeCell = { row: rowIndex, col: colIndex };
        cells = document.querySelectorAll('td:not(.actions)');
        setTargetCell(rowIndex, colIndex, cells);
    }

    function startEdit(rowIndex, colIndex) {
        const column = columns[colIndex - 1];
        editingCell = { row: rowIndex, col: colIndex };
        editValue = data[rowIndex - 1][column.key];
        setTimeout(() => {
            const input = document.querySelector('td input');
            input?.select();
        }, 0);
    }

    function saveEdit() {
        if (!editingCell) return false;

        const column = columns[editingCell.col - 1];
        
        const oldValue = data[editingCell.row - 1][column.key];
        const newValue = editValue;
        const wasChanged = oldValue !== newValue;

        console.log('Data.svelte saveEdit:', {
            oldValue,
            newValue,
            wasChanged,
            rowIndex: editingCell.row,
            columnKey: column.key
        });

        if (wasChanged) {
            data[editingCell.row - 1][column.key] = newValue;
            dispatch('cellChange', {
                rowIndex: editingCell.row,
                columnKey: column.key,
                oldValue,
                newValue
            });
        }

        editingCell = null;
        editValue = '';
        return wasChanged;
    }

    function cancelEdit() {
        editingCell = null;
        editValue = '';
    }
</script>

<div class="table-container">
    {#if debug}
        <div class="editing-status">
            <p>Data length: {data.length}</p>
            <p>Data width: {columns.length}</p>
            {#if editingCell}
                <div class="status-item">
                <span class="label">Editing:</span>
                <span class="value">Row {editingCell.row}, Column {editingCell.col}</span>
            </div>
            <div class="status-item">
                <span class="label">Original Value:</span> 
                <span class="value">{data[editingCell.row][columns[editingCell.col].key]}</span>
            </div>
            <div class="status-item">
                <span class="label">New Value:</span>
                <span class="value">{editValue}</span>
            </div>
        {:else}
            <div class="status-item">
                <span class="label">Active Cell:</span>
                <span class="value">Row {activeCell.row}, Column {activeCell.col}</span>
            </div>
        {/if}
        <div class="controls-hint">
            <span>Controls: Enter to edit • Arrow keys to navigate • Esc to cancel • Tab to move right</span>
            </div>
        </div>
    {/if}

    <table>
        <thead>
            <tr>
                {#if debug}
                    <th>#</th>
                {/if}
                {#each columns as column}
                    <th>{column.label}</th>
                {/each}
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each data as row, i}
                <tr>
                    {#if debug}
                        <td>{i + 1}</td>
                    {/if}
                    {#each columns as column, j}
                        <td 
                            class:active={activeCell.row === i + 1 && activeCell.col === j + 1}
                            on:click={() => {
                                if (activeCell.row === i + 1 && activeCell.col === j + 1) startEdit(i + 1, j + 1);
                                activeCell = { row: i + 1, col: j + 1 };
                                const cells = document.querySelectorAll('td:not(.actions)');
                                const targetCell = cells[i * columns.length + j];
                                targetCell?.focus();
                            }}
                            on:dblclick={() => startEdit(i + 1, j + 1)}
                            on:keydown={(e) => handleKeyDown(e, i + 1, j + 1)}
                            tabindex="0"
                        >
                            {#if editingCell && editingCell.row === i + 1 && editingCell.col === j + 1}
                                <input
                                    type="text"
                                    bind:value={editValue}
                                    on:blur={() => {
                                        const wasChanged = saveEdit();
                                        const currentRow = activeCell.row;
                                        const currentCol = activeCell.col;
                                        activeCell = { row: currentRow, col: currentCol };
                                        const cells = document.querySelectorAll('td:not(.actions)');
                                        const targetCell = cells[(currentRow - 1) * columns.length + (currentCol - 1)];
                                        targetCell?.focus();
                                    }}
                                    on:keydown={(e) => handleKeyDown(e, i + 1, j + 1)}
                                />
                            {:else}
                                {row[column.key]}
                            {/if}
                        </td>
                    {/each}
                    <td class="actions">
                        <button 
                            class="delete-btn" 
                            on:click={() => dispatch('deleteRow', { rowIndex: i, id: row.id })}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-container {
        overflow-x: auto;
        margin: 1rem 0;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    td {
        position: relative;
    }

    td.active {
        outline: 2px solid #b700ff;
        background-color: #e6f3ff;
        transition: outline-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    }

    td:focus {
        outline: 2px solid #007bff;
        background-color: #e6f3ff;
    }

    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0.75rem;
        border: none;
        background: white;
        box-sizing: border-box;
    }

    tr:hover {
        background-color: #f9f9f9;
    }
    .editing-status {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        .status-item {
            display: inline-block;
            margin-right: 1.5rem;
        }

        .label {
            font-weight: bold;
            color: #495057;
        }

        .value {
            color: #0d6efd;
            margin-left: 0.5rem;
        }

        .controls-hint {
            margin-top: 0.5rem;
            color: #6c757d;
            font-size: 0.8rem;
            font-style: italic;
        }

    .actions {
        text-align: center;
    }

    .delete-btn {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .delete-btn:hover {
        background-color: #c82333;
    }
</style>

