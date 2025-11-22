import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');
const token = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA';

pb.authStore.save(token, null);

async function fixSchema() {
    try {
        console.log("🔧 Fixing PocketBase Schema Using Correct API Format...\n");

        // Delete and recreate guests collection with proper schema
        console.log("Deleting guests collection...");
        try {
            await pb.collections.delete('guests');
            console.log("✓ Deleted guests collection");
        } catch (e) {
            console.log("Could not delete guests:", e.message);
        }

        console.log("\nCreating guests collection with fields...");
        const guestsCollection = await pb.collections.create({
            name: 'guests',
            type: 'base',
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: "",
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    max: 255
                },
                {
                    name: 'is_confirmed',
                    type: 'bool'
                },
                {
                    name: 'companions_count',
                    type: 'number',
                    min: 0
                },
                {
                    name: 'message',
                    type: 'text',
                    max: 1000
                }
            ]
        });
        console.log("✓ Created guests collection");

        // Delete and recreate config collection
        console.log("\nDeleting config collection...");
        try {
            await pb.collections.delete('config');
            console.log("✓ Deleted config collection");
        } catch (e) {
            console.log("Could not delete config:", e.message);
        }

        console.log("\nCreating config collection with fields...");
        const configCollection = await pb.collections.create({
            name: 'config',
            type: 'base',
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: "",
            fields: [
                {
                    name: 'key',
                    type: 'text',
                    required: true,
                    unique: true,
                    max: 100
                },
                {
                    name: 'value',
                    type: 'json'
                }
            ],
            indexes: [
                'CREATE UNIQUE INDEX idx_unique_key ON config (key)'
            ]
        });
        console.log("✓ Created config collection");

        // Create initial config records
        console.log("\n📝 Creating initial records...");

        await pb.collection('config').create({
            key: 'rsvp_enabled',
            value: true
        });
        console.log("✓ Created rsvp_enabled config");

        await pb.collection('config').create({
            key: 'portal_password',
            value: 'guid20'
        });
        console.log("✓ Created portal_password config");

        await pb.collection('config').create({
            key: 'admin_password',
            value: 'admin2025'
        });
        console.log("✓ Created admin_password config");

        // Create a test guest
        const testGuest = await pb.collection('guests').create({
            name: 'Test Guest',
            is_confirmed: true,
            companions_count: 2,
            message: 'Excited for the party!'
        });
        console.log("✓ Created test guest:", testGuest.name);

        // Verify schema
        console.log("\n🔍 Verifying schema...");
        const guestsColl = await pb.collections.getOne('guests');
        console.log("Guests fields count:", guestsColl.fields?.length || 0);

        const configColl = await pb.collections.getOne('config');
        console.log("Config fields count:", configColl.fields?.length || 0);

        // Fetch records without sort to verify
        console.log("\n✅ Fetching records...");
        const guests = await pb.collection('guests').getFullList();
        console.log("Guests found:", guests.length);
        if (guests.length > 0) {
            console.log("First guest:", JSON.stringify(guests[0], null, 2));
        }

        const configs = await pb.collection('config').getFullList();
        console.log("\nConfig records:", configs.length);
        configs.forEach(c => {
            console.log(`  - ${c.key}: ${JSON.stringify(c.value)}`);
        });

        console.log("\n✅ Schema fix completed successfully!");

    } catch (err) {
        console.error("❌ Error:", err);
        if (err.data) {
            console.error("Error data:", JSON.stringify(err.data, null, 2));
        }
    }
}

fixSchema();
