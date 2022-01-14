"use strict";
const { ethers } = require("ethers");
const controller = {};
let users = [];

let amountPerRound = 400;
let amountpergold = 100;

const checkUesr = (socketId) => {
    return users.find(user => user.socketId == socketId);
}

controller.socketLogin = async (data, socketId) => {
    const { signature } = data;
    const loginMsg = "welcome to run dog game!";
    const address = await ethers.utils.verifyMessage(loginMsg, signature);

    const db = global.db;
    var result = await db.query(
        "SELECT * FROM users WHERE address = '" + address + "'"
    );

    if (result.length != 0) {
        var newUser = result[0];
        newUser.socketId = socketId;
        users.push(newUser);
        return {
            success: 1,
            user: result[0]
        };
    } else return {
        success: 2
    };

};

controller.socketRegister = async (data, socketId) => {
    const { signature, nickname } = data;
    const loginMsg = "welcome to run dog game!";
    const address = await ethers.utils.verifyMessage(loginMsg, signature);

    const db = global.db;
    var result = await db.query(
        "SELECT * FROM users WHERE address = '" + address + "'"
    );

    console.log(result)
    if (result.length == 0) {
        await db.query(
            "INSERT INTO users (address,nickname) VALUES ('" + address + "','" + nickname + "')"
        );

        var result = await db.query(
            "SELECT * FROM users WHERE address = '" + address + "'"
        );

        console.log("new user register", address, nickname);
        var newUser = result[0];
        newUser.socketId = socketId;
        users.push(newUser);
        return {
            success: 1,
            user: result[0]
        };
    } else {
        console.log("user login", address, nickname);
        var newUser = result[0];
        newUser.socketId = socketId;
        users.push(newUser);
        return {
            success: 1,
            user: result[0],
        };
    }

};

controller.disconnect = (_socketId) => {
    users = users.filter((user) => user.socketId != _socketId);
};

controller.startGame = async (data, socketId) => {
    console.log("start game");
    var user = checkUesr(socketId);
    if (!user) throw new Error("Invalid request");
    if (user.balance < amountPerRound) throw new Error("Insufficient balance");

    user.balance -= amountPerRound;
    try {
        const db = global.db;
        await db.query(
            "UPDATE users SET balance = '" +
            user.balance +
            "' WHERE address = '" +
            user.address +
            "'"
        );
    } catch (err) {
        user.balance += amountPerRound;
        throw new Error("database error")
    }
    return user;
};

controller.collectCoin = async (data, socketId) => {
    var user = checkUesr(socketId);
    if (!user) throw new Error("Invalid request");

    user.coin += 1;
    const db = global.db;
    await db.query(
        "UPDATE users SET coin = '" +
        user.coin +
        "' WHERE address = '" +
        user.address +
        "'"
    );
    return user;
};

controller.collectGold = async (data, socketId) => {
    var user = checkUesr(socketId);
    if (!user) throw new Error("Invalid request");

    user.balance += amountpergold;
    const db = global.db;
    await db.query(
        "UPDATE users SET balance = '" +
        user.balance +
        "' WHERE address = '" +
        user.address +
        "'"
    );
    return user;
};

controller.updateNickname = async (data, socketId) => {
    const { nickname } = data;
    var user = checkUesr(socketId);
    if (!user) throw new Error("Invalid request");

    user.nickname = nickname;
    const db = global.db;
    await db.query(
        "UPDATE users SET nickname = '" +
        user.nickname +
        "' WHERE address = '" +
        user.address +
        "'"
    );
    return user;
};

controller.emit = (socket) => {
    socket.emit("userslist", { users });
};

// reward
controller.getScores = async () => {
    const db = global.db;
    var result = await db.query(
        "SELECT nickname,coin,address FROM users ORDER BY coin DESC"
    );
    if (result.length == 0) throw new Error("Invalid user");

    return result;
};

controller.updateScores = async (data) => {
    var { userDatas, amounts } = data;
    const db = global.db;
    for (var i = 0; i < userDatas.length; i++) {
        await db.query(
            "UPDATE users SET coin = '" +
            amounts[i] +
            "' WHERE address = '" +
            userDatas[i].address +
            "'"
        );
    }
}

controller.addHistory = async (data) => {
    var { userDatas, amounts, txHash } = data;
    const db = global.db;
    for (var i = 0; i < userDatas.length; i++) {
        await db.query(
            "INSERT INTO transactions (user,amount,txhash) VALUES ('"
            + userDatas[i].nickname + "','" + amounts[i] + "','" + txHash + "')"
        );
    }
}

controller.getHistories = async () =>{
    const db = global.db;
    var results = await db.query(
        "SELECT * FROM transactions"
    );

    return results;
}

// blockchain controllers
controller.updateBalance = async (data) => {
    const { address, amount } = data;

    const db = global.db;
    var result = await db.query(
        "SELECT * FROM users WHERE address = '" + address + "'"
    );
    if (result.length == 0) throw new Error("Invalid user");

    await db.query(
        "UPDATE users SET balance = '" +
        (result[0].balance + Number(amount)) +
        "' WHERE address = '" +
        result[0].address +
        "'"
    );

    var user = users.find(user => (user.address).toUpperCase() == address.toUpperCase());
    if (user) user.balance += Number(amount);

    return user;
};

controller.UpdateblockNumber = async (data) => {
    const { blockNumber } = data;

    const db = global.db;
    await db.query(
        "UPDATE blocknumber SET blockNumber = '" +
        blockNumber +
        "'"
    );
}

controller.FindblockNumber = async (data) => {
    const { blockNumber } = data;

    const db = global.db;
    var result = await db.query(
        "SELECT * FROM blocknumber "
    );

    console.log("SELECT * FROM blocknumber", result);

    if (result.length == 0) {
        var result = await db.query(
            "INSERT INTO blocknumber (blockNumber) VALUES ('" + blockNumber + "')"
        );
        console.log("INSERT INTO blocknumber", blockNumber);
        return blockNumber;
    }
    else return result[0].blockNumber
}

module.exports = {
    controller: controller,
    users: users,
};