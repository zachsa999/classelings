import { faker } from '@faker-js/faker';
import { getDb } from './index.js';
import { createUser } from './auth.js';
import { createCurriculum } from './curriculum.js';
import { createStudent } from './students.js';
import { createGrade } from './grades.js';
import bcrypt from 'bcrypt';

async function generateAndInsertData() {
    const db = await getDb();

    try {
        await db.run('BEGIN TRANSACTION');

        console.log('Creating teacher user...');
        let password = bcrypt.hashSync('900zdw900', 10);
        const teacherId = await createUser(db, {
            name: 'Zachary Wiebe',
            email: 'bot@zachw.ca',
            password_hash: password
        });
        console.log('Created teacher with ID:', teacherId);

        // Create curricula
        console.log('Creating curricula...');
        const subjects = ['Math', 'Science', 'English', 'History'];
        for (const subject of subjects) {
            for (let grade = 1; grade <= 12; grade++) {
                const curriculumId = await createCurriculum(db, {
                    title: `${subject} Grade ${grade}`,
                    subject,
                    grade_level: grade,
                    description: `Core ${subject} curriculum for grade ${grade}`,
                    teacher_id: teacherId
                });
                console.log(`Created curriculum: ${subject} Grade ${grade} with ID: ${curriculumId}`);
            }
        }

        // Create students
        const studentCount = 50;
        const studentIds = [];
        for (let i = 0; i < studentCount; i++) {
            const id = await createStudent(db, {
                name: faker.person.fullName(),
                grade_level: Math.floor(Math.random() * 12) + 1,
                parent_name: faker.person.fullName(),
                gender: faker.helpers.arrayElement(['male', 'female', 'other'])
            });
            studentIds.push(id);
        }

        // Generate grades
        const curricula = await db.all('SELECT id, grade_level FROM curricula');
        
        for (const studentId of studentIds) {
            const student = await db.get('SELECT grade_level FROM students WHERE id = ?', [studentId]);
            const relevantCurricula = curricula.filter(c => c.grade_level === student.grade_level);
            
            for (const curriculum of relevantCurricula) {
                if (Math.random() > 0.3) {
                    await createGrade(db, {
                        student_id: studentId,
                        curriculum_id: curriculum.id,
                        score: Math.floor(Math.random() * 41) + 60,
                        comment: faker.helpers.arrayElement([
                            'Good work!',
                            'Needs improvement',
                            'Excellent effort',
                            'Keep practicing',
                            null
                        ])
                    });
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

if (process.argv[1] === new URL(import.meta.url).pathname) {
    generateAndInsertData().catch(console.error);
} 