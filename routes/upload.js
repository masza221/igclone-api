import express from 'express';
import { uploadFile } from '../controllers/upload.js';
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/uploadFile', verifyUser, uploadFile);



export default router;