const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);


const vendor_Schema = new mongoose.Schema(
    {
        vendor_id: { type: Number, required: true },

        // group_id: { type: Number, required: false },
        // reference_id: { type: Number, required: false },
        opening_balance: { type: Number, required: false },
        dr_cr: { type: String, required: false, trim: true },
        mobile_no:{ type: Number, required: false },
        company_name: { type: String, required: false, trim: true },
        gst_no: { type: String, required: false, trim: true },
        website: { type: String, required: false, trim: true },

        // address: { type: Array, required: false },
        // contact_person: { type: Array, required: false },
        // bank_details: { type: Array, required: false },

        active_status: { type: String, required: true, trim: true, default: 'Y' },
        inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
        inserted_by_date: { type: String, required: true, trim: true, default: Date.now },
        edited_by_id: { type: Number, required: true, trim: true, default: 0 },
        edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
        deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
        deleted_by_date: { type: Number, required: true, trim: true, default: Date.now },
        edit_log: { type: Array, required: false },
    });
vendor_Schema.plugin(autoIncrement.plugin, { model: 't_500_vendor', field: 'vendor_id', startAt: 1, incrementBy: 1 });

const vendor = mongoose.model("t_500_vendor", vendor_Schema);

module.exports = { vendor };