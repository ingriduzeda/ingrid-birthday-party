import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');
const token = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA';

pb.authStore.save(token, null);

async function verify() {
    try {
        console.log("🔍 Verifying PocketBase Collections...\n");

        // Check Guests Collection
        console.log("📋 Guests Collection:");
        try {
            const guestCollection = await pb.collections.getOne('guests');
            console.log("  Schema:", JSON.stringify(guestCollection.schema, null, 2));

            // Fetch a sample record
            const records = await pb.collection('guests').getList(1, 1);
            if (records.items.length > 0) {
                console.log("  Sample Record:", JSON.stringify(records.items[0], null, 2));
            } else {
                console.log("  No records found");
            }
        } catch (e) {
            console.error("  ❌ Error:", e.message);
        }

        // Check Config Collection
        console.log("\n⚙️  Config Collection:");
        try {
            const configCollection = await pb.collections.getOne('config');
            console.log("  Schema:", JSON.stringify(configCollection.schema, null, 2));

            const records = await pb.collection('config').getFullList();
            console.log("  Records:", JSON.stringify(records, null, 2));
        } catch (e) {
            console.error("  ❌ Error:", e.message);
        }

    } catch (err) {
        console.error("❌ General error:", err);
    }
}

verify();
