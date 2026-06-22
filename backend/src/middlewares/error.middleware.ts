import {ErrorRequestHandler, RequestHandler} from "express";
import {AppError} from "../utils/errors";
import { Prisma } from "../../generated/prisma/client";


export const ErrorMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next) => {

    console.log(error)

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    if (error instanceof SyntaxError && (error as any).status === 400 && 'body' in error) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format. Please check your request body."
        });
    }

    if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code === 'P2025'){
            return res.status(404).json({success: false, message: 'Resource not found'})
        }
    }

    return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
}

// Missing Record: Your AppError should result in a 404 if you are finding a record by ID,
//     or a 401 (as we discussed for login) if you are verifying credentials.
//
//
//     Database/Connection Error: Your global
// middleware should catch these (like P2024 for connection pool timeouts) and return a 500 Internal Server Error.