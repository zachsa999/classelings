// import { faker } from '@faker-js/faker';
import { getDb } from '../index.js';
import { createUser } from '../auth.js';
import { createCurriculum } from '../curriculum.js';
import { createStudent } from '../students.js';
// import { createGrade } from '../grades.js';
import bcrypt from 'bcrypt';

async function generateAndInsertData() {
    const db = await getDb();

    try {
        await db.run('BEGIN TRANSACTION');

        console.log('Creating user...');
        let password = bcrypt.hashSync('900zdw900', 10);
        const userId = await createUser(db, {
            name: 'Zachary Wiebe',
            email: 'bot@zachw.ca',
            password_hash: password
        });
        console.log('Created user with ID:', userId);

        // Create curricula
        console.log('Creating subjects...');
        const subjects = [{
            subject: 'Math',
            variants: ["6", "7", "8", "9"],
            name: "CLE Math"
        }, {
            subject: 'Science',
            variants: ["Machines and Motion", "Properties of Atoms and Molecules"],
            name: "MasterBooks"
        }, {
            subject: 'English',
            variants: ["6", "7", "8", "9"],
            name: "Rod and Staff English"
        }, {
            subject: 'History',
            variants: ["6", "7", "8", "9"],
            name: "The Story of Canada"
        }, {
            subject: "English",
            variants: ["Year B Book 1"],
            name: "IEW"
        }, {
            subject: "Penmanship",
            variants: ["U"],
            name: "Penmanship"
        }, {
            subject: "Reading",
            variants: ["6", "7", "8"],
            name: "WWWPPS"
        }, {
            subject: "Reading",
            variants: ["9"],
            name: "Abeka Reading"
        }, {
            subject: "Typing",
            variants: ["U"],
            name: "TypingClub"
        },{
            subject: "Conduct",
            variants: [
                "Accepts Responsibility",
                "Is Courteous", 
                "Demonstrates Self-control",
                "Is Obedient and Cooperative",
                "Interacts Well With Others",
                "Respects Authority",
                "Handles Property Responsibly", 
                "Practices Good Sportsmanship",
                "Follows Directions",
                "Uses Time To Good Advantage",
                "Works Independently",
                "Puts Forth Best Effort"
            ],
            name: "Conduct"
        }, {
            subject: "Attendance",
            variants: ["Present", "Absent", "Tardy"],
            name: "Attendance"
        }];
        for (const subject of subjects) {
            for (const variant of subject.variants) {
                const curriculumId = await createCurriculum(db, {
                    title: `${subject.name} ${variant}`,
                    subject: subject.subject,
                    variant,
                    description: `${subject.subject} curriculum for variant ${variant}`,
                    user_id: userId
                });
                console.log(`Created curriculum: ${subject} Grade ${variant} with ID: ${curriculumId}`);
            }
        }

        // Create students
        const students = [
            {
                name: "Austin Toews",
                grade_level: 9,
                parent_name: "Jody and Judith Toews",
                gender: "male",
                birth_date: "2010-01-28"
            },
            {
                name: "Liam Penner",
                grade_level: 9,
                parent_name: "Kenton and Nancy Penner",
                gender: "male",
                birth_date: "2010-02-21"
            },
            {
                name: "Kaitlyn Toews",
                grade_level: 9,
                parent_name: "Jason and Kari Toews",
                gender: "female",
                birth_date: "2010-06-25"
            },
            {
                name: "Christina Toews",
                grade_level: 8,
                parent_name: "Eric and Rachelle Toews",
                gender: "female",
                birth_date: "2011-01-14"
            },
            {
                name: "Josh Toews",
                grade_level: 7,
                parent_name: "Tyson and Maria Toews",
                gender: "male",
                birth_date: "2011-09-23"
            },
            {
                name: "James Toews",
                grade_level: 7,
                parent_name: "Jody and Judith Toews",
                gender: "male",
                birth_date: "2012-04-14"
            },
            {
                name: "Joel Koehn",
                grade_level: 6,
                parent_name: "Thad and Raquel Koehn",
                gender: "male",
                birth_date: "2012-12-27"
            },
            {
                name: "Ellie Toews",
                grade_level: 7,
                parent_name: "Eric and Rachelle Toews",
                gender: "female",
                birth_date: "2013-05-13"
            },
            {
                name: "Brianna Toews",
                grade_level: 6,
                parent_name: "Jason and Kari Toews",
                gender: "female",
                birth_date: "2013-07-05"
            }
        ];

        const studentIds = [];
        for (const student of students) {
            const id = await createStudent(db, {
                name: student.name,
                grade_level: student.grade_level,
                parent_name: student.parent_name,
                gender: student.gender,
                birth_date: student.birth_date,
                user_id: userId
            });
            studentIds.push(id);
            console.log(`Created student ${student.name} with ID: ${id}`);
        }

        // Manual curriculum assignments
        console.log('Creating curriculum assignments...');
        const assignments = [
            // Austin Toews (Grade 9)
            { student: "Austin Toews", curricula: ["CLE Math 9", "MasterBooks Machines and Motion", "IEW", "Typing", "Universal Penmanship"] },
            // Liam Penner (Grade 9)
            { student: "Liam Penner", curricula: ["CLE Math 9", "MasterBooks Properties of Atoms and Molecules", "Rod and Staff English 9"] },
            // Kaitlyn Toews (Grade 9)
            { student: "Kaitlyn Toews", curricula: ["CLE Math 9", "MasterBooks Properties of Atoms and Molecules", "Rod and Staff English 9"] },
            // Christina Toews (Grade 8)
            { student: "Christina Toews", curricula: ["CLE Math 8", "MasterBooks Machines and Motion", "Rod and Staff English 8"] },
            // Josh Toews (Grade 7)
            { student: "Josh Toews", curricula: ["CLE Math 7", "MasterBooks Properties of Atoms and Molecules", "Rod and Staff English 7"] },
            // James Toews (Grade 7)
            { student: "James Toews", curricula: ["CLE Math 7", "MasterBooks Machines and Motion", "Rod and Staff English 7"] },
            // Joel Koehn (Grade 6)
            { student: "Joel Koehn", curricula: ["CLE Math 6", "MasterBooks Properties of Atoms and Molecules", "Rod and Staff English 6"] },
            // Ellie Toews (Grade 7)
            { student: "Ellie Toews", curricula: ["CLE Math 7", "MasterBooks Machines and Motion", "Rod and Staff English 7"] },
            // Brianna Toews (Grade 6)
            { student: "Brianna Toews", curricula: ["CLE Math 6", "MasterBooks Properties of Atoms and Molecules", "Rod and Staff English 6"] }
        ];

        for (const assignment of assignments) {
            // Get student ID
            const student = await db.get('SELECT id FROM students WHERE name = ?', [assignment.student]);
            if (!student) {
                console.log(`Warning: Student ${assignment.student} not found`);
                continue;
            }

            // Get curriculum IDs and create assignments
            for (const curriculumTitle of assignment.curricula) {
                const curriculum = await db.get('SELECT id FROM curricula WHERE title = ?', [curriculumTitle]);
                if (!curriculum) {
                    console.log(`Warning: Curriculum ${curriculumTitle} not found`);
                    continue;
                }

                await db.run(
                    'INSERT INTO student_curriculum (student_id, curriculum_id) VALUES (?, ?)',
                    [student.id, curriculum.id]
                );
                console.log(`Assigned "${curriculumTitle}" to ${assignment.student}`);
            }
        }

        const conductCriteria = [
            {
                category: 'Personal Conduct',
                items: [
                    'Accepts Responsibility',
                    'Uses Time To Good Advantage',
                    'Works Independently',
                    'Puts Forth Best Effort'
                ]
            },
            {
                category: 'Social Conduct',
                items: [
                    'Is Courteous',
                    'Demonstrates Self-control',
                    'Is Obedient and Cooperative',
                    'Interacts Well With Others'
                ]
            },
            {
                category: 'Work and Study Habits',
                items: [
                    'Respects Authority',
                    'Handles Property Responsibly',
                    'Practices Good Sportsmanship',
                    'Follows Directions'
                ]
            }
        ];

        // Insert conduct criteria
        for (const category of conductCriteria) {
            for (const item of category.items) {
                await db.run(
                    'INSERT INTO conduct_criteria (name, category, description) VALUES (?, ?, ?)',
                    [item, category.category, `Evaluation of student's ability to ${item.toLowerCase()}`]
                );
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