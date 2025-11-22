import pb from './pocketbase';

/**
 * Generates a random 6-digit numeric access code
 * Format: 000000 - 999999
 */
export function generateAccessCode(): string {
    const code = Math.floor(Math.random() * 1000000);
    return code.toString().padStart(6, '0');
}

/**
 * Generates a random 8-character alphanumeric invite code
 * Uses only lowercase letters and numbers for URL-friendliness
 * Excludes visually similar characters (0/O, 1/l/I)
 */
export function generateInviteCode(): string {
    const chars = '23456789abcdefghjkmnpqrstuvwxyz'; // Excludes 0, 1, o, i, l
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Extracts the first name from a full name
 * Examples:
 * - "João Silva" -> "João"
 * - "Maria" -> "Maria"
 * - "José da Silva" -> "José"
 */
export function extractFirstName(fullName: string): string {
    if (!fullName || fullName.trim() === '') {
        return 'Convidado';
    }

    const trimmed = fullName.trim();
    const firstSpace = trimmed.indexOf(' ');

    if (firstSpace === -1) {
        return trimmed; // Single name
    }

    return trimmed.substring(0, firstSpace);
}

/**
 * Checks if a code is unique in the specified collection field
 * @param collection - Collection name ('guests')
 * @param field - Field name ('access_code' or 'invite_code')
 * @param code - Code to check
 * @returns true if code is unique, false if already exists
 */
export async function isCodeUnique(
    collection: 'guests',
    field: 'access_code' | 'invite_code',
    code: string
): Promise<boolean> {
    try {
        const records = await pb.collection(collection).getList(1, 1, {
            filter: `${field} = "${code}"`
        });
        return records.items.length === 0;
    } catch (error) {
        console.error(`Error checking code uniqueness:`, error);
        // If there's an error, assume code might not be unique to be safe
        return false;
    }
}

/**
 * Generates a unique access code for a guest
 * Retries up to 10 times to find a unique code
 */
export async function generateUniqueAccessCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const code = generateAccessCode();
        const unique = await isCodeUnique('guests', 'access_code', code);

        if (unique) {
            return code;
        }

        attempts++;
    }

    throw new Error('Failed to generate unique access code after 10 attempts');
}

/**
 * Generates a unique invite code for a guest
 * Retries up to 10 times to find a unique code
 */
export async function generateUniqueInviteCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const code = generateInviteCode();
        const unique = await isCodeUnique('guests', 'invite_code', code);

        if (unique) {
            return code;
        }

        attempts++;
    }

    throw new Error('Failed to generate unique invite code after 10 attempts');
}
