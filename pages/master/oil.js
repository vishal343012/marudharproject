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

//For View Oil
const view_oil = async (req, res) => {
  let condition = {};
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const vehicle_no = req.body.vehicle_no;
  const oil_id = req.body.oil_id;
  const transaction_no = req.body.transaction_no;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const keyword = req.body.keyword;

  if (transaction_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: transaction_no, $options: "i" },
    };
  }
  if (oil_id) {
    condition = { ...condition, oil_id: oil_id };
  }

  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }
  if (keyword) {
    condition = {
      ...condition,
      $or: [
        { vehicle_no: { $regex: keyword, $options: "i" } },
        { transaction_no: { $regex: keyword, $options: "i" } },
        { petrol_pump: { $regex: keyword, $options: "i" } },
        { routes: { $regex: keyword, $options: "i" } },
        { fule_bill_no: { $regex: keyword, $options: "i" } },
      ],
    };
  }

  if (toDate && fromDate) {
    condition = {
      ...condition,
      oil_date: {
        $gte: fromDate,
        $lte: toDate,
      },
    };
  }

  let oilData = await Oil.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_view: true,
          can_edit: true,
          can_delete: false,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $lookup: {
        from: "t_000_petrol_pumps",
        let: { petrol_pump_id: "$petrol_pump_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$petrol_pump_id", "$petrol_pump_id"] } },
          },
          {
            $project: {
              petrol_pump: 1,
              _id: 0,
            },
          },
        ],
        as: "petrol_pump_details",
      },
    },
    {
      $addFields: {
        petrol_pump: { $first: "$petrol_pump_details.petrol_pump" },
      },
    },
    {
      $project: {
        vehicle_no: 1,
        km_start_reading: 1,
        km_end_reading: 1,
        purchase_oil: { $round: ["$purchase_oil", 2] },
        rate: 1,
        petrol_pump: 1,
        fule_bill_no: 1,
        fule_bill_date: 1,
        action_items: 1,
        oil_id: 1,
        total_amount: { $round: ["$total_amount"] },
        distance_cover: { $round: ["$distance_cover", 2] },
        oil_order_no: 1,
        transaction_no: 1,
        oil_date: 1,
      },
    },
    {
      $sort: {
        transaction_no: -1,
      },
    },
  ]);
  if (oilData) {
    return res.status(200).json(oilData);
  } else {
    return res.status(200).json([]);
  }
};

//get alloiled_vehicle_list
const oiled_vehicle_list = async (req, res) => {
  const advance_status = req.body.advance_status;

  const oiledData = await Oil.aggregate([
    {
      $match: {
        advance_status: advance_status,
      },
    },
    {
      $project: {
        _id: 0,
        transaction_no: 1,
        vehicle_id: 1,
        oil_order_no: 1,
        advance_status: 1,
        oil_id: 1,
        trip_no: 1,
        routes: 1,
        routes_name: 1,
        vehicle_no: 1,
        routes_id: 1,
        difference_Amount: 1,
      },
    },
    {
      $group: {
        _id: "$vehicle_id",
        transaction_no: { $first: "$transaction_no" },
        vehicle_id: { $first: "$vehicle_id" },
        vehicle_no: { $first: "$vehicle_no" },
        oil_order_no: { $first: "$oil_order_no" },
        advance_status: { $first: "$advance_status" },
        oil_id: { $first: "$oil_id" },
        trip_no: { $sum: "$trip_no" },
        routes: { $first: "$routes" },
        routes_name: { $first: "$routes_name" },
        routes_id: { $first: "$routes_id" },
        difference_Amount: { $first: "$difference_Amount" },
      },
    },
    {
      $lookup: {
        from: "t_000_routes",
        let: { routes_id: "$routes_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$routes_id", "$route_id"] } },
          },
          {
            $project: {
              amount: 1,
              _id: 0,
            },
          },
        ],
        as: "route_details",
      },
    },
    {
      $addFields: {
        route_amount: { $first: "$route_details.amount" },
        // trip_no: { $first: "$vehicle_details.trip_no" },
      },
    },
    {
      $unset: "route_details",
    },
  ]);
  if (oiledData) {
    return res.status(200).json(oiledData);
  } else {
    return res.status(200).json([]);
  }
};
//loading update
const update_oil = async (req, res) => {
  const condition = { oil_id: req.body.oil_id };
  const transaction_no = req.body.transaction_no;

  if (transaction_no) {
    condition = { ...condition, transaction_no: transaction_no };
  }

  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.oil_list,
    data: condition,
  });

  // const changed = trackChange(myData.data[0], req.body)
  // data.edit_log = ([JSON.stringify(changed), ...myData.data[0].edit_log]);

  const oilDetails = myData.data;
  data.edit_log = oilDetails;

  await Oil.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};
