const router = require("express").Router();
const moment = require("moment");
const axios = require("axios");
const { apiURL } = require("../../config/config");
const { trackChange } = require("../../config/global");
const { apiList } = require("../../config/api");

var express = require("express");
var jsonDiff = require("json-diff");

const {
  TyreFitting,
  RejectedTyre,
  RejectedTyreSales,
} = require("../../modals/TyreFitting");
const {
  tyre_details,
  vehicle,
  purchaseReturnTyre,
} = require("../../modals/Master");

const view_tyreFitting = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_no = req.body.vehicle_no;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;

  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      fitting_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }

  let tyreFittingData = await TyreFitting.aggregate([
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
      $project: {
        vehicle_no: 1,
        action_items: 1,
        brand_label: 1,
        tracking_date: 1,
        remarks: 1,
        model_name: 1,
        fitting_km: 1,
        barcode: 1,
        amount: 1,
        tyrecondition_no_label: 1,
        fitting_date: 1,
        position_no_label: 1,
        TyreFitting_id: 1,
      },
    },
  ]);
  if (tyreFittingData) {
    return res.status(200).json(tyreFittingData);
  } else {
    return res.status(200).json([]);
  }
};

//edit
const update_tyreFitting = async (req, res) => {
  const condition = { TyreFitting_id: req.body.TyreFitting_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.tyreFitting_List,
    data: condition,
  });

  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  const tyreFittingDetails = myData.data;
  data.edit_log = tyreFittingDetails;

  await TyreFitting.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const tyreFittingDetails = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const id = req.body.id;

  if (id) {
    condition = { ...condition, TyreFitting_id: id };
  }

  let details = await TyreFitting.aggregate([
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

const rejectedTyreDetailsUpdate = async (req, res) => {
  const barcode = req.body.barcode;
  const vehicle_id = req.body.vehicle_id;
  const rejected_id = req.body.rejected_id;
  const rejected_no = req.body.rejected_no;
  let updateData = await tyre_details.findOneAndUpdate(
    {
      "tyre_details.ddl_vehicle_no_id": vehicle_id,
      "tyre_details.txt_barcode": barcode,
    },
    {
      $set: {
        "tyre_details.$.rejected": true,
        "tyre_details.$.rejected_no": rejected_no,
        "tyre_details.$.rejected_id": rejected_id,
      },
    },
    {
      new: true,
      arrayFilters: [{ "tyre_details.txt_barcode": "barcode" }],
    }
  );

  if (updateData) {
    return res.status(200).json(updateData);
  } else {
    return res.status(200).json([]);
  }
};

const tyreFittingDetailsUpdate = async (req, res) => {
  try {
    const data = req.body.data;
    const vehicle_id = req.body.vehicle_id;

    // Using { upsert: true } to create a new document if it doesn't exist
    let updateData = await tyre_details.findOneAndUpdate(
      { vehicle_id: vehicle_id },
      { $push: { tyre_details: data } },
      { new: true, upsert: true }
    );

    if (updateData) {
      return res.status(200).json(updateData);
    } else {
      return res.status(500).json({ error: "Empty response" });
    }
  } catch (error) {
    console.error("Error in tyreFittingDetailsUpdate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const tyreFittingDetailsUpdate = async (req, res) => {
//   const data = req.body.data;
//   const vehicle_id = req.body.vehicle_id;
//   let updateData = await tyre_details.findOneAndUpdate(
//     {
//       vehicle_id: vehicle_id,
//     },
//     {
//       $push: {
//         tyre_details: data,
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   if (updateData) {
//     return res.status(200).json(updateData);
//   } else {
//     return res.status(200).json([]);
//   }
// };

//New Update include interchange

// const tyreFittingDetailsUpdate = async (req, res) => {
//   const data = req.body.data;
//   const vehicle_id = req.body.vehicle_id;

//   try {

//     let document = await tyre_details.findOne({ vehicle_id });

//     if (document) {

//       document.tyre_details.forEach((tyreDetail) => {

//         if (
//           tyreDetail.vehicle_no === data.vehicle_no_from &&
//           tyreDetail.barcode === data.barcode_from
//         ) {

//           tyreDetail.vehicle_no = data.vehicle_no_to;
//           tyreDetail.barcode = data.barcode_to;
//         }
//       });

//       document = await document.save();

//       return res.status(200).json(document);
//     } else {
//       return res.status(404).json({ error: 'Document not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const tyreFittingDetailsUpdate = async (req, res) => {
//   try {
//     const {
//       ddl_barcode_From_label,
//       ddl_barcode_To_label,
//       ddl_vehicle_From_id,
//       ddl_vehicle_To_id,
//     } = req.body.data;

//     const documentFrom = await tyre_details.findOne({
//       vehicle_id: ddl_vehicle_From_id,
//     });
//     const documentTo = await tyre_details.findOne({
//       vehicle_id: ddl_vehicle_To_id,
//     });

//     if (!documentFrom || !documentTo) {
//       return res.status(404).json({ error: "Document not found" });
//     }

//     const fromIndex = documentFrom.tyre_details.findIndex(

//       (tyre) => tyre.txt_barcode === ddl_barcode_From_label
//     );
//     const toIndex = documentTo.tyre_details.findIndex(
//       (tyre) => tyre.txt_barcode === ddl_barcode_To_label
//     );

//     if (fromIndex === -1 || toIndex === -1) {
//       return res
//         .status(404)
//         .json({ error: "Barcode not found in the document" });
//     }

//     // Swap the tyre_details
//     const temp = documentFrom.tyre_details[fromIndex];
//     documentFrom.tyre_details[fromIndex] = documentTo.tyre_details[toIndex];
//     documentTo.tyre_details[toIndex] = temp;

//     // Update barcode information in swapped tyre_details
//     documentFrom.tyre_details[fromIndex].txt_barcode = ddl_barcode_From_label;
//     documentTo.tyre_details[toIndex].txt_barcode = ddl_barcode_To_label;

//     await Promise.all([documentFrom.save(), documentTo.save()]);

//     return res.status(200).json({ documentFrom, documentTo });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const vehicleRejectedTyreUpdate = async (req, res) => {
//   const barcode = req.body.barcode
//   const vehicle_id = req.body.vehicle_id
//   let updateData = await vehicle.findOneAndUpdate({
//     "vehicle_id": vehicle_id,
//   },
//     {
//       $inc: {
//         "rejected_count": 1,
//       }
//     },
//     {
//       new: true,
//     }
//   )

//   if (updateData) {

//     return res.status(200).json(updateData);
//   } else {
//     return res.status(200).json([]);
//   }
// }

const vehicleRejectedTyreUpdate = async (req, res) => {
  try {
    const barcode = req.body.barcode;
    const vehicle_id = req.body.vehicle_id;

    let updateData = await vehicle.findOneAndUpdate(
      { vehicle_id: vehicle_id },
      { $inc: { rejected_count: 1 } },
      { new: true }
    );

    if (updateData) {
      return res.status(200).json(updateData);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectedTyreList = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const rejected_tyre = req.body.rejected_tyre;

  const vehicle_no = req.body.vehicle_no;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;

  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }
  if (rejected_tyre && rejected_tyre.trim() !== "") {
    condition = {
      ...condition,
      rejected_tyre: { $regex: rejected_tyre, $options: "i" },
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      rejected_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }

  const rejectedData = await RejectedTyre.aggregate([
    {
      $match: {
        // vehicle_id: vehicle_id,
        rejected_tyre: false,
      },
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
      $project: {
        action_items: 1,
        rejected_date: 1,
        vehicle_no: 1,
        vehicle_id: 1,
        barcode: 1,
        tyrecondition: 1,
        remove_km: 1,
        fitting_km: 1,
        total_use_km: 1,
        amount: 1,
        perKm_cost: 1,
        company_name: 1,
        model_name: 1,
        position: 1,
        remarks: 1,
        rejected_tyre_id: 1,
      },
    },

    {
      $lookup: {
        from: "t_000_vehicles",
        let: { vehicle_id: "$vehicle_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] } },
          },
          {
            $project: {
              // trip_no: { $ifNull: ["$trip_no", 0] },
              rejected_count: 1,
            },
          },
        ],
        as: "vehicle",
      },
    },
    { $addFields: { rejected_count: { $first: "$vehicle.rejected_count" } } },
    {
      $sort: {
        rejected_date: 1,
      },
    },
  ]);
  console.log(rejectedData);
  if (rejectedData) {
    return res.status(200).json(rejectedData);
  } else {
    return res.status(200).json([]);
  }
};

const updateRejectTyre = async (req, res) => {
  const condition = {
    rejected_tyre_id: req.body.rejected_tyre_id,
  };
  const data = req.body;
  console.log(req.body, "bodyyy");
  data.edited_by_id = req.body.edited_by_id;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.rejectedTyre_List,
    data: condition,
  });

  // const changed = trackChange(myData.data[0], req.body);

  // if (myData.data[0].edit_log) {
  //   data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
  // } else {
  //   data.edit_log = JSON.stringify(changed);
  // }

  const rejectedTyre = myData.data;
  data.edit_log = rejectedTyre;

  await RejectedTyre.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const viewRejectedTyre = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const id = req.body.id;

  if (id) {
    condition = { ...condition, rejected_tyre_id: id };
  }

  let details = await RejectedTyre.aggregate([
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

const rejectedTyreUpdate = async (req, res) => {
  const condition = { rejected_tyre_id: req.body.rejected_tyre_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.rejectedTyre_List,
    data: condition,
  });

  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  const rejectedTyreDetails = myData.data;
  data.barcode_From_no = rejectedTyreDetails[0].barcode_To_no;
  data.barcode_To_no = rejectedTyreDetails[0].barcode_From_no;

  data.edit_log = rejectedTyreDetails;

  await RejectedTyre.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const rejectedTyreDetails = async (req, res) => {
  // const data = req.body.data;
  // const rejected_tyre_id = req.body.rejected_tyre_id;
  let condition = { deleted_by_id: 0 };
  const id = req.body.id;

  if (id) {
    condition = { ...condition, rejected_tyre_id: id };
  }

  let details = await RejectedTyre.aggregate([
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

const vehicleFitting = async (req, res) => {
  let vehicleData = await vehicle.aggregate([
    {
      $match: { rejected_count: { $gt: 0 } },
    },
    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
        rejected_count: 1,
        km_start: 1,
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

const barcode_type = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  let service_type = await RejectedTyreSales.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        service_type_id: 1,
        service_type_label: 1,
        barcode_id: 1,
        barcode: 1,
      },
    },
  ]);
  if (service_type) {
    return res.status(200).json(service_type);
  } else {
    return res.status(200).json([]);
  }
};

const view_rejectedTyreSale = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_no = req.body.vehicle_no;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;

  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      rejected_sales_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }
  let rejectedTyreSalesData = await RejectedTyreSales.aggregate([
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
      $project: {
        action_items: 1,
        rejected_tyre_Sales_id: 1,
        rejected_sales_date: 1,
        barcode_id: 1,
        barcode: 1,
        amount: 1,
        vendoramount: 1,
        vendor_id: 1,
        vendor_name: 1,
        salesOffice_id: 1,
        salesOffice_name: 1,
        approve_id: 1,
        approve_name: 1,
        company_name: 1,
        model_name: 1,
        position: 1,
        service_type_id: 1,
        service_type_label: 1,
      },
    },
  ]);
  if (rejectedTyreSalesData) {
    return res.status(200).json(rejectedTyreSalesData);
  } else {
    return res.status(200).json([]);
  }
};

const rejectedTyreSalesDetails = async (req, res) => {
  const data = req.body.data;
  const rejected_tyre_Sales_id = req.body.rejected_tyre_Sales_id;
  // console.log(rejected_tyre_Sales_id, "sankdetails");

  let details = await RejectedTyreSales.findOneAndUpdate(
    { rejected_tyre_Sales_id: rejected_tyre_Sales_id },
    {
      $push: {
        RejectedTyreSales: data,
      },
    }
  );

  if (details) {
    return res.status(200).json(details);
  } else {
    return res.status(200).json([]);
  }
};

//edit
const update_rejectedTyreSales = async (req, res) => {
  console.log(req.body, "06022023");
  const condition = { vehicle_id: req.body.vehicle_id };
  const data = req.body;
  // data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.rejectedTyreSales_List,
    data: condition,
  });

  // const changed = trackChange(myData.data, req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data.edit_log];

  const rejectedTyreSalesDetails = myData.data;
  data.edit_log = rejectedTyreSalesDetails;

  await RejectedTyre.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

// api for tyre fitting barcode new and repair

// const barcode_Tyre_Fitting = async (req, res) => {
//   try{
//   const rejectedTyreSalesData = await RejectedTyreSales.aggregate([
//     {
//       $match: {
//         service_type_id: 2,
//       },
//     },

//     {
//       $project: {
//         rejected_tyre_Sales_id: 1,
//         rejected_sales_date: 1,
//         barcode_id: 1,
//         barcode: 1,
//         service_type_id: 1,
//         service_type_label: 1,
//       },
//     },
//   ]);

//   const newtyreData = await tyre_details.aggregate([
//     {
//       $match: {
//         vehicle_status: "N",
//       },
//     },

//     {
//       $project: {
//         tyre_details: 1,

//       },
//     },
//   ]);

//   if (rejectedTyreSalesData || newtyreData) {
//     return res.status(200).json(rejectedTyreSalesData,newtyreData);
//   } else {
//     return res.status(200).json([]);
//   }
// } catch (error){
//   return res
//   .status(500)
//   .json({error: "Internal Server Error. Please try again later."})
// }
// };

//previous code for tyre fitting
// const barcode_Tyre_Fitting = async (req, res) => {
//   try {
//     const rejectedTyreSalesData = await RejectedTyreSales.aggregate([
//       {
//         $match: {
//           service_type_id: 2,
//         },
//       },
//       {
//         $project: {
//           rejected_tyre_Sales_id: 1,
//           rejected_sales_date: 1,
//           barcode_id: 1,
//           barcode: 1,
//           service_type_id: 1,
//           service_type_label: 1,
//           model:"$model_name",
//           brand:"$company_name",

//         },
//       },
//     ]);

//     const newtyreData = await tyre_details.aggregate([
//       {
//         $match: {
//           vehicle_status: "N",
//         },
//       },
//       {
//         $unwind: "$tyre_details",
//       },
//       {
//         $addFields: {
//           barcode: "$tyre_details.txt_barcode",
//           brand:"$tyre_details.ddl_brand_label",
//           brand_id:"$tyre_details.ddl_brand_id",
//           tyre_date:"$tyre_details.tyre_date",
//           model:"$tyre_details.ddl_model_label",
//           model_id:"$tyre_details.ddl_model_id",
//           txt_amount:"$tyre_details.txt_amount",

//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           tyre_details: 0,
//         },
//       },
//     ]);

//     const combinedData = rejectedTyreSalesData.concat(newtyreData);

//     if (combinedData.length > 0) {
//       return res.status(200).json(combinedData);
//     } else {
//       return res.status(200).json([]);
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: "Internal Server Error. Please try again later." });
//   }
// };

//barcode for tyre fitting using purchaseReturnTyre Schema

const barcode_Tyre_Fitting = async (req, res) => {
  // let condition = { deleted_by_id: 0 };

  let service_type = await purchaseReturnTyre.aggregate([
    { $unwind: "$tyre_details" },

    {
      $project: {
        _id: "",
        tyre_Type_id: "$tyre_details.ddl_Tyre_Type_id",
        tyre_Type_name: "$tyre_details.ddl_Tyre_Type_label",
        brand_id: "$tyre_details.brand_id",
        brand_name: "$tyre_details.ddl_brand_label",
        model_id: "$tyre_details.model_id",
        model_name: "$tyre_details.ddl_model_label",
        barcode: "$tyre_details.txt_barcode",
        tyrecondition_no_name: "$tyre_details.ddl_tyrecondition_no_label",
        amount: "$tyre_details.txt_amount",
      },
    },
  ]);
  if (service_type) {
    return res.status(200).json(service_type);
  } else {
    return res.status(200).json([]);
  }
};

//rejected tyre barcode api

const rejected_Tyre_barcode = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_id = req.body.vehicle_id;

  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }

  let service_type = await RejectedTyre.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
        barcode_id: 1,
        barcode: 1,
        position: 1,
      },
    },
    // {
    //   $group: {
    //     _id: "$vehicle_id",
    //     vehicle_no: { $first: "$vehicle_no" },
    //     barcode_id: { $first: "$barcode_id" },
    //     barcode: { $first: "$barcode" },
    //     position: { $first: "$position" },

    //   },
    // },
  ]);
  if (service_type) {
    return res.status(200).json(service_type);
  } else {
    return res.status(200).json([]);
  }
};

