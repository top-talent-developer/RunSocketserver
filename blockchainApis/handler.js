
const cron = require('node-cron');
const {
	providers, tokenContract, presaleContract, storeContract, supportChainId
} = require('../contracts');

const controller = require("../controllers/mycontrollers").controller;
const {ethers} = require("ethers");

const handleDeposits = () => {
	var chainId = supportChainId;
	var provider = providers[chainId];
	var latestblocknumber;

	const handletransactions = async () => {

		try {
			let blockNumber = await provider.getBlockNumber();
			console.log("fantomtenstnet : ", blockNumber, latestblocknumber);
			if (blockNumber > latestblocknumber) {
				var res = await storeContract.queryFilter("Deposit", latestblocknumber + 1, blockNumber);

				for (var index in res) {
					var tx = res[index];
					let account = tx.args.from;
					let amount = Number(ethers.utils.formatUnits(tx.args.amount,18)).toFixed(0);
					let hash = tx.transactionHash;
					let blockNumber = tx.blockNumber;
					console.log(`Deposit require from ${account} amount ${amount} with hash ${hash} in block ${blockNumber}`);

					/*---------------- update userBalance ---------------*/
					try {
						await controller.updateBalance({ address: account, amount: amount });
					} catch (err) {
						console.log(err.message ? err.message : "update user balance failed");
					}
				}
			}
			latestblocknumber = blockNumber;

			await controller.UpdateblockNumber({
				blockNumber: blockNumber
			});
		} catch (err) {
			console.log("err", err)
		}
	}

	const handleDeposits = async () => {
		var blockNumber = await provider.getBlockNumber();
		try {
			blockNumber = await controller.FindblockNumber({ blockNumber: blockNumber });
		} catch (err) {
			console.log(err);
		}
		console.log(blockNumber);
		latestblocknumber = blockNumber;
		cron.schedule('*/15 * * * * *', () => {
			console.log("running a transaction handle every 15 second");
			handletransactions()
		});
	}

	handleDeposits();
}

module.exports = { handleDeposits };