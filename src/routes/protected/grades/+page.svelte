<script>
	import Data from '$lib/components/Data.svelte';
	import { getGrades } from '$lib/db/grades.js';
	import { getDb } from '$lib/db/index.js';

	let data, columns;

    export async function load() {
        const db = await getDb();
        data = await getGrades(db);
        columns = ['id', 'name', 'description'];
    }
</script>

<h1>Grades</h1>
<Data {data} {columns} />