// total oil
const totalOiled = async (req, res) => {
  const data = await Serial_no.aggregate([
    {
      $project: {
        oil_no: 1,
      },
    },
  ]);

  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(200).json([]);
  }
};

//Vehicle dropDown
const vehicleDropDownOil = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const inTransit = req.body.inTransit;

  //inTransit
  if (inTransit === false) {
    condition = { ...condition, inTransit: inTransit };
  }

  let vehicleData = await vehicle.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
        trip_no: 1,
        km_start: 1,
        mileage: 1,
        km_end: 1,
        no_of_wheels: 1,
        vehicle_type: 1,

        insurance_expire_date: 1,
        pollution_expiry_date: 1,
        permit_expiry_date: 1,
        fitness_expiry_date: 1,
        loan_date: 1,
        bank_noc_date: 1,
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

// const vehicleDropDownOil = async (req, res) => {
//   let condition = { deleted_by_id: 0 };
//   const inTransit = req.body.inTransit;

//   // InTransit
//   if (inTransit === false) {
//     condition.inTransit = inTransit;
//   }

//   // Calculate the timestamp for 15 days from now
//   // const fifteenDaysFromNow = Math.floor(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).getTime() / 1000);

//    // Calculate the timestamp for 2 days from now
//   const twoDaysFromNow = Math.floor(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime() / 1000);

// // Calculate the timestamp
// // const currentDate = new Date();

//   let vehicleData = await vehicle.aggregate([
//     {
//       $match: {
//         ...condition,
//         $and: [
//           {
//             pollution_expiry_date: { $not: { $lte: twoDaysFromNow } },
//             insurance_expire_date: { $not: { $lte: twoDaysFromNow } },
//             permit_expiry_date: { $not: { $lte: twoDaysFromNow } },
//             fitness_expiry_date: { $not: { $lte: twoDaysFromNow } },
//             loan_date: { $not: { $lte: twoDaysFromNow } },
//             bank_noc_date: { $not: { $lte: twoDaysFromNow } },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         vehicle_id: 1,
//         vehicle_no: 1,
//         trip_no: 1,
//         km_start: 1,
//         mileage: 1,
//         km_end: 1,
//         no_of_wheels: 1,
//         vehicle_type: 1,
//       },
//     },
//     {
//       $sort: {
//         vehicle_no: 1,
//       },
//     },
//   ]);

//   if (vehicleData) {
//     return res.status(200).json(vehicleData);
//   } else {
//     return res.status(200).json([]);
//   }
// };

//Petrol_pump
const petrolPumpDropDown = async (req, res) => {
  let condition = {};

  const routes_id = req.body.routes_id;

  if (routes_id) {
    condition = { ...condition, route_id: routes_id };
  }
  console.log(condition);
  let petrol_pumpData = await petrol_pump.aggregate([
    {
      $match: condition,
    },
    {
      $sort: {
        petrol_pump: 1,
      },
    },
    {
      $project: {
        petrol_pump_id: 1,
        petrol_pump: 1,
        rate: 1,
      },
    },
  ]);

  if (petrol_pumpData) {
    return res.status(200).json(petrol_pumpData);
  } else {
    return res.status(200).json([]);
  }
};

const viewDetails = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const oil_id = req.body.oil_id;

  if (oil_id) {
    condition = { ...condition, oil_id: oil_id };
  }

  let details = await Oil.aggregate([
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "t_000_routes",
        let: { routes_id: "$routes_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$routes_id", "$route_id"] } },
          },
          {
            $project: {
              truck_type: 1,
              wheel: 1,
              _id: 0,
            },
          },
        ],
        as: "route_details",
      },
    },
    {
      $addFields: {
        vehicle_type: { $first: "$route_details.truck_type" },
        wheel: { $first: "$route_details.wheel" },
      },
    },
  ]);

  if (details) {
    return res.status(200).json(details);
  } else {
    return res.status(200).json([]);
  }
};

const viewTransaction = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  const vehicle_id = req.body.vehicle_id;

  console.log(vehicle_id);

  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }
  let oilData = await Oil.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$vehicle_id", vehicle_id],
        },
      },
    },
    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
        transaction_no: 1,
        routes_name: 1,
      },
    },
  ]);
  if (oilData) {
    return res.status(200).json(oilData);
  } else {
    return res.status(200).json([]);
  }
};

