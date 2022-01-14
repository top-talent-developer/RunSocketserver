const cron = require('node-cron');
const { providers, tokenContract, presaleContract, storeContract, supportChainId } = require('../contracts');
const controller = require("../controllers/mycontrollers").controller;
const { rate } = require("../constants");
const { ethers } = require("ethers")

const updatePool = async () => {
    var poolBalance = ethers.utils.formatUnits(await tokenContract.balanceOf(storeContract.address), 18);
    if (poolBalance > 1000) {
        var tx = await storeContract.swapToETH();
        await tx.wait();
        console.log("updatePool", tx.hash);
    }
}

const withdrawRequests = async () => {
    const handleReward = async () => {
        try {
            await updatePool();

            var poolBalance = await providers[supportChainId].getBalance(storeContract.address);
            if (Number(poolBalance) == 0) throw new Error("poolBalance is 0!")
            // top 10 player's data
            var userDatas = await controller.getScores();
            userDatas = userDatas.slice(0, 10);

            var _tos = [], _amounts = [], i = 0;
            var _userAmounts = [], _zeroAmounts = [];
            for (var userData of userDatas) {
                _tos.push(userData.address);
                _amounts.push(poolBalance.mul(rate[i++]).div(1000));

                _userAmounts.push(userData.coin);
                _zeroAmounts.push(0);
            }

            if (_tos.length == 0 || userDatas[0].coin == 0) {
                console.log("no reward data", _tos, userDatas[0].nickname, userDatas[0].coin);
                throw new Error("no rewardable players!");
            }
            await controller.updateScores({
                userDatas,
                amounts: _zeroAmounts
            });

            var tx = await storeContract.rewards(_tos, _amounts)
                .catch(async (err) => {
                    console.log("store Contract error :", err, _amounts, _userAmounts);
                    await controller.updateScores({
                        userDatas,
                        amounts: _userAmounts
                    });
                });

            if (tx) {
                await tx.wait();
                console.log(tx.hash);

                await controller.addHistory({
                    userDatas,
                    amounts: _amounts,
                    txHash: tx.hash
                });
            }
        } catch (err) {
            console.log("reward request error", err.message);
        }
    }

    const startHandling = () => {
        cron.schedule('*/10 * * * * *', () => {
            console.log("running a reward request every 10 second");
            handleReward();
        });
    }

    startHandling();
}
module.exports = { withdrawRequests };