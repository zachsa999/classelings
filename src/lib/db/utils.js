export function createDatabaseError(message, operation, originalError) {
    const error = new Error(message);
    error.name = 'DatabaseError';
    error.operation = operation;
    error.originalError = originalError;
    return error;
}

export async function executeTransaction(db, operations) {
    try {
        await db.run('BEGIN TRANSACTION');
        const result = await operations();
        await db.run('COMMIT');
        return result;
    } catch (error) {
        await db.run('ROLLBACK');
        throw createDatabaseError(
            'Transaction failed',
            'executeTransaction',
            error
        );
    }
}

export function handleDatabaseError(error, operation) {
    console.error(`Database error in ${operation}:`, error);
    throw createDatabaseError(
        `Database operation failed: ${operation}`,
        operation,
        error
    );
}

export function logDatabaseChange(operation, details) {
    const timestamp = new Date().toISOString();
    console.log(`[DB Change ${timestamp}]`, {
        operation,
        ...details
    });
} 