const oil_vehicle_ExpiryDate_List = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const inTransit = req.body.inTransit;
  console.log(
    Math.floor(
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
    ),
    "sankh15"
  );

  if (inTransit === false) {
    condition = { ...condition, inTransit: inTransit };
  }

  const expiry_date = await vehicle.aggregate([
    // {
    //   $match:{condition}
    // },

    {
      $match: {
        deleted_by_id: 0,
        $or: [
          {
            pollution_expiry_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },
            insurance_expire_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },

            permit_expiry_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },

            fitness_expiry_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },
            // loan_date: {
            //   $lte: Math.floor(
            //     new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
            //   ),
            // },
            // bank_noc_date: {
            //   $lte: Math.floor(
            //     new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
            //   ),
            // },
          },
        ],
      },
    },

    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,

        insurance_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "insurance_expire_date",
              ],
            },
            then: { $ifNull: ["$insurance_number", 0] },
            else: 0,
          },
        },
        insurance_expire_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "insurance_expire_date",
              ],
            },
            then: "$insurance_expire_date",
            else: 0,
          },
        },
        pollution_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "pollution_expiry_date",
              ],
            },
            then: { $ifNull: ["$pollution_number", 0] },
            else: 0,
          },
        },
        pollution_expiry_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "pollution_expiry_date",
              ],
            },
            then: "$pollution_expiry_date",
            else: 0,
          },
        },

        permit_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "permit_expiry_date",
              ],
            },
            then: { $ifNull: ["$permit_number", 0] },
            else: 0,
          },
        },
        permit_expiry_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "permit_expiry_date",
              ],
            },
            then: "$permit_expiry_date",
            else: 0,
          },
        },

        fitness_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "fitness_expiry_date",
              ],
            },
            then: { $ifNull: ["$fitness_number", 0] },
            else: 0,
          },
        },
        fitness_expiry_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "fitness_expiry_date",
              ],
            },
            then: "$fitness_expiry_date",
            else: 0,
          },
        },

        // loan_number: {
        //   $cond: {
        //     if: {
        //       $lte: [
        //         Math.floor(
        //           new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
        //             1000
        //         ),
        //         "loan_date",
        //       ],
        //     },
        //     then: { $ifNull: ["$loan_number", 0] },
        //     else: 0,
        //   },
        // },
        // loan_date: {
        //   $cond: {
        //     if: {
        //       $lte: [
        //         Math.floor(
        //           new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
        //             1000
        //         ),
        //         "loan_date",
        //       ],
        //     },
        //     then: "$loan_date",
        //     else: 0,
        //   },
        // },

        // bank_noc_number: {
        //   $cond: {
        //     if: {
        //       $lte: [
        //         Math.floor(
        //           new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
        //             1000
        //         ),
        //         "bank_noc_date",
        //       ],
        //     },
        //     then: { $ifNull: ["$bank_noc_number", 0] },
        //     else: 0,
        //   },
        // },
        // bank_noc_date: {
        //   $cond: {
        //     if: {
        //       $lte: [
        //         Math.floor(
        //           new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
        //             1000
        //         ),
        //         "bank_noc_date",
        //       ],
        //     },
        //     then: "$bank_noc_date",
        //     else: 0,
        //   },
        // },
      },
    },
    {
      $group: {
        _id: "$vehicle_id",
        vehicle_id: { $first: "$vehicle_id" },
        vehicle_no: { $first: "$vehicle_no" },
        document_expirations: {
          $push: {
            $concatArrays: [
              [
                {
                  document_name: "Insurance",
                  document_number: "$insurance_number",
                  expiry_date: "$insurance_expire_date",
                },
              ],
              [
                {
                  document_name: "Pollution",
                  document_number: "$pollution_number",
                  expiry_date: "$pollution_expiry_date",
                },
              ],
              [
                {
                  document_name: "Permit",
                  document_number: "$permit_number",
                  expiry_date: "$permit_expiry_date",
                },
              ],
              [
                {
                  document_name: "Fitness",
                  document_number: "$fitness_number",
                  expiry_date: "$fitness_expiry_date",
                },
              ],
              // [
              //   {
              //     document_name: "Bank_noc",
              //     document_number: "$bank_noc_number",
              //     expiry_date: "$bank_noc_date",
              //   },
              // ],
            ],
          },
        },
      },
    },
  ]);

  if (expiry_date) {
    return res.status(200).json(expiry_date);
  } else {
    res.status(200).json([]);
  }
};
module.exports = {
  view_oil,
  totalOiled,
  update_oil,
  oiled_vehicle_list,
  vehicleDropDownOil,
  petrolPumpDropDown,
  viewDetails,
  viewTransaction,
  oil_vehicle_ExpiryDate_List,
};
