const router = require("express").Router();
const moment = require("moment");
const axios = require("axios");
const { apiURL } = require("../../config/config");
const { trackChange } = require("../../config/global");
const { apiList } = require("../../config/api");

// const stripe = require('stripe')('sk_test_51O8eTrSHonwzBW2rYvT514uZBzIMayXVQVklUpzpV5EBDsamdspLfbe8y83m72ej8J6HWfQMccdlJMTxKmfxH6LL007H1AyNPK');

var express = require("express");
var jsonDiff = require("json-diff");

const {
  role,
  vehicle,
  services,
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
  policeStation,
  Parking,
  motorVehicleLegislation,
  lab,
  kata,
  tyre_model,
  tyre_details,
  category,
  brand,
  item,
  receiptSalesVehicle,
  distanceCover,
  purchaseReturnTyre,
  breakDown,
} = require("../../modals/Master");
const {
  tax_master,
  ledger_account,
  ledger_group,
  primary_group,
  journal,
  receipt_payment,
} = require("../../modals/MasterAccounts");

var isoDate = new Date().toISOString();
var isodate = require("isodate");

const { Oil } = require("../../modals/Oil");
const { salesCumDispatch } = require("../../modals/Sales_cum_dispatch");
const { Advance } = require("../../modals/Advance");
const { Material, Loading } = require("../../modals/Loading");
const { MaintenanceExpenses, Maintenance } = require("../../modals/MaintenanceExpenses");
const { Tracking } = require("../../modals/Tracking");

const { ExtraCharges } = require("../../modals/Extracharges");

const { Serial_no } = require("../../modals/SerialNo");
const { User } = require("../../modals/User");
const {
  TyreFitting,
  RejectedTyre,
  RejectedTyreSales,
} = require("../../modals/TyreFitting");
// const { pipeline } = require("nodemailer/lib/xoauth2");

const { vendor } = require("../../modals/Vendor");
const { purchase } = require("../../modals/Purchase");

