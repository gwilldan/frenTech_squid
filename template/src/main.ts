import { TypeormDatabase } from "@subsquid/typeorm-store";
import { decodeHex } from "@subsquid/evm-processor";
import * as FriendtechAbi from "./abi/FriendtechSaresV1";
import { OwnershipTransferred, Trade } from "./model";
import { processor, Contract } from "./processor";

export const concatID = (hash: string, logindex: number) => {
	const buffer = Buffer.alloc(4);
	buffer.writeInt32LE(logindex, 0);
	const result = `${hash}${buffer.toString("hex")}`;
	return result;
};

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
	const ownershipTransferred: OwnershipTransferred[] = [];
	const trade: Trade[] = [];

	for (const c of ctx.blocks) {
		for (const e of c.logs) {
			if (e.address === Contract) {
				if (
					e.topics[0] === FriendtechAbi.events["OwnershipTransferred"].topic
				) {
					const { previousOwner, newOwner } = FriendtechAbi.events[
						"OwnershipTransferred"
					].decode(e);
					ownershipTransferred.push(
						new OwnershipTransferred({
							id: concatID(e.transactionHash, e.logIndex),
							previousOwner: decodeHex(previousOwner),
							newOwner: decodeHex(newOwner),
							blockNumber: BigInt(e.block?.height),
							blockTimestamp: BigInt(e.block?.timestamp),
							transactionHash: decodeHex(e.transactionHash),
						})
					);
				} else if (e.topics[0] === FriendtechAbi.events["Trade"].topic) {
					const {
						trader,
						subject,
						isBuy,
						shareAmount,
						ethAmount,
						protocolEthAmount,
						subjectEthAmount,
						supply,
					} = FriendtechAbi.events["Trade"].decode(e);
					trade.push(
						new Trade({
							id: concatID(e.transactionHash, e.logIndex),

							blockNumber: BigInt(e?.block?.height),
							blockTimestamp: BigInt(e?.block?.timestamp),
							ethAmount,
							isBuy,
							protocolEthAmount,
							shareAmount,
							subject: decodeHex(subject),
							subjectEthAmount,
							supply,
							trader: decodeHex(trader),
							transactionHash: decodeHex(e.transactionHash),
						})
					);
				}
			}
		}
	}

	await ctx.store.upsert(ownershipTransferred);
	await ctx.store.upsert(trade);
});

// 	const ownershipTransferred: OwnershipTransferred[] = [];
// 	const trade: Trade[] = [];

// 	for (const c of ctx.blocks) {
// 		for (const e of c.logs) {
// 			e.address === Contract
// 				? e.topics[0] === FriendtechAbi.events["OwnershipTransferred"].topic
// 					? ownershipTransferred.push(
// 							new OwnershipTransferred({
// 								id: concatID(e.transactionHash, e.logIndex),
// 								previousOwner: decodeHex(
// 									FriendtechAbi.events["OwnershipTransferred"].decode(e)
// 										.previousOwner
// 								),
// 								newOwner: decodeHex(
// 									FriendtechAbi.events["OwnershipTransferred"].decode(e)
// 										.newOwner
// 								),
// 								blockNumber: BigInt(e.block?.height),
// 								blockTimestamp: BigInt(e.block?.timestamp),
// 								transactionHash: decodeHex(e.transactionHash),
// 							})
// 					  )
// 					: e.topics[0] === FriendtechAbi.events["Trade"].topic
// 					? trade.push(
// 							new Trade({
// 								id: concatID(e.transactionHash, e.logIndex),
// 								blockNumber: BigInt(e?.block?.height),
// 								blockTimestamp: BigInt(e?.block?.timestamp),
// 								ethAmount: FriendtechAbi.events["Trade"].decode(e).ethAmount,
// 								isBuy: FriendtechAbi.events["Trade"].decode(e).isBuy,
// 								protocolEthAmount: FriendtechAbi.events["Trade"].decode(e)
// 									.protocolEthAmount,
// 								shareAmount: FriendtechAbi.events["Trade"].decode(e)
// 									.shareAmount,
// 								subject: decodeHex(
// 									FriendtechAbi.events["Trade"].decode(e).subject
// 								),
// 								subjectEthAmount: FriendtechAbi.events["Trade"].decode(e)
// 									.subjectEthAmount,
// 								supply: FriendtechAbi.events["Trade"].decode(e).supply,
// 								trader: decodeHex(
// 									FriendtechAbi.events["Trade"].decode(e).trader
// 								),
// 								transactionHash: decodeHex(e.transactionHash),
// 							})
// 					  )
// 					: null
// 				: null;
// 		}
// 	}

// 	await ctx.store.upsert(ownershipTransferred);
// 	await ctx.store.upsert(trade);
// });
