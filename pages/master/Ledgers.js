const router = require("express").Router();
const moment = require("moment");
const axios = require("axios");
const { apiURL } = require("../../config/config");
const { trackChange } = require("../../config/global");
const { apiList } = require("../../config/api");

var express = require("express");
var jsonDiff = require('json-diff')

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
  material_type

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
const { Material, Loading } = require("../../modals/Loading")
const { MaintenanceExpenses } = require("../../modals/MaintenanceExpenses")
// const { Destination } = require("../../modals/Destination")
const { Serial_no } = require("../../modals/SerialNo")
const { User } = require("../../modals/User");

const viewBankLedgerAccount = async (req, res) => {

  let bankList = await ledger_account.aggregate([
    {
      $match: {
        ledger_group_id: 3,
      }
    },
    {
      $project: {
        ledger_account_id: 1,
        ledger_account: 1,
      }
    }
  ])

  if (bankList) {

    return res.status(200).json(bankList);
  } else {
    return res.status(200).json([]);
  }
}

const updateLedgerClosing = async (req, res) => {

  const ledger_account_id = req.body.ledger_account_id
  const customerId = req.body.customerId
  const amount = req.body.amount
  let updateData = await ledger_account.findOneAndUpdate(
    {
      $or: [
        { ledger_account_id: ledger_account_id },
        { type_id: customerId }
      ]

    },
    {
      $inc: { "closingBalance": amount }
    },
  )

  if (updateData) {

    return res.status(200).json(updateData);
  } else {
    return res.status(200).json([]);
  }
}

const viewLedgerAccount = async (req, res) => {

  let condition = {};
  const typeId = req.body.typeId;
  const ledgerId = req.body.ledgerId;

  if (typeId) {
    condition = { ...condition, type_id: typeId };
  }

  if (ledgerId) {
    condition = { ...condition, ledger_account_id: ledgerId }
  }


  let bankList = await ledger_account.aggregate([
    {
      $match:  condition
      
    },
    {
      $project: {
        ledger_account_id: 1,
        ledger_account: 1,
        opening_balance:1,
        closingBalance:1,
        dr_cr_status:1,
      }
    }
  ])

  if (bankList) {
    return res.status(200).json(bankList);
  } else {
    return res.status(200).json([]);
  }
}
module.exports = { viewBankLedgerAccount, updateLedgerClosing, viewLedgerAccount }