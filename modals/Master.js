const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const vehicleSchema = new mongoose.Schema({
  vehicle_id: { type: Number, required: false },
  vehicle_type_id: { type: Number, required: false },
  rejected_count: { type: Number, required: false, default: 0 },
  vehicle_type: { type: String, required: false },
  vehicle_brand_id: { type: Number, required: false },
  vehicle_brand: { type: String, required: false },
  tyre_brand_id: { type: Number, required: false },
  tyre_brand: { type: String, required: false },
  ownerName: { type: String, required: false },
  vehicle_charges: { type: Number, required: false },
  no_of_wheels_id: { type: Number, required: false },
  no_of_wheels: { type: String, required: false },
  vehicle_ownership: { type: String, required: false },
  vehicle_specification: { type: String, required: false },
  vehicle_no: { type: String, required: true, trim: false },
  vehicle_purchase_date: {
    type: String,
    required: false,
    trim: true,
    default: Date.now,
  },
  mode: { type: String, required: false, trim: true, default: "Web" },
  // attachment: { type: Array, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  inTransit: { type: Boolean, required: true, default: false },
  trip_no: { type: Number, required: true, trim: true, default: 0 },
  km_start: { type: Number, required: false, trim: true, default: 0 },
  km_end: { type: Number, required: false, trim: true, default: 0 },
  max_traveled_distance: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  mileage: { type: Number, required: true, trim: true, default: 0 },
  insurance_company: { type: String, required: false, trim: true },
  tyre_details_status: {
    type: Boolean,
    required: false,
    trim: true,
    default: false,
  },

  insurance_number: { type: String, required: false, trim: true },
  pollution_number: { type: String, required: false, trim: true },
  permit_number: { type: String, required: false, trim: true },
  tax_number: { type: String, required: false, trim: true },
  bluebook_number: { type: String, required: false, trim: true },
  fitness_number: { type: String, required: false, trim: true },
  loan_number: { type: String, required: false, trim: true },
  bank_noc_number: { type: String, required: false, trim: true },

  insurance_expire_date: { type: Number, required: false, trim: true },
  pollution_expiry_date: { type: Number, required: false, trim: true },
  permit_expiry_date: { type: Number, required: false, trim: true },
  tax_expire_date: { type: Number, required: false, trim: true },
  // bluebook_expiry_date:{type: Number, required: false, trim: true},
  fitness_expiry_date: { type: Number, required: false, trim: true },

  engine_number: { type: String, required: false, trim: true },
  chassis_number: { type: String, required: false, trim: true },
  loan_letter: { type: String, required: false, trim: true },
  // loan_date:{type:Number,required:false,trim:true},

  bank_noc: { type: String, required: false, trim: true },
  // bank_noc_date:{type:Number,required:false,trim:true},

  insurance_image_path: { type: String, required: false, trim: true },
  insurance_image_name: { type: String, required: false, trim: true },
  pollution_image_path: { type: String, required: false, trim: true },
  pollution_image_name: { type: String, required: false, trim: true },
  permit_image_path: { type: String, required: false, trim: true },
  permit_image_name: { type: String, required: false, trim: true },
  tax_image_path: { type: String, required: false, trim: true },
  tax_image_name: { type: String, required: false, trim: true },
  bluebook_image_path: { type: String, required: false, trim: true },
  bluebook_image_name: { type: String, required: false, trim: true },
  fitness_image_path: { type: String, required: false, trim: true },
  fitness_image_name: { type: String, required: false, trim: true },
  loan_image_path: { type: String, required: false, trim: true },
  loan_image_name: { type: String, required: false, trim: true },
  bank_image_path: { type: String, required: false, trim: true },
  bank_image_name: { type: String, required: false, trim: true },
  gps_image_path: { type: String, required: false, trim: true },
  gps_image_name: { type: String, required: false, trim: true },
  gps_date: { type: Number, required: false, trim: true },
});
vehicleSchema.plugin(autoIncrement.plugin, {
  model: "t_000_vehicle",
  field: "vehicle_id",
  startAt: 1,
  incrementBy: 1,
});

