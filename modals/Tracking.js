const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const trackingSchema = new mongoose.Schema({
    tracking_id: { type: Number, required: false },
    tracking_order_no:{ type: String, required: false },
    vehicle_id:{type:Number,require: false},
    vehicle_no:{type:String,require:false},

    // received_time:{ type: String, required: false, trim: true},
    // received_date:{ type: String, required: false, trim: true},
    // unloading_time:{ type: String, required: false, trim: true},
    challan_date:{ type: String, required: false, trim: true},
    oil_in_time:{ type: String, required: false, trim: true},
    driver_expenses_time:{ type: String, required: false, trim: true},
    exit_time:{ type: String, required: false, trim: true},
    approved_time:{ type: String, required: false, trim: true},
    actual_time:{ type: String, required: false, trim: true},
    excess_time:{ type: String, required: false, trim: true},
    txt_remarks:{ type: String, required: false, trim: true},

    office_exit_time:{ type: String, required: false, trim: true},
    in_time:{ type: String, required: false, trim: true},
    approve_to_time:{ type: String, required: false, trim: true},
    actual_to_time:{ type: String, required: false, trim: true},
    excess_to_time:{ type: String, required: false, trim: true},
    txt_to_remarks:{ type: String, required: false, trim: true},

    ghat_in_time:{ type: String, required: false, trim: true},
    ghat_exit_time:{ type: String, required: false, trim: true},
    last_approve_time:{ type: String, required: false, trim: true},
    last_actual_time:{ type: String, required: false, trim: true},
    last_excess_time:{ type: String, required: false, trim: true},
    txt_last_remarks:{ type: String, required: false, trim: true},

    desi_ghat_exit_time:{ type: String, required: false, trim: true},
    holding_time:{ type: String, required: false, trim: true},
    desi_approve_time:{ type: String, required: false, trim: true},
    desi_actual_time:{ type: String, required: false, trim: true},
    desi_excess_time:{ type: String, required: false, trim: true},
    txt_desi_remarks:{ type: String, required: false, trim: true},

    order_holding_time:{ type: String, required: false, trim: true},
    holding_exit_time:{ type: String, required: false, trim: true},
    order_approve_time:{ type: String, required: false, trim: true},
    order_actual_time:{ type: String, required: false, trim: true},
    order_excess_time:{ type: String, required: false, trim: true},
    txt_order_remarks:{ type: String, required: false, trim: true},

    unload_holding_exit_time:{ type: String, required: false, trim: true},
    return_time:{ type: String, required: false, trim: true},
    unload_approve_time:{ type: String, required: false, trim: true},
    unload_actual_time:{ type: String, required: false, trim: true},
    unload_excess_time:{ type: String, required: false, trim: true},
    txt_unload_remarks:{ type: String, required: false, trim: true},


    mode: { type: String, required: true,  trim: true, default:'Web'},
    transaction_no: { type:String, required: false, trim: true, default:0},
    inserted_by_id : { type: Number, required: false, trim: true, default:0 },
    inserted_by_date : { type: Number, required: false,  trim: true},
    edited_by_id : { type: Number, required: false,  trim: true, default:0 },
    edit_by_date : { type: Number, required: false,  trim: true, },
    deleted_by_id : { type: Number, required: false, trim: true, default:0 },
    deleted_by_date : { type: Number, required: false, trim: true,},
    edit_log : { type : Array, required: false },
    extra_expenses : { type : Array, required: false },
    
    salesCumDispatch_no:{ type: String, required: false, trim: true},
    salse_dispatch_id: { type: Number, required: false, trim: true,},
});

trackingSchema.plugin(autoIncrement.plugin,{model:'t_000_tracking', field:'tracking_id', startAt:1, incrementBy:1})

const Tracking = mongoose.model('t_000_tracking',trackingSchema)
module.exports = {Tracking};