const repairTyre_List = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  let repair_tyre = await RejectedTyreSales.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        barcode_id: 1,
        barcode: 1,
        company_name: 1,
        position: 1,
        model_name: 1,
        vendoramount: 1,
      },
    },
  ]);
  if (repair_tyre) {
    return res.status(200).json(repair_tyre);
  } else {
    return res.status(200).json([]);
  }
};

const editRepairTyre = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const purchaseReturnTyre_id = req.body.purchaseReturnTyre_id;

  if (purchaseReturnTyre_id) {
    condition = { ...condition, purchaseReturnTyre_id: purchaseReturnTyre_id };
  }

  let details = await purchaseReturnTyre.aggregate([
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

// const updatePurchaseReturnTyre = async (req, res) => {
//   const condition = { "tyre_details._id": req.body.tyre_details._id };
//   const data = req.body;
//   data.edited_by_id = 10;
//   data.edit_by_date = moment().format("X");

//   const myData = await axios({
//     method: "post",
//     url: apiURL + apiList.repairTyre_list,
//     data: condition,
//   });

//   // const changed = trackChange(myData.data[0], req.body);
//   // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

//   const rejectedTyreDetails = myData.data;
//   data.edit_log = rejectedTyreDetails;

//   await RejectedTyre.findOneAndUpdate(condition, data, (err, obj) => {
//     if (err) {
//       return res.status(500).json({ Error: err });
//     }
//     return res.status(200).json(obj);
//   });
// };

// const updatePurchaseReturnTyre = async (req, res) => {

//   if (!req.body.tyre_details || !req.body.tyre_details._id) {
//     return res.status(400).json({ Error: "Invalid request body" });
//   }
//   const { _id, ...updateData } = req.body.tyre_details;
//   const condition = { "tyre_details._id": _id };
//   const edited_by_id = 10;
//   const edit_by_date = moment().format("X");

//   try {

//     const response = await axios.post(apiURL + apiList.repairTyre_list, condition);
//     const existingData = response.data[0];

//     if (!existingData) {
//       return res.status(404).json({ Error: "Record not found" });
//     }

//     // Merge the update data with the existing data
//     const updatedData = {
//       ...existingData,
//       ...updateData,
//       edited_by_id,
//       edit_by_date,
//     };

//     const updatedObject = await purchaseReturnTyre.findOneAndUpdate(condition, updatedData, {
//       new: true,
//     });

//     return res.status(200).json(updatedObject);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ Error: "Internal server error" });
//   }
// };

const updatePurchaseReturnTyre = async (req, res) => {
  try {
    // Ensure that req.body.tyre_details and req.body.tyre_details._id exist
    if (!req.body.tyre_details || !req.body.tyre_details._id) {
      return res.status(400).json({ Error: "Invalid request body" });
    }

    const { _id, ...updateData } = req.body.tyre_details;
    const condition = { "tyre_details._id": _id };
    const edited_by_id = 10;
    const edit_by_date = moment().format("X");

    const response = await axios.post(
      apiURL + apiList.repairTyre_list,
      condition
    );
    const existingData = response.data[0];

    if (!existingData) {
      return res.status(404).json({ Error: "Record not found" });
    }

    const updatedData = {
      ...existingData,
      ...updateData,
      edited_by_id,
      edit_by_date,
    };

    const updatedObject = await purchaseReturnTyre.findOneAndUpdate(
      condition,
      updatedData,
      {
        new: true,
      }
    );

    return res.status(200).json(updatedObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

module.exports = updatePurchaseReturnTyre;

const rejectedTyreSales_view = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const rejected_tyre_Sales_id = req.body.rejected_tyre_Sales_id;

  if (rejected_tyre_Sales_id) {
    condition = {
      ...condition,
      rejected_tyre_Sales_id: rejected_tyre_Sales_id,
    };
  }

  let repair_tyre = await RejectedTyreSales.aggregate([
    {
      $match: condition,
    },
    // {
    //   $project: {

    //     barcode_id: 1,
    //     barcode: 1,
    //     company_name:1,
    //     position:1,
    //     model_name:1,
    //     vendoramount:1,
    //   },
    // },
  ]);
  if (repair_tyre) {
    return res.status(200).json(repair_tyre);
  } else {
    return res.status(200).json([]);
  }
};

//interchange list
const view_tyreFitting_interChange = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_no = req.body.vehicle_no;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;

  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      fitting_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }

  let tyreFittingData = await tyre_details.aggregate([
   
    {
      $match: {
        ...condition,
        interchange: true
      }

    },

    // {
    //   $addFields: {
    //     action_items: {
    //       can_view: true,
    //       can_edit: true,
    //       can_delete: false,
    //       can_activate: "$active_status" === "Y" ? false : true,
    //       can_deactivate: "$active_status" === "Y" ? true : false,
    //     },
    //   },
    // },

    // {
    //   $project: {
    //     vehicle_From_id: 1,
    //     vehicle_From_no: 1,
    //     vehicle_To_id: 1,
    //     vehicle_To_no: 1,
    //     barcode_From_no: 1,
    //     barcode_To_no: 1,
    //     fitting_date: 1,
    //   },
    // },

    // {
    //   $lookup: {
    //     from: "t_000_tyre_details",
    //     let: { vehicle_From_id: "$vehicle_From_id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$ddl_vehicle_no_id", "$$vehicle_From_id"] },
    //               { $eq: ["$interchange", true] },
    //             ],
    //           },
    //         },
    //       },
    //       {$unset:["tyre_details"]},
    //       {
    //         $project: {
    //           ddl_vehicle_no_id: 1,
    //           ddl_vehicle_no_label: 1,
    //           ddl_tyrecondition_no_label: 1,
    //           txt_barcode: 1,
    //           tyre_date: 1,
    //           ddl_brand_label: 1,
    //           ddl_model_label: 1,
    //           txt_amount: 1,
    //           txt_fitting_km: 1,
    //         },
    //       },
    //     ],
    //     as: "interchange_data",
    //   },
    // },
    // {
    //   $addFields:{
    //     vehicle_id : {$first:"$interchange_data.ddl_vehicle_no_id"}
    //   }
    // }
  ]);
  if (tyreFittingData) {
    return res.status(200).json(tyreFittingData);
  } else {
    return res.status(200).json([]);
  }
};

module.exports = {
  view_tyreFitting,
  view_tyreFitting_interChange,
  rejectedTyreDetailsUpdate,
  rejectedTyreList,
  updateRejectTyre,
  vehicleRejectedTyreUpdate,
  vehicleFitting,
  tyreFittingDetailsUpdate,
  view_rejectedTyreSale,
  rejectedTyreSalesDetails,
  update_rejectedTyreSales,
  viewRejectedTyre,
  rejectedTyreUpdate,
  rejectedTyreDetails,
  update_tyreFitting,
  tyreFittingDetails,
  barcode_type,
  barcode_Tyre_Fitting,
  rejected_Tyre_barcode,
  repairTyre_List,
  editRepairTyre,
  updatePurchaseReturnTyre,
  rejectedTyreSales_view,
};
