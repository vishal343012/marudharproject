const express = require("express");
const router = express.Router();

const { auth } = require("./auth");

const userRegister = require("./userRegister");
const userLogin = require("./userLogin");
const userList = require("./userList");
const userSelect = require("./userSelect");
const {
  masterInsert,
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
  view_vehicle_for_distance,
  view_role,
  updaterole,
  deleterole,
  view_vehicle_brand,
  updateVehicleBrand,
  deleteVehicleBrand,
  viewcustomer,
  deletecustomer,
  updatecustomer,
  view_vehicle_type,
  updateVehicleType,
  deleteVehicleType,
  view_location,
  updateLocation,
  view_petrol_pump,
  updatePetrolPump,
  view_tyre_brand,
  updateTyreBrand,
  view_loading,
  view_loading_details,
  view_destination,
  view_expenses,
  updateExpenses,
  view_material,
  updateMaterial,
  view_salesCumDispatch,
  deletebank,
  updatebank,
  view_employee,
  update_employee,
  view_bank,
  loaded_vehicle,
  update_loading,
  advanced_vehicle,
  tracking_vehicle,
  trackTransaction,
  update_salesDispatch,
  view_routes,
  view_material_type,
  viewSalesDispatch,
  getInBetweenRoutes,
  view_policeStation,
  updatepoliceStation,
  deletepoliceStation,
  view_parking,
  updateparking,
  deleteparking,
  view_mvl,
  delete_mvl,
  update_mvl,
  view_lab,
  updatelab,
  deletelab,
  view_kata,
  updatekata,
  deletekata,
  updateRoutes,
  deleteRoutes,
  viewvendor,
  updatevendor,
  deletevendor,
  view_tyre_model,
  view_cashBook,
  drop_down_barcode,
  view_tyreDetails,
  update_tyreDetails,
  update_Material_type,
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
  view_salesCumDispatch_print,
  totalVehicleDistanceMonthWise,
  view_service,
  deleteService,
  updateService,
  view_distance_cover,
  view_purchaseReturnTyre,
  barcode_Type,
  view_tyreType,
  deletetyreType,
  updatetyreType,
  tyreTypeById,
  view_Spare_List,
  brakeDown_List,
  brakeDown_View,
  purchase_list
  // payment_mode
} = require("./master");
//master accounts
const {
  AccountMasterInsert,
  view_primary_group,
  updatePrimaryGroup,
  deletePrimaryGroup,
  view_ledger_group,
  view_ledger_account,
  view_journal,
  updateLedgerAccount,
  updateLedgerGroup,
  deleteLedgerGroup,
  deleteLedgerAccount,
  viewReceiptVehicleList,
  viewSalesReceiptList,
  ReceiptSalesVehicle_List
} = require("./masterAccounts.js");

//For Oil
const {
  view_advance,
  update_advance,
  viewAdvanceDetails,
} = require("./advance.js");

//For Oil
const {
  view_oil,
  totalOiled,
  update_oil,
  oiled_vehicle_list,
  vehicleDropDownOil,
  petrolPumpDropDown,
  viewDetails,
  viewTransaction,
  oil_vehicle_ExpiryDate_List
} = require("./oil.js");

const {
  view_tyreFitting,
  view_tyreFitting_interChange,
  rejectedTyreDetailsUpdate,
  tyreFittingDetailsUpdate,
  rejectedTyreList,
  updateRejectTyre,
  rejectedTyreUpdate,
  rejectedTyreDetails,
  viewRejectedTyre,
  vehicleRejectedTyreUpdate,
  vehicleFitting,
  view_rejectedTyreSale,
  rejectedTyreSalesDetails,
  update_tyreFitting,
  tyreFittingDetails,
  update_rejectedTyreSales,
  barcode_type,
  barcode_Tyre_Fitting,
  rejected_Tyre_barcode,
  repairTyre_List,
  editRepairTyre,
  updatePurchaseReturnTyre,
  rejectedTyreSales_view
} = require("./tyreFitting");

const {
  viewreceipt_payment,
  updatereceipt_payment,
  deletereceipt_payment,
} = require("./receiptAccount");
const { view_maintenanceExpenses } = require("./maintenanceExpenses.js");
const {
  view_extraCharges,
  viewextraChargesDetails,
  update_extraCharges,
} = require("./extraCharges");
const {
  viewBankLedgerAccount,
  updateLedgerClosing,
  viewLedgerAccount,
} = require("./Ledgers");
const {
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
} = require("./dashboard");

//Routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/list", userList);
router.post("/search", userSelect);

//Vehicle
router.post("/vehicle/insert", masterInsert);
router.post("/vehicle/list", view_vehicle);
router.post("/vehicle/delete", deleteVehicle);
router.post("/vehicle/update", updateVehicle);
router.post("/vehicle/updateRejected", updateVehicleSelected);

