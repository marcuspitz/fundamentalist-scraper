import express from 'express';
import { noCache } from 'helmet';

const router = express.Router();

//ejb health
router.get('/health', noCache(), async (req, res) => {    
    res.status(200).send("Application running");
});

export default router;
