import PocketBase from 'pocketbase';

const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');
const token = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2Mzg0MzEwNywiaWQiOiJqb3l0OG8ybDM0MTFidDEiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.bwTg8yy9QKF7BNOdHj0QPzOzlcy-tpeAFe6nBnJFhQA';

pb.authStore.save(token, null);

async function fixWithImport() {
    try {
        console.log("🔧 Attempting to import PocketBase schema using importCollections API...\n");

        const collections = [
            {
                "id": "pbc_2047001084",
                "name": "guests",
                "type": "base",
                "system": false,
                "schema": [
                    {
                        "id": "name_field",
                        "name": "name",
                        "type": "text",
                        "required": true,
                        "presentable": false,
                        "unique": false,
                        "options": {
                            "min": null,
                            "max": 255,
                            "pattern": ""
                        }
                    },
                    {
                        "id": "is_confirmed_field",
                        "name": "is_confirmed",
                        "type": "bool",
                        "required": false,
                        "presentable": false,
                        "unique": false,
                        "options": {}
                    },
                    {
                        "id": "companions_count_field",
                        "name": "companions_count",
                        "type": "number",
                        "required": false,
                        "presentable": false,
                        "unique": false,
                        "options": {
                            "min": 0,
                            "max": null,
                            "noDecimal": true
                        }
                    },
                    {
                        "id": "message_field",
                        "name": "message",
                        "type": "text",
                        "required": false,
                        "presentable": false,
                        "unique": false,
                        "options": {
                            "min": null,
                            "max": 1000,
                            "pattern": ""
                        }
                    }
                ],
                "indexes": [],
                "listRule": "",
                "viewRule": "",
                "createRule": "",
                "updateRule": "",
                "deleteRule": "",
                "options": {}
            },
            {
                "id": "pbc_3818476082",
                "name": "config",
                "type": "base",
                "system": false,
                "schema": [
                    {
                        "id": "key_field",
                        "name": "key",
                        "type": "text",
                        "required": true,
                        "presentable": false,
                        "unique": true,
                        "options": {
                            "min": null,
                            "max": 100,
                            "pattern": ""
                        }
                    },
                    {
                        "id": "value_field",
                        "name": "value",
                        "type": "json",
                        "required": false,
                        "presentable": false,
                        "unique": false,
                        "options": {
                            "maxSize": 2000000
                        }
                    }
                ],
                "indexes": ["CREATE UNIQUE INDEX idx_unique_key ON config (key)"],
                "listRule": "",
                "viewRule": "",
                "createRule": "",
                "updateRule": "",
                "deleteRule": "",
                "options": {}
            }
        ];

        // Try to import
        console.log("Attempting importCollections...");
        try {
            const response = await fetch('https://party-pocketbase.ingriduzeda.com/api/collections/import', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': pb.authStore.token
                },
                body: JSON.stringify({
                    collections: collections,
                    deleteMissing: false
                })
            });

            const result = await response.json();
            console.log("Import result:", result);
        } catch (e) {
            console.error("Import failed:", e);
        }

        // Verify
        console.log("\n🔍 Verifying after import...");
        const guestCollection = await pb.collections.getOne('guests');
        console.log("Guests schema:", guestCollection.schema);

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

fixWithImport();
