import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

async function testFetch() {
    try {
        console.log('🧪 Testing guest fetch by invite_code...\n');

        const code = 'dmm44tyt';

        // Test 1: Try with filter (what the app does)
        console.log('Test 1: Using filter with escaped quotes');
        try {
            const records1 = await pb.collection('guests').getList(1, 1, {
                filter: `invite_code = "${code}"`,
            });
            console.log('✅ Success!', records1.items.length, 'records found');
            if (records1.items.length > 0) {
                console.log('   Guest:', records1.items[0].name);
                console.log('   First Name:', records1.items[0].first_name);
                console.log('   Invite Code:', records1.items[0].invite_code);
            }
        } catch (err) {
            console.error('❌ Failed:', err.message);
            if (err.data) {
                console.error('   Data:', JSON.stringify(err.data, null, 2));
            }
        }

        console.log('');

        // Test 2: Try to fetch all and filter manually
        console.log('Test 2: Fetching all guests');
        try {
            const allGuests = await pb.collection('guests').getFullList();
            console.log('✅ Success! Found', allGuests.length, 'total guests');
            allGuests.forEach(g => {
                console.log('   -', g.name, '| invite_code:', g.invite_code, '| first_name:', g.first_name);
            });
        } catch (err) {
            console.error('❌ Failed:', err.message);
        }

    } catch (err) {
        console.error('\n❌ Test failed:', err.message);
        if (err.data) {
            console.error('   Data:', JSON.stringify(err.data, null, 2));
        }
    }
}

testFetch();
