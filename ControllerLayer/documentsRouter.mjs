import express from 'express';

import documents from "../ApplicationLayer/documents.mjs";
import { httpOk, brewingCoffee, httpBadRequest, httpCreated } from "./httpCodes.mjs";
const router = express.Router();

router.post("/", async (req, res) => {
    const result = await documents.addNewDocument(req.body.content, req.body.title);
    res.status(httpOk).json({ data: result });
});

router.get('/:id', async (req, res) => {
    const result = await documents.getDocumentById(req.params.id);
    res.status(httpOk).json({ data: result });
});


router.put('/:id', async (req, res, next) => {
    const result = await documents.updateDocument(req.params.id, req.body.title, req.body.content);
    res.status(httpCreated).json({ data: result });
});

router.get('/', async (req, res) => {
    const result = await documents.getAllDocuments();
    res.status(httpOk).json({ data: result });
});



export default router;