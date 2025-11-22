import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error('Usage: node scripts/setup-pocketbase.mjs <admin-email> <admin-password>');
    process.exit(1);
}

async function main() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword(email, password);
        console.log('Authenticated successfully.');

        // 1. Create 'guests' collection
        try {
            await pb.collections.getOne('guests');
            console.log("Collection 'guests' already exists.");
        } catch (e) {
            console.log("Creating 'guests' collection...");
            await pb.collections.create({
                name: 'guests',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'is_confirmed', type: 'bool' },
                    { name: 'companions_count', type: 'number' },
                    { name: 'message', type: 'text' }
                ],
                createRule: "", // Public create
                listRule: "@request.auth.id != ''", // Admin only list (or auth)
                viewRule: "@request.auth.id != ''",
                updateRule: "@request.auth.id != ''",
                deleteRule: "@request.auth.id != ''",
            });
            console.log("Collection 'guests' created.");
        }

        // 2. Create 'config' collection
        try {
            await pb.collections.getOne('config');
            console.log("Collection 'config' already exists.");
        } catch (e) {
            console.log("Creating 'config' collection...");
            await pb.collections.create({
                name: 'config',
                type: 'base',
                schema: [
                    { name: 'key', type: 'text', required: true, unique: true },
                    { name: 'value', type: 'bool' } // Simple bool value for now
                ],
                listRule: "", // Public read (so we can check rsvp_enabled)
                viewRule: "",
                createRule: "@request.auth.id != ''",
                updateRule: "@request.auth.id != ''",
                deleteRule: "@request.auth.id != ''",
            });
            console.log("Collection 'config' created.");
        }

        // 3. Create default config record
        try {
            const records = await pb.collection('config').getList(1, 1, {
                filter: 'key = "rsvp_enabled"'
            });
            if (records.items.length === 0) {
                console.log("Creating default config 'rsvp_enabled'...");
                await pb.collection('config').create({
                    key: 'rsvp_enabled',
                    value: true
                });
                console.log("Default config created.");
            } else {
                console.log("Config 'rsvp_enabled' already exists.");
            }
        } catch (e) {
            console.error("Error checking/creating config record:", e);
        }

        console.log("\nSetup complete! You can now use the RSVP form.");

    } catch (err) {
        console.error("Error:", err.originalError || err.message);
        process.exit(1);
    }
}

main();
