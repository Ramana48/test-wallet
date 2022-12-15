import { Request, Response } from "express";
import CosmosService from "../services/cosmos.service";
import CosmosBalanceService from '../services/cosmos.balance.service';

const productsService = new CosmosService();
const balanceService = new CosmosBalanceService();

export default class CosmosController {

    async fetchProducts(req: Request, res: Response) {

        const products = await productsService.fetchAllProducts(req, res);
        return res.json(products);
    }

    async fetchAccountBalance(req: Request, res: Response){
        const balances = await balanceService.fetchAccountBalance(req, res);
        return res.json(balances);
    }

    async createTransaction(req: Request, res: Response){
        const txn = await productsService.createTransaction(req, res);
        return res.json(txn);
    }
}