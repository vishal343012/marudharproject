
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const serial_noSchema = new mongoose.Schema({

    serial_no_id: { type: Number, required: true, default: 0 },
    oil_no: { type: Number, required: true, default: 0 },
    destination_no: { type: Number, required: true, default: 0 },
    loading_no: { type: Number, required: true, default: 0 },
    advance_no: { type: Number, required: false, default: 0 },
    maintenance_no: { type: Number, required: false, default: 0 },
    salesDispatch_no: { type: Number, required: false, default: 0 },
    transaction_no: { type: Number, required: false, default: 0 },
  grn_no: { type: Number, required: false, trim: true, default: 0 },
    serial_no_id: { type: Number, required: false, default: 0 },
    journal_no: { type: Number, required: false, default: 0 },
    voucher_no: { type: Number, required: false, default: 0 },
    route_no:{ type: Number, required: false, default: 0 },
    tracking_no:{ type: Number, required: false, default: 0 },
    extraCharges_no:{ type: Number, required: false, default: 0 },
    rejected_tyre_no:{ type: Number, required: false, default: 0 },
});
serial_noSchema.plugin(autoIncrement.plugin, { model: 't_000_serial_no', field: 'serial_no_id', startAt: 1, incrementBy: 1 })

const Serial_no = mongoose.model('t_000_serial_no', serial_noSchema)

module.exports = { Serial_no };