const router = require("express").Router();
const moment = require("moment-timezone");

const { Oil } = require("../../modals/Oil");
const { vehicle, customer, breakDown } = require("../../modals/Master");
const {
  journal,
  receipt_payment,
  ledger_account,
} = require("../../modals/MasterAccounts");
const { salesCumDispatch } = require("../../modals/Sales_cum_dispatch");
const { Loading } = require("../../modals/Loading");

const dashboard_vehicle = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  let vehicleData = await vehicle.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
      },
    },

    {
      $sort: {
        vehicle_no: 1,
      },
    },
  ]);

  if (vehicleData) {
    return res.status(200).json(vehicleData);
  } else {
    return res.status(200).json([]);
  }
};

const dashboard_tracking = async (req, res) => {
  let condition = {};

  const inTransit = req.body.inTransit;
  const vehicle_id = req.body.vehicle_id;

  console.log(vehicle_id, "ddd");

  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }
  //inTransit
  if (inTransit === false) {
    condition = { ...condition, inTransit: inTransit };
  }

  //   const advance_status = req.body.advance_status;

  const details = await vehicle.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        inTransit: 1,
        vehicle_id: 1,
        vehicle_no: 1,
      },
    },

    {
      $lookup: {
        from: "t_000_oils",
        let: { vehicle_id: "$vehicle_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
          },
          {
            $project: {
              oil_id: 1,
              trip_no: { $ifNull: ["$trip_no", 0] },
              advance_status: 1,
              transaction_no: 1,
            },
          },
        ],
        as: "oil_details",
      },
    },
    { $addFields: { oil_Status: { $first: "$oil_details.advance_status" } } },
    {
      $addFields: { transaction_no: { $first: "$oil_details.transaction_no" } },
    },
    { $addFields: { trip_no: { $first: "$oil_details.trip_no" } } },

    {
      $unset: "oil_details",
    },
    {
      $lookup: {
        from: "t_100_advances",
        let: { vehicle_id: "$vehicle_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
          },
          {
            $project: {
              advance_id: 1,
              loading_status: 1,
              transaction_no: 1,
            },
          },
        ],
        as: "advance_details",
      },
    },
    {
      $addFields: {
        Advance_Status: { $first: "$advance_details.loading_status" },
      },
    },
    {
      $addFields: {
        transaction_no: { $first: "$advance_details.transaction_no" },
      },
    },

    {
      $unset: "advance_details",
    },

    {
      $lookup: {
        from: "t_000_loadings",
        let: { vehicle_id: "$vehicle_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
          },
          {
            $project: {
              loading_id: 1,
              dispatch_status: 1,
              transaction_no: 1,
            },
          },
        ],
        as: "loading_details",
      },
    },

    {
      $addFields: {
        loading_Status: { $first: "$loading_details.dispatch_status" },
      },
    },
    {
      $addFields: {
        transaction_no: { $first: "$loading_details.transaction_no" },
      },
    },

    {
      $unset: "loading_details",
    },
    {
      $lookup: {
        from: "t_001_sales_cum_dispatches",
        let: { vehicle_id: "$vehicle_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
          },
          {
            $project: {
              salse_dispatch_id: 1,
              tracking_status: 1,
              transaction_no: 1,
            },
          },
        ],
        as: "Sales_cum_dispatches_details",
      },
    },
    {
      $addFields: {
        Sales_cum_dispatches_Status: {
          $first: "$Sales_cum_dispatches_details.tracking_status",
        },
      },
    },
    {
      $addFields: {
        transaction_no: {
          $first: "$Sales_cum_dispatches_details.transaction_no",
        },
      },
    },

    {
      $unset: "Sales_cum_dispatches_details",
    },
    {
      $lookup: {
        from: "t_000_trackings",
        let: { vehicle_id: "$vehicle_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
          },
          {
            $project: {
              tracking_id: 1,
              // tracking_status: 1,
              transaction_no: 1,
            },
          },
        ],
        as: "tracking_details",
      },
    },
    {
      $addFields: {
        transaction_no: { $first: "$tracking_details.transaction_no" },
      },
    },
    {
      $unset: "tracking_details",
    },
  ]);

  if (details) {
    return res.status(200).json(details);
  } else {
    return res.status(200).json([]);
  }
};

const salesOrderBetweenDates = async (from, to) => {
  let results = {};

  results.data = await journal.aggregate([
    {
      $match: {
        $and: [
          { transaction_type: "Sales/Dispatch" },
          { voucher_date: { $gte: from / 1000 } },
          { voucher_date: { $lte: to / 1000 } },
        ],
      },
    },
  ]);

  results.totalSales = results.data.reduce(
    (sum, salesRecord) => sum + salesRecord.voucher_amount,
    0
  );
  //console.log("sen27062=>",results)

  return results;
};

//outstanding

const outstanding = async (from, to, mode, type) => {
  let condi = { deleted_by_id: 0 };
  // if (mode) {
  //   if (mode === "Cash") {
  //     condi = { ...condi, bank_id: 2 };
  //   } else {
  //     condi = { ...condi, bank_id: { $ne: 2 } };
  //   }
  // }
  if (from && to) {
    // { $lte: ["$invoice_date", txt_from_date] }
    condi = {
      ...condi,
      voucher_date: {
        $gte: from / 1000,
        $lte: to / 1000,
      },
    };
  }

  let total_outstanding = await receipt_payment.aggregate([
    {
      $match: condi,
    },
    {
      $project: {
        _id: 0,
        mode: 1,
        receipt_payment_type: 1,
        // amount:1,

        Rec_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "R"] },
            then: "$amount",
            else: 0,
          },
        },
        payment_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "P"] },
            then: "$amount",
            else: 0,
          },
        },
      },
    },

    {
      $group: {
        _id: "$mode",
        Rec_amount_total: { $sum: "$Rec_amount" },
        payment_amount_total: { $sum: "$payment_amount" },

        // $subtract: [ "$Rec_amount", "$payment_amount" ]
        // bad_amount: { $sum: "$bad_amount" },
      },
    },
  ]);

  return total_outstanding;
};

const receiptsOn = async (from, to, mode, type, bad_type) => {
  let condi = { deleted_by_id: 0 };
  if (mode) {
    if (mode === "Cash") {
      condi = { ...condi, bank_id: 2 };
    } else {
      condi = { ...condi, bank_id: { $ne: 2 } };
    }
  }
  if (from && to) {
    // { $lte: ["$invoice_date", txt_from_date] }
    condi = {
      ...condi,
      voucher_date: {
        $gte: from / 1000,
        $lte: to / 1000,
      },
    };
  }

  let total_cash = await receipt_payment.aggregate([
    {
      $match: condi,
    },
    {
      $project: {
        _id: 0,
        mode: 1,
        receipt_payment_type: 1,
        amount: 1,

        // amount: {
        //   $cond: {
        //     if: { $eq: ["$receipt_payment_type", type] },
        //     then: "$amount",
        //     else: 0,
        //   },
        // },
        // bad_amount:{
        //   $cond:{
        //     if: {$eq:["$receipt_payment_type",bad_type]},
        //     then:"$amount",
        //     else:0,
        //   }
        // }
      },
    },

    {
      $group: {
        _id: "$mode",
        total_amount: { $sum: "$amount" },
        // bad_amount: { $sum: "$bad_amount" },
      },
    },
  ]);

  return total_cash;
};

