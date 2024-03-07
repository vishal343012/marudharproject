const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);



const salesCumDispatchSchema = new mongoose.Schema({
    vehicle_id: { type: Number, required: false },
    vehicle: { type: String, required: false },
    customer_id: { type: Number, require: false },
    customer: { type: String, required: false },
    mobile_no: { type: Number, require: false },
    loaded_material_type: { type: String, require: false },
    loaded_material_type_id: { type: Number, require: false },
    loaded_material: { type: String, required: false },
    loaded_material_id: { type: Number, required: false },
    order_date: { type: Number, require: false },
    km: { type: Number, require: false },
    distance_covered: { type: Number, require: false },
    customer_km: { type: Number, require: false },
    mode: { type: String, required: false, trim: true, default: 'Web' },
    transaction_no: { type: Number, required: false, trim: true, default: 0 },
    tracking_status: { type: Boolean, required: true, trim: true, default: false },
    credit_limit: { type: Number, required: false },
    quantity_type_id: { type: String, required: false },
    quantity_type: { type: String, required: false },
    rate: { type: Number, required: false },
    quantity: { type: Number, required: false },
    discount: { type: Number, required: false },
    discount_per: { type: Number, required: false },
    discountedRate: { type: Number, required: false },
    salesman_name: { type: String, required: false },
    salesman_id: { type: Number, required: false },

    width: { type: Number, required: false ,default: 0},
    length:{ type: Number, required: false ,default: 0},
    height: { type: Number, required: false ,default: 0},
    totalCft: { type: Number, required: false ,default: 0},
    grossWeight: { type: Number, required: false,default: 0 },
    lorryWeight: { type: Number, required: false ,default: 0},
    waterLess: { type: Number, required: false ,default: 0},
    netWeight: { type: Number, required: false ,default: 0},

    gst_value: { type: Number, required: false },
    total_amount: { type: Number, required: false },
    actual_amount: { type: Number, required: false },
    gst: { type: Number, required: false },
    gst_status: { type: Boolean, required: false, default: false },
    sales_date: { type: Number, require: false },
    mode: { type: String, required: true, trim: true, default: 'Web' },
    transaction_no: { type: String, required: true, trim: true, },
    salesCumDispatch_no: { type: String, required: false },
    remarks: { type: String, required: false },
    dispatch_time: { type: Number, required: false },
    unloading_time: { type: Number, required: false },
    inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
    inserted_by_date: { type: String, required: true, trim: true, default: Date.now },
    edited_by_id: { type: Number, required: true, trim: true, default: 0 },
    edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
    deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
    deleted_by_date: { type: Number, required: true, trim: true, default: Date.now },
    edit_log: { type: Array, required: false },
    salse_dispatch_id: { type: Number, required: true, trim: true, default: 0 },
});
salesCumDispatchSchema.plugin(autoIncrement.plugin, { model: 't_001_sales_cum_dispatch', field: 'salse_dispatch_id', startAt: 1, incrementBy: 1 })

const salesCumDispatch = mongoose.model('t_001_sales_cum_dispatch', salesCumDispatchSchema)

module.exports = { salesCumDispatch };