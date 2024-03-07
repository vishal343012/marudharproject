const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const loadingSchema = new mongoose.Schema({
    advance_id: { type: Number, required: false },
    advance_order_no: { type: String, required: false },

    loading_id: { type: Number, required: false },
    loading_order_No: { type: String, required: false },
    loading_date: { type: Number, required: false },
    material_id: { type: Number, required: false },
    material:{ type: String, required: false },
    material_type_id: { type: Number, required: false },
    material_type:{ type: String, required: false },
    material_type_rate: { type: Number, required: false },
    gst:{ type: Number, required: false },
    vehicle_id:{ type: Number, required: false },
    vehicle_no:{ type: String, required: false },
    driver_id:{ type: Number, required: false },
    driver_no:{ type: Number, required: false },
    driver_name:{ type: String, required: false },
    loading_quantity:{type: Number, required: false },
    loading_start_time:{type: Number, required: false },
    loading_end_time:{type: Number, required: false },
    loading_location_id:{ type: Number, required: false },
    loading_location:{ type: String, required: false },
    measurement:{type: String, required: false },
    measurement_id:{type: String, required: false },
    challan_no:{type: String, required: false },
    challan_date:{type: Number, required: false },
    challan_time:{type:Number,required:false},
    challan_validity_time:{type:Number,required:false},
    challan_cft:{type: String, required: false },
    challan_image_path:{type:String,required:false},
    challan_image_name:{type:String,required:false},
    kata_image_path:{type:String,required:false},
    kata_image_name:{type:String,required:false},
    ghat_in_time:{type:Number,required:false},
    ghat_exit_time:{type:Number,required:false},
    weight_measurement:{type:Number,required:false},
    remarks:{type:String,required:false},

    mode: { type: String, required: true,  trim: true, default:'Web'},
    transaction_no: { type:String, required: true, trim: true, default:0},
    dispatch_status:{type:Boolean,required:true,trim:true,default:false},
    inserted_by_id : { type: Number, required: true, trim: true, default:0 },
    inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
    edited_by_id : { type: Number, required: true,  trim: true, default:0 },
    edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
    deleted_by_id : { type: Number, required: true, trim: true, default:0 },
    deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
    edit_log : { type : Array, required: false },
   
});
loadingSchema.plugin(autoIncrement.plugin,{
    model:'t_000_loading',
    field:'loading_id', 
    startAt:1, 
    incrementBy:1
})

const materialSchema = new mongoose.Schema({
    material_id: { type: Number, required: false },
    material_name: { type: String, required: false },
    location: { type: String, required: false },
    location_id:{ type: Number, required: false },
    hsn: { type: String, required: false},
    gst: { type:String, required: false},
    details: { type:String, required: false},
    effective_from_date:{ type:String, required: false},
    effective_to_date:{ type:String, required: false},
    active_status : { type: String, required: true, trim: true, default:'Y' },
    mode: { type: String, required: true,  trim: true, default:'Web'},
    
    inserted_by_id : { type: Number, required: true, trim: true, default:0 },
    inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
    edited_by_id : { type: Number, required: true,  trim: true, default:0 },
    edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
    deleted_by_id : { type: Number, required: true, trim: true, default:0 },
    deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
    edit_log : { type : Array, required: false },


})
materialSchema.plugin(autoIncrement.plugin,{model:'t_000_material',field:'material_id',startAt:1,incrementBy:1})


const Loading = mongoose.model('t_000_loading',loadingSchema)
const Material = mongoose.model('t_000_material',materialSchema)

module.exports={Loading,Material}