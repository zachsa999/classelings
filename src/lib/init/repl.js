import sqlite3 from 'sqlite3';
import repl from 'node:repl';

// Open a connection to the database
const db = new sqlite3.Database('grading_app.db', (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('SQLite REPL Shell for grading_app.db. Type SQL commands or ".exit" to quit.');
	}
});

// Start a REPL session
const replServer = repl.start({
	prompt: 'sqlite> ',
	eval: (input, context, filename, callback) => {
		const trimmedInput = input.trim();

		if (trimmedInput.toLowerCase() === '.exit') {
			db.close((err) => {
				if (err) console.error('Error closing database:', err.message);
				else console.log('Database closed.');
				replServer.close();
			});
		} else if (trimmedInput.toLowerCase().startsWith('select')) {
			db.all(trimmedInput, (err, rows) => {
				if (err) callback(err.message);
				else callback(null, rows);
			});
		} else if (trimmedInput) {
			db.run(trimmedInput, function (err) {
				if (err) callback(err.message);
				else callback(null, `Query OK. Rows affected: ${this.changes}`);
			});
		} else {
			callback(null);
		}
	}
});
