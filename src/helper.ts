import * as anchor from "@coral-xyz/anchor";
import { Wallet, AnchorProvider } from "@coral-xyz/anchor";
import {
  PublicKey,
  Connection,
  AddressLookupTableAccount,
  TransactionInstruction,
} from "@solana/web3.js";
import { loadKeypair } from "./keypair-util";
import * as dotenv from "dotenv"

dotenv.config();
export const {
  SENDER_WALLET_PATH,
  MAIN_NET_RPC,
  MAGIC_MATH_RPC,
  JUPITER_API_ENDPOINT
} = process.env;

export const wallet = new Wallet(
  loadKeypair(SENDER_WALLET_PATH as string)
);

export const connection = new Connection(MAIN_NET_RPC as string);

export const provider = new AnchorProvider(connection, wallet, {
  commitment: "processed",
});
anchor.setProvider(provider);

export const getAdressLookupTableAccounts = async (
  keys: string[]
): Promise<AddressLookupTableAccount[]> => {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key))
    );

  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data),
      });
      acc.push(addressLookupTableAccount);
    }

    return acc;
  }, new Array<AddressLookupTableAccount>());
};

export const instructionDataToTransactionInstruction = (
  instructionPayload: any
) => {
  if (instructionPayload === null) {
    return null;
  }

  return new TransactionInstruction({
    programId: new PublicKey(instructionPayload.programId),
    keys: instructionPayload.accounts.map((key) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instructionPayload.data, "base64"),
  });
};
