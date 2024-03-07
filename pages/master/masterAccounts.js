const router = require("express").Router();
const moment = require("moment");
const axios = require("axios");
const { apiURL } = require("../../config/config");
const { trackChange } = require("../../config/global");
const { apiList } = require("../../config/api");

const {
  tax_master,
  ledger_account,
  ledger_group,
  charges,
  primary_group,
  journal,
} = require("../../modals/MasterAccounts");
const { receiptSalesVehicle } = require("../../modals/Master");
const { salesCumDispatch } = require("../../modals/Sales_cum_dispatch");

const AccountMasterInsert = async (req, res) => {
  const data = req.body;
  const URL = req.url;
  const errors = {};
  let newMaster = "";

  switch (URL) {
    case "/primary_group/insert":
      newMaster = new primary_group(data);
      break;
    case "/account_nature/insert":
      newMaster = new account_nature(data);
      break;
    case "/ledger_group/insert":
      newMaster = new ledger_group(data);
      break;

    case "/ledger_account/insert":
      newMaster = new ledger_account(data);
      break;

    case "/tax_master/insert":
      newMaster = new tax_master(data);
      break;

    case "/charges/insert":
      newMaster = new charges(data);
      break;

    case "/bank_master/insert":
      newMaster = new bank_master(data);
      break;
  }

  const insertedMaster = await newMaster.save();
  return res.status(200).json({ _id: insertedMaster._id });
};

