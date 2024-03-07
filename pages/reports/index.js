const express = require("express");
const { ledgerList, outstandingByCustomer , vehicle_ExpiryDate_List } = require("./ledgerReport");
const router = express.Router();

const {view_daily_Report} = require("./misReport")


//Router Routes

router.post("/ledgerReport/list",ledgerList)
router.post("/outstandingByCustomer/list",outstandingByCustomer)


//expiry date api

router.post("/expiryDate/list",vehicle_ExpiryDate_List)


//Daily report api

router.post("/dailyReportList/list",view_daily_Report)






module.exports = router