const dashboardStatsReport = async (req, res) => {
  const data = req.body;
  let date = Number(data?.date) > 0 ? Number(data.date) : Date.now();

  let startOfDayTimeStamp = moment().startOf("day").toDate().getTime();
  let endOfDayTimeStamp = moment().endOf("day").toDate().getTime();
  let returnObj = { date, data: {} };

  let sales_order_results = await salesOrderBetweenDates(
    startOfDayTimeStamp,
    endOfDayTimeStamp
  );

  returnObj.data.saleToday = {
    data: sales_order_results.totalSales,

    startOfDayTimeStamp,
    endOfDayTimeStamp,
    //realData: sales_order_results,
    visible: true,
  };

  let startOfWeek =
    moment().startOf("week").toDate().getTime() - 7 * 24 * 3600 * 1000;
  let endOfWeek = moment().toDate().getTime();

  let sales_order_results_weekly = await salesOrderBetweenDates(
    startOfWeek,
    endOfWeek
  );

  returnObj.data.saleWeekly = {
    data: sales_order_results_weekly.totalSales,
    startOfWeek,
    endOfWeek,
    visible: true,
  };

  returnObj.data.weeklyDayByDayResults = [];

  for (
    let startOfWeekday = startOfWeek;
    startOfWeekday < endOfWeek;
    startOfWeekday += 24 * 3600000
  ) {
    let endOfWeekDay = startOfWeekday + 24 * 3600000 - 1;
    let weekDayResults = await salesOrderBetweenDates(
      startOfWeekday,
      endOfWeekDay
    );
    returnObj.data.weeklyDayByDayResults.push({
      startOfWeekday,
      endOfWeekDay,
      data: weekDayResults.totalSales,
    });
  }

  let startOfMonth = moment()
    .subtract("months")
    .startOf("month")
    .toDate()
    .getTime();
  let endOfMonth = moment();
  moment().toDate().getTime();

  //console.log(startOfMonth,"monthfrom")
  //console.log( endOfMonth,"monthTo")

  let sales_order_results_monthly = await salesOrderBetweenDates(
    startOfMonth,
    endOfMonth
  );

  returnObj.data.saleMonthly = {
    data: sales_order_results_monthly.totalSales,
    startOfMonth,
    endOfMonth,
    visible: true,
  };

  let quarterAdjustment = (moment().month() % 3) + 1;
  let endOfQuarterMoment = moment()
    .subtract({ months: quarterAdjustment })
    .endOf("month");
  // let endOfQuarter = endOfQuarterMoment.toDate().getTime();

  let endOfQuarter = moment().startOf("day").toDate().getTime();
  let startOfQuarter = endOfQuarterMoment
    .clone()
    .subtract({ months: 0 })
    .startOf("month")
    .toDate()
    .getTime();

  let sales_order_results_quarter = await salesOrderBetweenDates(
    startOfQuarter,
    endOfQuarter
  );

  returnObj.data.saleQuarterly = {
    data: sales_order_results_quarter.totalSales,
    startOfQuarter,
    endOfQuarter,
    visible: true,
  };

  let startOfYear = moment(startOfDayTimeStamp)
    .subtract(1, "years")
    .toDate()
    .getTime();
  let endOfYear = endOfDayTimeStamp;

  let sales_order_results_year = await salesOrderBetweenDates(
    startOfYear,
    endOfYear
  );

  returnObj.data.saleYearly = {
    data: sales_order_results_year.totalSales,
    startOfYear,
    endOfYear,
    visible: true,
  };

  //TODO: to use the sumation of sales value today instead of count. The same logic can be used for week, month, quarter and year

  let visitors_today_results = await salesCumDispatch.find({
    enquiry_details: {
      $elemMatch: {
        enquiry_date: {
          $lte: endOfDayTimeStamp / 1000,
          $gte: startOfDayTimeStamp / 1000,
        },

        // source_id: { $in: [0, 8] }, //TODO Hard coded, else some query needs to be made for the source id walk in
      },
    },
  });

  returnObj.data.visitorsToday = {
    data: visitors_today_results.length,
    //realData: visitors_today_results,
    visible: true,
  };

  //TODO let totalEarningResult = sales.aggregate();
  let cashCollectionInfo = await receiptsOn(
    startOfQuarter,
    endOfQuarter
    // startOfDayTimeStamp,
    // endOfDayTimeStamp,
    // "Cash",
    // "R",
    // "BR"
  );
  // console.log(cashCollectionInfo.total_amount,"sankchekcash")
  returnObj.data.totalCollectionCash = {
    startOfDayTimeStamp,
    endOfDayTimeStamp,
    data: cashCollectionInfo[0]?.total_amount,

    visible: true,
  };

  // let pendingOrdersResult = await sales.find({
  //   $and: [
  //     {"delivery_order_no":{$exists:true, $gt:[]}},
  //     {"dispatch_order_no":{$exists:false, $eq:[]}},
  //     // {"$dispatch_order_no.length<1" },
  //   ],
  // });
  // console.log(pendingOrdersResult.length,"por")

  // returnObj.data.pendingOrders = {
  //   data: pendingOrdersResult.length,
  //   visible: true,
  // };

  let pendingOrdersResult = await salesCumDispatch.aggregate([
    {
      $match: {
        sales_status: "24",
      },
    },
    {
      $count: "total_sales",
    },
  ]);

  returnObj.data.pendingOrders = {
    data: pendingOrdersResult[0]?.total_sales,
    visible: true,
  };

  //TODO: fix
  let bankCollectionInfo = await receiptsOn(
    startOfDayTimeStamp,
    endOfDayTimeStamp,
    "Bank",
    "R",
    "BR"
  );
  returnObj.data.totalCollectionBank = {
    data: bankCollectionInfo,
    startOfDayTimeStamp,
    endOfDayTimeStamp,
  };

  //outstanding

  let outstandingInfo = await outstanding(
    startOfYear,
    endOfYear,
    // startOfQuarter,
    // endOfQuarter
    // startOfDayTimeStamp,
    // endOfDayTimeStamp,
    "P",
    "R"
    // "BR"
  );

  returnObj.data.outstandingInfo = {
    startOfYear,
    endOfYear,
    // startOfDayTimeStamp,
    // endOfDayTimeStamp,
    data:
      outstandingInfo[0]?.Rec_amount_total -
      outstandingInfo[0]?.payment_amount_total,

    visible: true,
  };

  return res.status(200).json(returnObj);
};

const dashBoardReport = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");

  console.log(fromDate, toDate);
  const data = await salesCumDispatch.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$sales_date", Number(fromDate)] },
            { $lte: ["$sales_date", Number(toDate)] },
          ],
        },
      },
    },
    {
      $project: {
        total_amount: 1,
        mode: "TotalAmount",
      },
    },
    {
      $group: {
        _id: "$mode",
        totalAmount: { $sum: "$total_amount" },
      },
    },
  ]);

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardReportSalesTotal = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");
  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  // console.log(fromDate, toDate);
  const data = await salesCumDispatch.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$sales_date", Number(yearFromDate)] },
            { $lte: ["$sales_date", Number(yearToDate)] },
          ],
        },
      },
    },
    {
      $project: {
        total_amount: 1,
        mode: "TotalAmount",
      },
    },
    {
      $group: {
        _id: "$mode",
        totalAmount: { $sum: "$total_amount" },
      },
    },
  ]);

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(200).json([]);
  }
};

