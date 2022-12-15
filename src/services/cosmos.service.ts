import { Secp256k1HdWallet, makeCosmoshubPath } from '../packages/amino';
import { coins, HdPath, StdFee, WalletAccount, WalletAccountConfig } from '../packages';
import { SigningStargateClient, GasPrice, calculateFee, assertIsDeliverTxSuccess } from '@cosmjs/stargate';
var getJSON = require('get-json')

declare const window: any;
declare const self: any;
interface ChainConfig {
  chainId: string;
  coinDenom: string;
  coinDecimals: number;
  coinMinimalDenom: string;
}

const sendTransaction = async (wallet: any, req) => {
  const rpcEndpoint = 'http://52.173.19.8:26657'

  console.log("wallet is",wallet)
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
  )

  const recipient = req.body.recipient;
  const amount = coins(1004, 'ucoinsage')



  const [firstAccount] = await wallet.getAccounts()

  const defaultGasPrice = GasPrice.fromString('0.025ucoinsage')
  const defaultSendFee: StdFee = calculateFee(80_000, defaultGasPrice)

  const sendMsg = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: firstAccount.address,
      toAddress: recipient,
      amount: [amount],
    }
};

  console.log('sender', firstAccount.address)
  console.log('transactionFee', defaultSendFee)
  console.log('amount', amount)
  const memo = "Use your power wisely";

  const fee = {
    amount: [
      {
        denom: "ucoinsage",
        amount: "200",
      },
    ],
    gas: "180000", // 180k
  };

  const transaction = await client.sign(
    firstAccount.address,
    [sendMsg],
    fee,
    memo,
  )
  //assertIsDeliverTxSuccess(transaction)
  console.log('Successfully broadcasted:', transaction)
}

export default class CosmosService {
  private walletAccounts: Array<WalletAccount>;
  private aminoSigner: Secp256k1HdWallet;

    async fetchAllProducts(req, res) {

      const seeds = this.generateMnemonic();
      console.log('MNNNN::', seeds);

      this.aminoSigner =  await this.createByMnemonic(seeds);
      console.log('wa::', JSON.stringify(this.aminoSigner));


      await this.initAccounts();

      const pubAddr = this.walletAccounts[0].getAddress()

      console.log('this.walletAccounts ::',pubAddr);

      const coinDenom = this.walletAccounts[0]
      console.log('coinDenom ::',coinDenom);




      //fetch mnemonic

      const test = await this.getMnemonic();

     console.log('this test is ::',test );

     const privateKey = await this.getPrivateKey(pubAddr);
     console.log('this privateKey is ::',privateKey );


      return {'message':'ok'}
    }

    async createTransaction(req, res){
      const pubAddr = this.walletAccounts[0].getAddress()

      console.log('this.walletAccounts ::',pubAddr);

      const txn = await sendTransaction(this.aminoSigner, req);
    }

  generateMnemonic = (length: 12 | 15 | 18 | 21 | 24 = 12): string => {
    return Secp256k1HdWallet.mnemonicGenerate(length);
  };

 getBytes(count: number): Uint8Array {
  try {
    const globalObject = typeof window === 'object' ? window : self;
    const cryptoApi =
      typeof globalObject.crypto !== 'undefined' ? globalObject.crypto : globalObject.msCrypto;

    const out = new Uint8Array(count);
    cryptoApi.getRandomValues(out);
    return out;
  } catch {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');
      return new Uint8Array([...crypto.randomBytes(count)]);
    } catch {
      throw new Error('No secure random number generator found');
    }
  }
}

//  getInfo() {
// 	// Get info from wallet
// 	getJSON(config.lcdUrl+'/cosmos/bank/v1beta1/balances/'+address, function(error, response){
// 		cosmosTool.getAccounts(address).then(data => {
// 			table2.push(
// 				{ 'Uamount': response.balances[0].amount + ' ' + config.denom}
// 				, { 'Amount': (response.balances[0].amount/1000000).toFixed(2) + ' ' + config.prefix}
// 				, { 'Account number': data.result.value.account_number }
// 				, { 'Sequence': data.result.value.sequence }
// 			);			
// 			console.log(table2.toString());
// 		})
// 	})
// }

public getMnemonic = () => {
  return this.aminoSigner.mnemonic;
};

 public getPrivateKey = async (address: string) => {
    const privateKey = await this.aminoSigner.getPrivkey(address);
    return privateKey;
  };


 getAccounts = () => {
  return this.walletAccounts;
};
createByMnemonic = async (
  seeds: string,
  accountPaths: Array<number> = [0],
): Promise<Secp256k1HdWallet> => {
  const walletConfig = this.createWalletConfig({ accountPaths });
  console.log("wallet confug is",walletConfig)
  console.log("seeds is",seeds)
return await Secp256k1HdWallet.fromMnemonic(seeds, walletConfig);
};

createWalletConfig = (config?: {
  password?: string;
  accountPaths?: Array<number>;
}) => {
  console.log('config::', JSON.stringify(config));
  
  const password = config?.password ?? '';
  const accountPaths = config?.accountPaths ?? [0];
  const prefix = process.env.SIGNER_PREFIX ?? 'cosmos';
  const hdPaths: Array<HdPath> = accountPaths.map(makeCosmoshubPath);

  return {
    hdPaths,
    prefix,
    bip39Password: password,
  };
};

initAccounts = async (names: { [key in string]: string } = {}, config?: ChainConfig) => {
  const accounts = await this.aminoSigner.getAccounts();
  const walletAccounts = accounts.map(WalletAccount.createByAminoAccount);
  walletAccounts.map((walletAccount, index) => {
    walletAccount.setIndex(index + 1);
    walletAccount.setSigner(this.aminoSigner);
    walletAccount.data.address in names &&
      walletAccount.setName(names[walletAccount.data.address]);
    config && walletAccount.setConfig(new WalletAccountConfig(config));
  });

  this.walletAccounts = [...walletAccounts];
};

}