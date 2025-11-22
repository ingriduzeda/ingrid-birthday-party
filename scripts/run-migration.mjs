import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

// Set the auth token in the store
pb.authStore.save('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA');

/**
 * Generates a random 6-digit numeric access code
 */
function generateAccessCode() {
    const code = Math.floor(Math.random() * 1000000);
    return code.toString().padStart(6, '0');
}

/**
 * Generates a random 8-character alphanumeric invite code
 */
function generateInviteCode() {
    const chars = '23456789abcdefghjkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Extracts the first name from a full name
 */
function extractFirstName(fullName) {
    if (!fullName || fullName.trim() === '') {
        return 'Convidado';
    }

    const trimmed = fullName.trim();
    const firstSpace = trimmed.indexOf(' ');

    if (firstSpace === -1) {
        return trimmed;
    }

    return trimmed.substring(0, firstSpace);
}

/**
 * Generates a unique code that doesn't exist in the set
 */
function generateUniqueCode(existingCodes, generator) {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        const code = generator();
        if (!existingCodes.has(code)) {
            existingCodes.add(code);
            return code;
        }
        attempts++;
    }

    throw new Error('Failed to generate unique code after 100 attempts');
}

async function main() {
    try {
        console.log('🔐 Using provided authentication token...');
        console.log(`✅ Authenticated as: ${pb.authStore.model?.id || 'Unknown'}\n`);

        // 1. Try to update the collection schema using direct API call
        console.log('📋 Updating guests collection schema...');

        try {
            // First, get the current collection
            const collection = await pb.send('/api/collections/guests', {
                method: 'GET'
            });

            console.log('   ℹ️  Current collection retrieved');

            // Check if fields already exist
            const existingFields = collection.schema || [];
            const existingFieldNames = existingFields.map(f => f.name);
            const fieldsToAdd = [];

            if (!existingFieldNames.includes('first_name')) {
                fieldsToAdd.push({ name: 'first_name', type: 'text', required: false });
            }
            if (!existingFieldNames.includes('access_code')) {
                fieldsToAdd.push({ name: 'access_code', type: 'text', required: false });
            }
            if (!existingFieldNames.includes('invite_code')) {
                fieldsToAdd.push({ name: 'invite_code', type: 'text', required: false });
            }
            if (!existingFieldNames.includes('link_opened_at')) {
                fieldsToAdd.push({ name: 'link_opened_at', type: 'date', required: false });
            }
            if (!existingFieldNames.includes('link_opened_count')) {
                fieldsToAdd.push({ name: 'link_opened_count', type: 'number', required: false });
            }

            if (fieldsToAdd.length > 0) {
                // Update schema by adding new fields
                await pb.send(`/api/collections/${collection.id}`, {
                    method: 'PATCH',
                    body: {
                        schema: [...existingFields, ...fieldsToAdd]
                    }
                });
                console.log(`   ✅ Added ${fieldsToAdd.length} new fields to schema\n`);
            } else {
                console.log('   ℹ️  All fields already exist in schema\n');
            }
        } catch (error) {
            console.error('   ⚠️  Schema update failed (may need admin rights):', error.message);
            console.log('   ℹ️  Continuing with guest updates (fields may already exist)...\n');
        }

        // 2. Fetch all existing guests
        console.log('👥 Fetching existing guests...');
        const guests = await pb.collection('guests').getFullList();
        console.log(`   Found ${guests.length} guests\n`);

        if (guests.length === 0) {
            console.log('   No guests to update. Migration complete.');
            return;
        }

        // 3. Generate unique codes for all guests
        console.log('🔢 Generating unique codes for guests...');

        const accessCodes = new Set();
        const inviteCodes = new Set();
        const updates = [];

        for (const guest of guests) {
            // Skip if guest already has codes (in case migration is run multiple times)
            if (guest.access_code && guest.invite_code && guest.first_name) {
                console.log(`   ⏭️  Skipping ${guest.name} (already has codes)`);
                continue;
            }

            const firstName = extractFirstName(guest.name);
            const accessCode = generateUniqueCode(accessCodes, generateAccessCode);
            const inviteCode = generateUniqueCode(inviteCodes, generateInviteCode);

            updates.push({
                guest,
                firstName,
                accessCode,
                inviteCode
            });

            console.log(`   ✓ ${guest.name}`);
            console.log(`     First Name: ${firstName}`);
            console.log(`     Access Code: ${accessCode}`);
            console.log(`     Invite Code: ${inviteCode}`);
        }

        console.log(`\n📝 Generated codes for ${updates.length} guests\n`);

        // 4. Update all guest records
        if (updates.length === 0) {
            console.log('✅ All guests already have codes!\n');
            console.log('📊 Summary:');
            console.log(`   Total guests: ${guests.length}`);
            console.log(`   All guests are ready with invite codes.\n`);
            console.log('🎉 You can now use the admin dashboard!');
            console.log('   Visit: http://localhost:3000/admin/guests');
            return;
        }

        console.log('💾 Updating guest records...');

        let successCount = 0;
        let errorCount = 0;

        for (const update of updates) {
            try {
                await pb.collection('guests').update(update.guest.id, {
                    first_name: update.firstName,
                    access_code: update.accessCode,
                    invite_code: update.inviteCode,
                    link_opened_count: 0
                });
                successCount++;
                console.log(`   ✅ Updated ${update.guest.name}`);
            } catch (error) {
                errorCount++;
                console.error(`   ❌ Failed to update ${update.guest.name}:`, error.message);
            }
        }

        console.log(`\n✨ Migration complete!`);
        console.log(`   Success: ${successCount}`);
        console.log(`   Errors: ${errorCount}\n`);

        // 5. Display summary
        console.log('📊 Summary:');
        console.log(`   Total guests: ${guests.length}`);
        console.log(`   Updated: ${updates.length}`);
        console.log(`   Skipped: ${guests.length - updates.length}\n`);

        if (successCount > 0) {
            console.log('🎉 Guests now have personalized invite codes!');
            console.log('   You can now copy invite links from the admin dashboard.');
            console.log('   Visit: http://localhost:3000/admin/guests');
        }

    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
        if (err.data) {
            console.error('   Data:', JSON.stringify(err.data, null, 2));
        }
        if (err.originalError) {
            console.error('   Details:', err.originalError);
        }
        process.exit(1);
    }
}

main();
