import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { z } from "zod";

const router = express.Router();

const signupSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Email is not valid"),
        password: z.string().min(6, "Password must be at least 6 characters")
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Email is not valid"),
        password: z.string().min(1, "Password is required")
    })
});

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;