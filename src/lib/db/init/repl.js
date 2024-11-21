import { getDb } from '../index.js';
import repl from 'node:repl';

async function startRepl() {
    const db = await getDb();
    console.log('SQLite REPL Shell for grading_app.db. Type SQL commands or ".exit" to quit.');

    const replServer = repl.start({
        prompt: 'sqlite> ',
        eval: async (input, context, filename, callback) => {
            const trimmedInput = input.trim();

            if (trimmedInput.toLowerCase() === '.exit') {
                await db.close();
                console.log('Database closed.');
                replServer.close();
                return;
            }

            try {
                if (trimmedInput.toLowerCase().startsWith('select')) {
                    const rows = await db.all(trimmedInput);
                    callback(null, rows);
                } else if (trimmedInput) {
                    const result = await db.run(trimmedInput);
                    callback(null, `Query OK. Rows affected: ${result.changes || 0}`);
                } else {
                    callback(null);
                }
            } catch (error) {
                callback(error);
            }
        }
    });

    replServer.on('exit', async () => {
        await db.close();
        console.log('Database closed.');
        process.exit();
    });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    startRepl().catch(console.error);
} 
