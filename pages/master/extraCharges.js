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
const { ExtraCharges } = require("../../modals/Extracharges");


//For View Oil
const view_extraCharges = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  
  const vehicle_no = req.body.vehicle_no;
  
  if (vehicle_no) {
    condition = { ...condition, vehicle_no: { $regex: vehicle_no, $options: "i" } };
  }
  let extraChargesData = await ExtraCharges.aggregate([
    {
      $match: condition
    },
    {
      $addFields: {
        action_items: {
          can_view: true,
          can_edit: true,
          can_delete: false,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,

        }
      }
    },
    {
      $project: {
        action_items:1,
        "vehicle_no": 1,
        transaction_no:1,
        extraChargesType:"$extraCharges.ddl_extra_charges_type_name"

    
      },
    },
  ]);
  if (extraChargesData) {

    return res.status(200).json(extraChargesData);
  } else {
    return res.status(200).json([]);
  }



};


const viewextraChargesDetails = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const id = req.body.id;

  if (id) {
    condition = { ...condition, extraCharges_id: id };
  }



  let details = await ExtraCharges.aggregate([
    {
      $match: condition,
    },
  ]);

  if (details) {
    return res.status(200).json(details);
  } else {
    return res.status(200).json([]);
  }
}


const update_extraCharges = async (req, res) => {
console.log(req.body,"sank07022023")

  const condition = { extraCharges_id: req.body.extraCharges_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.extraCharges_List,
    data: condition,
    
  });
  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  const extraChargesDetails = myData.data;
  data.edit_log = extraChargesDetails;

  await ExtraCharges.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};



module.exports = {
    view_extraCharges,
    viewextraChargesDetails,
    update_extraCharges

}