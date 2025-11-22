import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

async function checkSchema() {
    try {
        console.log('🔍 Checking actual PocketBase schema...\n');

        // Fetch collection info
        const collection = await pb.send('/api/collections/guests', {
            method: 'GET'
        });

        console.log('Collection Name:', collection.name);
        console.log('Collection ID:', collection.id);
        console.log('\nSchema Fields:');
        console.log('─'.repeat(60));

        collection.schema.forEach((field, index) => {
            console.log(`${index + 1}. ${field.name}`);
            console.log(`   Type: ${field.type}`);
            console.log(`   Required: ${field.required || false}`);
            console.log(`   Options:`, JSON.stringify(field.options || {}, null, 2));
            console.log('');
        });

        // Also fetch one record to see actual data structure
        console.log('\n📝 Fetching sample guest record...\n');
        const guests = await pb.collection('guests').getFullList({ $autoCancel: false });

        if (guests.length > 0) {
            const guest = guests[0];
            console.log('Sample Guest Record Keys:');
            console.log('─'.repeat(60));
            Object.keys(guest).forEach(key => {
                const value = guest[key];
                const type = typeof value;
                const display = value === null ? 'null' : (value === undefined ? 'undefined' : (type === 'string' && value.length > 50 ? `"${value.substring(0, 50)}..."` : JSON.stringify(value)));
                console.log(`  ${key}: ${type} = ${display}`);
            });
        } else {
            console.log('No guests found in collection.');
        }

    } catch (err) {
        console.error('\n❌ Error:', err.message);
        if (err.data) {
            console.error('   Data:', JSON.stringify(err.data, null, 2));
        }
    }
}

checkSchema();