const   generateSerialNumber = async (serialType, inserted_date) => {
  const allSerial_no = await Serial_no.find({}, (err, allEnq) => {
    if (err) {
      return 1;
    } else {
      return allEnq;
    }
  });

  let retSerialNumber = 0;
  let transactionSerialNumber = 0;

  let data = {};
  let condition = {};
  const zeroPrefix = ["0000", "000", "00", "0"];
  const routeZeroPrefix = ["00", "0"];

  let insertedYear = moment(inserted_date * 1000).format("YY");
  let insertedMonth = moment(inserted_date * 1000).format("MM");
  // let dateRange = ''
  // if (Number(insertedMonth) <= 3) {
  //   dateRange = `${Number(insertedYear) - 1}-${Number(insertedYear)}`
  // } else {
  //   dateRange = `${Number(insertedYear)}-${Number(insertedYear) + 1}`
  // }
  let dateRange = "22-23";

  if (serialType === "oil") {
    console.log("sen12", allSerial_no[0]["oil_no"]);

    retSerialNumber = allSerial_no[0]["oil_no"] + 1;
    transactionSerialNumber = allSerial_no[0]["transaction_no"] + 1;
    // Update the sequence
    data = { oil_no: retSerialNumber, transaction_no: transactionSerialNumber };

    zeroPrefix[transactionSerialNumber.toString().length - 1]
      ? (transactionSerialNumber =
          "TS/TN/" +
          dateRange +
          "/" +
          zeroPrefix[transactionSerialNumber.toString().length - 1] +
          transactionSerialNumber)
      : (transactionSerialNumber =
          "TS/TN/" + dateRange + "/" + transactionSerialNumber);

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/OO/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/OO/" + dateRange + "/" + retSerialNumber);

    console.log(retSerialNumber, transactionSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return { retSerialNumber, transactionSerialNumber };
  } else if (serialType === "loading") {
    retSerialNumber = allSerial_no[0]["loading_no"] + 1;

    // Update the sequence
    data = { loading_no: retSerialNumber };

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/LO/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/LO/" + dateRange + "/" + retSerialNumber);

    console.log(retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "sales") {
    retSerialNumber = allSerial_no[0]["salesDispatch_no"] + 1;

    // Update the sequence
    data = { salesDispatch_no: retSerialNumber };

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/SD/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/SD/" + dateRange + "/" + retSerialNumber);

    console.log(retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "advance") {
    retSerialNumber = allSerial_no[0]["advance_no"] + 1;

    // Update the sequence
    data = { advance_no: retSerialNumber };
    console.log(data);
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/AN/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/AN/" + dateRange + "/" + retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "tracking") {
    retSerialNumber = allSerial_no[0]["tracking_no"] + 1;

    // Update the sequence
    data = { tracking_no: retSerialNumber };
    console.log(data);
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/TO/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/TO/" + dateRange + "/" + retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "maintenance") {
    retSerialNumber = allSerial_no[0]["maintenance_no"] + 1;

    // Update the sequence
    data = { maintenance_no: retSerialNumber };
    console.log(data);
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/ME/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/ME/" + dateRange + "/" + retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  }
  else if (serialType === "DIRECT PURCHASE") {
    retSerialNumber = allSerial_no[0]["grn_no"] + 1;
    // Update the sequence
    data = { grn_no: retSerialNumber };
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/GR/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/GR/" + dateRange + "/" + retSerialNumber);

    console.log(retSerialNumber);
  }
  else if (serialType === "extraCharges") {
    retSerialNumber = allSerial_no[0]["extraCharges_no"] + 1;

    // Update the sequence
    data = { extraCharges_no: retSerialNumber };

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/EN/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/EN/" + dateRange + "/" + retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "journal") {
    retSerialNumber = allSerial_no[0]["journal_no"] + 1;

    // Update the sequence
    data = { journal_no: retSerialNumber };

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/JO/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/JO/" + dateRange + "/" + retSerialNumber);
    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "R") {
    console.log("Dispatch action triggered=>>", allSerial_no[0]);
    retSerialNumber = allSerial_no[0]["voucher_no"] + 1;
    // Update the sequence
    data = { voucher_no: retSerialNumber };
    console.log(
      zeroPrefix[retSerialNumber.toString().length - 1]
        ? zeroPrefix[retSerialNumber.toString().length - 1]
        : "",
      "sen12081"
    );

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/AR/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/AR/" + dateRange + "/" + retSerialNumber);
    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "BR") {
    // console.log("Dispatch action triggered")
    retSerialNumber = allSerial_no[0]["voucher_no"] + 1;
    // Update the sequence
    data = { voucher_no: retSerialNumber };
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/AB/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/AB/" + dateRange + "/" + retSerialNumber);
    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "P") {
    // console.log("Dispatch action triggered")
    retSerialNumber = allSerial_no[0]["voucher_no"] + 1;
    // Update the sequence
    data = { voucher_no: retSerialNumber };
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/AP/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/AP/" + dateRange + "/" + retSerialNumber);
    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "BP") {
    // console.log("Dispatch action triggered")
    retSerialNumber = allSerial_no[0]["voucher_no"] + 1;
    // Update the sequence
    data = { voucher_no: retSerialNumber };
    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/AB/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/AB/" + dateRange + "/" + retSerialNumber);
    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "routes") {
    retSerialNumber = allSerial_no[0]["route_no"] + 1;
    // Update the sequence
    data = { route_no: retSerialNumber };

    routeZeroPrefix[transactionSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "R" +
          routeZeroPrefix[transactionSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "R" + retSerialNumber);

    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  } else if (serialType === "rejectedTyre") {
    retSerialNumber = allSerial_no[0]["rejected_tyre_no"] + 1;
    console.log(retSerialNumber, "uu");
    // Update the sequence
    data = { rejected_tyre_no: retSerialNumber };

    zeroPrefix[retSerialNumber.toString().length - 1]
      ? (retSerialNumber =
          "TS/RJ/" +
          dateRange +
          "/" +
          zeroPrefix[retSerialNumber.toString().length - 1] +
          retSerialNumber)
      : (retSerialNumber = "TS/RJ/" + dateRange + "/" + retSerialNumber);

    console.log(retSerialNumber);
    // update
    await Serial_no.findOneAndUpdate(condition, data, (err, obj) => {});
    return retSerialNumber;
  }
};

const masterInsert = async (req, res) => {
  const data = req.body;
  const URL = req.url;
  const errors = {};
  let newMaster = "";
  let serial_no = "";
  switch (URL) {
    case "/routes/insert":
      let newRoutesData = data;
      serial_no = await generateSerialNumber("routes");

      console.log(serial_no, "sen11102022");

      newRoutesData = {
        ...newRoutesData,
        route_no: serial_no,
      };
      newMaster = new routes(newRoutesData);
      break;

    case "/oil/insert":
      let newOilData = data;
      serial_no = await generateSerialNumber("oil");
      console.log(serial_no, "dd");
      newOilData = {
        ...newOilData,
        oil_order_no: serial_no.retSerialNumber,
        transaction_no: serial_no.transactionSerialNumber,
      };
      newMaster = new Oil(newOilData);
      break;
    case "/purchaseRepairTyre/insert":
      newMaster = new purchaseReturnTyre(data);
      break;
    case "/distance_covered/insert":
      newMaster = new distanceCover(data);
      break;

    case "/employee/insert":
      newMaster = new employee(data);
      break;

    case "/bank/insert":
      newMaster = new bank(data);
      break;

    case "/advance/insert":
      let newAdvanceData = data;
      serial_no = await generateSerialNumber("advance");
      newAdvanceData = { ...newAdvanceData, advance_order_no: serial_no };
      newMaster = new Advance(newAdvanceData);
      break;

    case "/loading/insert":
      let newloadData = data;

      serial_no = await generateSerialNumber("loading");
      console.log(serial_no, "dd");
      newloadData = { ...newloadData, loading_order_No: serial_no };

      newMaster = new Loading(newloadData);
      break;

    case "/salesCumDispatch/insert":
      let newSalesData = data;

      serial_no = await generateSerialNumber("sales");
      console.log(serial_no, "dd");
      newSalesData = { ...newSalesData, salesCumDispatch_no: serial_no };

      newMaster = new salesCumDispatch(newSalesData);
      break;

    case "/tracking/insert":
      let newTrackingData = data;
      serial_no = await generateSerialNumber("tracking");
      console.log(serial_no, "sen25");
      newTrackingData = { ...newTrackingData, tracking_order_no: serial_no };

      newMaster = new Tracking(newTrackingData);
      break;

    case "/maintenanceexpenses/insert":
      let newMaintenanceExpensesData = data;

      serial_no = await generateSerialNumber("maintenance");
      console.log(serial_no, "sen25");
      newMaintenanceExpensesData = {
        ...newMaintenanceExpensesData,
        maintenance_order_no: serial_no,
      };

      newMaster = new MaintenanceExpenses(newMaintenanceExpensesData);
      break;

      case "/maintance/insert":
        // let newMaintenanceData = data;
  
        // serial_no = await generateSerialNumber("maintenance");
        // console.log(serial_no, "sen25");
        // newMaintenanceData = {
        //   ...newMaintenanceData,
        //   maintenance_order_no: serial_no,
        // };
  
        newMaster = new Maintenance(data);
        break;

      
    case "/extraCharges/insert":
      let newExtraChargesData = data;
      serial_no = await generateSerialNumber("extraCharges");
      console.log(serial_no, "sen255");
      newExtraChargesData = {
        ...newExtraChargesData,
        extraCharges_order_no: serial_no,
      };

      newMaster = new ExtraCharges(newExtraChargesData);
      break;
      

    case "/tyreModel/insert":
      newMaster = new tyre_model(data);
      break;
    case "/tyre_details/insert":
      newMaster = new tyre_details(data);
      break;

    case "/tyreFitting/insert":
      newMaster = new TyreFitting(data);
      break;
    case "/rejectedTyre/insert":
      let newRejectData = data;
      serial_no = await generateSerialNumber("rejectedTyre");

      console.log(serial_no, "r");
      newRejectData = {
        ...newRejectData,
        rejected_tyre_no: serial_no,
      };

      newMaster = new RejectedTyre(newRejectData);
      break;

    case "/rejectedTyreSales/insert":
      newMaster = new RejectedTyreSales(data);
      break;

    case "/expenses/insert":
      newMaster = new expenses(data);
      break;

    case "/material/insert":
      newMaster = new Material(data);
      break;

    case "/material_type/insert":
      newMaster = new material_type(data);
      break;

    case "/vehicle_brand/insert":
      newMaster = new vehicle_brand(data);
      break;

    case "/vehicle_type/insert":
      newMaster = new vehicle_type(data);
      break;

    case "/tyre_brand/insert":
      newMaster = new tyre_brand(data);
      break;

    case "/location/insert":
      newMaster = new location(data);
      break;

    case "/expenses/insert":
      newMaster = new expenses(data);
      break;

    case "/material/insert":
      newMaster = new Material(data);
      break;

    case "/location/insert":
      newMaster = new location(data);
      break;

    case "/petrol_pump/insert":
      newMaster = new petrol_pump(data);
      break;
    case "/services/insert":
      newMaster = new services(data);
      break;

    case "/vehicle/insert":
      newMaster = new vehicle(data);
      break;

    case "/area/insert":
      newMaster = new area(data);
      break;

    case "/category/insert":
      newMaster = new category(data);
      break;
    case "/brand/insert":
      newMaster = new brand(data);
      break;
    case "/item/insert":
      newMaster = new item(data);
      break;

    case "/brand/insert":
      newMaster = new brand(data);
      break;

    case "/statutory_type/insert":
      newMaster = new statutory_type(data);
      break;

    case "/uom/insert":
      newMaster = new uom(data);
      break;

  

    case "/showrooms-warehouse/insert":
      newMaster = new showrooms_warehouse(data);
      break;

    case "/menu/insert":
      newMaster = new menu(data);
      break;

    case "/primary_group/insert":
      newMaster = new primary_group(data);
      break;

    case "/ledger_group/insert":
      newMaster = new ledger_group(data);
      break;

    case "/source/insert":
      newMaster = new source(data);
      break;

    case "/role/insert":
      newMaster = new role(data);
      break;
    case "/police/insert":
      newMaster = new policeStation(data);
      break;

    case "/parking/insert":
      newMaster = new Parking(data);
      break;

    case "/mvl/insert":
      newMaster = new motorVehicleLegislation(data);
      break;

    case "/lab/insert":
      newMaster = new lab(data);
      break;
    case "/kata/insert":
      newMaster = new kata(data);
      break;
    case "/category/insert":
      newMaster = new category(data);
      break;

    case "/users/insert":
      newMaster = new User(data);
      break;

    case "/master_group/insert":
      newMaster = new master_group(data);
      break;

    case "/customer/insert":
      newMaster = new customer(data);
      break;

    case "/vendor/insert":
      newMaster = new vendor(data);
      break;

      case "/breakDown/insert":
        newMaster = new breakDown(data);
        break;

    //NEW
    case "/journal/insert":
      let newData_Journal = data;
      const serial_no_Journal = await generateSerialNumber("journal");
      newData_Journal = { ...newData_Journal, voucher_no: serial_no_Journal };
      newMaster = new journal(newData_Journal);
      break;

    case "/bank/insert":
      newMaster = new bank(data);
      break;

    case "/enquiry/insert":
      newMaster = new enquiry(data);
      break;

    case "/receipt_payment/insert":
      let newData3 = data;
      // const serial_no_rp = await generateSerialNumber("R");
      const serial_no_rp = await generateSerialNumber(
        newData3.receipt_payment_type
      );
      console.log("sen2209=>", serial_no_rp);
      newData3 = { ...newData3, voucher_no: serial_no_rp };
      newMaster = new receipt_payment(newData3);
      break;

    case "/receipt_Sales/insert":
      newMaster = new receiptSalesVehicle(data);
      break;

    case "/stock_transfer/insert":
      let newData4 = data;
      const serial_no_st = await generateSerialNumber(data.module);

      newData4 = { ...newData4, stock_transfer_no: serial_no_st };

      newMaster = new stock_transfer(newData4);

      break;

    case "/opening_stock/insert":
      newMaster = new opening_stock(data);
      break;

    case "/direct_purchase/insert":
      newMaster = new direct_purchase(data);
      break;

    //Purchse Return
    case "/purchase_return/insert":
      let newData9 = data;
      const serial_no_return = await generateSerialNumber(data.module);

      if (data.module === "PURCHASE_RETURN_ORDER") {
        newData9 = { ...newData9, purchase_return_no: serial_no_return };
      }

      newMaster = new purchase_return(newData9);

      break;

    //Sales Return
    case "/sales_return/insert":
      let newData10 = data;
      const serial_no_sales_return = await generateSerialNumber(data.module);

      if (data.module === "SALES_RETURN") {
        newData10 = { ...newData10, sales_return_no: serial_no_sales_return };
      }

      newMaster = new sales_return(newData10);

      break;

    case "/purchase/insert":
      let newData2 = data;
      if (data.module === "DIRECT PURCHASE") {
        const serial_no = await generateSerialNumber(
          data.module,
          data.grn_details[0]?.grn_date
        );
        // console.log(serial_no);
        // console.log("vvvvvv");
        newData2 = { ...newData2, grn_no: serial_no };
      }

      // if (data.module === "PURCHASE_ORDER") {
      //   const serial_no = await generateSerialNumber(data.module, data.po_date);

      //   newData2 = { ...newData2, po_number: serial_no };
      // }

      newMaster = new purchase(newData2);
      break;

    case "/task_todo/insert":
      newMaster = new task_todo(data);
      break;

    case "/stock_movement/insert":
      console.log("29033", data);
      newMaster = new stock_movement(data);
      break;
  }

  const validatePayload = (data, schemaDef) => {
    let error = [];
    let obj = {};
    const schemaFields = Object.keys(schemaDef);
    for (let iCtr = 0; iCtr < schemaFields.length; iCtr++) {
      if (schemaDef[schemaFields[iCtr]]["required"] === true) {
        if (typeof schemaDef[schemaFields[iCtr]]["default"] === "undefined") {
          if (
            typeof data[schemaFields[iCtr]] === "undefined" ||
            data[schemaFields[iCtr]] === ""
          ) {
            error.push(schemaFields[iCtr]);
          }
        }
      }
    }

    if (error.length > 0) {
      obj = { Required: error };
    }
    return obj;
  };
  // let returnValid=validatePayload(data, categorySchemaDef)
  // return res.status(200).json(returnValid)
  // console.log(newMaster, "2706");
  console.log(newMaster);
  const insertedMaster = await newMaster.save();

  // if(data.module === "STOCK_TRANSFER" && insertedMaster?.stock_tranfer_details ){
  //   insertedMaster?.stock_tranfer_details.map((item =>{
  //      const data = {
  //        transaction_type:"STF",
  //        transaction_id:insertedMaster.stock_transfer_id,
  //        transaction_date:insertedMaster.inserted_by_date,
  //        showroom_warehouse_id:insertedMaster.to_showroom_warehouse_id,
  //        item_id:item.item_id,
  //        plus_qty:item.quantity,
  //        unit_id:item.uom_id,
  //      }

  //      const newData = new stock_movement(data);

  //      newData.save();
  //   }))
  //   insertedMaster?.stock_tranfer_details.map((item =>{
  //     const data = {
  //       transaction_type:"STF",
  //       transaction_id:insertedMaster.stock_transfer_id,
  //       transaction_date:insertedMaster.inserted_by_date,
  //       showroom_warehouse_id:insertedMaster.from_showroom_warehouse_id,
  //       item_id:item.item_id,
  //       minus_qty:item.quantity,
  //       unit_id:item.uom_id,
  //     }
  //     const newData = new stock_movement(data);
  //     newData.save();
  //   }))

  // }

  return res.status(200).json({
    ...insertedMaster._doc,
    _id: insertedMaster._id,
    enquiry_no: insertedMaster?.enquiry_no,
    quotation_no: insertedMaster?.quotation_no,
    sales_order_no: insertedMaster?.sales_order_no,
    sales_id: insertedMaster?.sales_id,
    grn_no: insertedMaster?.grn_no,
    po_number: insertedMaster?.po_number,
    stock_transfer_no: insertedMaster?.stock_transfer_no,
    voucher_no: insertedMaster?.voucher_no,
    invoice_no: insertedMaster?.invoice_no,
    sales_return_no: insertedMaster?.sales_return_no,
    oil_no: insertedMaster?.oil_no,
  });
};

//transport dispatch
const loadedVehicle = async (req, res) => {
  const dispatch_status = req.body.dispatch_status;

  let loadedData = await vehicle.aggregate();
};
//Material_master
// const view_material = async (req, res) => {
//   let condition = { deleted_by_id: 0 };
//   const material_id = req.body.material_id;

//   const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
//   const searchQuery = req.body.keyword_pharse;

//   // Details by ID
//   if (material_id) {
//     condition = { ...condition, material_id: material_id };
//   }

//   // Search
//   if (searchQuery) {
//     condition = {
//       ...condition,
//       $or: [
//         { material_name: new RegExp(searchQuery, "i") },

//       ],
//     };
//     ; // Matching string also compare incase-sensitive
//   }
//   let expensesData = await Material.aggregate([
//     {
//       $match: condition
//     },
//     {
//       $addFields: {
//         action_items: {

//           can_edit: true,
//           can_delete: false,
//           can_activate: "$active_status" === "Y" ? false : true,
//           can_deactivate: "$active_status" === "Y" ? true : false,

//         }
//       }
//     },

//     {
//       $project: {

//         "action_items": 1,
//         "active_status": 1,
//         "inserted_by_id": 1,
//         "material_id": 1,
//         "material_name": 1,
//         "hsn": 1,
//         "gst": 1,
//         "location_id": 1,
//         "location": 1,
//         "effective_from_date": 1,
//         "effective_to_date": 1,

//         "details": 1,
//         "edited_by_id": 1,
//         "deleted_by_id": 1,
//         "edit_log": 1,
//         "inserted_by_date": 1,
//         "edit_by_date": 1,
//         "deleted_by_date": 1,
//         "__v": 1,

//       },
//     },

//     {
//       $sort: {
//         material_name: 1
//       }
//     }
//   ]);

//   if (expensesData) {
//     return res.status(200).json(expensesData);
//   } else {
//     return res.status(200).json([]);
//   }

// };

// const updateMaterial = async (req, res) => {
//   const condition = { material_id: req.body.material_id };
//   const data = req.body;
//   data.edited_by_id = 10;

//   data.edit_by_date = moment().format("X");

//   const myData = await axios({
//     method: "post",
//     url: apiURL + apiList.material_list,
//     data: condition,
//   });

//   // const vehicleDetails = myData.data;
//   // data.edit_log = vehicleDetails;

//   const changed = trackChange(myData.data[0], req.body)
//   data.edit_log = ([JSON.stringify(changed), ...myData.data[0].edit_log]);

//   await Material.findOneAndUpdate(condition, data, (err, obj) => {
//     if (err) {
//       return res.status(500).json({ Error: err });
//     }
//     return res.status(200).json(obj);
//   });
// };

// showroom_warehouse_master
const view_showrooms_warehouse = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const showrooms_warehouse_id = req.body.showrooms_warehouse_id;
  const showrooms_warehouse_type = req.body.showrooms_warehouse_type;
  const showrooms_warehouse_name = req.body.showrooms_warehouse;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  // Details by ID
  if (showrooms_warehouse_id) {
    condition = {
      ...condition,
      showrooms_warehouse_id: showrooms_warehouse_id,
    };
  }

  // Details by Name
  if (showrooms_warehouse_name) {
    condition = {
      ...condition,
      showrooms_warehouse_name: {
        $regex: "^" + showrooms_warehouse_name + "$",
        $options: "i",
      },
    };
  } // Matching exact text but incase-sensitive

  // Details by Type
  if (showrooms_warehouse_type) {
    condition = {
      ...condition,
      showrooms_warehouse_type: {
        $regex: "^" + showrooms_warehouse_type + "$",
        $options: "i",
      },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { showrooms_warehouse_name: { $regex: searchQuery, $options: "i" } },
        { showrooms_warehouse_type: { $regex: searchQuery, $options: "i" } },
      ],
    }; // Matching string also compare incase-sensitive
  }

  let showrooms_warehouseData = await showrooms_warehouse.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
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
        gst: 1,
        address: 1,
        active_status: 1,
        inserted_by_id: 1,
        showrooms_warehouse_id: 1,
        showrooms_warehouse_type: 1,
        showrooms_warehouse: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ]);
  if (showrooms_warehouseData) {
    return res.status(200).json(showrooms_warehouseData);
  } else {
    return res.status(200).json([]);
  }
};

const updateshowrooms_warehouse = async (req, res) => {
  const condition = { showrooms_warehouse_id: req.body.showrooms_warehouse_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.showrooms_warehouse_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const showroomsWarehouseDetails = myData.data;
  // data.edit_log = showroomsWarehouseDetails;

  await showrooms_warehouse.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleteshowrooms_warehouse = async (req, res) => {
  const showrooms_warehouse_id = req.body.showrooms_warehouse_id;

  const condition = { showrooms_warehouse_id: showrooms_warehouse_id };
  await showrooms_warehouse.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//vehicle_master
const view_vehicle = async (req, res) => {
  let condition = {};
  const vehicle_id = req.body.vehicle_id;
  const vehicle_no = req.body.vehicle_no;
  const tyre_details_status = req.body.tyre_details_status;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;
  const inTransit = req.body.inTransit;

  // Details by ID
  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }
  if (tyre_details_status === false) {
    condition = { ...condition, tyre_details_status: tyre_details_status };
  }

  //inTransit
  if (inTransit === false) {
    condition = { ...condition, inTransit: inTransit };
  }
  // Details by Name
  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: "^" + vehicle_no + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  console.log(condition, "sen22122022", tyre_details_status);
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { vehicle_no: new RegExp(searchQuery, "i") },
        { vehicle_brand: new RegExp(searchQuery, "i") },
        { vehicle_type: new RegExp(searchQuery, "i") },
        { vehicle_ownership: new RegExp(searchQuery, "i") },
      ],
    }; // Matching string also compare incase-sensitive
  }
  let vehicleData = await vehicle.aggregate([
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
        no_of_wheels: {
          $cond: {
            if: { $gt: ["$rejected_count", 0] }, 
            then: { $subtract: [{ $toInt: "$no_of_wheels" }, "$rejected_count"] },
            else: { $toInt: "$no_of_wheels" }, 
          },
        },
      },
    },

    // {
    //   $project: {
    //     action_items: 1,
    //     active_status: 1,
    //     inserted_by_id: 1,
    //     vehicle_id: 1,
    //     vehicle_no: 1,
    //     vehicle_type: 1,
    //     vehicle_brand: 1,
    //     tyre_brand: 1,
    //     vehicle_ownership: 1,
    //     no_of_wheels: 1,
    //     no_of_wheels_id: 1,
    //     no_of_wheels: 1,
    //     vehicle_ownership: 1,
    //     vehicle_specification: 1,
    //     vehicle_purchase_date: 1,
    //     contact_no: 1,
    //     contact_person: 1,
    //     edited_by_id: 1,
    //     deleted_by_id: 1,
    //     edit_log: 1,
    //     inserted_by_date: 1,
    //     edit_by_date: 1,
    //     deleted_by_date: 1,
    //     trip_no: 1,
    //     km_start: 1,
    //     mileage: 1,
    //     __v: 1,
    //   },
    // },

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

const deleteVehicle = async (req, res) => {
  const vehicle_id = req.body.vehicle_id;
  const condition = { vehicle_id: vehicle_id };
  await vehicle.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const updateVehicle = async (req, res) => {
  const condition = { vehicle_id: req.body.vehicle_id };
  const data = req.body;
  console.log(req.body, "bodyyy");
  data.edited_by_id = req.body.edited_by_id;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.Vehicle_list,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);

  if (myData.data[0].edit_log) {
    data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
  } else {
    data.edit_log = JSON.stringify(changed);
  }

  await vehicle.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const updateVehicleSelected = async (req, res) => {
  const vehicle_id = req.body.vehicle_id;

  const updateVehicleData = await vehicle.findOneAndUpdate(
    // { customerId: r.customer_id },
    { vehicle_id: vehicle_id },
    //updated data
    {
      $inc: { rejected_count: -1 },
    },
    {
      new: true,
    }
  );
  if (updateVehicleData) {
    return res.status(200).json(updateVehicleData);
  } else {
    return res.status(200).json([]);
  }
};

//vehicle_brand_master
const view_vehicle_brand = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_brand_id = req.body.vehicle_brand_id;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (vehicle_brand_id) {
    condition = { ...condition, vehicle_brand_id: vehicle_brand_id };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ vehicle_brand: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let vehicleBrandData = await vehicle_brand.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
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
        vehicle_brand_id: 1,
        vehicle_brand: 1,
        details: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        vehicle_brand: 1,
      },
    },
  ]);

  if (vehicleBrandData) {
    return res.status(200).json(vehicleBrandData);
  } else {
    return res.status(200).json([]);
  }
};

