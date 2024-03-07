const moment = require("moment-timezone");

const { Loading } = require("../../modals/Loading");
const { salesCumDispatch } = require("../../modals/Sales_cum_dispatch");
const { receipt_payment } = require("../../modals/MasterAccounts");
const { Advance } = require("../../modals/Advance");
const { receiptSalesVehicle } = require("../../modals/Master");
const { Oil } = require("../../modals/Oil");

const view_daily_Report = async (req, res) => {
  try {
  const txt_from_date = req.body.txt_from_date;

    // const fromDate = moment().tz("Asia/Kolkata").startOf("day").valueOf();
    const toDate = moment("01-04-2022", "DD-MM-YYYY").unix();
   
    const fromDatestart = Math.floor(txt_from_date );
  // console.log(fromDatestart,"sab")
    const yesterdayStartOfDayTimestamp = Math.floor(
      (fromDatestart - 86400)
    );

    // const previousDay =  moment().subtract(2, 'days').startOf('day').unix();

    // moment().subtract(2, 'days').endOf('day').toDate();

  // console.log(yesterdayStartOfDayTimestamp,"sab")

  // console.log(toDate,"sankhatodate")
   

    // console.log(yesterdayEndOfDayTimestamp,"sankha")
    // const loadingData = await Loading.aggregate([
    //   {
    //     $match: {

    //       challan_date: {
    //         $gte: yesterdayStartOfDayTimestamp,
    //         $lte: yesterdayEndOfDayTimestamp,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$loading_order_No",
    //       tripCount: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalTripCount: { $sum: "$tripCount" },
    //     },
    //   },
    // ]);

    const unlodingdata = await Loading.aggregate([
      {
        $match: {
          dispatch_status: false,
          // challan_date: {
          //   $lte: toDate,
          //   $gte: txt_from_date,
           
          // },
        },
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

    const yesterdayunlodingdata = await Loading.aggregate([
      {
        $match: {
          dispatch_status: false,
          challan_date: {
            
            $eq: yesterdayStartOfDayTimestamp,
           
          },
        },
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

    const previousdayUnlodingData = await Loading.aggregate([
      {
        $match: {
          dispatch_status: false,
          challan_date: {
            $gte: toDate,
            $lte: txt_from_date - 2,
          },
        },
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

    const salesData = await salesCumDispatch.aggregate([
      {
        $match: {
          sales_date: {
            $eq: txt_from_date,
          },
        },
      },
      {
        $group: {
          _id: "$transaction_no",
          tripCount: { $sum: 1 },
          total_amount: { $sum: "$total_amount" },
        },
      },
      {
        $group: {
          _id: null,
          totalTripCount: { $sum: "$tripCount" },
          totalAmount: { $sum: "$total_amount" },
        },
      },
    ]);

    const advancedata = await Advance.aggregate([
      {
        $match: {
          advance_date: txt_from_date,
        },
      },
      {
        $project: {
          transaction_no: 1,
          actual_expense: 1,
        },
      },

      {
        $group: {
          _id: "$transaction_no",
          tripCount: { $sum: 1 },

          expense: { $sum: "$actual_expense" },
        },
      },
      {
        $group: {
          _id: null,
          totalTripCount: { $sum: "$tripCount" },
          expense: { $sum: "$expense" },

          // loadingOrders: { $push: { loading_order_No: "$_id", tripCount: "$tripCount" } },
        },
      },
    ]);

    const oildata = await Oil.aggregate([
      {
        $match: {
          oil_date: txt_from_date,
        },
      },
      {
        $project: {
          transaction_no: 1,
          total_amount: 1,
        },
      },

      {
        $group: {
          _id: "$transaction_no",
          tripCount: { $sum: 1 },
          amount: { $sum: "$total_amount" },
        },
      },
      {
        $group: {
          _id: null,
          totalTripCount: { $sum: "$tripCount" },
          amount: { $sum: "$amount" },

          
        },
      },
    ]);

    const total_Received = await receipt_payment.aggregate([
      {
        $match: {
          voucher_date:{
            $eq:txt_from_date
          }
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

    const total_ReceiptSalesVehicle = await receiptSalesVehicle.aggregate([
      {
        $match: {
          payment_date:{
            $eq:txt_from_date
          }
        },
      },
      {
        $unwind: "$payment_details",
      },
      {
        $project: {
          _id: 0,

          receiptSalesVehicle_id: 1,
          "payment_details.transaction_no": 1,
          "payment_details.amount": 1,
        },
      },

      {
        $group: {
          _id: null,
          Rec_amount_today: { $sum: "$payment_details.amount" },
        },
      },
    ]);


    const totalAdvancedExpense = advancedata.length > 0 ? advancedata[0].expense : 0;
    const totalOilAmount = oildata.length > 0 ? oildata[0].amount : 0;

    const totalExpenseAndAmount = totalAdvancedExpense + totalOilAmount;


  const recAmountReceived = total_Received.length > 0 ? total_Received[0].Rec_amount_today : 0;
  const recAmountPayment = salesData.length > 0 ? salesData[0].totalAmount : 0;


  const recAmountReceiptSalesVehicle = total_ReceiptSalesVehicle.length > 0 ? total_ReceiptSalesVehicle[0].Rec_amount_today: 0;


  const totalRecAmount = recAmountReceived + recAmountReceiptSalesVehicle;
  const todayOutstanding = totalRecAmount - recAmountPayment;




    if (
      salesData ||
      advancedata ||
      oildata ||
      total_Received ||
      total_ReceiptSalesVehicle ||
      totalRecAmount ||
      todayOutstanding ||
      unlodingdata ||
      yesterdayunlodingdata ||
      previousdayUnlodingData
    ) {
      return res
        .status(200)
        .json({
          salesData,
          advancedata,
          totalExpenseAndAmount,
          oildata,
          total_Received,
          total_ReceiptSalesVehicle,
          totalRecAmount,
          todayOutstanding,
          unlodingdata,
          yesterdayunlodingdata,
          previousdayUnlodingData
        });
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

module.exports = { view_daily_Report };
