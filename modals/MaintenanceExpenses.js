const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);



const maintenanceexpensesSchema = new mongoose.Schema({
    maintenance_id: { type: Number, required: false },
    vehicle_id: { type: Number, required: false },
    vehicle:{ type: String, required: false },
    expenses:{type:Array,required: false},
    maintenance_order_no:{ type: String, required: false },
    maintenance_expense_date:{type: Number, required: false},
    //common
    mode: { type: String, required: true,  trim: true, default:'Web'},
    transaction_no: { type:Number, required: true, trim: true, default:0},
    inserted_by_id : { type: Number, required: true, trim: true, default:0 },
    inserted_by_date : { 
        type: Number, 
        required: true,  
        trim: true, 
        default:Date.now
    },
    edited_by_id : { type: Number, required: true,  trim: true, default:0 },
    edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
    deleted_by_id : { type: Number, required: true, trim: true, default:0 },
    deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
    edit_log : { type : Array, required: false },
});
maintenanceexpensesSchema.plugin(autoIncrement.plugin,{model:'t_001_maintenance_expenses', field:'maintenance_id', startAt:1, incrementBy:1})

const maintenanceSchema = new mongoose.Schema({
    maintenance_id: { type: Number, required: false },
    vehicle_id: { type: Number, required: false },
    vehicle:{ type: String, required: false },
    vehicle_details:{type:Array,required: false},
    spare_Parts:{type:Array,required: false},
   
    
    mode: { type: String, required: true,  trim: true, default:'Web'},
    
    inserted_by_id : { type: Number, required: true, trim: true, default:0 },
    inserted_by_date : { 
        type: Number, 
        required: true,  
        trim: true, 
        default:Date.now
    },
    edited_by_id : { type: Number, required: true,  trim: true, default:0 },
    edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
    deleted_by_id : { type: Number, required: true, trim: true, default:0 },
    deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
    edit_log : { type : Array, required: false },
});
maintenanceSchema.plugin(autoIncrement.plugin,{model:'t_000_maintenance', field:'maintenance_id', startAt:1, incrementBy:1})



const MaintenanceExpenses = mongoose.model('t_001_maintenance_expenses',maintenanceexpensesSchema)
const Maintenance = mongoose.model('t_000_maintenance',maintenanceSchema)


module.exports = {MaintenanceExpenses,Maintenance};