const updateVehicleBrand = async (req, res) => {
  const condition = { vehicle_brand_id: req.body.vehicle_brand_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.vehicle_brand_list,
    data: condition,
  });

  // const vehicleDetails = myData.data;
  // data.edit_log = vehicleDetails;

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await vehicle_brand.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleteVehicleBrand = async (req, res) => {
  const vehicle_brand_id = req.body.vehicle_brand_id;
  const condition = { vehicle_brand_id: vehicle_brand_id };
  await vehicle_brand.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};


//vehicle_type
const view_vehicle_type = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_type_id = req.body.vehicle_type_id;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (vehicle_type_id) {
    condition = { ...condition, vehicle_type_id: vehicle_type_id };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ vehicle_type: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let vehicleTypeData = await vehicle_type.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
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
        vehicle_type_id: 1,
        vehicle_type: 1,
        details: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        vehicle_type: 1,
      },
    },
  ]);

  if (vehicleTypeData) {
    return res.status(200).json(vehicleTypeData);
  } else {
    return res.status(200).json([]);
  }
};

const updateVehicleType = async (req, res) => {
  const condition = { vehicle_type_id: req.body.vehicle_type_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.vehicle_type_list,
    data: condition,
  });

  // const vehicleDetails = myData.data;
  // data.edit_log = vehicleDetails;

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await vehicle_type.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleteVehicleType = async (req, res) => {
  const vehicle_type_id = req.body.vehicle_type_id;
  const condition = { vehicle_type_id: vehicle_type_id };
  await vehicle_type.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const view_tyre_brand = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const tyre_brand_id = req.body.tyre_brand_id;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (tyre_brand_id) {
    condition = { ...condition, tyre_brand_id: tyre_brand_id };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ vehicle_type: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let tyreBrandData = await tyre_brand.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
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
        tyre_brand_id: 1,
        tyre_brand: 1,
        details: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        vehicle_type: 1,
      },
    },
  ]);

  if (tyreBrandData) {
    return res.status(200).json(tyreBrandData);
  } else {
    return res.status(200).json([]);
  }
};

const updateTyreBrand = async (req, res) => {
  const condition = { tyre_brand_id: req.body.tyre_brand_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.tyre_brand_list,
    data: condition,
  });

  // const vehicleDetails = myData.data;
  // data.edit_log = vehicleDetails;

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await tyre_brand.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

//Location_master
const view_location = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const location_id = req.body.location_id;
  const location_type = req.body.location_type;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (location_id) {
    condition = { ...condition, location_id: location_id };
  }
  if (location_type) {
    condition = {
      ...condition,
      location_type: { $regex: location_type, $options: "i" },
    };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ location: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let locationData = await location.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
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
        active_status: 1,
        inserted_by_id: 1,

        location_type: 1,
        location_type_id: 1,

        location_id: 1,
        location: 1,
        amount: 1,
        effective_to_date: 1,
        effective_from_date: 1,
        location_type: 1,
        location_type_id: 1,
        details: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        location: 1,
      },
    },
  ]);

  if (locationData) {
    return res.status(200).json(locationData);
  } else {
    return res.status(200).json([]);
  }
};

const updateLocation = async (req, res) => {
  const condition = { location_id: req.body.location_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.location_list,
    data: condition,
  });

  const locationDetails = myData.data;
  data.edit_log = locationDetails;

  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await location.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const view_routes = async (req, res) => {
  let condition = {};
  const route_id = req.body.route_id;
  const wheels = req.body.wheels;
  const vehicle_type = req.body.vehicle_type;
  const searchQuery = req.body.keyword_pharse;

  if (wheels) {
    condition = { ...condition, wheel_id: wheels };
  }
  if (vehicle_type) {
    condition = { ...condition, truck_type: new RegExp(vehicle_type, "i") };
  }
  if (route_id) {
    condition = { ...condition, route_id: route_id };
  }
  // if (searchQuery) {
  //   condition = {
  //     ...condition,
  //     $or: [{ location: new RegExp(searchQuery, "i") }],
  //   };
  // }
  console.log(condition);
  let locationData = await routes.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $project: {
        delivery_location: 1,
        delivery_location_id: 1,
        loading_loaction_id: 1,
        loading_loaction: 1,
        amount: 1,
        route_no: 1,
        route_id: 1,
        active_status: 1,
        action_items: 1,
        wheel: 1,
        wheel_id: 1,
        truck_type: 1,
        truck_type_id: 1,
      },
    },

    {
      $sort: {
        location: 1,
      },
    },
  ]);
  console.log(locationData);
  if (locationData) {
    return res.status(200).json(locationData);
  } else {
    return res.status(200).json([]);
  }
};

const updateRoutes = async (req, res) => {
  const condition = { route_id: req.body.route_id };
  const data = req.body;
  // data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.route_list,
    data: condition,
  });

  // const vehicleDetails = myData.data;
  // data.edit_log = vehicleDetails;

  const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await routes.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};



const deleteRoutes = async (req, res) => {
  const route_id = req.body.route_id;
  const condition = { route_id: route_id };
  await routes.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const getInBetweenRoutes = async (req, res) => {
  const delivery_location_id = req.body.delivery_location_id;
  const loading_loaction_id = req.body.loading_loaction_id;

  const routesData = await routes.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$delivery_location_id", delivery_location_id] },
            { $eq: ["$loading_loaction_id", loading_loaction_id] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        delivery_location: 1,
        loading_loaction: 1,
        wheel: 1,
        amount: 1,
        route_no: 1,
      },
    },
  ]);

  if (routesData) {
    return res.status(200).json(routesData);
  } else {
    return res.status(200).json([]);
  }
};
const view_expenses = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const expenses_id = req.body.expenses_id;
  const expenses_type_id = req.body.expenses_type_id;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (expenses_id) {
    condition = { ...condition, expenses_id: expenses_id };
  }
  if (expenses_type_id) {
    condition = { ...condition, expenses_type_id: expenses_type_id };
  }
  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ expenses: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let expensesData = await expenses.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
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
        active_status: 1,
        inserted_by_id: 1,
        expenses_id: 1,
        expenses: 1,
        expenses_type: 1,
        expenses_type_id: 1,
        details: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        location: 1,
      },
    },
  ]);

  if (expensesData) {
    return res.status(200).json(expensesData);
  } else {
    return res.status(200).json([]);
  }
};

const updateExpenses = async (req, res) => {
  const condition = { expenses_id: req.body.expenses_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.expenses_list,
    data: condition,
  });

  // const vehicleDetails = myData.data;
  // data.edit_log = vehicleDetails;

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await expenses.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const updateMaterial = async (req, res) => {
  const condition = { material_id: req.body.material_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.material_list,
    data: condition,
  });

  const matrialDetails = myData.data;
  data.edit_log = matrialDetails;

  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await Material.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

//Petrol_pump
const view_petrol_pump = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const petrol_pump_id = req.body.petrol_pump_id;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (petrol_pump_id) {
    condition = { ...condition, petrol_pump_id: petrol_pump_id };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ petrol_pump: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let petrol_pumpData = await petrol_pump.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
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
        active_status: 1,
        inserted_by_id: 1,
        rate: 1,
        petrol_pump_id: 1,
        petrol_pump: 1,
        incharge: 1,
        phone_no: 1,
        address: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        petrol_pump: 1,
      },
    },
  ]);

  if (petrol_pumpData) {
    return res.status(200).json(petrol_pumpData);
  } else {
    return res.status(200).json([]);
  }
};

const updatePetrolPump = async (req, res) => {
  const condition = { petrol_pump_id: req.body.petrol_pump_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.petrol_pump_list,
    data: condition,
  });

  // const vehicleDetails = myData.data;
  // data.edit_log = vehicleDetails;

  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await petrol_pump.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

// const update_advance = async (req, res) => {
//   const condition = { advance_id: req.body.advance_id };
//   const data = req.body;
//   data.edited_by_id = 10;
//   data.edit_by_date = moment().format("X");

//   const myData = await axios({
//     method: "post",
//     url: apiURL + apiList.user_List,
//     data: condition,
//   });

//   data.edit_log = myData.data;
//   const changed = trackChange(myData.data[0], req.body)
//   data.edit_log = ([JSON.stringify(changed), ...myData.data[0].edit_log]);

//   await Advance.findOneAndUpdate(condition, data, (err, obj) => {
//     if (err) {
//       return res.status(500).json({ Error: err });
//     }
//     return res.status(200).json(obj);
//   });
// };

const view_destination = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_no = req.body.vehicle_no;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;

  if (fromDate && toDate) {
    condition = {
      ...condition,
      inserted_by_date: {
        $gte: fromDate,
        $lte: toDate,
      },
    };
  }
  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: vehicle_no, $options: "i" },
    };
  }

  console.log(condition);
  let destinationData = await Tracking.aggregate([
    { $match: condition },
    {
      $project: {
        vehicle_id: 1,
        transaction_no: 1,
        vehicle_no: 1,
        tracking_order_no: 1,
        inserted_by_date: 1,
      },
    },
    {
      $sort: {
        inserted_by_date: -1,
      },
    },
  ]);

  if (destinationData) {
    return res.status(200).json(destinationData);
  } else {
    return res.status(200).json([]);
  }
};

