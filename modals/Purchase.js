const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);



const purchase_Schema = new mongoose.Schema( 
    {        
        purchase_id:{type:Number, required:true},
        approve_id:{type:Number,required: false, trim: true},
        vendor_id:{type:Number, required:true, default:0},      
        po_number:  { type: String, required: false, trim: true },
        po_date:  { type: Number, required: false, trim: true, default:Date.now },
        reference_no: { type:String, required: false, trim: true},
        reference_date:{ type: Number, required: false, trim: true, default:Date.now }, 
        po_status:  { type: String, required: false, trim: true, default:0 },
        po_note:  { type: String, required: false, trim: true, },
        direct_purchase_task: { type: Array, required: false, trim: true  },
        direct_purchase_status: { type: String, required: false, trim: true,  default:"New"  },
        direct_purchase_note: { type: String, required: false, trim: true,default:"New"},
        purchase_order_task: { type: Array, required: false, trim: true  },
        purchase_order_status: { type: String, required: false, trim: true,  default:"New"  },
        purchase_order_note: { type: String, required: false, trim: true},
        module:{ type: String, required:true,trim: true},       
        item_details : { type : Array, required: true },
        received_item_details : { type : Array, required: true },
        grn_no: { type:String, required:false, trim:true },
       
        grn_details : { type : Array, required: true },      
        approved_by_date : { type: Number, required: false,  trim: true},
        active_status : { type: String, required: true, trim: true, default:'Y' },
        inserted_by_id : { type: Number, required: true, trim: true, default:0 },
        inserted_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        edited_by_id : { type: Number, required: true,  trim: true, default:0 },
        edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        deleted_by_id : { type: Number, required: true, trim: true, default:0 },
        deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
        edit_log : { type : Array, required: false },
    } );
    purchase_Schema.plugin(autoIncrement.plugin,{model:'t_200_purchase', field:'purchase_id', startAt:1, incrementBy:1});


const purchase = mongoose.model("t_200_purchase", purchase_Schema);

module.exports = { purchase};

 