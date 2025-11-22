import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

// Set the auth token
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

async function main() {
    try {
        console.log('🔧 Testing guest record update...\n');

        // Fetch the test guest
        const guests = await pb.collection('guests').getFullList();
        console.log(`Found ${guests.length} guests\n`);

        if (guests.length === 0) {
            console.log('No guests to update.');
            return;
        }

        const guest = guests[0];
        console.log('Guest before update:');
        console.log('  name:', guest.name);
        console.log('  first_name:', guest.first_name);
        console.log('  invite_code:', guest.invite_code);
        console.log('  access_code:', guest.access_code);
        console.log('');

        const firstName = extractFirstName(guest.name);
        const accessCode = generateAccessCode();
        const inviteCode = generateInviteCode();

        console.log('Attempting to update with:');
        console.log('  first_name:', firstName);
        console.log('  access_code:', accessCode);
        console.log('  invite_code:', inviteCode);
        console.log('');

        try {
            const updated = await pb.collection('guests').update(guest.id, {
                first_name: firstName,
                access_code: accessCode,
                invite_code: inviteCode,
                link_opened_count: 0
            });

            console.log('✅ Update successful!');
            console.log('Updated guest:');
            console.log('  name:', updated.name);
            console.log('  first_name:', updated.first_name);
            console.log('  invite_code:', updated.invite_code);
            console.log('  access_code:', updated.access_code);
            console.log('');

            // Verify by fetching again
            console.log('Verifying by fetching again...');
            const verified = await pb.collection('guests').getOne(guest.id);
            console.log('Verified guest:');
            console.log('  first_name:', verified.first_name);
            console.log('  invite_code:', verified.invite_code);
            console.log('  access_code:', verified.access_code);

        } catch (updateErr) {
            console.error('❌ Update failed:', updateErr.message);
            if (updateErr.data) {
                console.error('   Data:', JSON.stringify(updateErr.data, null, 2));
            }
            if (updateErr.status === 403) {
                console.error('\n⚠️  Permission denied - the token may not have write access.');
                console.error('   You may need to use admin credentials or update the collection rules.');
            }
        }

    } catch (err) {
        console.error('\n❌ Test failed:', err.message);
        if (err.data) {
            console.error('   Data:', JSON.stringify(err.data, null, 2));
        }
    }
}

main();