//loading

const view_loading = async (req, res) => {
  let condition = {};

  const keyword = req.body.keyword;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;

  if (keyword) {
    condition = {
      ...condition,
      $or: [
        { vehicle: { $regex: keyword, $options: "i" } },
        { customer: { $regex: keyword, $options: "i" } },
        { transaction_no: { $regex: keyword, $options: "i" } },
        { driver_name: { $regex: keyword, $options: "i" } },
        { driver_name: { $regex: keyword, $options: "i" } },
      ],
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      challan_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }

  let advanceData = await Loading.aggregate([
    {
      $match: condition,
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
              vehicle_no: 1,
              _id: 0,
            },
          },
        ],
        as: "vehicle_details",
      },
    },
    { $addFields: { vehicle_no: { $first: "$vehicle_details.vehicle_no" } } },

    {
      $project: {
        loading_id: 1,
        vehicle_no: 1,
        driver_id: 1,
        driver_name: 1,
        loading_quantity: 1,
        loading_start_time: 1,
        loading_end_time: 1,
        challan_no: 1,
        challan_date: 1,
        challan_time: 1,
        transaction_no: 1,
      },
    },
    {
      $addFields: {
        action_items: {
          can_view: true,
          // can_edit: true,
          // can_delete: false,
          // can_activate: "$active_status" === "Y" ? false : true,
          // can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
    {
      $sort: {
        challan_date: -1,
      },
    },
  ]);

  if (advanceData) {
    return res.status(200).json(advanceData);
  } else {
    return res.status(200).json([]);
  }
};

const view_loading_details = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  const id = req.body.id;

  if (id) {
    condition = { ...condition, loading_id: id };
  }

  let advanceData = await Loading.aggregate([
    {
      $match: condition,
    },
  ]);
  if (advanceData) {
    return res.status(200).json(advanceData);
  } else {
    return res.status(200).json([]);
  }
};

//material
const view_material = async (req, res) => {
  // console.log(req.body,"www")
  const material_id = req.body.material_id;
  const keyword_pharse = req.body.keyword_pharse;

  let condition = { deleted_by_id: 0 };

  if (material_id) {
    condition = { ...condition, material_id: material_id };
  }
  if (keyword_pharse) {
    condition = {
      ...condition,
      material_name: { $regex: keyword_pharse, $options: "i" },
    };
  }

  console.log(material_id, "sank225");
  let materialData = await Material.aggregate([
    {
      $match: condition,

      // {
      //   $expr: { $eq: ["material_id", material_id] },
      // }
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: false,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
    {
      $project: {
        location: 1,
        material_id: 1,
        material_name: 1,
        location: 1,
        hsn: 1,
        gst: 1,
        details: 1,
        action_items: 1,

        active_status: 1,
      },
    },
  ]);
  if (materialData) {
    // console.log(materialData,"sank2251")
    return res.status(200).json(materialData);
  } else {
    return res.status(200).json([]);
  }
};

//   let salesCumDispatchData = await salesCumDispatch.aggregate([
//     {
//       $match: condition
//     },

//     {
//       $lookup: {
//         from: "t_400_customers",
//         let: { "customer_id": "$customer_id" },
//         pipeline: [
//           {
//             $match:
//               { $expr: { $eq: ["$$customer_id", "$customer_id"] }, },
//           },
//           {
//             $project: {
//               "company_name": 1,
//               "_id": 0
//             }
//           }
//         ],
//         as: "customer_details"
//       },
//     },
//     { $addFields: { customer_name: { $first: "$customer_details.company_name" } } },

//     {
//       $project: {

//         "customer_name": 1,
//         "customer_id":1,
//         "loaded_vehicle":1,
//         "loaded_vehicle_id":1,
//         "quantity_type":1,
//         "quantity_type_id":1,
//         "rate":1,
//         "quantity":1,
//         "date":1,
//         "active_status":1,

//       },
//     },

//   ]);
//   if (salesCumDispatchData) {

//     return res.status(200).json(salesCumDispatchData);
//   } else {
//     return res.status(200).json([]);
//   }

// };

// const view_loading = async (req, res) => {
//   const condition = { deleted_by_id: 0 };

//   const advance_id = req.body.advance_id;
//   const truck = req.body.truck;

//   // if (advance_id) {
//   //   condition = { ...condition, advance_id: advance_id };
//   // }

//   let advanceData = await Loading.aggregate([
//     {
//       $match: condition
//     },

//     {
//       $lookup: {
//         from: "t_000_vehicles",
//         let: { "vehicle_id": "$vehicle_id" },
//         pipeline: [
//           {
//             $match:
//               { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] }, },
//           },
//           {
//             $project: {
//               "vehicle_no": 1,
//               "_id": 0
//             }
//           }
//         ],
//         as: "vehicle_details"
//       },
//     },
//     { $addFields: { vehicle_no: { $first: "$vehicle_details.vehicle_no" } } },

//     {
//       $project: {

//         "vehicle_no": 1,
//         "driver_id": 1,
//         "loading_quantity": 1,
//         "loading_start_time": 1,
//         "loading_completion_time": 1,
//         "challan_no": 1,
//         "challan_date": 1,
//         "challan_time": 1

//       },
//     },

//   ]);
//   if (advanceData) {

//     return res.status(200).json(advanceData);
//   } else {
//     return res.status(200).json([]);
//   }

// };

// const view_destination = async (req, res) => {
//   let condition = { deleted_by_id: 0 };
//   const vehicle_no = req.body.vehicle_no;

//   console.log(vehicle_no)
//   if (vehicle_no) {
//     condition = { ...condition, vehicle_no: { $regex: vehicle_no, $options: "i" } };
//     // condition = { ...condition, $regexMatch: { input: "vehicle_no", regex: vehicle_no } }
//   }

//   console.log(condition)
//   let destinationData = await vehicle.aggregate([
//     { $match: condition },
//     {
//       $project: {
//         vehicle_id: 1,
//         vehicle_no: 1,
//       }
//     },
//     {
//       $lookup: {
//         from: "t_000_destinations",
//         let: { "vehicle_id": "$vehicle_id" },
//         pipeline: [
//           {
//             $match:
//               { $expr: { $eq: ["$$vehicle_id", "$vehicle_id"] }, },
//           },
//           {
//             $project:
//             {

//               "destination_order_no": 1,
//               "received_time": 1,
//               "received_date": 1,
//               "unloading_time": 1,
//             },
//           },
//         ],
//         as: "destinations_details"
//       },
//     },
//     // { $addFields: { vehicle_no: { $first: "$destinations_details.vehicle_no" } } },
//     { $addFields: { destination_order_no: { $first: "$destinations_details.destination_order_no" } } },
//     { $addFields: { received_time: { $first: "$destinations_details.received_time" } } },
//     { $addFields: { received_date: { $first: "$destinations_details.received_date" } } },
//     { $addFields: { unloading_time: { $first: "$destinations_details.unloading_time" } } },
//     {
//       $group: {
//         _id: "$destination_order_no",
//         vehicle_no: { $first: "$vehicle_no" },
//         destination_order_no: { $first: "$destination_order_no" },
//         received_time: { $addToSet: "$received_time" },
//         received_date: { $addToSet: "$received_date" },
//         unloading_time: { $addToSet: "$unloading_time" },

//       }
//     }
//   ]);

//   if (destinationData) {
//     return res.status(200).json(destinationData);
//   } else {
//     return res.status(200).json([]);
//   }

// };

//user_master
const viewuser = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const user_name = req.body.user;
  const user_id = req.body.user_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (user_id) {
    condition = { ...condition, user_id: user_id };
  }

  // Details by Name
  if (user_name) {
    condition = {
      ...condition,
      user_name: { $regex: "^" + user_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ user_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }
  let userData = await User.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: false,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $lookup: {
        from: "t_100_roles",
        let: { role_id: "$role_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$role_id", "$role_id"] } },
          },
          { $project: { role: 1, _id: 0 } },
        ],
        as: "role_details",
      },
    },

    { $addFields: { role_name: { $first: "$role_details.role" } } },
    { $unset: ["role_details"] },

    {
      $project: {
        action_items: 1,
        role_name: 1,
        role_id: 1,
        active_status: 1,
        inserted_by_id: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        name: 1,
        email: 1,
        password: 1,
        mobile: 1,
        user_id: 1,
        // showroom_warehouse_id: 1,
        accessible_menus: 1,
        weekDays: 1,
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ]);

  if (userData) {
    return res.status(200).json(userData);
  } else {
    return res.status(200).json([]);
  }
};

//for listing
const view_salesCumDispatch = async (req, res) => {
  const keyWordPharse = req.body.keyword_pharse;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;
  const salse_dispatch_id = req.body.salse_dispatch_id;

  let condition = { deleted_by_id: 0 };

  if (salse_dispatch_id) {
    condition = { ...condition, salse_dispatch_id: salse_dispatch_id };
  }

  if (keyWordPharse) {
    condition = {
      ...condition,
      // $expr:{
      $or: [
        { vehicle: { $regex: keyWordPharse, $options: "i" } },
        { customer: { $regex: keyWordPharse, $options: "i" } },
        { transaction_no: { $regex: keyWordPharse, $options: "i" } },
        { salesCumDispatch_no: { $regex: keyWordPharse, $options: "i" } },
      ],
      // }
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      sales_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }

  console.log(condition, from_date, to_date);
  let salesCumDispatchData = await salesCumDispatch.aggregate([
    {
      $match: condition,
    },

    {
      $lookup: {
        from: "t_400_customers",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$customer_id", "$customer_id"] } },
          },
          {
            $project: {
              company_name: 1,
              _id: 0,
            },
          },
        ],
        as: "customer_details",
      },
    },
    {
      $addFields: {
        customer_name: { $first: "$customer_details.company_name" },
      },
    },
    {
      $project: {
        customer_name: 1,
        customer_id: 1,
        vehicle: 1,
        vehicle_id: 1,
        quantity_type: 1,
        quantity_type_id: 1,
        rate: 1,
        quantity: 1,
        order_date: 1,
        sales_date: 1,
        active_status: 1,
        salse_dispatch_id: 1,
        transaction_no: 1,
        remarks: 1,
        salesman_id: 1,
        salesman_name: 1,
      },
    },
    {
      $lookup: {
        from: "t_000_loadings",
        let: { transaction_no: "$transaction_no" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$transaction_no", "$transaction_no"] } },
          },
          {
            $project: {
              challan_date: 1,
              _id: 0,
            },
          },
        ],
        as: "loadings_details",
      },
    },
    {
      $addFields: {
        action_items: {
          can_view: true,
          can_edit: true,
          can_print: true,
        },
        
        challan_date: {
          $first: "$loadings_details.challan_date",
        },
      },
    },
    {
      $sort: {
        sales_date: -1,
      },
    },
  ]);
  if (salesCumDispatchData) {
    return res.status(200).json(salesCumDispatchData);
  } else {
    return res.status(200).json([]);
  }
};

//foredit
const view_salesCumDispatch_edit = async (req, res) => {
  const keyWordPharse = req.body.keyword_pharse;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;
  const salse_dispatch_id = req.body.salse_dispatch_id;

  let condition = { deleted_by_id: 0 };

  if (salse_dispatch_id) {
    condition = { ...condition, salse_dispatch_id: salse_dispatch_id };
  }

  if (keyWordPharse) {
    condition = {
      ...condition,
      // $expr:{
      $or: [
        { vehicle: { $regex: keyWordPharse, $options: "i" } },
        { customer: { $regex: keyWordPharse, $options: "i" } },
        { transaction_no: { $regex: keyWordPharse, $options: "i" } },
        { salesCumDispatch_no: { $regex: keyWordPharse, $options: "i" } },
      ],
      // }
    };
  }

  if (from_date && to_date) {
    condition = {
      ...condition,
      sales_date: {
        $gte: from_date,
        $lte: to_date,
      },
    };
  }

  console.log(condition, from_date, to_date);
  let salesCumDispatchData = await salesCumDispatch.aggregate([
    {
      $match: condition,
    },

    {
      $addFields: {
        action_items: {
          can_view: true,
          can_edit: true,
        },
      },
    },
    {
      $sort: {
        sales_date: -1,
      },
    },
  ]);
  if (salesCumDispatchData) {
    return res.status(200).json(salesCumDispatchData);
  } else {
    return res.status(200).json([]);
  }
};

//for view
const viewSalesDispatch = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  const salesId = req.body.salesDispatchId;

  let salesCumDispatchData = await salesCumDispatch.aggregate([
    {
      $match: {
        salse_dispatch_id: salesId,
      },
    },
  ]);
  if (salesCumDispatchData) {
    return res.status(200).json(salesCumDispatchData);
  } else {
    return res.status(200).json([]);
  }
};

