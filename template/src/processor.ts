import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";

import * as FriendtechAbi from "./abi/FriendtechSaresV1";

export const Contract = "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4".toLowerCase();

export const processor = new EvmBatchProcessor()
	.setDataSource({
		archive: lookupArchive("base-mainnet"),
		chain: "https://rpc.ankr.com/base",
	})
	.setFinalityConfirmation(10)
	.setBlockRange({
		from: 2430439,
	})
	.setFields({
		log: {
			data: true,
			topics: true,
			transactionHash: true,
		},
	})
	.addLog({
		address: [Contract],
		topic0: [
			FriendtechAbi.events["OwnershipTransferred"].topic,
			FriendtechAbi.events["Trade"].topic,
		],
	});