router.post("/vehicle/totalVehicleDistanceMonthWise", totalVehicleDistanceMonthWise);


router.post("/vehicle/distance/list", view_vehicle_for_distance);


//Services
router.post('/services/insert', masterInsert);
router.post('/services/list', view_service);
router.post('/services/delete', deleteService);
router.post('/services/update', updateService);

//Vehicle_brand
router.post("/vehicle_brand/insert", masterInsert);
router.post("/vehicle_brand/list", view_vehicle_brand);
router.post("/vehicle_brand/update", updateVehicleBrand);
router.post("/vehicle_brand/delete", deleteVehicleBrand);


//Vehicle_type
router.post("/vehicle_type/insert", masterInsert);
router.post("/vehicle_type/list", view_vehicle_type);
router.post("/vehicle_type/update", updateVehicleType);
router.post("/vehicle_Type/delete", deleteVehicleType);

//Tyre_brand
router.post("/tyre_brand/insert", masterInsert);
router.post("/tyre_brand/list", view_tyre_brand);
router.post("/tyre_brand/update", updateTyreBrand);

//Location
router.post("/location/insert", masterInsert);
router.post("/location/list", view_location);
router.post("/location/update", updateLocation);

//expenses
router.post("/expenses/insert", masterInsert);
router.post("/expenses/list", view_expenses);
router.post("/expenses/update", updateExpenses);

//Material
router.post("/material/insert", masterInsert);
router.post("/material/list", view_material);
router.post("/material/update", updateMaterial);

//Maintenance Expenses
router.post("/maintenanceexpenses/insert", masterInsert);
router.post("/maintenanceexpenses/list", view_maintenanceExpenses);

//Petrol_pump
router.post("/petrol_pump/insert", masterInsert);
router.post("/petrol_pump/list", view_petrol_pump);
router.post("/petrol_pump/update", updatePetrolPump);

//showrooms-warehouse
router.post("/showrooms-warehouse/insert", masterInsert);
router.post("/showrooms-warehouse/list", view_showrooms_warehouse);
router.post("/showrooms-warehouse/update", updateshowrooms_warehouse);
router.post("/showrooms-warehouse/delete", deleteshowrooms_warehouse);

//User
router.post("/users/insert", masterInsert);
router.post("/users/list", viewuser),
  router.post("/users/update", updateuser),
  router.post("/users/delete", deleteuser);

//role
router.post("/role/insert", masterInsert);
router.post("/role/list", view_role);
router.post("/role/delete", deleterole);
router.post("/role/update", updaterole);

//CUSTOMER
router.post("/customer/insert", masterInsert);
router.post("/customer/list", viewcustomer),
  router.post("/customer/delete", deletecustomer),
  router.post("/customer/update", updatecustomer);

//OIL
router.post("/oil/insert", masterInsert);
router.post("/oil/list", view_oil);
router.post("/oil/oiled_vehicle_list", oiled_vehicle_list);
router.post("/oil/update", update_oil);
router.post("/oil/totalOiled", totalOiled);
router.post("/oil/vehicle/list", vehicleDropDownOil);
router.post("/oil/petrolPump/list", petrolPumpDropDown);
router.post("/oil/viewDetails", viewDetails);
router.post("/oil/transaction", viewTransaction);
router.post("/oil/expiryDate_List", oil_vehicle_ExpiryDate_List);



//extraCharges
router.post("/extraCharges/insert", masterInsert);
router.post("/extraCharges/list", view_extraCharges);
router.post("/extraCharges/viewextraChargesDetails", viewextraChargesDetails);
router.post("/extraCharges/update", update_extraCharges);

router.post("/drop_down_barcode/list", drop_down_barcode);

//Sales_cum_dispatch
router.post("/salesCumDispatch/insert", masterInsert);
router.post("/salesCumDispatch/list", view_salesCumDispatch);
router.post("/salesCumDispatch/edit", view_salesCumDispatch_edit);
router.post("/salesCumDispatch/print", view_salesCumDispatch_print);




router.post("/salesCumDispatch/view", viewSalesDispatch);
router.post("/salesCumDispatch/update", update_salesDispatch);

router.post("/salesCumDispatch/loaded_vehicle_list", loaded_vehicle);

//Advance
router.post("/advance/insert", masterInsert);
router.post("/advance/list", view_advance);
router.post("/advance/update", update_advance);
router.post("/advance/viewAdvanceDetails", viewAdvanceDetails);

//Loading
router.post("/loading/insert", masterInsert);
router.post("/loading/list", view_loading);
router.post("/loading/loadingDetails", view_loading_details);
router.post("/loading/update", update_loading);
router.post("/loading/advanced_vehicle_list", advanced_vehicle);

