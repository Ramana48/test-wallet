import { assertIsDeliverTxSuccess, calculateFee, Coin, coins, createProtobufRpcClient, GasPrice, QueryClient, SigningStargateClient, StdFee } from "@cosmjs/stargate";
import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { OfflineSigner } from "@cosmjs/proto-signing";

const getBalance = async (denom: string, address: string, rcp: string): Promise<Coin | undefined> => {
    try {
      const tendermint = await Tendermint34Client.connect(rcp);
      const queryClient = new QueryClient(tendermint);
      const rpcClient = createProtobufRpcClient(queryClient);
      const bankQueryService = new QueryClientImpl(rpcClient);

      const { balance } = await bankQueryService.Balance({
        address,
        denom,
      });
      console.log('balance:::',balance);
      
      return balance;
    } catch (error) {
     throw error;
    }
  };



export default class CosmosBalanceService {

    async fetchAccountBalance(req, res) {
        let input = req.body;
        try {
           return await getBalance(input['denom'],input['address'],input['rpc']);
        } catch (error) {
            console.log('error:::',error);

            return {message:error.message};
        }
    }

    async createTransaction(req, res){

    }
    
}