// for Print

const view_salesCumDispatch_print = async (req, res) => {
 
  const salse_dispatch_id = req.body.salse_dispatch_id;

  let condition = { deleted_by_id: 0 };

  if (salse_dispatch_id) {
    condition = { ...condition, salse_dispatch_id: salse_dispatch_id };
  }



  let salesCumDispatchData = await salesCumDispatch.aggregate([
    {
      $match: condition,
    },

    {
      $lookup: {
        from: "t_400_customers",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$customer_id", "$customer_id"] } },
          },
          {
            $project: {
              company_name: 1,
              _id: 0,
            },
          },
        ],
        as: "customer_details",
      },
    },

  ]);
  if (salesCumDispatchData) {
    return res.status(200).json(salesCumDispatchData);
  } else {
    return res.status(200).json([]);
  }
};

//get all advanced vehicle
const advanced_vehicle = async (req, res) => {
  const loading_status = req.body.loading_status;
  const advanceData = await Advance.aggregate([
    {
      $match: {
        loading_status: loading_status,
      },
    },
    {
      $project: {
        _id: 0,
        transaction_no: 1,
        vehicle_id: 1,
        advance_order_no: 1,
        loading_status: 1,
        advance_id: 1,
        driver_id: 1,
        driver_name: 1,
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
              vehicle_no: 1,
              _id: 0,
            },
          },
        ],
        as: "vehicle_details",
      },
    },
    { $addFields: { vehicle_no: { $first: "$vehicle_details.vehicle_no" } } },
    {
      $unset: "vehicle_details",
    },
    {
      $lookup: {
        from: "t_000_employees",
        let: { driver_id: "$driver_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$driver_id", "$employee_id"],
              },
            },
          },
          {
            $project: {
              whatsapp_no: 1,
            },
          },
        ],
        as: "emp",
      },
    },
    {
      $addFields: {
        driver_no: { $first: "$emp.whatsapp_no" },
      },
    },
    // {

    // }
  ]);
  if (advanceData) {
    return res.status(200).json(advanceData);
  } else {
    return res.status(200).json([]);
  }
};

//get all tracking vehicle
const tracking_vehicle = async (req, res) => {
  const tracking_status = req.body.tracking_status;

  const dispatcheData = await salesCumDispatch.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$tracking_status", tracking_status],
        },
      },
    },
    {
      $project: {
        _id: 0,
        transaction_no: 1,
        vehicle_id: 1,
        vehicle: 1,
        salesCumDispatch_no: 1,
        destination_status: 1,
        salse_dispatch_id: 1,
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
              vehicle_no: 1,
              trip_no: {
                $cond: {
                  if: "$trip_no",
                  then: "$trip_no",
                  else: 0,
                },
              },
              _id: 0,
            },
          },
        ],
        as: "vehicle_details",
      },
    },
    {
      $addFields: {
        vehicle_no: { $first: "$vehicle_details.vehicle_no" },
        trip_no: { $first: "$vehicle_details.trip_no" },
      },
    },
    {
      $unset: "vehicle_details",
    },
    // {

    // }
  ]);
  if (dispatcheData) {
    return res.status(200).json(dispatcheData);
  } else {
    return res.status(200).json([]);
  }
};

//get track transaction
const trackTransaction = async (req, res) => {
  const transaction_no = req.body.transaction_no;

  const trackData = await Oil.aggregate([
    {
      $match: {
        transaction_no: { $regex: transaction_no, $options: "i" },
      },
    },
    {
      $project: {
        _id: 0,
        fule_bill_date: 1,
        fule_bill_time: 1,
        transaction_no: 1,
      },
    },
    {
      $lookup: {
        from: "t_100_advances",
        let: { transaction_no: "$transaction_no" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$transaction_no", "$$transaction_no"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              advance_time: 1,
            },
          },
        ],
        as: "advance",
      },
    },
    {
      $addFields: {
        advance_time: { $first: "$advance.advance_time" },
      },
    },
    {
      $lookup: {
        from: "t_000_loadings",
        let: { transaction_no: "$transaction_no" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$transaction_no", "$$transaction_no"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              loading_start_time: 1,
              loading_end_time: 1,
              challan_validity_time: 1,
              ghat_in_time: 1,
              ghat_exit_time: 1,
            },
          },
        ],
        as: "loading",
      },
    },
    {
      $addFields: {
        loading_start_time: { $first: "$loading.loading_start_time" },
        loading_end_time: { $first: "$loading.loading_end_time" },
        challan_validity_time: { $first: "$loading.challan_validity_time" },
        ghat_in_time: { $first: "$loading.ghat_in_time" },
        ghat_exit_time: { $first: "$loading.ghat_exit_time" },
      },
    },
    {
      $lookup: {
        from: "t_001_sales_cum_dispatches",
        let: { transaction_no: "$transaction_no" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$transaction_no", "$$transaction_no"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              dispatch_time: 1,
              unloading_time: 1,
            },
          },
        ],
        as: "sales",
      },
    },
    {
      $addFields: {
        dispatch_time: { $first: "$sales.dispatch_time" },
        unloading_time: { $first: "$sales.unloading_time" },
      },
    },
    {
      $unset: ["advance", "loading", "sales"],
    },
  ]);

  if (trackData) {
    return res.status(200).json(trackData);
  } else {
    return res.status(200).json([]);
  }
};
//get all loaded vehicle
const loaded_vehicle = async (req, res) => {
  const dispatch_status = req.body.dispatch_status;
  const loadedData = await Loading.aggregate([
    {
      $match: {
        dispatch_status: dispatch_status,
      },
    },
    {
      $project: {
        _id: 0,
        loading_quantity: 1,
        vehicle_id: 1,
        loading_order_No: 1,
        gst: 1,
        dispatch_status: 1,
        loading_id: 1,
        transaction_no: 1,
        material: 1,
        material_id: 1,
        material_type: 1,
        material_type_id: 1,
        material_type_rate: 1,
        challan_date: 1,
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
              vehicle_no: 1,
              km_start: 1,
              vehicle_charges: 1,
              _id: 0,
            },
          },
        ],
        as: "vehicle_details",
      },
    },
    {
      $addFields: {
        vehicle_no: { $first: "$vehicle_details.vehicle_no" },
        km_start: { $first: "$vehicle_details.km_start" },
        vehicle_charges: { $first: "$vehicle_details.vehicle_charges" },
      },
    },
    {
      $unset: "vehicle_details",
    },
  ]);
  if (loadedData) {
    return res.status(200).json(loadedData);
  } else {
    return res.status(200).json([]);
  }
};

//loading update
const update_loading = async (req, res) => {
  const condition = { loading_id: req.body.loading_id };
  const data = req.body;
  data.edited_by_id = req.body.edited_by_id;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.loading_list,
    data: condition,
  });
  console.log(myData, "chech");
  const changed = trackChange(myData.data[0], req.body);
  if (myData.data[0].edit_log) {
    data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
  } else {
    data.edit_log = JSON.stringify(changed);
  }

  await Loading.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

//salesdispatch update
// const update_salesDispatch = async (req, res) => {
//   const condition = { salse_dispatch_id: req.body.salse_dispatch_id };
//   const data = req.body;
//   data.edited_by_id = req.body.edited_by_id;
//   data.edit_by_date = moment().format("X");

//   const myData = await axios({
//     method: "post",
//     url: apiURL + apiList.sales_dispatch_list,
//     data: condition,
//   });
//   console.log(myData, "chech");
//   const changed = trackChange(myData.data[0], req.body);
//   if (myData.data[0].edit_log) {
//     data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
//   } else {
//     data.edit_log = JSON.stringify(changed);
//   }

//   await salesCumDispatch.findOneAndUpdate(condition, data, (err, obj) => {
//     if (err) {
//       return res.status(500).json({ Error: err });
//     }
//     return res.status(200).json(obj);
//   });
// };

