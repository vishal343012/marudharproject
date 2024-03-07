const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);


const advanceSchema = new mongoose.Schema(
    {
        advance_id: { type: Number, required: false },
        advance_order_no: { type: String, required: false },
        oil_order_no: { type: String, required: false },
        oil_id: { type: Number, trim: true },
        vehicle_id: { type: Number, required: false },
        vehicle_no:{type:String,require:false},
        trip_no: { type: Number, required: false, trim: true },
        expense: { type: Number, required: false, trim: true },
        actual_expense: { type: Number, required: false, trim: true },
        Excess_Pay_Oil:{ type: Number, required: false, trim: true },
        Actual_Pay:{ type: Number, required: false, trim: true },

        remarks: { type: String, required: false, trim: true },
        advance_office_id: { type: Number, trim: true },
        advance_office_label: { type: String, trim: true },
        paymode_id: { type: Number, trim: true },
        paymode: { type: String, trim: true },
        account_id: { type: Number, trim: true },
        account_name: { type: String, trim: true },
        route_amount: { type: Number, trim: true },
        route_name: { type: String, trim: true },
        route: { type: String, trim: true },
        cheque_no:{ type: String, trim: true },
        driver_id: { type: Number, trim: true },
        driver_name:{ type: String, trim: true },
        advance_time: { type: Number, required: false, trim: true },
        advance_date: { type: Number, required: false, trim: true },
        transaction_no: { type: String, required: true, trim: true, },
        mode: { type: String, required: true, trim: true, default: 'Web' },
        loading_status: { type: Boolean, required: true, trim: true, default: false },
        inserted_by_id: { type: Number, required: false, trim: true, default: 0 },
        inserted_by_date: { type: String, required: false, trim: true, default: Date.now },
        edited_by_id: { type: Number, required: false, trim: true, default: 0 },
        edit_by_date: { type: Number, required: false, trim: true, default: Date.now },
        deleted_by_id: { type: Number, required: false, trim: true, default: 0 },
        deleted_by_date: { type: Number, required: false, trim: true, default: Date.now },
        edit_log: { type: Array, required: false },
    }
);
advanceSchema.plugin(autoIncrement.plugin, { model: 't_100_advance', field: 'advance_id', startAt: 1, incrementBy: 1 });


const Advance = mongoose.model("t_100_advance", advanceSchema);


module.exports = { Advance };