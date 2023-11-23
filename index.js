let express = require('express');
let cors = require("cors");
// create the express object
let exp = express();
exp.use(cors())
exp.use(express.static('web'))
let web = exp.listen(3000, function() {
  console.log("Running")
})