//  PRIMARY GROUP
const view_primary_group = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const group_id = req.body.group_id;
  const group_name = req.body.group;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const natureByLetter = (nature) => {
    switch (nature) {
      case "A":
        return "Assets";
      case "E":
        return "Expenses";
      case "I":
        return "Income";
      case "L":
        return "Liabilities";
      case "P":
        return "Provision";
      default:
        return "";
    }
  };

  // Function to prepare action items for each category
  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: true,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };

  // Details by ID
  if (group_id) {
    condition = { ...condition, group_id: group_id };
  }

  // Details by Name
  if (group_name) {
    condition = {
      ...condition,
      group_name: { $regex: "^" + group_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive
  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ group_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await primary_group
    .find(condition, (err, groupData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (groupData) {
        // (v => ({...v, isActive: true}))

        //  categoriesData.forEach(data){

        //  }

        let returnDataArr = groupData.map((data) => ({
          nature_name: data.nature,
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(short_data === true && { group_id: 1, group: 1, _id: 0 });
};

const updatePrimaryGroup = async (req, res) => {
  const condition = { primary_group_id: req.body.primary_group_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.primary_group_list,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);

  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const primaryGroupDetails = myData.data;
  // data.edit_log = primaryGroupDetails;

  await primary_group.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deletePrimaryGroup = async (req, res) => {
  const primary_group_id = req.body.primary_group_id;
  const condition = { primary_group_id: primary_group_id };
  await primary_group.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const view_ledger_group = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const ledger_group_name = req.body.ledger_group;
  const ledger_group_id = req.body.ledger_group_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  let all_primary_group = await primary_group
    .find({}, (err, primary_groupData) => {
      return primary_groupData;
    })
    .select({ primary_group_id: 1, primary_group: 1, _id: 0 });
  const primary_groupById = (all_primary_group, primary_group_id) => {
    if (primary_group_id === 0) return "--";
    for (let iCtr = 0; iCtr < all_primary_group.length; iCtr++) {
      if (all_primary_group[iCtr]["primary_group_id"] === primary_group_id)
        return all_primary_group[iCtr]["primary_group"];
    }
  };
  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (ledger_group_id) {
    condition = { ...condition, ledger_group_id: ledger_group_id };
  }

  // Details by Name
  if (ledger_group_name) {
    condition = {
      ...condition,
      ledger_group_name: {
        $regex: "^" + ledger_group_name + "$",
        $options: "i",
      },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ ledger_group_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  const ledger_groupData = await ledger_group.aggregate([
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "t_200_primary_groups",
        let: { primary_group_id: "$primary_group_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$primary_group_id", "$$primary_group_id"] },
            },
          },
          { $project: { primary_group: 1 } },
        ],
        as: "primary_data",
      },
    },
    {
      $addFields: {
        primary_group_name: { $first: "$primary_data.primary_group" },
      },
    },
    { $unset: ["primary_data"] },

    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
          // can_view: true,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
    {
      $project: {
        action_items: 1,
        active_status: 1,
        inserted_by_id: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        edit_log: 1,

        primary_group_name: 1,
        primary_group_id: 1,
        account_nature_id: 1,
        account_nature_name: 1,
        sequence: 1,
        ledger_group: 1,
        alias: 1,
        sub_group_status: 1,
        ledger_group_id: 1,
      },
    },
  ]);
  if (ledger_groupData) {
    return res.status(200).json(ledger_groupData);
  } else {
    return res.status(200).json([]);
  }
};

const deleteLedgerGroup = async (req, res) => {
  const ledger_group_id = req.body.ledger_group_id;
  const condition = { ledger_group_id: ledger_group_id };
  await ledger_group.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};
const updateLedgerGroup = async (req, res) => {
  const condition = { ledger_group_id: req.body.ledger_group_id };
  const data = req.body;

  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.ledger_group_list,
    data: condition,
  });

  const ledgerGroupDetails = myData.data;
  data.edit_log = ledgerGroupDetails;

  await ledger_group.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const view_ledger_account = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const ledger_account_id = req.body.ledger_account_id;
  const ledger_account_name = req.body.ledger_account;
  const ledger_group_id = req.body.ledger_group_id;
  const ledger_group_mis = req.body.ledger_group_mis;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  let all_ledger_group = await ledger_group
    .find({}, (err, ledger_groupData) => {
      return ledger_groupData;
    })
    .select({ ledger_group_id: 1, ledger_group: 1, _id: 0 });

  const ledger_groupById = (all_ledger_group, ledger_group_id) => {
    if (ledger_group_id === 0) return "--";
    for (let iCtr = 0; iCtr < all_ledger_group.length; iCtr++) {
      if (all_ledger_group[iCtr]["ledger_group_id"] === ledger_group_id)
        return all_ledger_group[iCtr]["ledger_group"];
    }
  };
  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };

  // Details by ID
  if (ledger_account_id) {
    condition = { ...condition, ledger_account_id: ledger_account_id };
  }
  if (ledger_group_id) {
    condition = { ...condition, ledger_group_id: ledger_group_id };
  }

  if (ledger_group_mis) {
    condition = { ...condition, ledger_group_id: ledger_group_mis };
  }

  // Details by Name
  if (ledger_account_name) {
    // console.log(ledger_account_name,"999freched");
    condition = {
      ...condition,
      // ledger_account_name: {
      //   $regex: "^" + ledger_account_name + "$",
      //   $options: "i",
      // },
      ledger_account: ledger_account_name,
    };
  } // Matching exact text but incase-sensitive
  //console.log(condition,"conditionconditioncondition")
  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ ledger_account_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await ledger_account
    .find(condition, (err, ledger_accountData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (ledger_accountData) {
        let returnDataArr = ledger_accountData.map((data) => ({
          ledger_group_name: ledger_groupById(
            all_ledger_group,
            data.ledger_group_id
          ),
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(
      short_data === true && {
        ledger_account_id: 1,
        ledger_account: 1,
        ledger_group_id: 1,
        opening_balance: 1,
        dr_cr_status: 1,
        _id: 0,
      }
    )
    .sort({ ledger_account: 1 });
};

const updateLedgerAccount = async (req, res) => {
  const condition = { ledger_account_id: req.body.ledger_account_id };
  const data = req.body;
  // data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");
  const myData = await axios({
    method: "post",
    url: apiURL + apiList.ledger_account_list,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const ledgerAccountDetails = myData.data;
  // data.edit_log = ledgerAccountDetails;

  await journal.updateMany(
    { 'journal_details.ledger_account_id': req.body.ledger_account_id },
    { $set: { 'journal_details.$.ledger': data.ledger_account}  }
  )

  await ledger_account.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleteLedgerAccount = async (req, res) => {
  const ledger_account_id = req.body.ledger_account_id;
  const condition = { ledger_account_id: ledger_account_id };
  await ledger_account.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const view_journal = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const journal_id = req.body.journal_id;
  const voucher_no = req.body.voucher_no;
  const voucher_date = req.body.voucher_date;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;
  //this varial being use for ledger in misreports
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;
  const ledger_name = req.body.ledger_name;
  const journal_ledger_name = req.body.journal_ledger_name;
  const transaction_id = req.body.transaction_id;

  console.log(ledger_name, "ssss");

  let all_ledger_account = await ledger_account
    .find({}, (err, ledger_accountData) => {
      return ledger_accountData;
    })
    .select({ ledger_account_id: 1, ledger_account: 1, _id: 0 });
  const ledger_accountById = (all_ledger_account, ledger_account_id) => {
    if (ledger_account_id === 0) return "--";
    for (let iCtr = 0; iCtr < all_ledger_account.length; iCtr++) {
      if (all_ledger_account[iCtr]["ledger_account_id"] == ledger_account_id)
        return all_ledger_account[iCtr]["ledger_account"];
    }
  };

  // Function to prepare action items for each category
  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  //console.log(req.body)

  // Details by ID
  if (journal_id) {
    condition = { ...condition, journal_id: journal_id };
  }

  //SEARCH BY journal_ledger_name
  // if(journal_ledger_name) { condition={...condition, 'journal_details.ddl_ledger_name': journal_ledger_name} }
  // console.log(journal_ledger_name,"zzzz")

  // search by Ledger_name
  if (ledger_name) {
    condition = { ...condition, "journal_details.ddl_ledger": ledger_name };
  }
  // Details by Name
  if (voucher_no) {
    condition = { ...condition, voucher_no: new RegExp(voucher_no, "i") };
  }

  if (transaction_id) {
    condition = {
      ...condition,
      transaction_id: new RegExp(transaction_id, "i"),
    };
  }
  //datefilter
  if (from_date) {
    condition = { ...condition, voucher_date: from_date };
  }

  if (to_date) {
    condition = { ...condition, voucher_date: to_date };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      voucher_date: { $gte: from_date, $lte: to_date },
    };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { voucher_no: { $regex: searchQuery, $options: "i" } },
        { details: { $regex: searchQuery, $options: "i" } },
      ],
    }; // Matching string also compare incase-sensitive
  }
  //console.log(condition)
  await journal
    .find(condition, (err, journalData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (journalData) {
        let returnDataArr = journalData.map((data) => ({
          ledger_account_name: ledger_accountById(
            all_ledger_account,
            data.ledger_account_id
          ),
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));

        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(short_data === true && { journal_id: 1, journal: 1, _id: 0 });
};

// const viewReceiptVehicleList = async(req,res)=> {
//   const { ledger_account_id } = req.body;
//     let condition = { deleted_by_id: 0, ledger_account_id:ledger_account_id };

//  let receiptSalesVehicle = await ledger_account.aggregate([
//   {$match:condition},
//   {
//     $project:
//     {
//       ledger_account_id:1,
//       type_id:1
//     },
//   },
//   {
//     $lookup: {
//       from: "t_200_receipt_payments",
//       let: { ledger_account_id: "$ledger_account_id" },
//       pipeline: [
//         {
//           $match: { $expr: { $eq: ["$$ledger_account_id", "$ledger_account_id"] } },
//         },
//         {
//           $project: {
//             amount: 1,
//             voucher_no:1,
//             _id: 0,
//           },
//         },
//       ],
//       as: "receipt_details",
//     },
//   },
//   {
//     $unwind: "$receipt_details"
//   },
//   {
//     $lookup: {
//       from: "t_001_sales_cum_dispatches",
//       let: { customer_id: "$type_id" },
//       pipeline: [
//         {
//           $match: { $expr: { $eq: ["$$customer_id", "$customer_id"] } },
//         },
//         {
//           $project: {
//             customer_id:1,
//             customer: 1,
//             sales_date:1,
//             transaction_no:1,
//             vehicle_id:1,
//             vehicle:1,
//             _id: 0,
//           },
//         },
//       ],
//       as: "sales_details",
//     },
//   },
//   {
//     $unwind: "$sales_details"
//   },

//   {
//     $group:
//     {
//       _id:"$sales_details.transaction_no",
//       customer_id:{$first:"$sales_details.customer_id"},
//       transaction_no:{$first:"$sales_details.transaction_no"},
//       sales_date:{$first:"$sales_details.sales_date"},
//       customer:{$first:"$sales_details.customer"},
//       amount:{$first:"$receipt_details.amount"},
//       vehicle_id:{$first:"$sales_details.vehicle_id"},
//       vehicle:{$first:"$sales_details.vehicle"},

//     }
//   }

// ])
// if (receiptSalesVehicle) {
//   return res.status(200).json(receiptSalesVehicle);
// } else {
//   return res.status(200).json([]);
// }

//   };

// const viewReceiptVehicleList = async (req, res) => {
//   const { ledger_account_id } = req.body;

//   try {
//     let condition = { deleted_by_id: 0, ledger_account_id: ledger_account_id };

//     let receiptSalesVehicle = await ledger_account.aggregate([
//       { $match: condition },
//       {
//         $project: {
//           ledger_account_id: 1,
//           type_id: 1,
//         },
//       },

//       {
//         $lookup: {
//           from: "t_001_sales_cum_dispatches",
//           let: { customer_id: "$type_id" },
//           pipeline: [
//             {
//               $match: { $expr: { $eq: ["$$customer_id", "$customer_id"] } },
//             },
//             {
//               $project: {
//                 customer_id: 1,
//                 customer: 1,
//                 sales_date: 1,
//                 transaction_no: 1,
//                 vehicle_id: 1,
//                 vehicle: 1,
//                 _id: 0,
//               },
//             },
//           ],
//           as: "sales_details",
//         },
//       },

//       {
//         $lookup: {
//           from: "t_000_receiptsalesvehicles",
//           let: { transaction_no: { $first: "$sales_details.transaction_no" } },
//           pipeline: [
//             {
//               $match: { $expr: { $eq: ["$payment_details.transaction_no", "$$transaction_no"] } },
//             },
//             {
//               $project: {
//                 payment_details:1,
//                 ledger_account_id:1,
//                 ledger_account_name:1,
//                 _id: 0,
//               },
//             },
//             {
//               $unwind:
//               {
//               path:"$payment_details",
//               preserveNullAndEmptyArrays: true

//               }
//             }
//           ],
//           as: "receiptsales_details",
//         },
//       },
//       // {
//       //   $unwind:
//       //   {
//       //   path:"$sales_details",
//       //   preserveNullAndEmptyArrays: true
//       // }
//       // },
//       // {
//       //   $unwind:

//       //   {path:"$receiptsales_details",
//       //   preserveNullAndEmptyArrays:true,
//       // }

//       // },
//       // {
//       //   $match: {
//       //     $expr: { $eq: ["$sales_details.transaction_no", "$receiptsales_details.payment_details.transaction_no"] },
//       //   },
//       // },
//       // {
//       //   $group: {
//       //     _id: "$sales_details.transaction_no",
//       //     customer_id: { $first: "$sales_details.customer_id" },
//       //     transaction_no: { $first: "$sales_details.transaction_no" },
//       //     sales_date: { $first: "$sales_details.sales_date" },
//       //     customer: { $first: "$sales_details.customer" },
//       //     amount: { $first: "$receipt_details.amount" },
//       //     vehicle_id: { $first: "$sales_details.vehicle_id" },
//       //     vehicle: { $first: "$sales_details.vehicle" },
//       //     already_payment_received:{$first:{$toInt:"$receiptsales_details.payment_details.already_payment_received"}},
//       //     balence_left:{$first:"$receiptsales_details.payment_details.balence_left"}

//       //   },
//       // },
//     ]);

//     if (receiptSalesVehicle) {
//       return res.status(200).json(receiptSalesVehicle);
//     } else {
//       return res.status(200).json([]);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal Server Error. Please try again later." });
//   }
// };

const viewReceiptVehicleList = async (req, res) => {
  const { customer_id } = req.body;

  try {
    let condition = { deleted_by_id: 0, customer_id: customer_id };

    let receiptSalesVehicle = await salesCumDispatch.aggregate([
      { $match: condition },
      {
        $project: {
          transaction_no: 1,
          customer_id: 1,
          customer: 1,
          sales_date: 1,
          transaction_no: 1,
          vehicle_id: 1,
          vehicle: 1,
          total_amount: 1,
        },
      },
      {
        $lookup: {
          from: "t_000_receiptsalesvehicles",
          let: { transaction_no: "$transaction_no" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$transaction_no", "$$transaction_no"] } },
            },
            {
              $project: {
                payment_details: 1,
                _id: 0,
                // payment_sum : {$sum:"$payment_details.amount"}
              },
            },
           
          ],
          as: "receiptsales_details",
        },
        
      },
      
      {
        $addFields: {
          payment_sum: {
            $reduce: {
              input: "$receiptsales_details",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $sum: "$$this.payment_details.amount"
                  }
                ]
              },
            },
          },
        },
      },
     
      {
        $group: {
          _id: "$transaction_no",
          data: { $push: "$$ROOT" },
          // receiptsales_details: { $push: "$receiptsales_details" },
          // payment_sum: { $sum: "$receiptsales_details.payment_details.amount" }
        },
      },
    ]);

    return res.status(200).json(receiptSalesVehicle);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};





const viewSalesReceiptList = async (req, res) => {
  let condition = {};
  let tyreData = await receiptSalesVehicle.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        receiptSalesVehicle_id: 1,
        transaction_no: 1,
        vehicle_no: 1,
        sales_value: 1,
        bill_date: 1,
        already_payment_received: 1,
        balence_left: 1,
        amount: 1,
      },
    },
  ]);

  if (tyreData) {
    return res.status(200).json(tyreData);
  } else {
    return res.status(200).json([]);
  }
};

const getAllAccData = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const journal_id = req.body.journal_id;
  const voucher_no = req.body.voucher_no;
  const voucher_date = req.body.voucher_date;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;
  //this varial being use for ledger in misreports
  const voucher_from_date = req.body.voucher_from_date;
  const voucher_to_date = req.body.voucher_to_date;
  const ledger_name = req.body.ledger_name;
  const ledger_account_id = req.body.ledger_account_id;
  console.log("anna", req.body);

  // let all_ledger_account=await ledger_account.find( {} , (err,ledger_accountData) => {return ledger_accountData}).select( ({"ledger_account_id": 1, "ledger_account":1, "_id": 0} ));
  // const ledger_accountById=(all_ledger_account, ledger_account_id)=>{
  //     if(ledger_account_id===0) return "--"
  //     for(let iCtr=0; iCtr<all_ledger_account.length; iCtr++){

  //       if(all_ledger_account[iCtr]['ledger_account_id']==ledger_account_id)
  //         return all_ledger_account[iCtr]['ledger_account']
  //     }
  // }

  //console.log(req.body)

  // Details by ID
  if (journal_id) {
    condition = { ...condition, journal_id: journal_id };
  }

  // search by Ledger_name
  if (ledger_account_id) {
    console.log("cde", ledger_name);
    condition = {
      ...condition,
      "journal_details.ddl_ledger_id": ledger_account_id,
    };
  }

  // Details by Name
  if (voucher_no) {
    condition = {
      ...condition,
      primary_group: { $regex: "^" + voucher_no + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Date wise
  if (voucher_from_date && voucher_to_date) {
    condition = {
      ...condition,
      voucher_date: { $gte: voucher_from_date, $lte: voucher_to_date + 86399 },
    };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { voucher_no: { $regex: searchQuery, $options: "i" } },
        { details: { $regex: searchQuery, $options: "i" } },
      ],
    }; // Matching string also compare incase-sensitive
  }
  console.log("conditioner", condition);

  // $or:[{ledger_account_id: {$eq:ledger_account_id}},{ bank_id: { $eq:ledger_account_id} }],

  await journal.aggregate(
    [
      { $match: condition },
      { $unwind: "$journal_details" },
      {
        $project: {
          voucher_no: 1,
          "journal_details.ddl_ledger_id": 1,
          "journal_details.ddl_ledger": 1,
          "journal_details.amount": 1,
          "journal_details.dr_cr": 1,
          voucher_date: 1,
          transaction_id: 1,
          transaction_type: 1,
          narration: 1,
        },
      },

      { $addFields: { voucher_type: "Journal" } },
      ////////////////////union with rp
      {
        $unionWith: {
          coll: "t_200_receipt_payments",
          pipeline: [
            {
              $match: {
                deleted_by_id: 0,
                $or: [
                  { ledger_account_id: ledger_account_id },
                  { bank_id: ledger_account_id },
                ],
                voucher_date: {
                  $gte: voucher_from_date,
                  $lte: voucher_to_date,
                },
              },
            },
            {
              $project: {
                voucher_no: 1,
                mode: 1,
                amount: 1,
                receipt_payment_type: 1,
                voucher_date: 1,
                ledger_account_id: 1,
                narration: 1,
                bank_id: 1,
                dr_cr: {
                  //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
                  $cond: {
                    if: {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$bank_id", ledger_account_id] },
                            { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ["$ledger_account_id", ledger_account_id] },
                            { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          ],
                        },
                      ],
                    },
                    then: 1,
                    else: 2,
                  },
                },
              },
            },
            //{ $addFields: { flag: 2 } }
          ],
        },
      },

      {
        $lookup: {
          from: "t_200_ledger_accounts",
          let: { ledger_account_id: "$ledger_account_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },
              },
            },
            {
              $project: { _id: 0, ledger_account: 1 },
            },
          ],
          as: "ledger_account_details",
        },
      },

      {
        $unwind: {
          path: "$ledger_account_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          ledger_account_for_party: "$ledger_account_details.ledger_account",
        },
      },

      {
        $sort: { voucher_date: 1 },
      },
      //   {
      //     $group: {
      //         _id: "$voucher_no",
      //         voucher_date: { $first: "$voucher_date"},
      //         ddl_ledgers: {$addToSet: "$journal_details.ddl_ledger"},
      //         dr_cr: {$addToSet: "$journal_details.dr_cr"},
      //         amount: {$addToSet: "$journal_details.amount"},
      //         receipt_payment: { $first: "$amount" },
      //         ledger_account_id: { $first: "$ledger_account_id" },
      //         receipt_payment_type: { $first: "$receipt_payment_type" },
      //     //   //{"harness":"$harness","testDay":"$end_date"}
      //     //    item_id:{$first:"$invoice_item_details.item_id"},
      //     //    dispatched_qty:{$sum:"$dispatched_qty"},
      //     //    showroom_warehouse_id :{$first:"$invoice_item_details.showroom_warehouse_id"},
      //         // voucher_no: {$first: "$journal_details.voucher_no"}
      //       },
      //   },
    ],
    (err, journalData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (journalData) {
        console.log("jD", journalData);
        return res.status(200).json(journalData);
      } else {
        return res.status(200).json([]);
      }
    }
  ); //.select( (short_data ===true && {"journal_id": 1, "journal":1, "_id": 0} ));
};


const ReceiptSalesVehicle_List = async (req, res) => {
  // const { transaction_no } = req.body;

  try {
    let condition = { deleted_by_id: 0, 
      // transaction_no: transaction_no
     };

    let receiptSalesVehicleList = await receiptSalesVehicle.aggregate([
      { $match: condition },
      {
        $project: {
          receiptSalesVehicle_id:1,
          payment_date:1,
          transaction_no:1,
          payment_details:1,

        },
      },
      {
        $addFields :{
          Transction :{$first:"$payment_details.transaction_no"},
          vehicle_no :{$first:"$payment_details.vehicle_no"},
          sales_date :{$first:"$payment_details.sales_date"},
          sales_value :{$first:"$payment_details.sales_value"},
          already_payment_received :{$first:"$payment_details.already_payment_received"},
          amount :{$first:"$payment_details.amount"},

        }
      }
      
  
    ]);

    return res.status(200).json(receiptSalesVehicleList);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};


module.exports = {
  AccountMasterInsert,
  view_primary_group,
  updatePrimaryGroup,
  view_ledger_group,
  view_ledger_account,
  view_journal,
  updateLedgerAccount,
  deletePrimaryGroup,
  updateLedgerGroup,
  deleteLedgerGroup,
  deleteLedgerAccount,
  viewReceiptVehicleList,
  viewSalesReceiptList,
  getAllAccData,
  ReceiptSalesVehicle_List
};
