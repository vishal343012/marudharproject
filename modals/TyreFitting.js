const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const TyreFittingSchema = new mongoose.Schema({
  TyreFitting_id: { type: String, required: false },
  vehicle_id: { type: Number, required: false },
  vehicle_no: { type: String, required: false },
  brand: { type: String, required: false },
  model: { type: String, required: false },
  position_no: { type: String, required: false },
  barcode_type_id: { type: Number, required: false },
  barcode_type_label: { type: String, required: false },
  fitting_km: { type: Number, required: false },
  barcode_id: { type: Number, required: false },
  barcode_label: { type: String, required: false },
  rejected_barcode_id: { type: Number, required: false },
  rejected_barcode_label: { type: String, required: false },
  tyre_type_id: { type: Number, required: false },
  tyre_type_label: { type: String, required: false },
  remarks: { type: String, required: false },
  fitting_date: { type: Number, required: false },
  tyre_condition: { type: String, required: false },
  amount: { type: Number, required: false },
  vehicle_From_id: { type: Number, required: false },
  vehicle_From_no: { type: String, required: false },
  vehicle_To_id: { type: Number, required: false },
  vehicle_To_no: { type: String, required: false },
  barcode_From_id: { type: Number, required: false },
  barcode_From_no: { type: String, required: false },
  barcode_To_id: { type: Number, required: false },
  barcode_To_no: { type: String, required: false },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
TyreFittingSchema.plugin(autoIncrement.plugin, {
  model: "t_000_TyreFitting",
  field: "TyreFitting_id",
  startAt: 1,
  incrementBy: 1,
});

const RejectedTyreSchema = new mongoose.Schema({
  rejected_tyre_id: { type: Number, required: false },
  rejected_tyre: { type: Boolean, required: true, trim: true, default: false },

  rejected_tyre_no: { type: String, required: false },
  vehicle_id: { type: Number, required: false },
  vehicle_no: { type: String, required: false },
  remove_km: { type: Number, required: false },
  barcode: { type: String, required: false },
  fitting_km: { type: Number, required: false },
  total_use_km: { type: Number, required: false },
  amount: { type: Number, required: false },
  perKm_cost: { type: Number, required: false },
  company_name: { type: String, required: false },
  model_name: { type: String, required: false },
  position: { type: String, required: false },
  tyrecondition: { type: String, required: false },
  remarks: { type: String, required: false },
  rejected_date: { type: Number, required: false, trim: true },
  rejectTyre_status: {
    type: Boolean,
    required: true,
    trim: true,
    default: false,
  },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
RejectedTyreSchema.plugin(autoIncrement.plugin, {
  model: "t_000_RejectedTyre",
  field: "rejected_tyre_id",
  startAt: 1,
  incrementBy: 1,
});

const RejectedTyreSalesSchema = new mongoose.Schema({
  rejected_tyre_Sales_id: { type: Number, required: false },
  rejected_tyre_sales_no: { type: String, required: false },
  rejected_tyre_id: { type: Number, required: false },
  barcode_id: { type: Number, required: false },
  barcode: { type: String, required: false },
  amount: { type: Number, required: false },
  vendoramount: { type: Number, required: false },
  vendor_id: { type: Number, required: false },
  vendor_name: { type: String, required: false },
  service_type_id: { type: Number, required: false },
  service_type_label: { type: String, required: false },
  vehicle_id: { type: Number, required: false },
  vehicle_no: { type: String, required: false },
  remarks:{type: String, required: false},
  salesOffice_id: { type: Number, required: false },
  salesOffice_name: { type: String, required: false },
  approve_id: { type: Number, required: false },
  approve_name: { type: String, required: false },
  company_name: { type: String, required: false },
  model_name: { type: String, required: false },
  position: { type: String, required: false },
  rejected_sales_date: { type: Number, required: false, trim: true },
  rejected_tyre_return_date: { type: Number, required: false, trim: true },

  repair_status: { type: Boolean, required: true, trim: true, default: false },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
RejectedTyreSalesSchema.plugin(autoIncrement.plugin, {
  model: "t_000_Rejected_Tyre_Sales",
  field: "rejected_tyre_Sales_id",
  startAt: 1,
  incrementBy: 1,
});

const TyreFitting = mongoose.model("t_000_TyreFitting", TyreFittingSchema);
const RejectedTyre = mongoose.model("t_000_RejectedTyre", RejectedTyreSchema);
const RejectedTyreSales = mongoose.model(
  "t_000_Rejected_Tyre_Sales",
  RejectedTyreSalesSchema
);

module.exports = { TyreFitting, RejectedTyre, RejectedTyreSales };