//newupdate
const update_salesDispatch = async (req, res) => {
  const condition = { salse_dispatch_id: req.body.salse_dispatch_id };
  const transaction_no = req.body.transaction_no;

  if (transaction_no) {
    condition = { ...condition, transaction_no: transaction_no };
  }

  const data = req.body;
  data.edited_by_id = req.body.edited_by_id;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.sales_dispatch_list,
    data: condition,
  });

  const salesDetails = myData.data;
  data.edit_log = salesDetails;

  // const changed = trackChange(myData.data[0], req.body);
  // if (myData.data[0].edit_log) {
  //   data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
  // } else {
  //   data.edit_log = JSON.stringify(changed);
  // }

  await salesCumDispatch.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const updateuser = async (req, res) => {
  const condition = { user_id: req.body.user_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  console.log(data, "sen2609");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.user_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await User.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleteuser = async (req, res) => {
  const user_id = req.body.user_id;

  const condition = { user_id: user_id };
  await User.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//Role_master
const view_role = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const role_name = req.body.role;
  const role_id = req.body.role_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (role_id) {
    condition = { ...condition, role_id: role_id };
  }

  // Details by Name
  if (role_name) {
    condition = {
      ...condition,
      role_name: { $regex: "^" + role_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ role_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await role
    .find(condition, (err, roleData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (roleData) {
        let returnDataArr = roleData.map((data) => ({
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(short_data === true && { role_id: 1, role: 1, _id: 0 })
    .sort({ role: 1 });
};

const updaterole = async (req, res) => {
  const condition = { role_id: req.body.role_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.role_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const roleDetails = myData.data;
  // data.edit_log = roleDetails;

  await role.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleterole = async (req, res) => {
  const role_id = req.body.role_id;

  const condition = { role_id: role_id };
  await role.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//customer_master
const viewcustomer = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const customer_id = req.body.customer_id;
  const customer_name = req.body.customer;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const exclude_fields = req.body.exclude_fields
    ? req.body.exclude_fields
    : ["not_applicable_to_exclude"];
  const searchQuery = req.body.keyword_pharse;
  const group_id = req.body.group_id;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_view: true,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (customer_id) {
    condition = { ...condition, customer_id: customer_id };
  }

  //for group
  if (group_id) {
    condition = { ...condition, group_id: group_id };
  }

  // Details by Name
  if (customer_name) {
    condition = {
      ...condition,
      customer_name: { $regex: "^" + customer_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search

  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { company_name: new RegExp(searchQuery, "i") },
        { "contact_person.txt_name": new RegExp(searchQuery, "i") },
        { gst_no: new RegExp(searchQuery, "i") },
        { "contact_person.txt_whatsapp": new RegExp(searchQuery, "i") },
        { "contact_person.txt_mobile": new RegExp(searchQuery, "i") },
        { "contact_person.txt_email": new RegExp(searchQuery, "i") },
      ],
    }; // Matching string also compare incase-sensitive
  }

  const myCustomerData = await customer.aggregate([
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "t_200_master_groups",
        let: { group_id: "$group_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$master_group_id", "$$group_id"] } } },
          { $project: { group: 1, _id: 0 } },
        ],
        as: "group_data",
      },
    },
    { $addFields: { group_name: { $first: "$group_data.group" } } },
    { $unset: ["group_data"] },

    //For Reference
    {
      $lookup: {
        from: "t_300_references",
        let: { reference_id: "$reference_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$reference_id", "$$reference_id"] } } },
          { $project: { name: 1, _id: 0 } },
        ],
        as: "reference_data",
      },
    },
    { $addFields: { reference_name: { $first: "$reference_data.name" } } },
    { $unset: ["reference_data"] },

    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: false,
          can_view: true,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $project: {
        action_items: 1,
        group_name: 1,
        group_id: 1,
        reference_name: 1,
        reference_id: 1,
        contact_person: 1,
        address: 1,
        active_status: 1,
        inserted_by_id: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        company_name: 1,
        opening_balance: 1,
        dr_cr: 1,
        customer_id: 1,
        whatsapp: {
          $cond: {
            if: "$whatsapp",
            then: { $toDouble: "$whatsapp" },
            else: { $toDouble: { $first: "$contact_person.txt_whatsapp" } },
          },
        },
      },
    },

    // { $unset: exclude_fields },

    {
      $sort: {
        company_name: 1,
      },
    },
  ]);

  if (myCustomerData) {
    return res.status(200).json(myCustomerData);
  } else {
    return res.status(200).json([]);
  }
};

const deletecustomer = async (req, res) => {
  const customer_id = req.body.customer_id;
  const condition = { customer_id: customer_id };
  await customer.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const updatecustomer = async (req, res) => {
  const condition = { customer_id: req.body.customer_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.customer_list,
    data: condition,
  });
  console.log(myData, "chech");
  const changed = trackChange(myData.data[0], req.body);
  if (myData.data[0].edit_log) {
    data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
  } else {
    data.edit_log = JSON.stringify(changed);
  }

  // const customerDetails = myData.data;
  // data.edit_log = customerDetails;

  await customer.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const view_bank = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const bank_id = req.body.bank_id;
  const bank_name = req.body.bank;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };

  // Details by ID
  if (bank_id) {
    condition = { ...condition, bank_id: bank_id };
  }

  // Details by Name
  if (bank_name) {
    condition = {
      ...condition,
      bank_name: { $regex: "^" + bank_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ bank_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await bank
    .find(condition, (err, bankData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (bankData) {
        let returnDataArr = bankData.map((data) => ({
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(short_data === true && { bank_id: 1, bank: 1, _id: 0 })
    .sort({ bank_name: 1 });
};

const deletebank = async (req, res) => {
  const bank_id = req.body.bank_id;
  const condition = { bank_id: bank_id };
  await bank.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const updatebank = async (req, res) => {
  const condition = { bank_id: req.body.bank_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.bank_list,
    data: condition,
  });

  // const bankDetails = myData.data;
  // data.edit_log = bankDetails;

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await bank.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

//Employee

const view_employee = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const keyword_pharse = req.body.keyword_pharse;
  const post = req.body.post;

  if (post) {
    condition = { ...condition, post: post };
  }
  if (keyword_pharse) {
    condition = {
      ...condition,
      first_name: { $regex: keyword_pharse, $options: "i" },
    };
  }

  let employeeData = await employee.aggregate([
    // {
    //   $match: {
    //     $expr: { $eq: ["employee_id", employee_id] },
    //   }
    // },

    {
      $match: condition,
    },
    // {
    //   $project: {
    //     employee_id: 1,
    //     first_name: 1,
    //     last_name: 1,
    //     phone_no: 1,
    //     whatsapp_no: 1,
    //     email: 1,
    //     blood_group: 1,
    //     dob_date: 1,
    //     active_status: 1,
    //     blood_group_name: 1,
    //     post: 1,
    //   },
    // },
    {
      $addFields: {
        action_items: {
          // can_view: true,
          can_edit: true,
          // can_delete: false,
          // can_activate: "$active_status" === "Y" ? false : true,
          // can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
  ]);
  if (employeeData) {
    return res.status(200).json(employeeData);
  } else {
    return res.status(200).json([]);
  }
};

const update_employee = async (req, res) => {
  const condition = { employee_id: req.body.employee_id };
  const data = req.body;

  await employee.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};
//material
const view_material_type = async (req, res) => {
  // console.log(req.body,"www")
  const material_id = req.body.material_id;
  let condition = { deleted_by_id: 0 };

  if (material_id) {
    condition = { ...condition, material_id: material_id };
  }

  let materialTypeData = await material_type.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: false,
          can_view: false,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
    {
      $project: {
        material_type_rate: 1,
        material_type_name: 1,
        material_type_id: 1,
        material_id: 1,
        material_name: 1,
        hsn: 1,
        gst: 1,
        details: 1,
        action_items: 1,
        active_status: 1,
      },
    },
  ]);
  if (materialTypeData) {
    // console.log(materialData,"sank2251")
    return res.status(200).json(materialTypeData);
  } else {
    return res.status(200).json([]);
  }
};

const update_Material_type = async (req, res) => {
  const condition = { material_type_id: req.body.material_type_id };
  const data = req.body;
  data.edited_by_id = 10;

  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.material_type_List,
    data: condition,
  });

  const material_type_Details = myData.data;
  data.edit_log = material_type_Details;

  // const changed = trackChange(myData.data[0], req.body);
  // data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  await material_type.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

//police station master

const view_policeStation = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const policeStation_name = req.body.Police;
  const policeStation_id = req.body.Police_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (policeStation_id) {
    condition = { ...condition, policeStation_id: policeStation_id };
  }

  // Details by Name
  if (policeStation_name) {
    condition = {
      ...condition,
      policeStation_name: {
        $regex: "^" + policeStation_name + "$",
        $options: "i",
      },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ policeStation_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await policeStation
    .find(condition, (err, policeStationData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (policeStationData) {
        let returnDataArr = policeStationData.map((data) => ({
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(
      short_data === true && { policeStation_id: 1, policeStation: 1, _id: 0 }
    )
    .sort({ policeStation: 1 });
};

const updatepoliceStation = async (req, res) => {
  const condition = { policeStation_id: req.body.policeStation_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.police_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const roleDetails = myData.data;
  // data.edit_log = roleDetails;

  await policeStation.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deletepoliceStation = async (req, res) => {
  const policeStation_id = req.body.policeStation_id;

  const condition = { policeStation_id: policeStation_id };
  await policeStation.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//parking

const view_parking = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const Parking_name = req.body.Parking_name;
  const Parking_id = req.body.Parking_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (Parking_id) {
    condition = { ...condition, Parking_id: Parking_id };
  }

  // Details by Name
  if (Parking_name) {
    condition = {
      ...condition,
      Parking_name: { $regex: "^" + Parking_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ Parking_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await Parking.find(condition, (err, ParkingData) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    if (ParkingData) {
      let returnDataArr = ParkingData.map((data) => ({
        action_items: actionValues(data.active_status),
        ...data["_doc"],
      }));
      return res.status(200).json(returnDataArr);
    } else {
      return res.status(200).json([]);
    }
  })
    .select(short_data === true && { Parking_id: 1, Parking: 1, _id: 0 })
    .sort({ Parking: 1 });
};

const updateparking = async (req, res) => {
  const condition = { Parking_id: req.body.Parking_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.parking_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const roleDetails = myData.data;
  // data.edit_log = roleDetails;

  await Parking.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deleteparking = async (req, res) => {
  const Parking_id = req.body.Parking_id;

  const condition = { Parking_id: Parking_id };
  await Parking.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//MVL_master
const view_mvl = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const motor_vehicle_legislation_name =
    req.body.motor_vehicle_legislation_name;
  const motor_vehicle_legislation_id = req.body.motor_vehicle_legislation_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (motor_vehicle_legislation_id) {
    condition = {
      ...condition,
      motor_vehicle_legislation_id: motor_vehicle_legislation_id,
    };
  }

  // Details by Name
  if (motor_vehicle_legislation_name) {
    condition = {
      ...condition,
      motor_vehicle_legislation_name: {
        $regex: "^" + motor_vehicle_legislation_name + "$",
        $options: "i",
      },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        {
          motor_vehicle_legislation_name: {
            $regex: searchQuery,
            $options: "i",
          },
        },
      ],
    }; // Matching string also compare incase-sensitive
  }

  await motorVehicleLegislation
    .find(condition, (err, motorVehicleLegislationData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (motorVehicleLegislationData) {
        let returnDataArr = motorVehicleLegislationData.map((data) => ({
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
        motor_vehicle_legislation_id: 1,
        motor_vehicle_legislation_name: 1,
        _id: 0,
      }
    )
    .sort({ role: 1 });
};

const update_mvl = async (req, res) => {
  const condition = {
    motor_vehicle_legislation_id: req.body.motor_vehicle_legislation_id,
  };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.mvl_list,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const roleDetails = myData.data;
  // data.edit_log = roleDetails;

  await motorVehicleLegislation.findOneAndUpdate(
    condition,
    data,
    (err, obj) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      return res.status(200).json(obj);
    }
  );
};

const delete_mvl = async (req, res) => {
  const motor_vehicle_legislation_id = req.body.motor_vehicle_legislation_id;

  const condition = {
    motor_vehicle_legislation_id: motor_vehicle_legislation_id,
  };
  await role.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//lab
const view_lab = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const lab_name = req.body.lab;
  const lab_id = req.body.lab_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (lab_id) {
    condition = { ...condition, lab_id: lab_id };
  }

  // Details by Name
  if (lab_name) {
    condition = {
      ...condition,
      lab_name: { $regex: "^" + lab_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ lab_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await lab
    .find(condition, (err, labData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (labData) {
        let returnDataArr = labData.map((data) => ({
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(short_data === true && { lab_id: 1, lab: 1, _id: 0 })
    .sort({ lab: 1 });
};

const updatelab = async (req, res) => {
  const condition = { lab_id: req.body.lab_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.lab_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const roleDetails = myData.data;
  // data.edit_log = roleDetails;

  await lab.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deletelab = async (req, res) => {
  const lab_id = req.body.lab_id;

  const condition = { lab_id: lab_id };
  await lab.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

//kata
const view_kata = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const kata_name = req.body.kata;
  const kata_id = req.body.kata_id;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.query;

  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (kata_id) {
    condition = { ...condition, kata_id: kata_id };
  }

  // Details by Name
  if (kata_name) {
    condition = {
      ...condition,
      kata_name: { $regex: "^" + kata_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ kata_name: { $regex: searchQuery, $options: "i" } }],
    }; // Matching string also compare incase-sensitive
  }

  await kata
    .find(condition, (err, kataData) => {
      if (err) {
        return res.status(500).json({ Error: err });
      }
      if (kataData) {
        let returnDataArr = kataData.map((data) => ({
          action_items: actionValues(data.active_status),
          ...data["_doc"],
        }));
        return res.status(200).json(returnDataArr);
      } else {
        return res.status(200).json([]);
      }
    })
    .select(short_data === true && { kata_id: 1, kata: 1, _id: 0 })
    .sort({ kata: 1 });
};

const updatekata = async (req, res) => {
  const condition = { kata_id: req.body.kata_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.kata_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const roleDetails = myData.data;
  // data.edit_log = roleDetails;

  await kata.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deletekata = async (req, res) => {
  const kata_id = req.body.kata_id;

  const condition = { kata_id: kata_id };
  await kata.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const viewvendor = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  const vendor_id = req.body.vendor_id;
  const vendor_name = req.body.vendor;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const group_id = req.body.group_id;
  const searchQuery = req.body.keyword_pharse;

  //console.log(group_id,"groupid")

  // let all_group = await master_group
  //   .find({}, (err, groupData) => {
  //     return groupData;
  //   })
  //   .select({ master_group_id: 1, group: 1, _id: 0 });

  // const groupById = (all_group, master_group_id) => {
  //   if (master_group_id === 0) return "--";
  //   for (let iCtr = 0; iCtr < all_group.length; iCtr++) {
  //     if (all_group[iCtr]["master_group_id"] === master_group_id)
  //       return all_group[iCtr]["group"];
  //   }
  // };

  // let all_reference = await reference
  //   .find({}, (err, referenceData) => {
  //     return referenceData;
  //   })
  //   .select({ reference_id: 1, name: 1, _id: 0 });
  // const referenceById = (all_reference, reference_type_id) => {
  //   if (reference_type_id === 0) return "--";
  //   for (let iCtr = 0; iCtr < all_reference.length; iCtr++) {
  //     if (all_reference[iCtr]["reference_id"] === reference_type_id)
  //       return all_reference[iCtr]["name"];
  //   }
  // };
  // const actionValues = (active_status) => {
  //   return {
  //     can_edit: true,
  //     can_delete: false,
  //     can_view: true,
  //     can_activate: active_status === "Y" ? false : true,
  //     can_deactivate: active_status === "Y" ? true : false,
  //   };
  // };
  // Details by ID
  if (vendor_id) {
    condition = { ...condition, vendor_id: vendor_id };
  }

  if (group_id) {
    condition = { ...condition, group_id: group_id };
  }

  // Details by Name
  if (vendor_name) {
    condition = {
      ...condition,
      // vendor_name: { $regex: "^" + vendor_name + "$", $options: "i" },
      company_name: vendor_name,
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { company_name: new RegExp(searchQuery, "i") },
        { "contact_person.txt_name": new RegExp(searchQuery, "i") },
        { gst_no: new RegExp(searchQuery, "i") },
        { "contact_person.txt_whatsapp": new RegExp(searchQuery, "i") },
        { "contact_person.txt_mobile": new RegExp(searchQuery, "i") },
        { "contact_person.txt_email": new RegExp(searchQuery, "i") },
      ],
    }; // Matching string also compare incase-sensitive
  }

  //   await vendor
  //     .find(condition, (err, vendorData) => {
  //       if (err) {
  //         return res.status(500).json({ Error: err });
  //       }
  //       if (vendorData) {
  //         let returnDataArr = vendorData.map((data) => ({
  //           group_name: groupById(all_group, data.group_id),
  //           reference_name: referenceById(all_reference, data.reference_id),
  //           action_items: actionValues(data.active_status),
  //           ...data["_doc"],
  //         }));

  //         return res.status(200).json(returnDataArr);
  //       } else {
  //         return res.status(200).json([]);
  //       }
  //     })
  //     .select(short_data === true && { vendor_id: 1, vendor: 1, _id: 0 });
  // };

  const myVendorData = await vendor.aggregate([
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "t_200_master_groups",
        let: { group_id: "$group_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$master_group_id", "$$group_id"] } } },
          { $project: { group: 1, _id: 0 } },
        ],
        as: "group_data",
      },
    },
    { $addFields: { group_name: { $first: "$group_data.group" } } },
    { $unset: ["group_data"] },

    //For Reference
    {
      $lookup: {
        from: "t_300_references",
        let: { reference_id: "$reference_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$reference_id", "$$reference_id"] } } },
          { $project: { name: 1, _id: 0 } },
        ],
        as: "reference_data",
      },
    },
    { $addFields: { reference_name: { $first: "$reference_data.name" } } },
    { $unset: ["reference_data"] },

    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
          can_view: true,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $project: {
        action_items: 1,
        group_name: 1,
        group_id: 1,
        reference_name: 1,
        reference_id: 1,
        contact_person: 1,
        address: 1,
        active_status: 1,
        inserted_by_id: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        company_name: 1,
        opening_balance: 1,
        dr_cr: 1,
        vendor_id: 1,
        gst_no: 1,
        website: 1,
        mobile_no: 1,
      },
    },
    {
      $sort: {
        company_name: 1,
      },
    },
  ]);

  if (myVendorData) {
    return res.status(200).json(myVendorData);
  } else {
    return res.status(200).json([]);
  }
};

const updatevendor = async (req, res) => {
  const condition = { vendor_id: req.body.vendor_id };
  const data = req.body;

  await vendor.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const deletevendor = async (req, res) => {
  const vendor_id = req.body.vendor_id;
  const condition = { vendor_id: vendor_id };
  await vendor.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const view_tyre_model = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const tyre_model_id = req.body.tyre_brand_id;

  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const searchQuery = req.body.keyword_pharse;

  // Details by ID
  if (tyre_model_id) {
    condition = { ...condition, tyre_model_id: tyre_model_id };
  }

  // Search
  if (searchQuery) {
    condition = {
      ...condition,
      $or: [{ vehicle_type: new RegExp(searchQuery, "i") }],
    }; // Matching string also compare incase-sensitive
  }
  let tyreModelData = await tyre_model.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $project: {
        action_items: 1,
        tyre_model_id: 1,
        tyre_model: 1,
        details: 1,
        active_status: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        vehicle_type: 1,
      },
    },
  ]);

  if (tyreModelData) {
    return res.status(200).json(tyreModelData);
  } else {
    return res.status(200).json([]);
  }
};

const update_tyre_model = async (req, res) => {
  const condition = { tyre_model_id: req.body.tyre_model_id };
  const data = req.body;

  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.tyre_model_List,
    data: condition,
  });

  const tyreModelDetails = myData.data[0];
  
  // Ensure that edit_log is an array
  const editLogArray = Array.isArray(tyreModelDetails.edit_log) ? tyreModelDetails.edit_log : [];

  const changed = trackChange(tyreModelDetails, req.body);
  data.edit_log = [JSON.stringify(changed), ...editLogArray];

  await tyre_model.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};


const delete_tyre_model = async (req, res) => {
  const tyre_model_id = req.body.tyre_model_id;
  const condition = { tyre_model_id: tyre_model_id };
  await tyre_model.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const view_cashBook = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  let cashBookData = await receipt_payment.aggregate([
    {
      $match: condition,
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
      $addFields: {
        ledger_account: {
          $first: "$ledger_account_details.ledger_account",
        },
      },
    },

    {
      $project: {
        receipt_payment_type: 1,
        ledger_account_id: 1,
        ledger_account: 1,
        voucher_date: 1,
        mode: 1,
        narration: 1,
        amount: 1,
        _id: 0,
      },
    },
  ]);

  if (cashBookData) {
    return res.status(200).json(cashBookData);
  } else {
    return res.status(200).json([]);
  }
};

const drop_down_barcode = async (req, res) => {
  try {
    let condition = { deleted_by_id: 0 };
    const vehicle_id = req.body.vehicle_id;

    if (vehicle_id) {
      condition = { ...condition, vehicle_id: vehicle_id };
    }

    let barcodeData = await tyre_details.aggregate([
      { $unwind: "$tyre_details" },
      {
        $match: {
          vehicle_id: vehicle_id,
          "tyre_details.rejected": false,
        },
      },
      {
        $project: {
          vehicle_id: 1,
          barcode: "$tyre_details.txt_barcode",
          TyreFitting_km: "$tyre_details.txt_fitting_km",
          amount: {
            $cond: {
              if: { $eq: ["$tyre_details.txt_amount", ""] }, // Check if it's an empty string
              then: null,
              else: { $toDouble: "$tyre_details.txt_amount" },
            },
          },
          model: "$tyre_details.ddl_model_label",
          company_name: "$tyre_details.ddl_brand_label",
          position: "$tyre_details.ddl_position_label",
          condition: "$tyre_details.ddl_tyrecondition_no_label",
        },
      },
    ]);

    return res.status(200).json(barcodeData || []);
  } catch (error) {
    console.error('Error in drop_down_barcode:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// const drop_down_barcode = async (req, res) => {
//   let condition = { deleted_by_id: 0 };
//   const vehicle_id = req.body.vehicle_id;

//   if (vehicle_id) {
//     condition = { ...condition, vehicle_id: vehicle_id };
//   }

//   let barcodeData = await tyre_details.aggregate([
//     { $unwind: "$tyre_details" },
//     {
//       $match: {
//         vehicle_id: vehicle_id,
//         "tyre_details.rejected": false,
//       },
//     },
//     {
//       $project: {
//         vehicle_id: 1,
//         // "tyre_details.txt_barcode": 1,
//         barcode: "$tyre_details.txt_barcode",
//         TyreFitting_km: "$tyre_details.txt_fitting_km",
//         amount: { $toDouble: "$tyre_details.txt_amount" },
//         model: "$tyre_details.ddl_model_label",
//         company_name: "$tyre_details.ddl_brand_label",
//         position: "$tyre_details.ddl_position_label",
//         condition: "$tyre_details.ddl_tyrecondition_no_label",
//       },
//     },
//   ]);

//   if (barcodeData) {
//     return res.status(200).json(barcodeData);
//   } else {
//     return res.status(200).json([]);
//   }
// };

const view_tyreDetails = async (req, res) => {
  let condition = {};
  let tyreData = await tyre_details.aggregate([
    {
      $match: condition,
    },

    {
      $project: {
        vehicle_no: 1,
        vehicle_id: 1,
        tyre_details: 1,
        tyre_details_id: 1,
        vehicle_status: 1,
        rejected:"$tyre_details.rejected",
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
  ]);

  if (tyreData) {
    return res.status(200).json(tyreData);
  } else {
    return res.status(200).json([]);
  }
};

const update_tyreDetails = async (req, res) => {
  const condition = { tyre_details_id: req.body.tyre_details_id };
  const data = req.body;

  await tyre_details.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const viewCatgeory = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const category_id = req.body.category_id;

  const category_name = req.body.category;
  const hsn_code = req.body.hsn_code;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const serachQuery = req.body.query;

  // Fetching all categories for showing Parent Category

  // Details by ID
  if (category_id) {
    condition = { ...condition, category_id: category_id };
  }

  // Details by Name
  if (category_name) {
    condition = {
      ...condition,
      category: { $regex: "^" + category_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (serachQuery) {
    condition = {
      ...condition,
      $or: [
        { category: new RegExp(serachQuery, "i") },      
        { hsn_code: new RegExp(serachQuery, "i") },    
            ],
    }; 
  }

  let categoriesData = await category.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_edit: true,
          can_delete: true,
          can_activate: "$active_status" === "Y" ? false : true,
          can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },

    {
      $project: {
        picture_path: 1,
        hsn: 1,
        gst: 1,
        action_items: 1,
        active_status: 1,
        inserted_by_id: 1,
        category_id: 1,
        category: 1,
        details: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    /////////////////////////////////////
    {
      $lookup: {
        from: "t_100_categories",
        let: { parent_category_id: "$parent_category_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$parent_category_id", "$$parent_category_id"] },
            },
          },
          { $project: { category: 1 } },
        ],
        as: "primary_data",
      },
    },
    {
      $addFields: {
        parent_category_name: { $first: "$primary_data.category" },
      },
    },
    { $unset: ["primary_data"] },

    {
      $sort: {
        category: 1,
      },
    },
  ]);

  if (categoriesData) {
    return res.status(200).json(categoriesData);
  } else {
    return res.status(200).json([]);
  }
};

const deleteCategory = async (req, res) => {
  const category_id = req.body.category_id;
  const condition = { category_id: category_id };
  await category.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const updateCategory = async (req, res) => {
  const condition = { category_id: req.body.category_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.Category_List,
    data: condition,
  });

  // const changed = trackChange(myData.data[0], req.body)
  // data.edit_log = ([JSON.stringify(changed), ...myData.data[0].edit_log]);

  const categoryDetails = myData.data;
  data.edit_log = categoryDetails;

  await category.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const viewBrand = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const brand_id = req.body.brand_id;
  const parent_brand_id = req.body.parent_brand_id;
  const brand_name = req.body.brand;
  const short_data = req.body.short_data ? req.body.short_data : false; // Will use this for sending limited fields only
  const serachQuery = req.body.query;

  // Details by ID
  if (brand_id) {
    condition = { ...condition, brand_id: brand_id };
  }

  // Details by Parent Brand ID
  if (parent_brand_id >= 0) {
    condition = { ...condition, parent_brand_id: parent_brand_id };
  }

  // Details by Name
  if (brand_name) {
    condition = {
      ...condition,
      brand: { $regex: "^" + brand_name + "$", $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  // Search
  if (serachQuery) {
    condition = {
      ...condition,
      $or: [
        { brand: { $regex: serachQuery, $options: "i" } },
        { details: { $regex: serachQuery, $options: "i" } },
      ],
    }; // Matching string also compare incase-sensitive
  }

  let brandData = await brand.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
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
        active_status: 1,
        inserted_by_id: 1,
        parent_brand_id: 1,
        brand: 1,
        details: 1,
        brand_id: 1,
        edited_by_id: 1,
        deleted_by_id: 1,
        edit_log: 1,
        inserted_by_date: 1,
        edit_by_date: 1,
        deleted_by_date: 1,
        __v: 1,
      },
    },

    {
      $sort: {
        brand: 1,
      },
    },
  ]);
  if (brandData) {
    return res.status(200).json(brandData);
  } else {
    return res.status(200).json([]);
  }
};

const deleteBrand = async (req, res) => {
  const brand_id = req.body.brand_id;
  const condition = { brand_id: brand_id };
  await brand.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const updateBrand = async (req, res) => {
  const condition = { brand_id: req.body.brand_id };
  const data = req.body;
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.Brand_List,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);
  data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];

  // const brandDetails = myData.data;
  // data.edit_log = brandDetails;

  await brand.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

const view_item = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const item_name = req.body.item;
  const item_id = req.body.item_id;

  const category_id = req.body.category_id;
  const brand_id = req.body.brand_id;
  const searchQuery = req.body.keyword_pharse;


  const actionValues = (active_status) => {
    return {
      can_edit: true,
      can_delete: false,
      can_activate: active_status === "Y" ? false : true,
      can_deactivate: active_status === "Y" ? true : false,
    };
  };
  // Details by ID
  if (item_id) {
    condition = { ...condition, item_id: item_id };
  }

  // Details by Category ID
  //console.log(category_id,"category123")
  if (category_id && category_id > 0) {
    condition = { ...condition, category_id: category_id };
  }
  // Details by Brand ID
  if (brand_id && brand_id > 0) {
    condition = { ...condition, brand_id: brand_id };
  }
  // Details by Name
  if (item_name) {
    condition = {
      ...condition,
      item: { $regex: item_name, $options: "i" },
    };
  } // Matching exact text but incase-sensitive

  if (searchQuery) {
    condition = {
      ...condition,
      $or: [
        { item: searchQuery },
      
      ],
    }; // Matching string also compare incase-sensitive
  }

  let itemData = await item.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        item_id: 1,
        brand_id: 1,
        category_id: 1,
        item_company_code: 1,
        item: 1,
        qty:1,
        uom: 1,
        details: 1,
        hsn_code: 1,
        active_status: 1,
      },
    },
    //////Brand Lookup
    {
      $lookup: {
        from: "t_100_brands",
        let: { brand_id: "$brand_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$brand_id", "$$brand_id"],
              },
            },
          },
          {
            $project: {
              brand: 1,
            },
          },
        ],
        as: "brand_details",
      },
    },
    {
      $addFields: {
        brand_name: { $first: "$brand_details.brand" },
      },
    },
    { $unset: ["brand_details"] },
    /////categories LookUp
    {
      $lookup: {
        from: "t_100_categories",
        let: { category_id: "$category_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$category_id", "$$category_id"] } },
          },
          {
            $project: { category: 1 },
          },
        ],
        as: "category_details",
      },
    },
    {
      $addFields: { category_name: { $first: "$category_details.category" } },
    },
    { $unset: ["category_details"] },
  ]);

  if (itemData) {
    return res.status(200).send(itemData);
  } else {
    return res.status(200).json([]);
  }
};

const view_maintance = async (req, res) => {
  let condition = { deleted_by_id: 0 };

  let vehicleData = await vehicle.aggregate([
    {
      $match: condition,
    },

    {
      $project: {
        vehicle_id: 1,

        vehicle_no: 1,
        vehicle_brand: 1,

        no_of_wheels: 1,

        engine_number: 1,
        chassis_number: 1,
        vehicle_ownership: 1,
      },
    },
  ]);

  if (vehicleData) {
    return res.status(200).json(vehicleData);
  } else {
    return res.status(200).json([]);
  }
};

const vehicleDropDownrejectedTyre = async (req, res) => {
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

const totalVehicleDistanceMonthWise = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const vehicle_id = req.body.vehicle_id;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;

  // const month = req.body.month;
  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }

  if (toDate && fromDate) {
    condition = {
      ...condition,
      fule_bill_date: {
        $gte: fromDate,
        $lte: toDate,
      },
    };
  }
  console.log("Condition:", condition);
  let totalVehicleDistanceData = await Oil.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
        purchase_oil: 1,
        distance_cover: 1,
        fule_bill_date: {
          $month: { $toDate: { $multiply: ["$fule_bill_date", 1000] } },
        },
      },
    },
    {
      $group: {
        _id: { vehicle_no: "$vehicle_no", fule_bill_date: "$fule_bill_date" },
        vehicle_no: { $first: "$vehicle_no" },
        purchase_oil: { $sum: "$purchase_oil" },
        distance_cover: { $sum: "$distance_cover" },
        fule_bill_month: { $first: "$fule_bill_date" },
      },
    },
    {
      $sort: { fule_bill_month: 1 },
    },
  ]);

  // if(totalVehicleDistanceData)
  // {
  //     let returnArr=[];
  //     for(let iCtr=0; iCtr<totalVehicleDistanceData.length; iCtr++)
  //     {
  //       totalVehicleDistanceData[iCtr]['bill_no']= totalVehicleDistanceData[iCtr]['bill_no'][0]
  //     }
  //     let obj={grn:grn};
  //     returnArr.push(obj);
  // }

  console.log(totalVehicleDistanceData);
  if (totalVehicleDistanceData) {
    return res.status(200).json(totalVehicleDistanceData);
  } else {
    return res.status(200).json([]);
  }
};

//service_master
const view_service = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const service_id = req.body.service_id;
  const service = req.body.service;

  // Details by ID
  if (service_id) {
    condition = { ...condition, service_id: service_id };
  }
  let serviceData = await services.aggregate([
    {
      $match: condition,
    },

    {
      $project: {
        service_id: 1,
        service: 1,
        details: 1,
        active_status: 1,
      },
    },
    {
      $addFields: {
        action_items: {
          // can_view: true,
          can_edit: true,
          // can_delete: false,
          // can_activate: "$active_status" === "Y" ? false : true,
          // can_deactivate: "$active_status" === "Y" ? true : false,
        },
      },
    },
    {
      $sort: {
        service: 1,
      },
    },
  ]);
  if (serviceData) {
    return res.status(200).json(serviceData);
  } else {
    return res.status(200).json([]);
  }
};

const deleteService = async (req, res) => {
  const service_id = req.body.service_id;
  const condition = { service_id: service_id };
  await services.deleteOne(condition, (err, obj) => {
    return res.status(200).json(obj);
  });
};

const updateService = async (req, res) => {
  const condition = { service_id: req.body.service_id };
  const data = req.body;
  console.log(req.body, "bodyyy");
  data.edited_by_id = 10;
  data.edit_by_date = moment().format("X");

  const myData = await axios({
    method: "post",
    url: apiURL + apiList.Service_list,
    data: condition,
  });

  const changed = trackChange(myData.data[0], req.body);

  if (myData.data[0].edit_log) {
    data.edit_log = [JSON.stringify(changed), ...myData.data[0].edit_log];
  } else {
    data.edit_log = JSON.stringify(changed);
  }

  await services.findOneAndUpdate(condition, data, (err, obj) => {
    if (err) {
      return res.status(500).json({ Error: err });
    }
    return res.status(200).json(obj);
  });
};

//view vehicle for distance cover manual

const view_vehicle_for_distance = async (req, res) => {
  let condition = {};
  const vehicle_id = req.body.vehicle_id;
  const vehicle_no = req.body.vehicle_no;

  // Details by ID
  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }

  // Details by Name
  if (vehicle_no) {
    condition = {
      ...condition,
      vehicle_no: { $regex: "^" + vehicle_no + "$", $options: "i" },
    };
  }

  let vehicleData = await vehicle.aggregate([
    {
      $match: condition,
    },
    {
      $addFields: {
        action_items: {
          can_view: false,
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

const view_distance_cover = async (req, res) => {
  let condition = {};
  // const vehicle_id = req.body.vehicle_id;
  // const vehicle_no = req.body.vehicle_no;

  // // Details by ID
  // if (vehicle_id) {
  //   condition = { ...condition, vehicle_id: vehicle_id };
  // }

  // // Details by Name
  // if (vehicle_no) {
  //   condition = {
  //     ...condition,
  //     vehicle_no: { $regex: "^" + vehicle_no + "$", $options: "i" },
  //   };
  // }

  let distanceCoverData = await distanceCover.aggregate([
    {
      $match: condition,
    },
    // {
    //   $addFields: {
    //     action_items: {
    //       can_view: false,
    //       can_edit: true,
    //       can_delete: false,
    //       can_activate: "$active_status" === "Y" ? false : true,
    //       can_deactivate: "$active_status" === "Y" ? true : false,
    //     },
    //   },
    // },

    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,
        month_id: 1,
        month_name: 1,
        year_id:1,
        year_name:1,
        distance: 1,
        narration: 1,
        inserted_by_date:1
      },
    },

    // {
    //   $sort: {
    //     vehicle_no: 1,
    //   },
    // },
  ]);

  if (distanceCoverData) {
    return res.status(200).json(distanceCoverData);
  } else {
    return res.status(200).json([]);
  }
};

const view_purchaseReturnTyre = async (req, res) => {
  let condition = {};

  let distanceCoverData = await purchaseReturnTyre.aggregate([
    // { $unwind: "$tyre_details" },
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

    // {
    //   $project: {
    //     purchaseReturnTyre_id: 1,
    //     action_items:1,
    //     barcode: "$tyre_details.txt_barcode",
    //     tyre_type:"$tyre_details.ddl_Tyre_Type_label",
    //     TyreFitting_km: "$tyre_details.txt_fitting_km",
    //     amount: { $toDouble: "$tyre_details.txt_amount" },
    //     model: "$tyre_details.ddl_model_label",
    //     company_name: "$tyre_details.ddl_brand_label",
    //     position: "$tyre_details.ddl_position_label",
    //     condition: "$tyre_details.ddl_tyrecondition_no_label",
    //     tyre_date:1,
    //   },
    // },

    // {
    //   $sort: {
    //     vehicle_no: 1,
    //   },
    // },
  ]);

  if (distanceCoverData) {
    return res.status(200).json(distanceCoverData);
  } else {
    return res.status(200).json([]);
  }
};


// const payment_mode = async ( ) => {
//   {
//     const { paymentMethodId, amount } = req.body;

//     try {
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: 'INR',
//         payment_method: paymentMethodId,
//         confirm: true,
//       });

//      if(paymentIntent){
//       return  res.json({ success: true });
//      }
     
//     } catch (error) {
//       // Payment failed
//       res.status(500).json({ error: error.message });
//     }
//   };
// }


const view_Spare_List = async (req, res) => {
  let condition = {};
  const vehicle_id = req.body.vehicle_id;


  // Details by ID
  if (vehicle_id) {
    condition = { ...condition, vehicle_id: vehicle_id };
  }


  let spareData = await Maintenance.aggregate([
    {
      $match: condition,
    },
    // {
    //   $addFields: {
    //     action_items: {
    //       can_view: false,
    //       can_edit: true,
    //       can_delete: false,
    //       can_activate: "$active_status" === "Y" ? false : true,
    //       can_deactivate: "$active_status" === "Y" ? true : false,
    //     },
    //   },
    // },

    {
      $project: {
      
        vehicle_id: 1,
        vehicle: 1,
        spare_Parts:1
      },
    },
    {
      $unwind:{
        path:"$spare_Parts"
      }
      
    }

    
  ]);

  if (spareData) {
    return res.status(200).json(spareData);
  } else {
    return res.status(200).json([]);
  }
};



const brakeDown_List = async (req, res) => {
  let condition = {};
  const vehicle_no = req.body.vehicle_no;


  // Details by ID
  if (vehicle_no) {
    condition = { ...condition, vehicle_no: vehicle_no };
  }


  let brakeDownData = await breakDown.aggregate([
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
        breakDown_id:1,
        vehicle_id: 1,
        vehicle_no: 1,
        driver_name:1,
        Place:1,
        breakDownTime:1,
        breakDownDate:1,
        desecription:1,
        image_path:1,
        image_name:1,
        action_items:1
      },
    },
    

    
  ]);

  if (brakeDownData) {
    return res.status(200).json(brakeDownData);
  } else {
    return res.status(200).json([]);
  }
};

const brakeDown_View = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  const brakeDown_id = req.body.brakeDown_id;

  if (brakeDown_id) {
    condition = {
      ...condition,
      brakeDown_id: brakeDown_id,
    };
  }

  let breakDownView = await breakDown.aggregate([
    {
      $match: condition,
    },
   
  ]);
  if (breakDownView) {
    return res.status(200).json(breakDownView);
  } else {
    return res.status(200).json([]);
  }
};



const purchase_list = async (req, res) => {
  let condition = {};
  const   purchase_id = req.body.purchase_id;
  const grn_no = req.body.grn_no;

  // Details by ID
  if (purchase_id) {
    condition = { ...condition, purchase_id: purchase_id };
  }

  if (grn_no) {
    condition = {
      ...condition,
      "grn_details.grn_no": new RegExp(grn_no, "i"),
    };
  }


  let purchaseData = await purchase.aggregate([
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

   
    

    
  ]);

  if (purchaseData) {
    return res.status(200).json(purchaseData);
  } else {
    return res.status(200).json([]);
  }
};

module.exports = {
  masterInsert,
  view_tyreDetails,
  update_tyreDetails,
  view_showrooms_warehouse,
  updateshowrooms_warehouse,
  deleteshowrooms_warehouse,
  viewuser,
  updateuser,
  deleteuser,
  view_vehicle,
  deleteVehicle,
  updateVehicle,
  updateVehicleSelected,
  view_role,
  updaterole,
  deleterole,
  view_vehicle_brand,
  updateVehicleBrand,
  deleteVehicleBrand,
  view_vehicle_type,
  updateVehicleType,
  deleteVehicleType,
  view_tyre_brand,

  viewcustomer,
  updatecustomer,
  deletecustomer,
  view_location,
  updateLocation,
  view_petrol_pump,
  updatePetrolPump,

  view_loading,
  view_loading_details,
  view_salesCumDispatch,
  viewSalesDispatch,
  view_salesCumDispatch_print,
  view_destination,
  updateTyreBrand,
  view_expenses,
  updateExpenses,
  updateMaterial,
  view_bank,
  deletebank,
  updatebank,

  loaded_vehicle,
  update_loading,
  advanced_vehicle,
  tracking_vehicle,
  update_salesDispatch,
  view_material,
  view_employee,
  view_routes,
  updateRoutes,
  deleteRoutes,
  view_material_type,
  update_Material_type,
  getInBetweenRoutes,
  trackTransaction,
  view_policeStation,
  updatepoliceStation,
  deletepoliceStation,
  view_parking,
  updateparking,
  deleteparking,
  view_mvl,
  update_mvl,
  delete_mvl,
  view_lab,
  updatelab,
  deletelab,
  view_kata,
  updatekata,
  deletekata,
  viewvendor,
  updatevendor,
  deletevendor,
  view_tyre_model,
  view_cashBook,
  update_employee,
  drop_down_barcode,
  update_tyre_model,
  delete_tyre_model,
  viewCatgeory,
  deleteCategory,
  updateCategory,
  viewBrand,
  deleteBrand,
  updateBrand,
  view_item,
  view_maintance,
  vehicleDropDownrejectedTyre,
  view_salesCumDispatch_edit,
  totalVehicleDistanceMonthWise,
  view_service,
  deleteService,
  updateService,
  view_vehicle_for_distance,
  view_distance_cover,
  view_purchaseReturnTyre,
  view_Spare_List,
  brakeDown_List,
  brakeDown_View,
  purchase_list
  // payment_mode,
};
