import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

// Admin login route
adminRouter.post('/login', loginAdmin);

export default adminRouter;
