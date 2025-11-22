import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

async function checkAndFixSchema() {
    try {
        console.log('🔍 Checking PocketBase schema...\n');

        // Try to fetch a guest and check what fields exist
        const guests = await pb.collection('guests').getFullList({ $autoCancel: false });

        if (guests.length === 0) {
            console.log('❌ No guests found in the database.');
            console.log('\n📝 Please add a test guest first via the PocketBase UI.');
            return;
        }

        const guest = guests[0];
        console.log('Found guest:', guest.name);
        console.log('\nChecking fields on guest record:');
        console.log('  ✓ id:', guest.id);
        console.log('  ✓ name:', guest.name);
        console.log('  ? first_name:', guest.first_name !== undefined ? `✅ "${guest.first_name}"` : '❌ MISSING');
        console.log('  ? access_code:', guest.access_code !== undefined ? `✅ "${guest.access_code}"` : '❌ MISSING');
        console.log('  ? invite_code:', guest.invite_code !== undefined ? `✅ "${guest.invite_code}"` : '❌ MISSING');
        console.log('  ? link_opened_at:', guest.link_opened_at !== undefined ? `✅ ${guest.link_opened_at}` : '❌ MISSING');
        console.log('  ? link_opened_count:', guest.link_opened_count !== undefined ? `✅ ${guest.link_opened_count}` : '❌ MISSING');
        console.log('');

        const missingFields = [];
        if (guest.first_name === undefined) missingFields.push('first_name');
        if (guest.access_code === undefined) missingFields.push('access_code');
        if (guest.invite_code === undefined) missingFields.push('invite_code');
        if (guest.link_opened_at === undefined) missingFields.push('link_opened_at');
        if (guest.link_opened_count === undefined) missingFields.push('link_opened_count');

        if (missingFields.length > 0) {
            console.log('⚠️  Missing fields:', missingFields.join(', '));
            console.log('');
            console.log('📋 Please add these fields manually in PocketBase:');
            console.log('   1. Go to: https://party-pocketbase.ingriduzeda.com/_/');
            console.log('   2. Click on "Collections" → "guests"');
            console.log('   3. Click "Edit collection"');
            console.log('   4. Add the following fields:\n');
            console.log('   Field Name         | Type   | Required | Default');
            console.log('   ------------------ | ------ | -------- | -------');
            console.log('   first_name         | Text   | No       | -');
            console.log('   access_code        | Text   | No       | -');
            console.log('   invite_code        | Text   | No       | -');
            console.log('   link_opened_at     | Date   | No       | -');
            console.log('   link_opened_count  | Number | No       | 0');
            console.log('');
            console.log('   5. Click "Save"');
            console.log('   6. Run this script again to verify');
            console.log('');
        } else {
            console.log('✅ All required fields exist!');
            console.log('');

            // Check if the guest has codes
            if (!guest.invite_code || !guest.access_code) {
                console.log('📝 Guest exists but needs codes. Running migration...\n');
                return 'NEED_MIGRATION';
            } else {
                console.log('🎉 Schema is complete and guest has codes!');
                console.log(`   Test invite link: http://localhost:3000/invite/${guest.invite_code}`);
            }
        }

    } catch (err) {
        console.error('\n❌ Error:', err.message);
        if (err.data) {
            console.error('   Data:', JSON.stringify(err.data, null, 2));
        }
        process.exit(1);
    }
}

checkAndFixSchema().then(result => {
    if (result === 'NEED_MIGRATION') {
        console.log('💡 Next step: Run the migration script to generate codes');
        console.log('   node scripts/run-migration.mjs');
    }
});
