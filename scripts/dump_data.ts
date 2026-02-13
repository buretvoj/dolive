
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    const stream = fs.createWriteStream('migration_data.sql', { flags: 'w' });

    // Disable FK constraints for import
    stream.write(`
-- Data Dump
BEGIN;
SET session_replication_role = 'replica';

`);

    const replaceQuotes = (str: string) => str.replace(/'/g, "''");

    const formatValue = (val: any): string => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return String(val);
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        if (val instanceof Date) return `'${val.toISOString()}'`;
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return `'${replaceQuotes(String(val))}'`;
    };

    const dumpTable = async (modelName: string, tableName: string) => {
        console.log(`Dumping ${tableName}...`);
        // @ts-ignore
        const rows = await prisma[modelName].findMany();
        if (rows.length === 0) return;

        // Get columns from first row
        const cols = Object.keys(rows[0]).map(c => `"${c}"`).join(', ');

        for (const row of rows) {
            const values = Object.values(row).map(v => formatValue(v)).join(', ');
            stream.write(`INSERT INTO "${tableName}" (${cols}) VALUES (${values});\n`);
        }
        stream.write('\n');
    };

    // Dump tables
    // Adjust modelName (lowercase property on prisma client) to TableName (in DB)
    await dumpTable('page', 'Page');
    await dumpTable('section', 'Section');
    await dumpTable('post', 'Post');
    await dumpTable('media', 'Media');
    await dumpTable('navigation', 'Navigation');
    await dumpTable('performer', 'Performer');

    stream.write(`
SET session_replication_role = 'origin';
COMMIT;
`);

    stream.end();
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
