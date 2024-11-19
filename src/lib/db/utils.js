export class DatabaseError extends Error {
    constructor(message, operation, originalError) {
        super(message);
        this.name = 'DatabaseError';
        this.operation = operation;
        this.originalError = originalError;
    }
}

export async function executeTransaction(db, operations) {
    try {
        await db.run('BEGIN TRANSACTION');
        const result = await operations();
        await db.run('COMMIT');
        return result;
    } catch (error) {
        await db.run('ROLLBACK');
        throw new DatabaseError(
            'Transaction failed',
            'executeTransaction',
            error
        );
    }
}

export function handleDatabaseError(error, operation) {
    console.error(`Database error in ${operation}:`, error);
    throw new DatabaseError(
        `Database operation failed: ${operation}`,
        operation,
        error
    );
} 