const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

    const primary_group_Schema = new mongoose.Schema( 
    {        
        primary_group_id:{type:Number, required:true},
        primary_group:  { type: String, required: true, trim: true },
        nature: { type: String, required: false, trim: true },
        details : { type: String, required: false, trim: true,default:"-" },
        active_status : { type: String, required: true, trim: true, default:'Y' },
        inserted_by_id : { type: Number, required: true, trim: true, default:0 },
        inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
        edited_by_id : { type: Number, required: true,  trim: true, default:0 },
        edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        deleted_by_id : { type: Number, required: true, trim: true, default:0 },
        deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
        edit_log : { type : Array, required: false },
    } );
    primary_group_Schema.plugin(autoIncrement.plugin,{model:'t_200_primary_group', field:'primary_group_id', startAt:1, incrementBy:1});
    
   const ledger_group_Schema = new mongoose.Schema(
    {
        ledger_group_id:{type:Number, required:true},
        primary_group_id:{type:Number, required:true, default:0},
        // account_nature_id:{type:Number, required:true, default:0},
        // account_nature_name:{type:String, required:true, default:""},
        ledger_group:  { type: String, required: true, trim: true },
        alias : { type: String, required: false, trim: true },
        // sub_group_status : { type: String, required: false, trim: true },
        
        // sequence : { type: Number, required: true, trim: true, default:0 },
        active_status : { type: String, required: true, trim: true, default:'Y' },
        inserted_by_id : { type: Number, required: true, trim: true, default:0 },
        inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
        edited_by_id : { type: Number, required: true,  trim: true, default:0 },
        edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        deleted_by_id : { type: Number, required: true, trim: true, default:0 },
        deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
        edit_log : { type : Array, required: false },
   } );
   ledger_group_Schema.plugin(autoIncrement.plugin,{model:'t_200_ledger_group', field:'ledger_group_id', startAt:1, incrementBy:1});
 
   const ledger_account_Schema = new mongoose.Schema(
    {
        ledger_account_id:{type:Number, required:true},
        ledger_group_id:{type:Number, required:false, default:0},
        
        type_id:{type:Number, required:false, default:0},
        type:{type:String, required:false, default:""},
        closingBalance:{type:Number, required:false, default:0},
        ledger_account:  { type: String, required: true, trim: true },
        alias : { type: String, required: false, trim: true },
        opening_balance : { type: Number, required: false, trim: true, default:0 },
        dr_cr_status : { type: String, required: false, trim: true, default: "Dr" },
        as_on_date : { type: Number, required: true,  trim: true, default:Date.now},
        credit_limit : { type: Number, required: false, trim: true, default:0 },
        active_status : { type: String, required: true, trim: true, default:'Y' },
        inserted_by_id : { type: Number, required: true, trim: true, default:0 },
        inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
        edited_by_id : { type: Number, required: true,  trim: true, default:0 },
        edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        deleted_by_id : { type: Number, required: true, trim: true, default:0 },
        deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
        edit_log : { type : Array, required: false },
   } );
   ledger_account_Schema.plugin(autoIncrement.plugin,{model:'t_200_ledger_account', field:'ledger_account_id', startAt:1, incrementBy:1});
 
   const bank_master_Schema = new mongoose.Schema(
    {
        bank_master_id:{type:Number, required:true},
        ledger_account_id:{type:Number, required:true, default:0},
      
        bank_master:  { type: String, required: true, trim: true },        

        active_status : { type: String, required: true, trim: true, default:'Y' },
        inserted_by_id : { type: Number, required: true, trim: true, default:0 },
        inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
        edited_by_id : { type: Number, required: true,  trim: true, default:0 },
        edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        deleted_by_id : { type: Number, required: true, trim: true, default:0 },
        deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
        edit_log : { type : Array, required: false },
   } );
   bank_master_Schema.plugin(autoIncrement.plugin,{model:'t_200_bank_master', field:'bank_master_id', startAt:1, incrementBy:1});

   const journal_Schema = new mongoose.Schema( 
    {  
        journal_id:{type:Number, required:true,trim:true},            
        voucher_no:{type:String, required:false, trim: true},
        voucher_date: { type: Number, required: true,  trim: true, default:Date.now},
        ledger_account_id:{type:Number, required:false, trim: true},
        ledger_account:{type:String, required:false, trim: true},
        // dr_cr: { type :String, required: true, trim: true},
        // amount: { type: Number, required:false, trim: true },
        journal_details: { type:Array, required: true},
        voucher_amount:{type:Number, required:false, trim: true},
        transaction_id:{type:String, required:false, trim: true},
        transaction_type:{type:String, required:false, trim: true},
        transaction_type_id:{type:String, required:false, trim: true},

        narration: { type: String, required:false,trim:true},

        inserted_by_id : { type: Number, required: true, trim: true, default:0 },
        inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
        edited_by_id : { type: Number, required: true,  trim: true, default:0 },
        edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
        deleted_by_id : { type: Number, required: true, trim: true, default:0 },
        deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
        edit_log : { type : Array, required: false },
    } );
    journal_Schema.plugin(autoIncrement.plugin,{model:'t_200_journals', field:'journal_id', startAt:1, incrementBy:1});

    const receipt_payment_Schema = new mongoose.Schema( 
        {        
            receipt_payment_id:{type:Number, required:true,trim:true},
            receipt_payment_type:{type:String, required:false},
            voucher_no:{type:String, required:false, trim: true},
            voucher_date: { type: Number, required: true,  trim: true, default:Date.now},
            ledger_account_id:{type:Number, required:false, trim: true},
            mode: { type: String, required:false,trim:true},
            bank_id: { type: Number, required:false,trim:true,default:0},
            reference_number: { type: String, required:false, trim: true},
            amount: { type: Number, required:false, trim: true },
            adjustment_amount: { type: Number, required:false, trim: true},
            narration: { type: String, required:false,trim:true},
    
            inserted_by_id : { type: Number, required: true, trim: true, default:0 },
            inserted_by_date : { type: String, required: true,  trim: true, default:Date.now},
            edited_by_id : { type: Number, required: true,  trim: true, default:0 },
            edit_by_date : { type: Number, required: true,  trim: true, default:Date.now},
            deleted_by_id : { type: Number, required: true, trim: true, default:0 },
            deleted_by_date : { type: Number, required: true, trim: true, default:Date.now},
            edit_log : { type : Array, required: false },
        } );
        receipt_payment_Schema.plugin(autoIncrement.plugin,{model:'t_200_receipt_payment', field:'receipt_payment_id', startAt:1, incrementBy:1});
    
const primary_group = mongoose.model("t_200_primary_group", primary_group_Schema);
const ledger_group = mongoose.model("t_200_ledger_group", ledger_group_Schema);
const ledger_account = mongoose.model("t_200_ledger_account", ledger_account_Schema);
const bank_master = mongoose.model("t_200_bank_master", bank_master_Schema);
const journal = mongoose.model("t_200_journals", journal_Schema);
const receipt_payment = mongoose.model("t_200_receipt_payment", receipt_payment_Schema);

module.exports = { receipt_payment,primary_group,ledger_group,ledger_account,bank_master,journal};