//BANK
router.post("/bank/list", view_bank);
router.post("/bank/insert", masterInsert);
router.post("/bank/delete", deletebank);
router.post("/bank/update", updatebank);

//tracking
router.post("/tracking/insert", masterInsert);
router.post("/tracking/list", view_destination);
router.post("/tracking/tracking_vehicle_list", tracking_vehicle);
router.post("/tracking/tracking_transaction", trackTransaction);

//BANK
router.post("/bank/list", view_bank);
router.post("/bank/insert", masterInsert);
router.post("/bank/delete", deletebank);
router.post("/bank/update", updatebank);

//Employee
router.post("/employee/insert", masterInsert);
router.post("/employee/list", view_employee);
router.post("/employee/update", update_employee);

// //Material
// router.post('/material/insert', masterInsert);
// router.post('/material/list', view_material);
// router.post('/material/update',updateMaterial);

//Master Account
router.post("/primary_group/insert", AccountMasterInsert);
router.post("/primary_group/list", view_primary_group);
router.post("/primary_group/update", updatePrimaryGroup);
router.post("/primary_group/delete", deletePrimaryGroup);

//Master Account Ledger Group
router.post("/ledger_group/insert", AccountMasterInsert);
router.post("/ledger_group/list", view_ledger_group);
router.post("/ledger_group/delete", deleteLedgerGroup);
router.post("/ledger_group/update", updateLedgerGroup);
router.post("/ledger_account/delete", deleteLedgerAccount);

//Ledger Account
router.post("/ledger_account/insert", AccountMasterInsert);
router.post("/ledger_account/list", view_ledger_account);
router.post("/ledger_account/viewBankLedgerAccount", viewBankLedgerAccount);
router.post("/ledger_account/updateLedgerClosing", updateLedgerClosing);
router.post("/ledger_account/search", viewLedgerAccount);
router.post("/ledger_account/update", updateLedgerAccount);

//Journal
router.post("/journal/insert", masterInsert);
router.post("/journal/list", view_journal);

//Recept
router.post("/receipt_payment/insert", masterInsert);
router.post("/receipt_payment/list", viewreceipt_payment);
router.post("/receipt_payment/update", updatereceipt_payment);

//Routes

router.post("/routes/insert", masterInsert);
router.post("/routes/list", view_routes);
router.post("/routes/update", updateRoutes);
router.post("/route/delete", deleteRoutes);
router.post("/getInBetweenRoutes/list", getInBetweenRoutes);

//material_type

router.post("/material_type/insert", masterInsert);
router.post("/material_type/list", view_material_type);
router.post("/material_type/update", update_Material_type);

//police
router.post("/police/insert", masterInsert);
router.post("/police/list", view_policeStation);
router.post("/police/delete", deletepoliceStation);
router.post("/police/update", updatepoliceStation);

//parking
router.post("/parking/insert", masterInsert);
router.post("/parking/list", view_parking);
router.post("/parking/delete", deleteparking);
router.post("/parking/update", updateparking);

//MVL
router.post("/mvl/insert", masterInsert);
router.post("/mvl/list", view_mvl);
router.post("/mvl/delete", delete_mvl);
router.post("/mvl/update", update_mvl);

//lab
router.post("/lab/insert", masterInsert);
router.post("/lab/list", view_lab);
router.post("/lab/delete", deletelab);
router.post("/lab/update", updatelab);

//kata
router.post("/kata/insert", masterInsert);
router.post("/kata/list", view_kata);
router.post("/kata/delete", deletekata);
router.post("/kata/update", updatekata);

//TyreFitting
router.post("/tyreFitting/insert", masterInsert);
router.post("/tyreFitting/list", view_tyreFitting);
router.post("/tyreFitting_interChange/list", view_tyreFitting_interChange);


router.post("/tyreFitting/vehicle", vehicleFitting);
router.post("/tyreFitting/tyreFittingDetailsUpdate", tyreFittingDetailsUpdate);
router.post("/tyreFitting/details", tyreFittingDetails);
router.post("/tyreFitting/update", update_tyreFitting);
router.post("/tyreFitting/barcodeType",barcode_type);
router.post("/tyreFitting/barcode/list",barcode_Tyre_Fitting);
router.post("/rejectedTyre/barcode/list",rejected_Tyre_barcode);


//purchase & repair 

router.post("/purchaseRepairTyre/insert", masterInsert);
router.post("/purchaseRepairTyre/list", view_purchaseReturnTyre);




// RejectedTyreSales
router.post("/rejectedTyreSales/insert", masterInsert);
router.post("/rejectedTyreSales/list", view_rejectedTyreSale);
router.post("/rejectedTyreSales/details", rejectedTyreSalesDetails);
router.post("/rejectedTyreSales/update", update_rejectedTyreSales);
router.post("/rejectedTyreSales/view", rejectedTyreSales_view);



