import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

// Set the auth token
pb.authStore.save('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA');

async function main() {
    try {
        console.log('🔧 Updating collection access rules...\n');

        // Get the guests collection
        const collection = await pb.send('/api/collections/guests', {
            method: 'GET'
        });

        console.log('Current rules:');
        console.log('  listRule:', collection.listRule || '(empty)');
        console.log('  viewRule:', collection.viewRule || '(empty)');
        console.log('  updateRule:', collection.updateRule || '(empty)');
        console.log('');

        // Update collection rules to allow public reading (needed for invite pages)
        const updated = await pb.send(`/api/collections/${collection.id}`, {
            method: 'PATCH',
            body: {
                listRule: '', // Allow anyone to list (with filters)
                viewRule: '', // Allow anyone to view individual records
                // Keep update restricted to authenticated users
                updateRule: collection.updateRule || "@request.auth.id != ''"
            }
        });

        console.log('✅ Updated collection rules!\n');
        console.log('New rules:');
        console.log('  listRule:', updated.listRule || '(public access)');
        console.log('  viewRule:', updated.viewRule || '(public access)');
        console.log('  updateRule:', updated.updateRule || '(empty)');
        console.log('');

        console.log('🎉 Collection rules updated successfully!');
        console.log('   Invite pages can now fetch guest data.');
        console.log('   Try visiting: http://localhost:3000/invite/dmm44tyt\n');

    } catch (err) {
        console.error('\n❌ Failed to update rules:', err.message);
        if (err.data) {
            console.error('   Data:', JSON.stringify(err.data, null, 2));
        }
        process.exit(1);
    }
}

main();
