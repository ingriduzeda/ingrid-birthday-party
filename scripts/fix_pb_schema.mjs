import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');
const token = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA';

pb.authStore.save(token, null);

async function fix() {
    try {
        console.log("Starting PocketBase schema fix...\n");

        // Delete and recreate guests collection
        console.log("Deleting guests collection...");
        try {
            await pb.collections.delete('guests');
            console.log("Deleted guests collection");
        } catch (e) {
            console.log("Could not delete guests (might not exist or has dependencies):", e.message);
        }

        console.log("\nCreating guests collection with proper schema...");
        await pb.collections.create({
            name: 'guests',
            type: 'base',
            schema: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    options: { min: 1, max: 255 }
                },
                {
                    name: 'is_confirmed',
                    type: 'bool',
                    options: {}
                },
                {
                    name: 'companions_count',
                    type: 'number',
                    options: { min: 0 }
                },
                {
                    name: 'message',
                    type: 'text',
                    options: { max: 1000 }
                }
            ],
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: ""
        });
        console.log("Created guests collection successfully!");

        // Delete and recreate config collection
        console.log("\nDeleting config collection...");
        try {
            await pb.collections.delete('config');
            console.log("Deleted config collection");
        } catch (e) {
            console.log("Could not delete config:", e.message);
        }

        console.log("\nCreating config collection with proper schema...");
        await pb.collections.create({
            name: 'config',
            type: 'base',
            schema: [
                {
                    name: 'key',
                    type: 'text',
                    required: true,
                    options: { min: 1, max: 100 }
                },
                {
                    name: 'value',
                    type: 'json',
                    options: {}
                }
            ],
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: ""
        });
        console.log("Created config collection successfully!");

        // Create initial config records
        console.log("\nCreating config records...");
        await pb.collection('config').create({ key: 'rsvp_enabled', value: true });
        console.log("Created rsvp_enabled");

        await pb.collection('config').create({ key: 'portal_password', value: 'guid20' });
        console.log("Created portal_password");

        await pb.collection('config').create({ key: 'admin_password', value: 'admin2025' });
        console.log("Created admin_password");

        // Test: Create a sample guest
        console.log("\nCreating sample guest...");
        const guest = await pb.collection('guests').create({
            name: 'Test Guest',
            is_confirmed: true,
            companions_count: 2,
            message: 'Looking forward to it!'
        });
        console.log("Created guest:", guest);

        // Test: Fetch guests with sort
        console.log("\nFetching guests with sort...");
        const guests = await pb.collection('guests').getList(1, 10, { sort: '-created' });
        console.log("Fetched guests successfully:", guests.items);

        // Test: Fetch config
        console.log("\nFetching config...");
        const config = await pb.collection('config').getFullList();
        console.log("Config:", config);

        console.log("\n✅ PocketBase schema fix completed successfully!");
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

fix();
