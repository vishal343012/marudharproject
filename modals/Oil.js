const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const oilSchema = new mongoose.Schema({
    oil_id: { type: Number, required: false },
    oil_order_no:{ type: String, required: false },
    vehicle_id:{type:Number,require: false},
    vehicle_no:{type:String,require:false},
    trip_no:{type:Number,require: false,default:1},
    vehicle_total_trip_no:{type:Number,require: false},
    all_vehicle_trip_no:{type:Number,require: false},
    distance_cover:{type:Number,require: false},
    km_end_reading:{type:Number,require: false},
    km_start_reading: { type: Number, required: false },
    approved_oil:{type:Number,require: false},
    routes_id:{type:Number,require: false},
    routes:{type:String,require: false},
    routes_name:{type:String,require: false},
    purchase_oil: { type: Number, required: false },
    rate: { type: Number, required: false },
    total_amount: { type: Number, required: false },
    oil_date: { type: Number, required: false },
    petrol_pump_id:{type:Number,require:false},
    petrol_pump:{type:String,required:false},
    fule_bill_no:{type:String,require:false},
    fule_bill_date:{type:Number,require:false},
    fule_bill_time:{type:Number,require:false},
    pump_meter_image_path: { type: String, required: false, trim: true },
    pump_meter_image_name: { type: String, required: false, trim: true },
    meter_image_path: { type: String, required: false, trim: true },
    meter_image_name: { type: String, required: false, trim: true },
    bill_attachment_path: { type: String, required: false, trim: true },
    bill_attachment_name: { type: String, required: false, trim: true },
    mode: { type: String, required: true,  trim: true, default:'Web'},
    transaction_no: { type:String, required: true, trim: true, default:0},
    advance_status:{ type:Boolean, required: true, trim: true, default:false},
    inserted_by_id : { type: Number, required: true, trim: true, default:0 },
    inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
    edited_by_id : { type: Number, required: true,  trim: true, default:0 },
    edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
    deleted_by_id : { type: Number, required: true, trim: true, default:0 },
    deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
    edit_log : { type : Array, required: false },
    payMode_id:{ type: Number, required: false },
    payMode:{ type: String, required: false },
    account_id:{ type: Number, required: false },
    account_name:{ type: String, required: false },
    cheque_no:{type:String,require:false},
    actual_Amount: { type: Number, required: false },
    difference_Amount: { type: Number, required: false },
    txt_remarks:{ type: String, required: false },


});
oilSchema.plugin(autoIncrement.plugin,{model:'t_000_oil', field:'oil_id', startAt:1, incrementBy:1})

const Oil = mongoose.model('t_000_oil',oilSchema)

module.exports = {Oil};