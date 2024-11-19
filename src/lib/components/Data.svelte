<script>
    // @ts-ignore
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let data = [];
    export let columns = [];
    
    let activeCell = { row: 0, col: 0 };
    let editingCell = null;
    let editValue = '';

    function handleKeyDown(event, rowIndex, colIndex) {
        if (editingCell) {
            if (event.key === 'Escape') {
                event.preventDefault();
                cancelEdit();
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

        if (event.key.startsWith('Arrow')) {
            event.preventDefault();
            let newRow = rowIndex;
            let newCol = colIndex;
            
            if (editingCell) {
                saveEdit();
            }

            switch(event.key) {
                case 'ArrowUp':
                    if (rowIndex > 0) {
                        newRow = rowIndex - (event.shiftKey ? 2 : 1);
                        if (newRow < 0) newRow = 0;
                    }
                    break;
                case 'ArrowDown':
                    if (rowIndex < data.length - 1) {
                        newRow = rowIndex + (event.shiftKey ? 2 : 1);
                        if (newRow >= data.length) newRow = data.length - 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (colIndex > 0) {
                        newCol = colIndex - (event.shiftKey ? 2 : 1);
                        if (newCol < 0) newCol = 0;
                    }
                    break;  
                case 'ArrowRight':
                    if (colIndex < columns.length - 1) {
                        newCol = colIndex + (event.shiftKey ? 2 : 1);
                        if (newCol >= columns.length) newCol = columns.length - 1;
                    }
                    break;
            }
            
            activeCell = { row: newRow, col: newCol };
            const cells = document.querySelectorAll('td');
            const targetCell = cells[newRow * columns.length + newCol];
            targetCell?.focus();
            return;
        }
        
        if (event.key.length === 1) {
            event.preventDefault();
        }
    }

    function startEdit(rowIndex, colIndex) {
        const column = columns[colIndex];
        editingCell = { row: rowIndex, col: colIndex };
        editValue = data[rowIndex][column.key];
        setTimeout(() => {
            const input = document.querySelector('td input');
            input?.select();
        }, 0);
    }

    function saveEdit() {
        if (!editingCell) return false;

        const column = columns[editingCell.col];
        
        const oldValue = data[editingCell.row][column.key];
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
            data[editingCell.row][column.key] = newValue;
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
    <div class="editing-status">
        {#if editingCell}
            <div class="status-item">
                <span class="label">Editing:</span>
                <span class="value">Row {editingCell.row + 1}, Column {editingCell.col + 1}</span>
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
                <span class="value">Row {activeCell.row + 1}, Column {activeCell.col + 1}</span>
            </div>
        {/if}
        <div class="controls-hint">
            <span>Controls: Enter to edit • Arrow keys to navigate • Esc to cancel • Tab to move right</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                {#each columns as column}
                    <th>{column.label}</th>
                {/each}
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each data as row, rowIndex}
                <tr>
                    {#each columns as column, colIndex}
                        <td 
                            class:active={activeCell.row === rowIndex && activeCell.col === colIndex}
                            on:click={() => {
                                activeCell = { row: rowIndex, col: colIndex };
                                const cells = document.querySelectorAll('td');
                                const targetCell = cells[rowIndex * columns.length + colIndex];
                                targetCell?.focus();
                            }}
                            on:dblclick={() => startEdit(rowIndex, colIndex)}
                            on:keydown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            tabindex="0"
                        >
                            {#if editingCell && editingCell.row === rowIndex && editingCell.col === colIndex}
                                <input
                                    type="text"
                                    bind:value={editValue}
                                    on:blur={() => {
                                        const wasChanged = saveEdit();
                                        const currentRow = activeCell.row;
                                        const currentCol = activeCell.col;
                                        activeCell = { row: currentRow, col: currentCol };
                                        const cells = document.querySelectorAll('td');
                                        const targetCell = cells[currentRow * columns.length + currentCol];
                                        targetCell?.focus();
                                    }}
                                    on:keydown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                />
                            {:else}
                                {row[column.key]}
                            {/if}
                        </td>
                    {/each}
                    <td class="actions">
                        <button 
                            class="delete-btn" 
                            on:click={() => dispatch('deleteRow', { rowIndex, id: row.id })}
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

    /* td.active {
        outline: 2px solid #007bff;
        background-color: #e6f3ff;
        transition: outline-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    } */

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