const dashboardStatsReportTotalCash = async (req, res) => {
  const data = req.body;
  let date = Number(data?.date) > 0 ? Number(data.date) : Date.now();
  let quarterAdjustment = (moment().month() % 3) + 1;

  let endOfQuarterMoment = moment()
    .subtract({ months: quarterAdjustment })
    .endOf("month");
  let startOfDayTimeStamp = moment(
    moment(moment().startOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();
  let endOfDayTimeStamp = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();
  let endOfQuarter = moment().startOf("day").toDate().getTime();
  let startOfQuarter = endOfQuarterMoment
    .clone()
    .subtract({ months: 0 })
    .startOf("month")
    .toDate()
    .getTime();

    const yearFromDate = moment(
      moment(moment().quarter(-4).startOf("day").format("YYYY-MM-DD")).format(
        "x"
      ),
      "x"
    ).unix();
    const yearToDate = moment(
      moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
      "x"
    ).unix();

  // const yearFromDate = moment(moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format("x"), "x").unix()
  // const yearToDate = moment(moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"), "x").unix()

  let returnObj = { date, data: {} };

  let cashCollectionInfo = await receiptsOn(
    yearFromDate,
    yearToDate
    // startOfQuarter,
    // endOfQuarter
    // startOfDayTimeStamp,
    // endOfDayTimeStamp,
    // "Cash",
    // "R",
    // "BR"
  );
  console.log(cashCollectionInfo[0]?.total_amount, "sankchekcash");
  returnObj.data.totalCollectionCash = {
    yearFromDate,
    yearToDate,
    data: cashCollectionInfo[0]?.total_amount,

    visible: true,
  };

  return res.status(200).json(returnObj);
};

const dashboardStatsReportBank = async (req, res) => {
  const data = req.body;
  let date = Number(data?.date) > 0 ? Number(data.date) : Date.now();

  let startOfDayTimeStamp = moment(
    moment(moment().startOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();
  let endOfDayTimeStamp = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();
  let returnObj = { date, data: {} };

  let bankCollectionInfo = await receiptsOn(
    startOfDayTimeStamp,
    endOfDayTimeStamp,
    "Bank",
    "R",
    "BR"
  );
  returnObj.data.totalCollectionBank = {
    data: bankCollectionInfo,
    startOfDayTimeStamp,
    endOfDayTimeStamp,
  };

  return res.status(200).json(returnObj);
};

//OutStanding reports
const total_out_standing_report = async (req, res) => {
  let condi = { deleted_by_id: 0 };
  let condition = {};

  const group_id = req.body.group_id;
  const reference_id = req.body.reference_id;
  const customer_id = req.body.customer_id;
  // const txt_to_date = req.body.txt_to_date;
  // const txt_from_date = req.body.txt_from_date;

  if (group_id) {
    condition = { ...condition, group_id: group_id };
  }

  if (customer_id) {
    condition = { ...condition, customer_id: customer_id };
  }

  let outStandingData = await customer.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        customer_id: 1,
        company_name: 1,
      },
    },
    //LOOKUP 1 IN SALES COLLECTION ////////////////////////////////////////////////////////////////////////////////
    {
      $lookup: {
        from: "t_001_sales_cum_dispatches",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$customer_id", "$customer_id"] },
                  // { $lte: ["$sales_date", txt_to_date] },
                  // { $gte: ["$sales_date", txt_from_date] },
                ],
              },
            },
          },

          {
            $project: {
              customer_id: 1,
              transaction_no: 1,
              total_amount: 1,
            },
          },
          {
            $group: {
              _id: "$customer_id",
              sumSalesAmount: { $sum: "$total_amount" },
            },
          },
        ],
        as: "salesCumDispatchDetails",
      },
    },
    {
      $unwind: {
        path: "$salesCumDispatchDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        sumSalesAmount: {
          $toDouble: "$salesCumDispatchDetails.sumSalesAmount",
        },
      },
    },
    { $unset: ["salesCumDispatchDetails"] },

    // { $addFields: {
    //    transaction_no: { $first: "$salesCumDispatchDetails.transaction_no"}
    //   }
    //  },

    // {
    //   $lookup: {
    //     from: "t_001_sales_cum_dispatches",
    //     let: { "transaction_no": "$transaction_no" },
    //     pipeline: [

    //       {
    //         $match: {
    //           $expr: {
    //             $eq: ["$$transaction_no", "$transaction_no"],
    //           },
    //         }
    //       },
    //       { $project: { "total_amount": 1, } }
    //     ],
    //     as: "sales_cum_dispatches1"
    //   }
    // },
    // {
    //   $unwind:
    //   {
    //     path: "$sales_cum_dispatches1",
    //     preserveNullAndEmptyArrays: true
    //   }
    // },
    // { $addFields: { sumSalesValue: {$toDouble:"$sales_cum_dispatches1.total_amount"} } },
    // { $unset: ["sales_cum_dispatches1"] },

    /////////////////////////////////////////
    //ACCOUNTS PART BEGINS HERE
    /////////////////////////////////////////
    {
      $lookup: {
        from: "t_200_ledger_accounts",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$type_id", "$$customer_id"] },
                  { $eq: ["$type", "C"] },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              ledger_account_id: 1,
              ledger_account: 1,
              opening_balance: 1,
              dr_cr_status: 1,
            },
          },
        ],
        as: "ledger_account_details",
      },
    },
    {
      $unwind: {
        path: "$ledger_account_details",
        // preserveNullAndEmptyArrays: true
      },
    },
    // /////////////////////////////////////////////////////////////////
    {
      $addFields: {
        ledger_acc_id: "$ledger_account_details.ledger_account_id",
      },
    },
    {
      $addFields: {
        opening_balance: "$ledger_account_details.opening_balance",
      },
    },
    { $addFields: { dr_cr_status: "$ledger_account_details.dr_cr_status" } },
    {
      $lookup: {
        from: "t_200_journals",
        let: { ledger_account_id: "$ledger_acc_id" },
        pipeline: [
          { $unwind: "$journal_details" },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$$ledger_account_id",
                      "$journal_details.ledger_account_id",
                    ],
                  },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              ledger_account_id: 1,
              journal_id: 1,
              journal_details: 1,
              voucher_date: 1,
              voucher_amount: 1,
            },
          },
          {
            $group: {
              _id: "$journal_details.ledger_account_id",
            },
          },
        ],
        as: "journals",
      },
    },
    {
      $lookup: {
        from: "t_200_receipt_payments",
        let: { ledger_account_id: "$ledger_acc_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$ledger_account_id", "$ledger_account_id"],
              },
            },
          },

          {
            $match: {
              deleted_by_id: 0,
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ["$$ledger_account_id", "$ledger_account_id"] },
                      { $eq: ["$$ledger_account_id", "$bank_id"] },
                    ],
                  },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },

          {
            $project: {
              _id: 0,
              //ledger_account_id: 1,
              // $bank_id:1
              ledger_account_id: {
                $cond: {
                  if: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },

                  then: "$ledger_account_id",
                  else: "$bank_id",
                },
              },
              receipt_payment_id: 1,
              receipt_payment_type: 1,
              voucher_date: 1,
              amount: 1,
            },
          },
          {
            $group: {
              _id: "$ledger_account_id",
              amount: { $sum: "$amount" },
            },
          },
        ],
        as: "receipt_payments",
      },
    },

    {
      $unwind: {
        path: "$journals",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$receipt_payments",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        receipt_paymentAmount: { $toDouble: "$receipt_payments.amount" },
      },
    },
    { $unset: ["receipt_payments"] },

    { $addFields: { check: "report" } },

    {
      $group: {
        _id: "$check",
        sumReceiptValue: { $sum: "$receipt_paymentAmount" },
        sumSalesValue: { $sum: "$sumSalesAmount" },
      },
    },
    {
      $addFields: {
        outstanding: {
          $subtract: ["$sumSalesValue", "$sumReceiptValue"],
        },
      },
    },
  ]);

  // console.log("HKHK", outStandingData);
  if (outStandingData) {
    return res.status(200).json(outStandingData);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardLoading = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");
  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  // console.log(fromDate, toDate);
  const data = await Loading.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$challan_date", Number(fromDate)] },
            { $lte: ["$challan_date", Number(toDate)] },
          ],
        },
      },
    },
    {
      $project: {
        loading_order_No: 1,
      },
    },
    {
      $group: {
        _id: "$loading_order_No",
        tripCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalTripCount: { $sum: "$tripCount" },
        // loadingOrders: { $push: { loading_order_No: "$_id", tripCount: "$tripCount" } },
      },
    },
  ]);

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(200).json([]);
  }
};

