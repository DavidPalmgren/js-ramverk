import openDb from '../db/database.mjs';

const docs = {
    getAll: async function getAll() {
        let db = await openDb();

        try {
            return await db.all('SELECT rowid as id, * FROM documents');
        } catch (e) {
            console.error(e);

            return [];
        } finally {
            await db.close();
        }
    },

    getOne: async function getOne(id) {
        let db = await openDb();

        try {
            let bla = await db.get('SELECT rowid as id, * FROM documents WHERE rowid=?', id);
            return bla;
        } catch (e) {
            console.error(e);

            return {};
        } finally {
            await db.close();
        }
    },

    addOne: async function addOne(body) {
        let db = await openDb();
        try {
            return await db.run(
                'INSERT INTO documents (title, content) VALUES (?, ?)',
                body.title,
                body.content,
            );
        } finally {
            await db.close();
        }
    },

    updateOne: async function updateOne(id, title, content) {
        let db = await openDb();

        try {
            return await db.run(
                'UPDATE documents SET content = ?, title = ? WHERE rowid = ?',
                content,
                title,
                id
            );
        } finally {
            await db.close();
        }
    }
};

export default docs;
