import { faker } from '@faker-js/faker';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

async function generateAndInsertData() {
	const db = await open({
		filename: 'grading_app.db',
		driver: sqlite3.Database
	});

	try {
		await db.run('BEGIN TRANSACTION');

		// Clear all existing data
		await db.run('DELETE FROM grades');
		await db.run('DELETE FROM students');
		await db.run('DELETE FROM curricula');
		await db.run('DELETE FROM sessions');
		await db.run('DELETE FROM users');

		// Create a teacher account
		const hashedPassword = await bcrypt.hash('900zdw900', 10);
		const teacherResult = await db.run(
			'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
			['Zachary Wiebe', 'bot@zachw.ca', hashedPassword]
		);
		const teacherId = teacherResult.lastID;

		// Create curricula
		const subjects = ['Math', 'Science', 'English', 'History'];
		for (const subject of subjects) {
			for (let grade = 1; grade <= 12; grade++) {
				await db.run(
					'INSERT INTO curricula (title, subject, grade_level, description, teacher_id) VALUES (?, ?, ?, ?, ?)',
					[
						`${subject} Grade ${grade}`,
						subject,
						grade,
						`Core ${subject} curriculum for grade ${grade}`,
						teacherId
					]
				);
			}
		}

		// Create students
		const studentCount = 50;
		for (let i = 0; i < studentCount; i++) {
			const gradeLevel = Math.floor(Math.random() * 12) + 1;
			await db.run(
				'INSERT INTO students (name, grade_level, parent_name, gender) VALUES (?, ?, ?, ?)',
				[
					faker.person.fullName(),
					gradeLevel,
					faker.person.fullName(),
					faker.helpers.arrayElement(['male', 'female', 'other'])
				]
			);
		}

		// Generate grades
		const students = await db.all('SELECT id, grade_level FROM students');
		const curricula = await db.all('SELECT id, grade_level FROM curricula');

		for (const student of students) {
			const relevantCurricula = curricula.filter(c => c.grade_level === student.grade_level);
			for (const curriculum of relevantCurricula) {
				if (Math.random() > 0.3) { // 70% chance of having a grade
					await db.run(
						'INSERT INTO grades (student_id, curriculum_id, score, comment) VALUES (?, ?, ?, ?)',
						[
							student.id,
							curriculum.id,
							Math.floor(Math.random() * 41) + 60, // Scores between 60-100
							faker.helpers.arrayElement([
								'Good work!',
								'Needs improvement',
								'Excellent effort',
								'Keep practicing',
								null
							])
						]
					);
				}
			}
		}

		await db.run('COMMIT');
		console.log('Sample data created successfully');

	} catch (error) {
		await db.run('ROLLBACK');
		console.error('Error:', error);
		throw error;
	} finally {
		await db.close();
	}
}

// Make sure to export and call the function
export { generateAndInsertData };
if (process.argv[1] === new URL(import.meta.url).pathname) {
	generateAndInsertData().catch(console.error);
}