//totalLoading

const dashBoardLoadingTotal = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");
  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  // console.log(fromDate, toDate);
  const data = await Loading.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$challan_date", Number(yearFromDate)] },
            { $lte: ["$challan_date", Number(yearToDate)] },
          ],
        },
      },
    },
    {
      $project: {
        loading_order_No: 1,
      },
    },
    {
      $group: {
        _id: "$loading_order_No",
        tripCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalTripCount: { $sum: "$tripCount" },
        // loadingOrders: { $push: { loading_order_No: "$_id", tripCount: "$tripCount" } },
      },
    },
  ]);

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(200).json([]);
  }
};

// const dashBoardUnloading = async (req, res) => {
//   let condition = {};

//   const vehicle_id = req.body.vehicle_id;

//   if (vehicle_id) {
//     condition = { ...condition, vehicle_id: vehicle_id };
//   }

//   // console.log(fromDate, toDate);
//   const data = await vehicle.aggregate([
//     {
//       $match: condition,
//     },
//     {
//       $project: {
//         vehicle_id: 1,
//         vehicle_no: 1,
//       },
//     },
//     {
//       $lookup: {
//         from: "t_000_trackings",
//         let: { vehicle_id: "$vehicle_id" },
//         pipeline: [
//           {
//             $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
//           },
//           {
//             $project: {
//               tracking_id: 1,
//               transaction_no: 1,
//             },
//           },
//         ],
//         as: "tracking_details",
//       },
//     },
//     {
//       $addFields: {
//         transaction_no: { $first: "$tracking_details.transaction_no" },
//       },
//     },
//     {
//       $unset: "tracking_details",
//     },
//     {
//       $addFields: {
//         incomplete_transactions: {
//           $filter: {
//             input: "$tracking_details",
//             as: "tracking",
//             cond: {
//               $ne: ["$$tracking.tracking_status", "complete"],
//             },
//           },
//         },
//       },
//     },

//     {
//       $group: {
//         _id: "$incomplete_transactions",
//         tripCount: { $sum: 1 },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalTripCount: { $sum: "$tripCount" },
//         // loadingOrders: { $push: { loading_order_No: "$_id", tripCount: "$tripCount" } },
//       },
//     },
//   ]);

//   if (data) {
//     return res.status(200).json(data);
//   } else {
//     return res.status(200).json([]);
//   }
// };