//VENDOR
router.post("/vendor/insert", masterInsert);
router.post("/vendor/list", viewvendor);
router.post("/vendor/update", updatevendor);
router.post("/vendor/delete", deletevendor);

//tyreModel
router.post("/tyreModel/insert", masterInsert);
router.post("/tyreModel/list", view_tyre_model);
router.post("/tyreModel/update", update_tyre_model);
router.post("/tyreModel/delete", delete_tyre_model);


router.post("/tyre_details/insert", masterInsert);
router.post("/tyre_details/list", view_tyreDetails);
router.post("/tyre_details/update", update_tyreDetails);

//rejected tyres
router.post("/rejectedTyre/insert", masterInsert);
router.post(
  "/rejectedTyre/rejectedTyreDetailsUpdate",
  rejectedTyreDetailsUpdate
);
router.post("/rejectedTyre/list", rejectedTyreList);
router.post("/rejectedTyreSales/update/list", updateRejectTyre);


router.post(
  "/rejectedTyre/vehicleRejectedTyreUpdate",
  vehicleRejectedTyreUpdate
);

router.post("/rejectedTyre/viewDetails", viewRejectedTyre);

router.post("/rejectedTyre/update", rejectedTyreUpdate);
router.post("/rejectedTyre/details", rejectedTyreDetails);

//repair Tyre purchase and rapair dropdown api
router.post("/repairTyre/list", repairTyre_List);
router.post("/repairTyre/details", editRepairTyre);
router.post("/repairTyre/update", updatePurchaseReturnTyre);




//cashBook

router.post("/cashBook/list", view_cashBook);

//Category
router.post("/category/insert", masterInsert);
router.post("/category/list", viewCatgeory);
router.post("/category/delete", deleteCategory);
router.post("/category/update", updateCategory);

// Brand
router.post("/brand/insert", masterInsert);
router.post("/brand/list", viewBrand);
router.post("/brand/delete", deleteBrand);
router.post("/brand/update", updateBrand);

// Item Routes
router.post('/item/insert', masterInsert);
router.post('/item/list', view_item);

router.post('/maintance/list', view_maintance);

router.post('/receipt/sales/list', viewReceiptVehicleList)
router.post('/receipt/salesReceipt/list', viewSalesReceiptList)




router.post("/receipt_Sales/insert", masterInsert);


router.post('/vehicleDropDownrejectedTyre/list', vehicleDropDownrejectedTyre);

// router.post('/tyreBarcodeFitting/list', barcode_Type);

//api for distanceCovered manual

router.post("/distance_covered/insert", masterInsert);
router.post("/distance_covered/list", view_distance_cover);

router.post("/receiptSalesVehicle/list", ReceiptSalesVehicle_List);



// router.post("/tyreType/insert", masterInsert);
// router.post("/tyreType/list", view_tyreType);
// router.post("/tyreType/delete", deletetyreType);
// router.post("/tyreType/update", updatetyreType);

// router.post("/tyreTypeById/list", tyreTypeById);




///  Api for Dashboard Tracking   ///

router.post("/dashBoard/vehicle", dashboard_vehicle);

router.post("/dashBoard/tracking", dashboard_tracking);
router.post("/dashboardStatsReport", dashboardStatsReport);
router.post("/dashboardReport", dashBoardReport);
router.post("/dashboardStatsReportTotalCash", dashboardStatsReportTotalCash);
router.post("/dashboardStatsReportBank", dashboardStatsReportBank);
router.post("/dashboardOutstanding", total_out_standing_report);
router.post("/dashboardloading", dashBoardLoading);
router.post("/dashboardloadingTotal", dashBoardLoadingTotal);
router.post("/dashboardunloading", dashBoardUnloading);
router.post("/dashboardReceived", dashBoardReceivedTotal);
router.post("/dashboardReceivedToday", dashBoardReceivedToday);
router.post("/cashInHand", dashBoardTotalCash);
router.post("/bank", dashBoardTotalbank);
router.post("/dashBoardReportSalesTotal", dashBoardReportSalesTotal);
router.post("/dashBoardReportIntransit", dashBoardReportInTransit);
router.post("/dashBoardReportMaintanceToday", dashBoardReportMaintanceToday);
router.post("/dashBoardReportMaintanceTotal", dashBoardReportMaintanceTotal);
router.post("/dashBoardReportBreakDown", dashBoardReportBreakDown);





//purchase Api 

router.post('/purchase/insert', masterInsert);
router.post('/purchase/list', purchase_list);




//Maintance

router.post("/maintance/insert",masterInsert);
router.post("/maintance/spare/list",view_Spare_List);




// Brake Down Api

router.post("/breakDown/insert",masterInsert);
router.post("/breakDown/list",brakeDown_List);
router.post("/breakDown/View",brakeDown_View);






module.exports = router;
