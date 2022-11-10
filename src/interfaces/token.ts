
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user: Object;
}

export {AuthRequest}