const dashBoardUnloading = async (req, res) => {
  let condition = {};

  const vehicle_id = req.body.vehicle_id;

  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }

  // console.log(fromDate, toDate);
  const data = await Loading.aggregate([
    {
      $match: { dispatch_status: false },
    },
    {
      $project: {
        transaction_no: 1,
      },
    },

    {
      $group: {
        _id: "$transaction_no",
        tripCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalTripCount: { $sum: "$tripCount" },
        // loadingOrders: { $push: { loading_order_No: "$_id", tripCount: "$tripCount" } },
      },
    },
  ]);

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardReceivedTotal = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");

  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  const total_Received = await receipt_payment.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$voucher_date", Number(yearFromDate)] },
            { $lte: ["$voucher_date", Number(yearToDate)] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        mode: 1,
        receipt_payment_type: 1,
        // amount:1,

        Rec_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "R"] },
            then: "$amount",
            else: 0,
          },
        },
        payment_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "P"] },
            then: "$amount",
            else: 0,
          },
        },
      },
    },

    {
      $group: {
        _id: "",
        Rec_amount_total: { $sum: "$Rec_amount" },
        payment_amount_total: { $sum: "$payment_amount" },

        // $subtract: [ "$Rec_amount", "$payment_amount" ]
        // bad_amount: { $sum: "$bad_amount" },
      },
    },
  ]);

  if (total_Received) {
    return res.status(200).json(total_Received);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardReceivedToday = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");

  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  const total_Received = await receipt_payment.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$voucher_date", Number(fromDate)] },
            { $lte: ["$voucher_date", Number(toDate)] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        mode: 1,
        receipt_payment_type: 1,
        // amount:1,

        Rec_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "R"] },
            then: "$amount",
            else: 0,
          },
        },
        payment_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "P"] },
            then: "$amount",
            else: 0,
          },
        },
      },
    },

    {
      $group: {
        _id: "$mode",
        Rec_amount_today: { $sum: "$Rec_amount" },
        payment_amount_today: { $sum: "$payment_amount" },

        // $subtract: [ "$Rec_amount", "$payment_amount" ]
        // bad_amount: { $sum: "$bad_amount" },
      },
    },
  ]);

  if (total_Received) {
    return res.status(200).json(total_Received);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardTotalCash = async (req, res) => {
  // let condition = { deleted_by_id: 0 };

  const ledger_account_id = 2;
  const yearFromDate = moment(
    moment(moment().quarter(-4).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();
  // const voucher_from_date = yearFromDate;
  // 1689334287;
  // const voucher_to_date = yearToDate;
  // 1689420687;


  // if (ledger_account_id) {
    
  //   condition = { ...condition, 'journal_details.ddl_ledger_id': ledger_account_id };
  // }


  // if (voucher_from_date && voucher_to_date) {
  //   condition = {
  //     ...condition,
  //     voucher_date: { $gte: voucher_from_date, $lte: voucher_to_date + 86399 }
  //   }
  // }




  const ledgerData = await ledger_account.aggregate([
   
    {
      $match:{
        ledger_account_id: 2
      }
    },
    {
      $project:
      {
        opening_balance:1,
        ledger_account:1,
        ledger_account_id:1
      }
    },
    {
      $lookup: {
        from: "t_200_journals",
        let: { ledger_account_id: "$ledger_account_id" },
        pipeline: [
          { $unwind: "$journal_details" },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$journal_details.ledger_account_id", ledger_account_id] },
                  { $gte: ["$voucher_date", yearFromDate] },
                  { $lte: ["$voucher_date", yearToDate] },
                ],
              },
            },
          },
          {
            $project: {
              "journal_details.ledger_account_id": 1,
              "journal_details.ledger": 1,
              "journal_details.amount": 1,
              debit_balance: {
                $cond: {
                  if: {
                    $and: [
                      { $in: ["$journal_details.dr_cr_id", [1]] },
                      // { $gte: ["$voucher_date", txt_from_date] },
                      { $lte: ["$voucher_date", yearToDate] },
                    ],
                  },
                  then: {
                    $toDouble: "$journal_details.amount" // Convert to double
                  },
                  else: 0,
                },
              },
              credit_balance: {
                $cond: {
                  if: {
                    $and: [
                      { $in: ["$journal_details.dr_cr_id", [2]] },
                      // { $gte: ["$voucher_date", txt_from_date] },
                      { $lte: ["$voucher_date", yearToDate] },
                    ],
                  },
                  then: {
                    $toDouble: "$journal_details.amount" // Convert to double
                  },
                  else: 0,
                },
              },
            },
          },
          // {
          //   $group: {
          //     _id: null,
          //     total_debit_balance: { $sum: "$debit_balance" },
          //     total_credit_balance: { $sum: "$credit_balance" },
          //   },
          // }
          
          {
            $group: {
              _id: "$journal_details.ledger_account_id",
              debit_balance: { $sum: "$debit_balance" },
              credit_balance: { $sum: "$credit_balance" },
            },
          },
        ],
        as: "journals",
      },
    },
    {
      $lookup: {
        from: "t_200_receipt_payments",
        let: { ledger_account_id: "$ledger_account_id" },
        pipeline: [
         

          {
            $match: {
              deleted_by_id: 0,
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ["$$ledger_account_id", "$ledger_account_id"] },
                      { $eq: ["$$ledger_account_id", "$bank_id"] },
                    ],
                  },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },

          {
            $project: {
              _id: 0,
            
              ledger_account_id: {
                $cond: {
                  if: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },

                  then: "$ledger_account_id",
                  else: "$bank_id",
                },
              },
              receipt_payment_id: 1,
              receipt_payment_type: 1,
              voucher_date: 1,
              amount: 1,
              debit_balance: {
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          { $gte: ["$voucher_date", yearFromDate] },
                          { $lte: ["$voucher_date", yearToDate] },
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                        ],
                      },
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          { $gte: ["$voucher_date", yearFromDate] },
                          { $lte: ["$voucher_date", yearToDate] },
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$amount",
                  else: 0,
                },
              },
              credit_balance: {
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          { $gte: ["$voucher_date", yearFromDate] },
                          { $lte: ["$voucher_date", yearToDate] },
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                        ],
                      },
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          { $gte: ["$voucher_date", yearFromDate] },
                          { $lte: ["$voucher_date", yearToDate] },
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$amount",
                  else: 0,
                },
              },
              dr_cr_status: {
              
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                          { $eq: ["$receipt_payment_type", "R"] },
                        ],
                      },
                      {
                        $and: [
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                          { $eq: ["$receipt_payment_type", "P"] },
                        ],
                      },
                    ],
                  },
                  then: "Dr",
                  else: "Cr",
                },
              },
            },
          },
          {
            $group: {
              _id: "$ledger_account_id",
              debit_balance: { $sum: "$debit_balance" },
              credit_balance: { $sum: "$credit_balance" },
            },
          },
        ],
        as: "receipt_payments",
      },
    },
    {
      $unwind: {
        path: "$journals",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$receipt_payments",
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $addFields: {
    //     closing_balance: {
    //       $cond: {
    //         if: { $eq: ["$current_dr_cr", "Dr"] },
    //         then: {
    //           $subtract: [
    //             {
    //               $sum: [
    //                 "$opening_balance",
    //                 {
    //                   $sum: [
    //                     "$journals.debit_balance",
    //                     "$receipt_payments.debit_balance",
    //                   ],
    //                 },
    //               ],
    //             },
    //             {
    //               $sum: [
    //                 "$journals.credit_balance",
    //                 "$receipt_payments.credit_balance",
    //               ],
    //             },
    //           ],
    //         },
    //         else: {
    //           $subtract: [
    //             {
    //               $sum: [
    //                 "$opening_balance",
    //                 {
    //                   $sum: [
    //                     "$journals.credit_balance",
    //                     "$receipt_payments.credit_balance",
    //                   ],
    //                 },
    //               ],
    //             },
    //             {
    //               $sum: [
    //                 "$journals.debit_balance",
    //                 "$receipt_payments.debit_balance",
    //               ],
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // },
    {
      $addFields: {
        closing_balance: {
          $cond: {
            if: { $gt: ["$opening_balance", 0] },
            then: {
              $subtract: [
                {
                  $sum: [
                    "$opening_balance",
                    "$journals.debit_balance",
                    "$receipt_payments.debit_balance",
                  ],
                },
                { $sum: ["$journals.credit_balance", "$receipt_payments.credit_balance"] },
              ],
            },
            else: {
              $subtract: [
                { $sum: ["$journals.debit_balance", "$receipt_payments.debit_balance"] },
                { $sum: ["$journals.credit_balance", "$receipt_payments.credit_balance"] },
              ],
              // {
              //   $sum: ["$ledger_account_details.opening_balance",
              //     { $sum: [0, "$receipt_payments.credit_balance",] }]
              // },
              // { $sum: [0, "$receipt_payments.debit_balance","$netValue"] }]
            },
          },
        },
      },
    },

    // {
    //   $unset: ["journals", "receipt_payments"],
    // },
  
    
  ]);

  // const ledgerData = await journal.aggregate([
  //   { $unwind: "$journal_details" },
  //   {
  //     $match: {
  //       $expr: {
  //         $and: [
  //           { $eq: ["$journal_details.ledger_account_id", ledger_account_id] },
  //           { $gte: ["$voucher_date", yearFromDate] },
  //           { $lte: ["$voucher_date", yearToDate] },
  //         ],
  //       },
  //     },
  //   },

  //   {
  //     $project: {
  //       voucher_no: 1,
  //       "journal_details.ledger_account_id": 1,
  //       "journal_details.ledger": 1,
  //       "journal_details.amount": 1,
  //       "journal_details.dr_cr": 1,
  //       "journal_details.dr_cr_id": 1,
  //       voucher_date: 1,
  //       transaction_id: 1,
  //       transaction_type: 1,
  //       transaction_type_id: 1,
  //       narration: 1,
  //     },
  //   },
  //   { $addFields: { voucher_type: "Journal" } },
  //   {
  //     $unionWith: {
  //       coll: "t_200_receipt_payments",
  //       pipeline: [
  //         {
  //           $match: {
  //             deleted_by_id: 0,
  //             $or: [
  //               { ledger_account_id: ledger_account_id },
  //               { bank_id: ledger_account_id },
  //             ],
  //             voucher_date: { $gte: yearFromDate, $lte: yearToDate },
  //           },
  //         },
  //         {
  //           $project: {
  //             voucher_no: 1,
  //             mode: 1,
  //             amount: 1,
  //             receipt_payment_type: 1,
  //             voucher_date: 1,
  //             ledger_account_id: 1,
  //             narration: 1,
  //             bank_id: 1,
  //             dr_cr: {
  //               //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
  //               $cond: {
  //                 if: {
  //                   $or: [
  //                     {
  //                       $and: [
  //                         { $eq: ["$bank_id", ledger_account_id] },
  //                         { $in: ["$receipt_payment_type", ["R", "BP"]] },
  //                       ],
  //                     },
  //                     {
  //                       $and: [
  //                         { $eq: ["$ledger_account_id", ledger_account_id] },
  //                         { $in: ["$receipt_payment_type", ["P", "BR"]] },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //                 then: 1,
  //                 else: 2,
  //               },
  //             },
  //           },
  //         },
  //         //{ $addFields: { flag: 2 } }
  //       ],
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "t_200_ledger_accounts",
  //       let: { ledger_account_id: "$ledger_account_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },
  //           },
  //         },
  //         {
  //           $project: { _id: 0, ledger_account: 1 },
  //         },
  //       ],
  //       as: "ledger_account_details",
  //     },
  //   },

  //   {
  //     $unwind: {
  //       path: "$ledger_account_details",
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $addFields: {
  //       ledger_account_for_party: "$ledger_account_details.ledger_account",
  //     },
  //   },
  //   {
  //     $sort: { voucher_date: 1 },
  //   },
  // ]);
 

  if (ledgerData) {
    return res.status(200).json(ledgerData);
  } else {
    return res.status(200).json([]);
  }
};



// const dashBoardTotalbank = async (req, res) => {
//   const ledger_account_id = [76,86];
//   const yearFromDate = moment(
//     moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
//       "x"
//     ),
//     "x"
//   ).unix();
//   const yearToDate = moment(
//     moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
//     "x"
//   ).unix();

//   console.log(ledger_account_id, yearFromDate, yearToDate);
//   // console.log(ledger_account_id)
//   const ledgerData = await journal.aggregate([
//     { $unwind: "$journal_details" },
//     {
//       $match: {
//         $expr: {
//           $and: [
//             { $in: ["$journal_details.ledger_account_id", ledger_account_id] },
//             { $gte: ["$voucher_date", yearFromDate] },
//             { $lte: ["$voucher_date", yearToDate] },
//           ],
//         },
//       },
//     },

//     {
//       $project: {
//         voucher_no: 1,
//         "journal_details.ledger_account_id": 1,
//         "journal_details.ledger": 1,
//         "journal_details.amount": 1,
//         "journal_details.dr_cr": 1,
//         "journal_details.dr_cr_id": 1,
//         voucher_date: 1,
//         transaction_id: 1,
//         transaction_type: 1,
//         transaction_type_id: 1,
//         narration: 1,
//         debit_balance: {
//           $cond: {
//             if: {
//               $and: [
//                 { $in: ["$journal_details.dr_cr_id", [1]] },
//                 { $gte: ["$voucher_date", yearFromDate] },
//                 { $lt: ["$voucher_date", yearToDate] },
//               ],
//             },
//             then: "$journal_details.amount",
//             else: 0,
//           },
//         },
//         credit_balance: {
//           $cond: {
//             if: {
//               $and: [
//                 { $in: ["$journal_details.dr_cr_id", [2]] },
//                 { $gte: ["$voucher_date", yearFromDate] },
//                 { $lt: ["$voucher_date", yearToDate] },
//               ],
//             },
//             then: "$journal_details.amount",
//             else: 0,
//           },
//         },
//       },
//     },
//     {
//       $group: {
//            _id: "$journal_details.ledger_account_id",
//            debit_balance: { $sum: "$debit_balance" },
//            credit_balance: { $sum: "$credit_balance" },
//            ddl_ledger_id: { $first: "$journal_details.ledger_account_id" }
//          }
//        },
//        {
//         $addFields: {
//           journalbalance: {
//           $subtract: ["$credit_balance","$debit_balance",]
//           }
//       }
//       },
//     { $addFields: { voucher_type: "Journal" } },
//     // {
//     //   $unionWith: {
//     //     coll: "t_200_receipt_payments",
//     //     pipeline: [
//     //       {
//     //         $match: {
//     //           deleted_by_id: 0,
//     //           $or: [
//     //             { ledger_account_id: ledger_account_id },
//     //             { bank_id: ledger_account_id },
//     //           ],
//     //           voucher_date: { $gte: yearFromDate, $lte: yearToDate },
//     //         },
//     //       },
//     //       {
//     //         $project: {
//     //           voucher_no: 1,
//     //           mode: 1,
//     //           amount: 1,
//     //           receipt_payment_type: 1,
//     //           voucher_date: 1,
//     //           ledger_account_id: 1,
//     //           narration: 1,
//     //           bank_id: 1,
//     //           dr_cr: {
//     //             //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
//     //             $cond: {
//     //               if: {
//     //                 $or: [
//     //                   {
//     //                     $and: [
//     //                       { $eq: ["$bank_id", ledger_account_id] },
//     //                       { $in: ["$receipt_payment_type", ["R", "BP"]] },
//     //                     ],
//     //                   },
//     //                   {
//     //                     $and: [
//     //                       { $eq: ["$ledger_account_id", ledger_account_id] },
//     //                       { $in: ["$receipt_payment_type", ["P", "BR"]] },
//     //                     ],
//     //                   },
//     //                 ],
//     //               },
//     //               then: 1,
//     //               else: 2,
//     //             },
//     //           },

//     //         },
//     //       },
//     //       { $addFields: {

//     //         debit_balance: {
//     //           $cond: {
//     //             if: {
//     //               $and: [
//     //                 { $in: ["$dr_cr", [1]] },
//     //                 { $gte: ["$voucher_date", yearFromDate] },
//     //                 { $lt: ["$voucher_date", yearToDate] },
//     //               ],
//     //             },
//     //             then: "$amount",
//     //             else: 0,
//     //           },
//     //         },
//     //         credit_balance: {
//     //           $cond: {
//     //             if: {
//     //               $and: [
//     //                 { $in: ["$dr_cr", [2]] },
//     //                 { $gte: ["$voucher_date", yearFromDate] },
//     //                 { $lt: ["$voucher_date", yearToDate] },
//     //               ],
//     //             },
//     //             then: "$amount",
//     //             else: 0,
//     //           },
//     //         },
//     //        }
//     //       },
//     //       {
//     //         $group: {
//     //              _id: "",
//     //              debit_balance: { $sum: "$debit_balance" },
//     //              credit_balance: { $sum: "$credit_balance" },

//     //            }
//     //          },

//     //          {
//     //           $addFields: {
//     //             receiptpaybalance: {
//     //             $subtract: ["$credit_balance","$debit_balance",]
//     //             }
//     //         }
//     //         },

//     //     ],
//     //   },
//     // },
//     // {
//     //   $lookup: {
//     //     from: "t_200_ledger_accounts",
//     //     let: { "ledger_account_id": ledger_account_id },
//     //     pipeline: [
//     //       {
//     //         $match:
//     //           { $expr: { $eq: [ledger_account_id, "$ledger_account_id"] }, },
//     //       },
//     //       {
//     //         $project: { "_id": 0, "opening_balance": 1, }
//     //       }
//     //     ], as: "ledger_account_details"
//     //   },
//     // },

//     // {
//     //   $unwind:
//     //   {
//     //     path: "$ledger_account_details",
//     //     preserveNullAndEmptyArrays: true
//     //   }
//     // },
//     // {
//     //   $addFields: {
//     //     ledger_opening: "$ledger_account_details.opening_balance",
//     //   },
//     // },

//     // {

//     //   $sort: { voucher_date: 1 }

//     // }
//   ]);

//   if (ledgerData) {
//     return res.status(200).json(ledgerData);
//   } else {
//     return res.status(200).json([]);
//   }
// };

// const dashBoardTotalCash = async (req, res) => {
//   const ledger_account_id = 2;
//   const yearFromDate = moment(
//     moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
//       "x"
//     ),
//     "x"
//   ).unix();
//   const yearToDate = moment(
//     moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
//     "x"
//   ).unix();
//   const ledgerData = await journal.aggregate([
//     { $unwind: "$journal_details" },
//     {
//       $match: {
//         $expr: {
//           $and: [
//             { $eq: ["$journal_details.ledger_account_id", ledger_account_id] },
//             { $gte: ["$voucher_date", yearFromDate] },
//             { $lte: ["$voucher_date", yearToDate] },
//           ],
//         },
//       },
//     },

//     {
//       $project: {
//         voucher_no: 1,
//         "journal_details.ledger_account_id": 1,
//         "journal_details.ledger": 1,
//         "journal_details.amount": 1,
//         "journal_details.dr_cr": 1,
//         "journal_details.dr_cr_id": 1,
//         voucher_date: 1,
//         transaction_id: 1,
//         transaction_type: 1,
//         transaction_type_id: 1,
//         narration: 1,
//         debit_balance: {
//           $cond: {
//             if: {
//               $and: [
//                 { $in: ["$journal_details.dr_cr_id", [1]] },
//                 { $gte: ["$voucher_date", yearFromDate] },
//                 { $lt: ["$voucher_date", yearToDate] },
//               ],
//             },
//             then: "$journal_details.amount",
//             else: 0,
//           },
//         },
//         credit_balance: {
//           $cond: {
//             if: {
//               $and: [
//                 { $in: ["$journal_details.dr_cr_id", [2]] },
//                 { $gte: ["$voucher_date", yearFromDate] },
//                 { $lt: ["$voucher_date", yearToDate] },
//               ],
//             },
//             then: "$journal_details.amount",
//             else: 0,
//           },
//         },
//       },
//     },
//         {
//       $group: {
//         _id: "$journal_details.ledger_account_id",
//         debit_balance: { $sum: "$debit_balance" },
//         credit_balance: { $sum: "$credit_balance" },
        
//         ddl_ledger_id: { $first: "$journal_details.ledger_account_id" },
//       },
//     },
//     {
//       $addFields: {
//         journalbalance: {
//           $subtract: ["$credit_balance", "$debit_balance"],
//         },
//       },
//     },

//     { $addFields: { voucher_type: "Journal" } },
//     {
//       $unionWith: {
//         coll: "t_200_receipt_payments",
//         pipeline: [
//           {
//             $match: {
//               deleted_by_id: 0,
//               $or: [
//                 { ledger_account_id: ledger_account_id },
//                 { bank_id: ledger_account_id },
//               ],
//               voucher_date: { $gte: yearFromDate, $lte: yearToDate },
//             },
//           },
//           {
//             $project: {
//               voucher_no: 1,
//               mode: 1,
//               amount: 1,
//               receipt_payment_type: 1,
//               voucher_date: 1,
//               ledger_account_id: 1,
//               narration: 1,
//               bank_id: 1,
//               dr_cr: {
//                 //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
//                 $cond: {
//                   if: {
//                     $or: [
//                       {
//                         $and: [
//                           { $eq: ["$bank_id", ledger_account_id] },
//                           { $in: ["$receipt_payment_type", ["R", "BP"]] },
//                         ],
//                       },
//                       {
//                         $and: [
//                           { $eq: ["$ledger_account_id", ledger_account_id] },
//                           { $in: ["$receipt_payment_type", ["P", "BR"]] },
//                         ],
//                       },
//                     ],
//                   },
//                   then: 1,
//                   else: 2,
//                 },
//               },
//             },
//           },
//           //{ $addFields: { flag: 2 } }
//         ],
//       },
//     },
//     {
//       $addFields: {
//         debit_balance: {
//           $cond: {
//             if: {
//               $and: [
//                 { $in: ["$dr_cr", [1]] },
//                 { $gte: ["$voucher_date", yearFromDate] },
//                 { $lt: ["$voucher_date", yearToDate] },
//               ],
//             },
//             then: "$amount",
//             else: 0,
//           },
//         },
//         credit_balance: {
//           $cond: {
//             if: {
//               $and: [
//                 { $in: ["$dr_cr", [2]] },
//                 { $gte: ["$voucher_date", yearFromDate] },
//                 { $lt: ["$voucher_date", yearToDate] },
//               ],
//             },
//             then: "$amount",
//             else: 0,
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: "",
//         debit_balance: { $sum: "$debit_balance" },
//         credit_balance: { $sum: "$credit_balance" },
//       },
//     },
//     {
//       $addFields: {
//         receiptpaybalance: {
//           $subtract: ["$credit_balance", "$debit_balance"],
//         },
//       },
//     },

//     {
//       $lookup: {
//         from: "t_200_ledger_accounts",
//         let: { ledger_account_id: "$ledger_account_id" },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },
//             },
//           },
//           {
//             $project: { _id: 0,  
//               opening_balance: 1 },
//           },
//         ],
//         as: "ledger_account_details",
//       },
//     },

//     {
//       $unwind: {
//         path: "$ledger_account_details",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $addFields: {
//         ledger_opening: "$ledger_account_details.opening_balance",
//       },
//     },

//     {
//       $group: {
//         _id: "$ledger_account_id",
//         ledger_opening:{$first:"$ledger_opening"},
//         journalbalance: { $first: "$journalbalance" }, 
//         receiptpaybalance: {$first: "$receiptpaybalance"}
//       },
//     },
//     {
//       $sort: { voucher_date: 1 },
//     },
//   ]);

//   if (ledgerData) {
//     return res.status(200).json(ledgerData);
//   } else {
//     return res.status(200).json([]);
//   }
// };

const dashBoardTotalbank = async (req, res) => {
  const ledger_group_id = req.body.ledger_group_id;

  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  const ledgerData = await ledger_account.aggregate([
    { $match: { ledger_group_id: 3 } },
    {
      $project: {
        ledger_account: 1,
        ledger_group_id: 1,
        as_on_date: 1,
        dr_cr_status: 1,
        ledger_account_id: 1,
        opening_balance: 1,
      },
    },
    {
      $lookup: {
        from: "t_200_journals",
        let: { ledger_account_id: "$ledger_account_id" },
        pipeline: [
          { $unwind: "$journal_details" },
          {
            $match: {
              $expr: {
                $eq: ["$$ledger_account_id", "$journal_details.ddl_ledger_id"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              ledger_account_id: 1,
              journal_id: 1,
              journal_details: 1,
              voucher_date: 1,
              debit_balance: {
                $cond: {
                  if: {
                    $and: [
                      { $in: ["$journal_details.dr_cr", [1]] },
                      { $gte: ["$voucher_date", yearFromDate] },
                      { $lt: ["$voucher_date", yearToDate] },
                    ],
                  },
                  then: "$journal_details.amount",
                  else: 0,
                },
              },
              credit_balance: {
                $cond: {
                  if: {
                    $and: [
                      { $in: ["$journal_details.dr_cr", [2]] },
                      { $gte: ["$voucher_date", yearFromDate] },
                      { $lt: ["$voucher_date", yearToDate] },
                    ],
                  },
                  then: "$journal_details.amount",
                  else: 0,
                },
              },
            },
          },
          {
            $group: {
              _id: "$journal_details.ddl_ledger_id",
              debit_balance: { $sum: "$debit_balance" },
              credit_balance: { $sum: "$credit_balance" },
            },
          },
        ],
        as: "journals",
      },
    },
    {
      $lookup: {
        from: "t_200_receipt_payments",
        let: { ledger_account_id: "$ledger_account_id" },
        pipeline: [
          // { $match:
          //   { $expr: {
          //       $eq: ["$$ledger_account_id", "$ledger_account_id"]
          //     }
          //   }
          // },

          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ["$$ledger_account_id", "$ledger_account_id"] },

                      { $eq: ["$$ledger_account_id", "$bank_id"] },
                    ],
                  },
                  { $eq: ["$deleted_by_id", 0] },
                  { $gte: ["$voucher_date", yearFromDate] },
                  { $lte: ["$voucher_date", yearToDate] },
                ],
              },
            },
          },

          {
            $project: {
              _id: 0,
              //ledger_account_id: 1,
              // $bank_id:1
              ledger_account_id: {
                $cond: {
                  if: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },

                  then: "$ledger_account_id",
                  else: "$bank_id",
                },
              },
              receipt_payment_id: 1,
              receipt_payment_type: 1,
              voucher_date: 1,
              amount: 1,
              debit_balance: {
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          // { $lte: ["$voucher_date", to_date] },
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                        ],
                      },
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          // { $lte: ["$voucher_date", to_date] },
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$amount",
                  else: 0,
                },
              },
              credit_balance: {
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          { $lte: ["$voucher_date", yearToDate] },
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                        ],
                      },
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          { $lte: ["$voucher_date", yearToDate] },
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$amount",
                  else: 0,
                },
              },
              dr_cr_status: {
                //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                          { $eq: ["$receipt_payment_type", "R"] },
                        ],
                      },
                      {
                        $and: [
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                          { $eq: ["$receipt_payment_type", "P"] },
                        ],
                      },
                    ],
                  },
                  then: "Dr",
                  else: "Cr",
                },
              },
            },
          },
          {
            $group: {
              _id: "$ledger_account_id",
              debit_balance: { $sum: "$debit_balance" },
              credit_balance: { $sum: "$credit_balance" },
            },
          },
        ],
        as: "receipt_payments",
      },
    },
    {
      $unwind: {
        path: "$journals",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$receipt_payments",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        closing_balance: {
          $cond: {
            if: {
              $and: [{ $eq: ["$dr_cr_status", "Dr"] }],
            },
            then: {
              $subtract: [
                {
                  $sum: [
                    "$opening_balance",
                    {
                      $sum: [
                        "$journals.debit_balance",
                        "$receipt_payments.debit_balance",
                      ],
                    },
                  ],
                },
                {
                  $sum: [
                    "$journals.credit_balance",
                    "$receipt_payments.credit_balance",
                  ],
                },
              ],
            },

            else: {
              $subtract: [
                {
                  $sum: [
                    "$opening_balance",
                    {
                      $sum: [
                        "$journals.credit_balance",
                        "$receipt_payments.credit_balance",
                      ],
                    },
                  ],
                },
                {
                  $sum: [
                    "$journals.debit_balance",
                    "$receipt_payments.debit_balance",
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        current_dr_cr: {
          $switch: {
            branches: [
              {
                //// Case 1 op!=0 && o.drcr = dr
                case: {
                  $and: [
                    { $ne: ["$opening_balance", 0] },
                    { $eq: ["$dr_cr_status", "Dr"] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$opening_balance",
                                "$receipt_payments.debit_balance",
                                "$journals.debit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Dr",
              },
              {
                //// Case 1.1 op!=0 && o.drcr = dr && cr>dr
                case: {
                  $and: [
                    { $ne: ["$opening_balance", 0] },
                    { $eq: ["$dr_cr_status", "Dr"] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$opening_balance",
                                "$receipt_payments.debit_balance",
                                "$journals.debit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Cr",
              },
              //////case 2op!=0 && o.drcr =cr
              {
                case: {
                  $and: [
                    { $ne: ["$opening_balance", 0] },
                    { $eq: ["$dr_cr_status", "Cr"] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$opening_balance",
                                "$receipt_payments.credit_balance",
                                "$journals.credit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Cr",
              },
              {
                case: {
                  $and: [
                    { $ne: ["$opening_balance", 0] },
                    { $eq: ["$dr_cr_status", "Cr"] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$opening_balance",
                                "$receipt_payments.credit_balance",
                                "$journals.credit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Dr",
              },
              //////Case 3: op=0 && Dr-Cr>0
              {
                case: {
                  $and: [
                    { $eq: ["$opening_balance", 0] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Dr",
              },

              //////Case 4: op=0 && Dr-Cr<0
              {
                case: {
                  $and: [
                    { $eq: ["$opening_balance", 0] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Cr",
              },
            ],
            default: "-",
          },
        },
      },
    },
    { $unset: ["journals", "receipt_payments"] },
    {
      $group: {
        _id: "$ledger_group_id",
        sumClosingBalance: { $sum: "$closing_balance" },
      },
    },
  ]);

  if (ledgerData) {
    return res.status(200).json(ledgerData);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardReportInTransit = async (req, res) => {
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");

  const in_transit = await Oil.aggregate([
    {
      $match: { advance_status: false },
    },
    {
      $project: {
        transaction_no: 1,
      },
    },
    {
      $group: {
        _id: "$transaction_no",
        tripCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalTripCount: { $sum: "$tripCount" },
        // loadingOrders: { $push: { loading_order_No: "$_id", tripCount: "$tripCount" } },
      },
    },
  ]);

  if (in_transit) {
    return res.status(200).json(in_transit);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardReportMaintanceToday = async (req, res) => {
  const ledger_account_id = 78;
  let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");

  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  const today_Maintance = await receipt_payment.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$ledger_account_id", ledger_account_id] },
            { $gte: ["$voucher_date", Number(fromDate)] },
            { $lte: ["$voucher_date", Number(toDate)] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        mode: 1,
        receipt_payment_type: 1,
        // amount:1,

        Rec_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "R"] },
            then: "$amount",
            else: 0,
          },
        },
        payment_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "P"] },
            then: "$amount",
            else: 0,
          },
        },
      },
    },

    {
      $group: {
        _id: "$mode",
        Rec_amount_today: { $sum: "$Rec_amount" },
        payment_amount_today: { $sum: "$payment_amount" },

        // $subtract: [ "$Rec_amount", "$payment_amount" ]
        // bad_amount: { $sum: "$bad_amount" },
      },
    },
  ]);

  if (today_Maintance) {
    return res.status(200).json(today_Maintance);
  } else {
    return res.status(200).json([]);
  }
};

const dashBoardReportMaintanceTotal = async (req, res) => {
  const ledger_account_id = 78;
  // let fromDate = moment().tz("Asia/kolkata").startOf("day").format("X");
  // let toDate = moment().tz("Asia/kolkata").endOf("day").format("X");

  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  const today_Maintance = await receipt_payment.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$ledger_account_id", ledger_account_id] },
            { $gte: ["$voucher_date", Number(yearFromDate)] },
            { $lte: ["$voucher_date", Number(yearToDate)] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        mode: 1,
        receipt_payment_type: 1,
        // amount:1,

        Rec_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "R"] },
            then: "$amount",
            else: 0,
          },
        },
        payment_amount: {
          $cond: {
            if: { $eq: ["$receipt_payment_type", "P"] },
            then: "$amount",
            else: 0,
          },
        },
      },
    },

    {
      $group: {
        _id: "$mode",
        Rec_amount_today: { $sum: "$Rec_amount" },
        payment_amount_today: { $sum: "$payment_amount" },

        // $subtract: [ "$Rec_amount", "$payment_amount" ]
        // bad_amount: { $sum: "$bad_amount" },
      },
    },
  ]);

  if (today_Maintance) {
    return res.status(200).json(today_Maintance);
  } else {
    return res.status(200).json([]);
  }
};


const dashBoardReportBreakDown = async (req, res) => {

  const yearFromDate = moment(
    moment(moment().quarter(-2).startOf("day").format("YYYY-MM-DD")).format(
      "x"
    ),
    "x"
  ).unix();
  const yearToDate = moment(
    moment(moment().endOf("day").format("YYYY-MM-DD")).format("x"),
    "x"
  ).unix();

  const brakeDownData = await breakDown.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            
            { $gte: ["$breakDownDate", Number(yearFromDate)] },
            { $lte: ["$breakDownDate", Number(yearToDate)] },
          ],
        },
      },
    },
    {
      $project: {
        breakDown_id:1,
        vehicle_id: 1,
        vehicle_no: 1,
        driver_name:1,
        Place:1,
        breakDownTime:1,
        breakDownDate:1,
       
       
      },
    },
    {
      $group: {
        _id: "$vehicle_no",
        tripCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalTripCount: { $sum: "$tripCount" },
        
      },
    },

   
  ]);

  if (brakeDownData) {
    return res.status(200).json(brakeDownData);
  } else {
    return res.status(200).json([]);
  }
};

module.exports = {
  dashboard_tracking,
  dashboard_vehicle,
  dashboardStatsReport,
  dashBoardReport,
  dashboardStatsReportTotalCash,

  dashboardStatsReportBank,
  total_out_standing_report,

  dashBoardLoading,
  dashBoardLoadingTotal,
  dashBoardUnloading,

  dashBoardReceivedTotal,
  dashBoardReceivedToday,

  dashBoardTotalCash,
  dashBoardTotalbank,
  dashBoardReportSalesTotal,
  dashBoardReportInTransit,
  dashBoardReportMaintanceToday,
  dashBoardReportMaintanceTotal,
  dashBoardReportBreakDown
};
