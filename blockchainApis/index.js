const { handleDeposits } = require("./handler");
const { withdrawRequests } = require("./requests");

const blockchainHandle = async () => {
    handleDeposits();
    // handleStake();
    // withdrawRequests();
    // syncPoolCache();
}
module.exports = blockchainHandle;