var mysql = require("mysql");
const util = require( 'util' );

exports.connectDB = function () {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "running",
  });

  connection.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success!");
    }
  });

  connection.on("error", function onError(err) {
    console.log("db error", err);
  });

  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
};
