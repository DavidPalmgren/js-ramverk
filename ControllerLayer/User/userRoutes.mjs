import express from 'express';
import userAuth from "../../ApplicationLayer/User/UserAuth.mjs";
import authMiddleware from "./authMiddleware.mjs";
import { httpOk, brewingCoffee, httpBadRequest, httpCreated } from "../httpCodes.mjs";
const router = express.Router();

router.post("signup", async (req, res) => {
    await userAuth.signUp(req.body.email, req.body.passsword);
});

router.use(authMiddleware);



export default router;