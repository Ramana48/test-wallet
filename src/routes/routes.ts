import { Application, Request, Response } from "express";
import cosmosRoute from './comos.routes';

module.exports = (app: Application) => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome!!");
  });

  app.use('/cosmos',cosmosRoute);
};