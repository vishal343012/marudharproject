const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const extraChargesSchema = new mongoose.Schema({
  extraCharges_id: { type: Number, required: false, trim: true },
  extraCharges_order_no: { type: String, },
  vehicle_id: { type: Number, required: false, trim: true },
  vehicle_no: { type: String, required: false, trim: true },
  transaction_no: { type: String, required: false, trim: true },
  routes_name: { type: String, required: false, trim: true },
  extraCharges: { type: Array, required: false, trim: true },

  mode: { type: String, required: true, trim: true, default: 'Web' },
  transaction_no: { type: String, required: false, trim: true, default: 0 },
  inserted_by_id: { type: Number, required: false, trim: true, default: 0 },
  inserted_by_date: { type: Number, required: false, trim: true },
  edited_by_id: { type: Number, required: false, trim: true, default: 0 },
  edit_by_date: { type: Number, required: false, trim: true, },
  deleted_by_id: { type: Number, required: false, trim: true, default: 0 },
  deleted_by_date: { type: Number, required: false, trim: true, },
  edit_log: { type: Array, required: false },
});

extraChargesSchema.plugin(autoIncrement.plugin, { model: 't_000_extraCharges', field: 'extraCharges_id', startAt: 1, incrementBy: 1 })

const ExtraCharges = mongoose.model('t_000_extraCharges', extraChargesSchema)


module.exports =  {ExtraCharges} ;