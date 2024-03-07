const router = require("express").Router();
const moment = require("moment");
const axios = require("axios");
const { apiURL } = require("../../config/config");
const { trackChange } = require("../../config/global");
const { apiList } = require("../../config/api");

var express = require("express");
var jsonDiff = require("json-diff");

const {
  role,
  vehicle,
  vehicle_brand,
  showrooms_warehouse,
  customer,
  vehicle_type,
  tyre_brand,
  location,
  petrol_pump,
  expenses,
  employee,
  bank,
  routes,
  material_type,
} = require("../../modals/Master");
const {
  tax_master,
  ledger_account,
  ledger_group,
  primary_group,
  journal,
  receipt_payment,
} = require("../../modals/MasterAccounts");

const { Oil } = require("../../modals/Oil");
const { salesCumDispatch } = require("../../modals/Sales_cum_dispatch");
const { Advance } = require("../../modals/Advance");
const { Material, Loading } = require("../../modals/Loading");
const { MaintenanceExpenses } = require("../../modals/MaintenanceExpenses");
// const { Destination } = require("../../modals/Destination")
const { Serial_no } = require("../../modals/SerialNo");
const { User } = require("../../modals/User");

const view_advance = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_no = req.body.vehicle_no;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const transaction_no = req.body.transaction_no;

  if (transaction_no) {
    condition = { ...condition, transaction_no: transaction_no };
  }
  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }

  if (fromDate & toDate) {
    condition = {
      ...condition,
      advance_time: {
        $gte: fromDate,
        $lte: toDate,
      },
    };
  }

  console.log(condition, "advance");
  let advanceData = await Advance.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        vehicle_no: 1,
        location_name: 1,
        trip_no: 1,
        expense: 1,
        actual_expense: 1,
        remarks: 1,
        extra_expense_amount: 1,
        advance_office_label: 1,
        extra_remarks: 1,
        advance_id: 1,
        transaction_no: 1,
        oil_order_no: 1,
        advance_time: 1,
      },
    },
    {
      $addFields: {
        action_items: {
          can_view: true,
          can_edit: true,
          // can_delete: false,
          // can_activate: "$active_status" === "Y" ? false : true,
          // can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
    {
      $sort: {
        transaction_no: -1,
      },
    },
  ]);
  if (advanceData) {
    return res.status(200).json(advanceData);
  } else {
    return res.status(200).json([]);
  }
};

//loading update
const update_advance = async (req, res) => {
  const condition = { advance_id: req.body.advance_id };

  const transaction_no = req.body.transaction_no;

  if (transaction_no) {
    condition = { ...condition, transaction_no: transaction_no };
  }

  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.advance_list,
    data: condition,
  });
  // console.log(myData, "chech");
  // const changed = trackChange(myData.data[0], req.body)
  // if (myData.data[0].edit_log) {
  //     data.edit_log = ([JSON.stringify(changed), ...myData.data[0].edit_log]);
  // }
  // else {
  //     data.edit_log = JSON.stringify(changed);
  // }

  const advanceDetails = myData.data;
  data.edit_log = advanceDetails;

  await Advance.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

// /details
// const viewAdvanceDetails = async (req,res)=>{

//     const advance_id=req.body.advance_id
//     let details = await Advance.find({advance_id:advance_id})

//     if (details) {
//       return res.status(200).json(details);
//     } else {
//       return res.status(200).json([]);
//     }
//   }

const viewAdvanceDetails = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const advance_id = req.body.advance_id;

  if (advance_id) {
    condition = { ...condition, advance_id: advance_id };
  }

  let details = await Advance.aggregate([
    {
      $match: condition,
    },
  ]);

  if (details) {
    return res.status(200).json(details);
  } else {
    return res.status(200).json([]);
  }
};

module.exports = {
  view_advance,
  update_advance,
  viewAdvanceDetails,
};
