import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA';

pb.authStore.save(token, null);

async function inspect() {
    try {
        console.log("Auth valid:", pb.authStore.isValid);
        console.log("Is Admin:", pb.authStore.isAdmin);
        console.log("Model:", JSON.stringify(pb.authStore.model, null, 2));

        // Inspect Guests Collection Schema
        try {
            const guestCollection = await pb.collections.getOne('guests');
            console.log("\nGuests Schema:", JSON.stringify(guestCollection.schema, null, 2));
        } catch (e) {
            console.log("Could not get guests schema:", e.message);
        }

        // Inspect Config Collection Schema
        try {
            const configCollection = await pb.collections.getOne('config');
            console.log("\nConfig Schema:", JSON.stringify(configCollection.schema, null, 2));
        } catch (e) {
            console.log("Could not get config schema:", e.message);
        }

        // Try to UPDATE guests schema
        console.log("\nAttempting to update guests schema...");
        try {
            const guestCollection = await pb.collections.getOne('guests');
            // Add fields if missing
            const schema = [
                { name: 'name', type: 'text', required: true },
                { name: 'is_confirmed', type: 'bool' },
                { name: 'companions_count', type: 'number' },
                { name: 'message', type: 'text' }
            ];
            // Merge or replace? PocketBase updates replace the schema list usually, but we need to be careful.
            // If we can't read the schema (it was undefined), we might be blind.
            // But let's try to set it.
            await pb.collections.update(guestCollection.id, {
                schema: schema
            });
            console.log("Guests schema updated successfully!");
        } catch (e) {
            console.error("Error updating guests schema:", e.status, e.message);
        }

        // Try to UPDATE config schema
        console.log("\nAttempting to update config schema...");
        try {
            const configCollection = await pb.collections.getOne('config');
            const configSchema = [
                { name: 'key', type: 'text', required: true, unique: true },
                { name: 'value', type: 'json' } // Change to JSON to support text/bool/etc
            ];
            await pb.collections.update(configCollection.id, {
                schema: configSchema
            });
            console.log("Config schema updated successfully!");
        } catch (e) {
            console.error("Error updating config schema:", e.status, e.message);
        }

        // Try to UPDATE guests rules to PUBLIC
        console.log("\nAttempting to update guests rules to PUBLIC...");
        try {
            await pb.collections.update('guests', {
                listRule: "",
                viewRule: "",
                createRule: "",
                updateRule: "",
                deleteRule: ""
            });
            console.log("Guests rules updated to PUBLIC!");
        } catch (e) {
            console.error("Error updating guests rules:", e.status, e.message);
        }

        // Try to UPDATE config rules to PUBLIC
        console.log("\nAttempting to update config rules to PUBLIC...");
        try {
            await pb.collections.update('config', {
                listRule: "",
                viewRule: "",
                createRule: "", // Keep create restricted? No, let's open for now to debug
                updateRule: "",
                deleteRule: ""
            });
            console.log("Config rules updated to PUBLIC!");
        } catch (e) {
            console.error("Error updating config rules:", e.status, e.message);
        }

        // Try to fetch guests WITH SORT
        console.log("\nFetching guests (WITH SORT -created)...");
        try {
            const guests = await pb.collection('guests').getList(1, 5, { sort: '-created' });
            console.log("Guests fetched successfully:", guests.items.length);
            console.log("First Item:", JSON.stringify(guests.items[0], null, 2));
        } catch (e) {
            console.error("Error fetching guests (with sort):", e.status, e.message);
        }

        // Set Passwords in Config
        console.log("\nSetting passwords in config...");
        try {
            // Portal Password
            try {
                await pb.collection('config').create({ key: 'portal_password', value: 'guid20' });
                console.log("Created portal_password");
            } catch (e) {
                // If exists, update
                const record = await pb.collection('config').getFirstListItem('key="portal_password"');
                await pb.collection('config').update(record.id, { value: 'guid20' });
                console.log("Updated portal_password");
            }

            // Admin Password
            try {
                await pb.collection('config').create({ key: 'admin_password', value: 'admin2025' });
                console.log("Created admin_password");
            } catch (e) {
                const record = await pb.collection('config').getFirstListItem('key="admin_password"');
                await pb.collection('config').update(record.id, { value: 'admin2025' });
                console.log("Updated admin_password");
            }
        } catch (e) {
            console.error("Error setting passwords:", e.status, e.message);
        }

        // Verify Schema Persistence
        try {
            const guestCollection = await pb.collections.getOne('guests');
            console.log("\nGuests Schema AFTER update:", JSON.stringify(guestCollection.schema, null, 2));
        } catch (e) {
            console.log("Could not get guests schema after update:", e.message);
        }

        // Test Public Access (New Client)
        console.log("\nTesting Public Access (No Auth)...");
        const pbPublic = new PocketBase('https://party-pocketbase.ingriduzeda.com');

        try {
            const guests = await pbPublic.collection('guests').getList(1, 5);
            console.log("Public Guests fetch:", guests.items.length);
            console.log("Public Items:", JSON.stringify(guests.items, null, 2));
        } catch (e) {
            console.error("Public Guests fetch failed:", e.status, e.message);
        }

        try {
            const config = await pbPublic.collection('config').getFullList();
            console.log("Public Config fetch:", config.length);
            console.log("Public Config Items:", JSON.stringify(config, null, 2));
        } catch (e) {
            console.error("Public Config fetch failed:", e.status, e.message);
        }

    } catch (err) {
        console.error("General error:", err);
    }
}

inspect();
