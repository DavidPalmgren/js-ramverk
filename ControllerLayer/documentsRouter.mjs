import express from 'express';

import documents from "../ApplicationLayer/documents.mjs";
import { httpOk, brewingCoffee, httpBadRequest, httpCreated } from "./httpCodes.mjs";
const router = express.Router();

router.post("/", async (req, res) => {
    let response = {};
    const result = await documents.addNewDocument(req.body);
    response.code = httpOk;
    response.data = result;
    res.json(response);
});

router.get('/:id', async (req, res) => {
    let response = {};
    const result = await documents.getDocumentById(req.params.id)
    response.code = httpOk;
    response.data = result;
    res.json(response);
});


router.post('/update/:id', async (req, res) => {
    let response = {};
    const result = await documents.updateDocument(req.params.id, req.body.title, req.body.content);
    response.code = httpCreated;
    response.data = result;
    res.json(response);
});

router.get('/', async (req, res) => {
    let response = {};
    const result = await documents.getAllDocuments();
    response.code = httpOk;
    response.data = result;
    res.json(response);
});


export default router;