const vehicleBrandSchema = new mongoose.Schema({
  vehicle_brand_id: { type: Number, required: true },
  vehicle_brand: { type: String, required: true },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
vehicleBrandSchema.plugin(autoIncrement.plugin, {
  model: "t_000_vehicle_brand",
  field: "vehicle_brand_id",
  startAt: 1,
  incrementBy: 1,
});

const vehicleTypeSchema = new mongoose.Schema({
  vehicle_type_id: { type: Number, required: true },
  vehicle_type: { type: String, required: true },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  mode: { type: String, required: true, trim: true, default: "Web" },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
vehicleTypeSchema.plugin(autoIncrement.plugin, {
  model: "t_000_vehicle_type",
  field: "vehicle_type_id",
  startAt: 1,
  incrementBy: 1,
});

const tyreBrandSchema = new mongoose.Schema({
  tyre_brand_id: { type: Number, required: true },
  tyre_brand: { type: String, required: true },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
tyreBrandSchema.plugin(autoIncrement.plugin, {
  model: "t_000_tyre_brand",
  field: "tyre_brand_id",
  startAt: 1,
  incrementBy: 1,
});

const locationSchema = new mongoose.Schema({
  location_id: { type: Number, required: true },
  location: { type: String, required: true },
  location_type_id: { type: Number, required: false },
  location_type: { type: String, required: false },
  amount: { type: Number, required: true },
  effective_from_date: { type: Number, required: false },
  effective_to_date: { type: Number, required: false },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  mode: { type: String, required: true, trim: true, default: "Web" },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
locationSchema.plugin(autoIncrement.plugin, {
  model: "t_000_location",
  field: "location_id",
  startAt: 1,
  incrementBy: 1,
});

const routesSchema = new mongoose.Schema({
  route_id: { type: Number, required: true },
  route_no: { type: String, required: true },
  delivery_location: { type: String, required: true },
  delivery_location_id: { type: Number, required: true },
  loading_loaction: { type: String, required: true },
  loading_loaction_id: { type: Number, required: true },
  truck_type: { type: String, required: true },
  truck_type_id: { type: Number, required: true },
  wheel: { type: Number, required: true },
  wheel_id: { type: Number, required: true },
  amount: { type: Number, required: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true },
  inserted_by_date: { type: Number, required: true, default: Date.now() },
});
routesSchema.plugin(autoIncrement.plugin, {
  model: "t_000_routes",
  field: "route_id",
  startAt: 1,
  incrementBy: 1,
});

const petrolPumpSchema = new mongoose.Schema({
  petrol_pump_id: { type: Number, required: true },
  petrol_pump: { type: String, required: true },
  address: { type: String, required: false },
  // incharge_id:{type:Number,required:false},
  incharge: { type: String, required: false },
  // route_id:{type:Number,required:false},
  // routes:{type:String,required:false},
  rate: { type: Number, required: false },

  phone_no: { type: Number, required: false },

  mode: { type: String, required: true, trim: true, default: "Web" },
  active_status: { type: String, required: true, trim: true, default: "Y" },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
petrolPumpSchema.plugin(autoIncrement.plugin, {
  model: "t_000_petrol_pump",
  field: "petrol_pump_id",
  startAt: 1,
  incrementBy: 1,
});

const showrooms_warehouse_Schema = new mongoose.Schema({
  showrooms_warehouse_id: { type: Number, required: true },

  showrooms_warehouse_type: { type: String, required: true, trim: true },

  showrooms_warehouse: { type: String, required: false, trim: true },
  gst: { type: String, required: false, trim: true },
  address: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
showrooms_warehouse_Schema.plugin(autoIncrement.plugin, {
  model: "t_000_showrooms_warehouse",
  field: "showrooms_warehouse_id",
  startAt: 1,
  incrementBy: 1,
});

const roleSchema = new mongoose.Schema({
  role_id: { type: Number, required: true },

  role: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
roleSchema.plugin(autoIncrement.plugin, {
  model: "t_100_role",
  field: "role_id",
  startAt: 1,
  incrementBy: 1,
});

const customer_Schema = new mongoose.Schema({
  customer_id: { type: Number, required: true },

  opening_balance: { type: Number, required: false },
  dr_cr: { type: String, required: false, trim: true },
  company_name: { type: String, required: false, trim: true },
  name: { type: String, required: false, trim: true },
  mobile: { type: Number, required: false, trim: true },
  whatsapp: { type: Number, required: false, trim: true },
  email: { type: String, required: false, trim: true },
  gst_no: { type: String, required: false, trim: true },
  website: { type: String, required: false, trim: true },

  address: { type: Array, required: false },
  contact_person: { type: Array, required: false },

  active_status: { type: String, required: false, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: false, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: false,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: false, trim: true, default: 0 },
  edit_by_date: {
    type: Number,
    required: false,
    trim: true,
    default: Date.now,
  },
  deleted_by_id: { type: Number, required: false, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: false,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
customer_Schema.plugin(autoIncrement.plugin, {
  model: "t_400_customer",
  field: "customer_id",
  startAt: 1,
  incrementBy: 1,
});

const expensesSchema = new mongoose.Schema({
  expenses_id: { type: Number, required: true },
  expenses: { type: String, required: true },
  expenses_type: { type: String, required: true },
  expenses_type_id: { type: String, required: true },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  mode: { type: String, required: true, trim: true, default: "Web" },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
expensesSchema.plugin(autoIncrement.plugin, {
  model: "t_000_expenses",
  field: "expenses_id",
  startAt: 1,
  incrementBy: 1,
});

const bank_Schema = new mongoose.Schema({
  bank_id: { type: Number, required: true },

  bank_name: { type: String, required: true, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
bank_Schema.plugin(autoIncrement.plugin, {
  model: "t_100_bank_name",
  field: "bank_id",
  startAt: 1,
  incrementBy: 1,
});

const employeeSchema = new mongoose.Schema({
  employee_id: { type: Number, required: false },
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  phone_no: { type: String, required: false },
  email: { type: String, required: false },
  whatsapp_no: { type: String, required: false },
  txt_pin: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
  post: { type: String, required: false },
  post_name: { type: String, required: false },
  dob_date: { type: String, required: false },
  blood_group: { type: String, required: false },
  blood_group_name: { type: String, required: false },

  gender: { type: String, required: false },
  gender_name: { type: String, required: false },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  mode: { type: String, required: true, trim: true, default: "Web" },

  name: { type: String, required: false },
  mobile: { type: String, required: false },
  email: { type: String, required: false },
  village_premises: { type: String, required: false },
  landmark: { type: String, required: false },
  police_station: { type: String, required: false },
  street: { type: String, required: false },
  pin: { type: String, required: false },
  city: { type: String, required: false },
  address_type: { type: String, required: false },
  bank_id: { type: String, required: false },
  bank: { type: String, required: false },
  branch: { type: String, required: false },
  account_no: { type: String, required: false },
  Ifsc_code: { type: String, required: false },
  name: { type: String, required: false },
  designation: { type: String, required: false },
  mobile: { type: String, required: false },
  whatsapp: { type: String, required: false },
  email: { type: String, required: false },
  address: { type: Array, required: false, trim: true },
  bank: { type: Array, required: false, trim: true },
  contact: { type: Array, required: false, trim: true },
  statutoryForm: { type: Array, required: false, trim: true },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
employeeSchema.plugin(autoIncrement.plugin, {
  model: "t_000_employee",
  field: "employee_id",
  startAt: 1,
  incrementBy: 1,
});

const materialTypeSchema = new mongoose.Schema({
  material_type_id: { type: Number, required: false },
  material_type_name: { type: String, required: false },
  material_type_rate: { type: Number, required: false },
  material_id: { type: Number, required: false },
  material_name: { type: String, required: false },

  hsn: { type: String, required: false },
  gst: { type: String, required: false },
  details: { type: String, required: false },
  effective_from_date: { type: String, required: false },
  effective_to_date: { type: String, required: false },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  mode: { type: String, required: true, trim: true, default: "Web" },

  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
materialTypeSchema.plugin(autoIncrement.plugin, {
  model: "t_000_material_type",
  field: "material_type_id",
  startAt: 1,
  incrementBy: 1,
});

const policeSchema = new mongoose.Schema({
  policeStation_id: { type: Number, required: true },

  policeStation_name: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
policeSchema.plugin(autoIncrement.plugin, {
  model: "t_100_policeStation",
  field: "policeStation_id",
  startAt: 1,
  incrementBy: 1,
});

const ParkingSchema = new mongoose.Schema({
  Parking_id: { type: Number, required: true },

  Parking_name: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
ParkingSchema.plugin(autoIncrement.plugin, {
  model: "t_100_Parking",
  field: "Parking_id",
  startAt: 1,
  incrementBy: 1,
});

const motorVehicleLegislationSchema = new mongoose.Schema({
  motor_vehicle_legislation_id: { type: Number, required: true },

  motor_vehicle_legislation_name: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
motorVehicleLegislationSchema.plugin(autoIncrement.plugin, {
  model: "t_100_motor_vehicle_legislation",
  field: "motor_vehicle_legislation_id",
  startAt: 1,
  incrementBy: 1,
});

const labSchema = new mongoose.Schema({
  lab_id: { type: Number, required: true },

  lab: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
labSchema.plugin(autoIncrement.plugin, {
  model: "t_100_lab",
  field: "lab_id",
  startAt: 1,
  incrementBy: 1,
});
const kataSchema = new mongoose.Schema({
  kata_id: { type: Number, required: true },

  kata: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
kataSchema.plugin(autoIncrement.plugin, {
  model: "t_100_kata",
  field: "kata_id",
  startAt: 1,
  incrementBy: 1,
});

const tyreModelSchema = new mongoose.Schema({
  tyre_model_id: { type: Number, required: true },
  tyre_model: { type: String, required: false },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: false, trim: true, default: "y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
tyreModelSchema.plugin(autoIncrement.plugin, {
  model: "t_000_tyre_model",
  field: "tyre_model_id",
  startAt: 1,
  incrementBy: 1,
});

const tyreDetailsSchema = new mongoose.Schema({
  tyre_details_id: { type: Number, required: false },
  vehicle_id: { type: Number, required: false },
  vehicle_no: { type: String, required: false },
  tyre_details: { type: Array, required: false },
  vehicle_status: { type: String, required: false, default: "y" },
  active_status: { type: String, required: false, trim: true, default: "y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
tyreDetailsSchema.plugin(autoIncrement.plugin, {
  model: "t_000_tyre_details",
  field: "tyre_details_id",
  startAt: 1,
  incrementBy: 1,
});

const categorySchemaDef = {
  category_id: { type: Number, required: true },
  category: { type: String, required: true, trim: true },
  details: { type: String, required: false, trim: true },
  picture_path: { type: String, required: false, trim: true, default: "" },
  hsn: { type: String, required: false, trim: true },
  gst: { type: Number, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
};

const categorySchema = new mongoose.Schema(categorySchemaDef);
categorySchema.plugin(autoIncrement.plugin, {
  model: "t_100_category",
  field: "category_id",
  startAt: 10,
  incrementBy: 1,
});

const brandSchema = new mongoose.Schema({
  brand_id: { type: Number, required: true },

  parent_brand_id: { type: Number, required: true, default: 0 },
  brand: { type: String, required: true, trim: true },
  details: { type: String, required: false, trim: true },
  picture_path: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
brandSchema.plugin(autoIncrement.plugin, {
  model: "t_100_brand",
  field: "brand_id",
  startAt: 1,
  incrementBy: 1,
});

const itemSchema = new mongoose.Schema({
  item_id: { type: Number, required: false },
  brand_id: { type: Number, required: false, default: 0 },
  category_id: { type: Number, required: false, default: 0 },
  item_company_code: { type: String, required: false, trim: true },
  item: { type: String, required: false, trim: true, index: true },
  size: { type: String, required: false, trim: true },
  // qty: { type: Number, required: false },
  uom: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },
  hsn_code: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
});
itemSchema.plugin(autoIncrement.plugin, {
  model: "t_100_item",
  field: "item_id",
  startAt: 1,
  incrementBy: 1,
});
itemSchema.index({ item: 1, item_own_code: 1 });

const ServicesSchema = new mongoose.Schema({
  services_id: { type: Number, required: false },
  service: { type: String, required: false, trim: true },
  details: { type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
ServicesSchema.plugin(autoIncrement.plugin, {
  model: "t_000_services",
  field: "services_id",
  startAt: 1,
  incrementBy: 1,
});

const receiptSalesVehicleSchema = new mongoose.Schema({
  receiptSalesVehicle_id: { type: Number, required: false },
  customer_id: { type: Number, required: false },
  customer: { type: String, required: false, trim: true },
  payment_details: { type: Array, required: false },
  Party_Name: { type: String, required: false, trim: true },
  payment_date: { type: Number, required: false, trim: true },
  mode_id: { type: Number, required: false, trim: true },
  mode_name: { type: String, required: false, trim: true },
  bank_id: { type: Number, required: false, trim: true },
  bank_name: { type: String, required: false, trim: true },
  transaction_no: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
receiptSalesVehicleSchema.plugin(autoIncrement.plugin, {
  model: "t_000_receiptSalesVehicle",
  field: "receiptSalesVehicle_id",
  startAt: 1,
  incrementBy: 1,
});

const distanceCoverSchema = new mongoose.Schema({
  distanceCover_id: { type: Number, required: false },
  vehicle_id: { type: Number, required: false },
  vehicle_no: { type: String, required: false, trim: true },
  month_id: { type: Number, required: false, trim: true },
  month_name: { type: String, required: false, trim: true },
  year_id: { type: Number, required: false, trim: true },
  year_name: { type: String, required: false, trim: true },
  distance: { type: Number, required: false, trim: true },
  narration: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
distanceCoverSchema.plugin(autoIncrement.plugin, {
  model: "t_000_distanceCover",
  field: "distanceCover_id",
  startAt: 1,
  incrementBy: 1,
});

const purchaseReturnTyreSchema = new mongoose.Schema({
  purchaseReturnTyre_id: { type: Number, required: false },

  tyre_details: { type: Array, required: false },
  new_tyre: { type: Array, required: false },
  tyre_date: { type: Number, required: false, trim: true },
  vendor_id: { type: Number, required: false, trim: true },
  vendor_label: { type: String, required: false, trim: true },
  bill_no: { type: String, required: false, trim: true },
  bill_date: { type: Number, required: false, trim: true },
  bill_amount: { type: Number, required: false, trim: true },
  bill_image_path: { type: String, required: false, trim: true },
  bill_image_name: { type: String, required: false, trim: true },
  remarks:{type: String, required: false, trim: true },
  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
purchaseReturnTyreSchema.plugin(autoIncrement.plugin, {
  model: "t_000_purchaseReturnTyre",
  field: "purchaseReturnTyre_id",
  startAt: 1,
  incrementBy: 1,
});

const breakDownSchema = new mongoose.Schema({
  breakDown_id: { type: Number, required: false },

  vehicle_id: { type: Number, required: false, trim: true },
  vehicle_no: { type: String, required: false, trim: true },
  driver_name: { type: String, required: false, trim: true },
  Place: { type: String, required: false, trim: true },
  breakDownTime: { type: String, required: false, trim: true },
  breakDownDate: { type: Number, required: false, trim: true },
  desecription: { type: String, required: false, trim: true },
  image_path: { type: String, required: false, trim: true },
  image_name: { type: String, required: false, trim: true },

  active_status: { type: String, required: true, trim: true, default: "Y" },
  inserted_by_id: { type: Number, required: true, trim: true, default: 0 },
  inserted_by_date: {
    type: String,
    required: true,
    trim: true,
    default: Date.now,
  },
  edited_by_id: { type: Number, required: true, trim: true, default: 0 },
  edit_by_date: { type: Number, required: true, trim: true, default: Date.now },
  deleted_by_id: { type: Number, required: true, trim: true, default: 0 },
  deleted_by_date: {
    type: Number,
    required: true,
    trim: true,
    default: Date.now,
  },
  edit_log: { type: Array, required: false },
  mode: { type: String, required: true, trim: true, default: "Web" },
});
breakDownSchema.plugin(autoIncrement.plugin, {
  model: "t_000_breakDown",
  field: "breakDown_id",
  startAt: 1,
  incrementBy: 1,
});

const vehicle = mongoose.model("t_000_vehicle", vehicleSchema);
const vehicle_brand = mongoose.model("t_000_vehicle_brand", vehicleBrandSchema);
const tyre_brand = mongoose.model("t_000_tyre_brand", tyreBrandSchema);
const tyre_model = mongoose.model("t_000_tyre_model", tyreModelSchema);
const vehicle_type = mongoose.model("t_000_vehicle_type", vehicleTypeSchema);
const expenses = mongoose.model("t_000_expenses", expensesSchema);
const location = mongoose.model("t_000_location", locationSchema);
const petrol_pump = mongoose.model("t_000_petrol_pump", petrolPumpSchema);
const customer = mongoose.model("t_400_customer", customer_Schema);
const showrooms_warehouse = mongoose.model(
  "t_000_showrooms_warehouse",
  showrooms_warehouse_Schema
);
const role = mongoose.model("t_100_role", roleSchema);
const employee = mongoose.model("t_000_employee", employeeSchema);
const bank = mongoose.model("t_100_bank_name", bank_Schema);
const routes = mongoose.model("t_000_routes", routesSchema);
const material_type = mongoose.model("t_000_material_type", materialTypeSchema);
const policeStation = mongoose.model("t_100_policeStation", policeSchema);
const Parking = mongoose.model("t_100_Parking", ParkingSchema);
const motorVehicleLegislation = mongoose.model(
  "t_100_motor_vehicle_legislation",
  motorVehicleLegislationSchema
);
const lab = mongoose.model("t_100_lab", labSchema);
const kata = mongoose.model("t_100_kata", kataSchema);
const tyre_details = mongoose.model("t_000_tyre_details", tyreDetailsSchema);
const category = mongoose.model("t_100_category", categorySchema);
const brand = mongoose.model("t_100_brand", brandSchema);
const item = mongoose.model("t_100_item", itemSchema);
const services = mongoose.model("t_000_services", ServicesSchema);
const receiptSalesVehicle = mongoose.model(
  "t_000_receiptSalesVehicle",
  receiptSalesVehicleSchema
);
const distanceCover = mongoose.model(
  "t_000_distanceCover",
  distanceCoverSchema
);
const purchaseReturnTyre = mongoose.model(
  "t_000_purchaseReturnTyre",
  purchaseReturnTyreSchema
);
const breakDown = mongoose.model("t_000_breakDown", breakDownSchema);

module.exports = {
  routes,
  expenses,
  customer,
  vehicle,
  showrooms_warehouse,
  role,
  vehicle_brand,
  vehicle_type,
  tyre_brand,
  tyre_model,
  location,
  petrol_pump,
  bank,
  employee,
  material_type,
  policeStation,
  Parking,
  motorVehicleLegislation,
  lab,
  kata,
  tyre_details,
  category,
  brand,
  item,
  services,
  receiptSalesVehicle,
  distanceCover,
  purchaseReturnTyre,
  breakDown,
};
