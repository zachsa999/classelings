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
            grade_level INTEGER NOT NULL CHECK(grade_level BETWEEN 1 AND 12),
            description TEXT,
            teacher_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (teacher_id) REFERENCES users (id)
        )
    `,
    students: `
        CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            grade_level INTEGER NOT NULL CHECK(grade_level BETWEEN 1 AND 12),
            parent_name TEXT,
            gender TEXT CHECK(gender IN ('male', 'female', 'other')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    `
}; 