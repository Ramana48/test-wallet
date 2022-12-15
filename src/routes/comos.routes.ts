import * as express from "express";
import CosmosController from "../controllers/cosmos.controller";

const router = express.Router();
const productsController = new CosmosController();


router.get("/",
    productsController.fetchProducts);

    router.post("/balance",
    productsController.fetchAccountBalance);

    router.post("/transaction",
    productsController.createTransaction);


export default router;
