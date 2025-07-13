import { Request, Response } from 'express';

export const GET = (req: Request, res: Response) => {
  res.json({ message: 'Get all projects' });
};

export const POST = (req: Request, res: Response) => {
  res.json({ message: 'Create new project', data: req.body });
};