export const tableSchemas = {
    users: `
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,
    sessions: `
        CREATE TABLE sessions (
            session_token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `,
    curricula: `
        CREATE TABLE curricula (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            variant TEXT NOT NULL,
            description TEXT,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `,
    students: ` 
        CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            grade_level INTEGER NOT NULL CHECK(grade_level BETWEEN 1 AND 12),
            parent_name TEXT,
            birth_date DATE,
            gender TEXT CHECK(gender IN ('male', 'female')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL REFERENCES users (id)
        )
    `,
    grades: `
        CREATE TABLE grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            curriculum_id INTEGER NOT NULL,
            score INTEGER CHECK(score >= 0 AND score <= 100),
            comment TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (curriculum_id) REFERENCES curricula (id)
        )
    `,
    student_curriculum: `
        CREATE TABLE student_curriculum (
            student_id INTEGER NOT NULL,
            curriculum_id INTEGER NOT NULL,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE,
            PRIMARY KEY (student_id, curriculum_id)
        )
    `,
    conduct_criteria: `
        CREATE TABLE conduct_criteria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'general'
        )
    `,
    conduct_grades: `
        CREATE TABLE conduct_grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            criteria_id INTEGER NOT NULL,
            score INTEGER CHECK(score >= 1 AND score <= 4), -- 1=Poor, 2=Fair, 3=Good, 4=Excellent
            comment TEXT,
            grading_period TEXT NOT NULL,  -- e.g., '2024-Q1', '2024-Q2'
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (criteria_id) REFERENCES conduct_criteria(id) ON DELETE CASCADE
        )
    `
}; 