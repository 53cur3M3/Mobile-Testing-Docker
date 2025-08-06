const fs = require('fs');
const path = require('path');
const Realm = require('realm');

async function dumpRealmDatabase(filePath) {
    console.log(`\nDumping contents of Realm database: ${filePath}`);
    const realm = await Realm.open({ path: filePath });

    try {
        realm.schema.forEach((objectType) => {
            console.log(`\nClass: ${objectType.name}`);
            const objects = realm.objects(objectType.name);
            objects.forEach((obj) => {
                console.log(JSON.stringify(obj, null, 2));
            });
        });
    } catch (err) {
        console.error(`Error dumping database ${filePath}:`, err.message);
    } finally {
        realm.close(); // Ensure the Realm instance is closed
    }
}

(async () => {
    const realmDir = '/realm';
    if (!fs.existsSync(realmDir)) {
        console.error(`Directory ${realmDir} does not exist.`);
        process.exit(1);
    }

    const files = fs.readdirSync(realmDir);
    const realmFiles = files.filter((file) => file.endsWith('.realm'));

    if (realmFiles.length === 0) {
        console.log('No Realm database files found in /realm.');
        process.exit(0);
    }

    for (const file of realmFiles) {
        const filePath = path.join(realmDir, file);
        await dumpRealmDatabase(filePath);
    }

    console.log('All files processed.');
    process.exit(0); // Explicitly exit the process
})();

