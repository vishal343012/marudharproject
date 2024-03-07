const router = require("express").Router();
const moment = require("moment");
const axios = require("axios");
const { apiURL } = require("../../config/config");
const { trackChange } = require("../../config/global");
const { apiList } = require("../../config/api");
var express = require("express");
var jsonDiff = require('json-diff')

//Schema
const { MaintenanceExpenses } = require('../../modals/MaintenanceExpenses')

const view_maintenanceExpenses = async (req, res) => {
    let condition = { deleted_by_id: 0 }
    console.log(req.body)
    const vehicle = req.body.vehicle;
    const fromDate = req.body.fromDate
    const toDate = req.body.toDate;
    const maintenanceExpensesNo = req.body.maintenance_expenses_no
    if (vehicle) {
        condition = { ...condition, vehicle: { $regex: vehicle, $options: "i" } }
    }

    if (maintenanceExpensesNo) {
        condition = { ...condition, maintenance_order_no: { $regex: maintenanceExpensesNo, $options: "i" } }
    }

    let maintenanceExpensesData = await MaintenanceExpenses.aggregate([
          {
            $match: condition
          },
        {
            $project: {
                _id: 0,
                expenses: 1,
                vehicle: 1,
                maintenance_expense_date: 1,
                maintenance_order_no: 1,
                action_items: 1
            }
        },
        {
            $addFields: {
                action_items: {
                    can_edit: true,
                    can_delete: false,
                    can_activate: "$active_status" === "Y" ? false : true,
                    can_deactivate: "$active_status" === "Y" ? true : false,
                }
            }
        },

    ]);

    if (maintenanceExpensesData) {
        return res.status(200).json(maintenanceExpensesData);
    } else {
        return res.status(200).json([]);
    }

};

module.exports = { view_maintenanceExpenses }