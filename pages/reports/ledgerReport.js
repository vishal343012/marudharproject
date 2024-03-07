const moment = require("moment");

const {
  tax_master,
  ledger_account,
  ledger_group,
  primary_group,
  journal,
  receipt_payment,
} = require("../../modals/MasterAccounts");
const { vehicle, customer } = require("../../modals/Master");

const ledgerList = async (req, res) => {
  let condition = {};
  const ledger_account_id = req.body.ledger_account_id;
  const voucher_from_date = req.body.voucher_from_date;
  const voucher_to_date = req.body.voucher_to_date;

  if (voucher_to_date && voucher_from_date) {
    condition = {
      voucher_date: {
        $gte: voucher_from_date,
        $lte: voucher_to_date,
      },
    };
  }

  // console.log(ledger_account_id, voucher_from_date, voucher_to_date);
  // console.log(ledger_account_id)
  const ledgerData = await journal.aggregate([
    { $unwind: "$journal_details" },
    {
      $match: {
        ...condition,
        $expr: {
          $and: [
            { $eq: ["$journal_details.ledger_account_id", ledger_account_id] },
            { $gte: ["$voucher_date", voucher_from_date] },
            { $lte: ["$voucher_date", voucher_to_date] },
          ],
        },
      },
    },

    {
      $project: {
        voucher_no: 1,
        "journal_details.ledger_account_id": 1,
        "journal_details.ledger": 1,
        "journal_details.amount": 1,
        "journal_details.dr_cr": 1,
        "journal_details.dr_cr_id": 1,
        voucher_date: 1,
        transaction_id: 1,
        transaction_type: 1,
        transaction_type_id: 1,
        narration: 1,
      },
    },
    { $addFields: { voucher_type: "Journal" } },
    {
      $unionWith: {
        coll: "t_200_receipt_payments",
        pipeline: [
          {
            $match: {
              deleted_by_id: 0,
              $or: [
                { ledger_account_id: ledger_account_id },
                { bank_id: ledger_account_id },
              ],
              voucher_date: { $gte: voucher_from_date, $lte: voucher_to_date },
            },
          },
          {
            $project: {
              voucher_no: 1,
              mode: 1,
              amount: 1,
              receipt_payment_type: 1,
              voucher_date: 1,
              ledger_account_id: 1,
              narration: 1,
              bank_id: 1,
              dr_cr: {
                //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$bank_id", ledger_account_id] },
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ["$ledger_account_id", ledger_account_id] },
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                        ],
                      },
                    ],
                  },
                  then: 1,
                  else: 2,
                },
              },
            },
          },
          //{ $addFields: { flag: 2 } }
        ],
      },
    },
    {
      $lookup: {
        from: "t_200_ledger_accounts",
        let: { ledger_account_id: "$ledger_account_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },
            },
          },
          {
            $project: { _id: 0, ledger_account: 1 },
          },
        ],
        as: "ledger_account_details",
      },
    },

    {
      $unwind: {
        path: "$ledger_account_details",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        ledger_account_for_party: "$ledger_account_details.ledger_account",
      },
    },
    {
      $sort: { voucher_date: 1 },
    },
  ]);

  if (ledgerData) {
    return res.status(200).json(ledgerData);
  } else {
    return res.status(200).json([]);
  }
};

const outstandingByCustomer = async (req, res) => {
  let condi = { deleted_by_id: 0 };
  let condition = {};

  const group_id = req.body.group_id;
  const reference_id = req.body.reference_id;
  const customer_id = req.body.customer_id;
  const txt_to_date = req.body.txt_to_date;
  const txt_from_date = req.body.txt_from_date;

  // const txt_to_date = moment().endOf('day').unix("x");s
  // const txt_from_date = req.body.txt_from_date;

  console.log(txt_to_date, txt_from_date, customer_id, "wwww");

  if (group_id) {
    condition = { ...condition, group_id: group_id };
  }

  if (customer_id) {
    condition = { ...condition, customer_id: customer_id };
  }

  //   if(txt_from_date & txt_to_date){
  //     condition = {
  //         ...condition,
  //         voucher_date: {
  //           $gte: txt_from_date,
  //           $lte: txt_to_date,
  //         }
  //       };
  // }

  let outStandingData = await customer.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        customer_id: 1,
        company_name: 1,
      },
    },
    //LOOKUP 1 IN SALES COLLECTION ////////////////////////////////////////////////////////////////////////////////
    {
      $lookup: {
        from: "t_001_sales_cum_dispatches",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$customer_id", "$customer_id"] },
                  { $gte: ["$sales_date", txt_from_date] },
                  { $lte: ["$sales_date", txt_to_date] },
                ],
              },
            },
          },

          {
            $project: {
              customer_id: 1,
              transaction_no: 1,
              total_amount: 1,
            },
          },
          {
            $group: {
              _id: "$customer_id",
              sumSalesAmount: { $sum: "$total_amount" },
            },
          },
        ],
        as: "salesCumDispatchDetails",
      },
    },
    {
      $unwind: {
        path: "$salesCumDispatchDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        sumSalesAmount: {
          $toDouble: "$salesCumDispatchDetails.sumSalesAmount",
        },
      },
    },
    { $unset: ["salesCumDispatchDetails"] },

    /////////////////////////////////////////
    //ACCOUNTS PART BEGINS HERE
    /////////////////////////////////////////
    {
      $lookup: {
        from: "t_200_ledger_accounts",
        let: { customer_id: "$customer_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$type_id", "$$customer_id"] },
                  { $eq: ["$type", "C"] },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              ledger_account_id: 1,
              ledger_account: 1,
              opening_balance: 1,
              dr_cr_status: 1,
            },
          },
        ],
        as: "ledger_account_details",
      },
    },
    {
      $unwind: {
        path: "$ledger_account_details",
        // preserveNullAndEmptyArrays: true
      },
    },
    // /////////////////////////////////////////////////////////////////
    {
      $addFields: {
        ledger_acc_id: "$ledger_account_details.ledger_account_id",
      },
    },
    {
      $addFields: {
        opening_balance: "$ledger_account_details.opening_balance",
      },
    },
    // { $addFields: { dr_cr_status: "$ledger_account_details.dr_cr_status" } },
    {
      $lookup: {
        from: "t_200_journals",
        let: { ledger_account_id: "$ledger_acc_id" },
        pipeline: [
          { $unwind: "$journal_details" },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$$ledger_account_id",
                      "$journal_details.ledger_account_id",
                    ],
                  },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              ledger_account_id: 1,
              journal_id: 1,
              journal_details: 1,
              voucher_date: 1,
              voucher_amount: 1,
              debit_balance: {
                $cond: {
                  if: {
                    $and: [
                      { $in: ["$journal_details.dr_cr_id", [1]] },
                      // { $gte: ["$voucher_date", txt_from_date] },
                      { $lte: ["$voucher_date", txt_to_date] },
                    ],
                  },
                  then: "$journal_details.amount",
                  else: 0,
                },
              },
              credit_balance: {
                $cond: {
                  if: {
                    $and: [
                      { $in: ["$journal_details.dr_cr_id", [2]] },
                      // { $gte: ["$voucher_date", txt_from_date] },
                      { $lte: ["$voucher_date", txt_to_date] },
                    ],
                  },
                  then: "$journal_details.amount",
                  else: 0,
                },
              },
            },
          },
          {
            $group: {
              _id: "$journal_details.ledger_account_id",
              debit_balance: { $sum: "$debit_balance" },
              credit_balance: { $sum: "$credit_balance" },
            },
          },
        ],
        as: "journals",
      },
    },
    {
      $lookup: {
        from: "t_200_receipt_payments",
        let: { ledger_account_id: "$ledger_acc_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$ledger_account_id", "$ledger_account_id"],
              },
            },
          },

          {
            $match: {
              deleted_by_id: 0,
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ["$$ledger_account_id", "$ledger_account_id"] },
                      { $eq: ["$$ledger_account_id", "$bank_id"] },
                    ],
                  },
                  { $eq: ["$deleted_by_id", 0] },
                ],
              },
            },
          },

          {
            $project: {
              _id: 0,
              //ledger_account_id: 1,
              // $bank_id:1
              ledger_account_id: {
                $cond: {
                  if: { $eq: ["$ledger_account_id", "$$ledger_account_id"] },

                  then: "$ledger_account_id",
                  else: "$bank_id",
                },
              },
              receipt_payment_id: 1,
              receipt_payment_type: 1,
              voucher_date: 1,
              amount: 1,
              debit_balance: {
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          { $gte: ["$voucher_date", txt_from_date] },
                          { $lte: ["$voucher_date", txt_to_date] },
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                        ],
                      },
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          { $gte: ["$voucher_date", txt_from_date] },
                          { $lte: ["$voucher_date", txt_to_date] },
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$amount",
                  else: 0,
                },
              },
              credit_balance: {
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["P", "BR"]] },
                          { $gte: ["$voucher_date", txt_from_date] },
                          { $lte: ["$voucher_date", txt_to_date] },
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                        ],
                      },
                      {
                        $and: [
                          { $in: ["$receipt_payment_type", ["R", "BP"]] },
                          { $gte: ["$voucher_date", txt_from_date] },
                          { $lte: ["$voucher_date", txt_to_date] },
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$amount",
                  else: 0,
                },
              },
              dr_cr_status: {
                //$cond: { if: { $in: [ "$transaction_type", ["PR", "DR"] ] }, then: "$plus_qty", else: 0 }
                $cond: {
                  if: {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$bank_id", "$$ledger_account_id"] },
                          { $eq: ["$receipt_payment_type", "R"] },
                        ],
                      },
                      {
                        $and: [
                          {
                            $eq: ["$ledger_account_id", "$$ledger_account_id"],
                          },
                          { $eq: ["$receipt_payment_type", "P"] },
                        ],
                      },
                    ],
                  },
                  then: "Dr",
                  else: "Cr",
                },
              },
            },
          },
          {
            $group: {
              _id: "$ledger_account_id",
              debit_balance: { $sum: "$debit_balance" },
              credit_balance: { $sum: "$credit_balance" },
            },
          },
        ],
        as: "receipt_payments",
      },
    },

    {
      $unwind: {
        path: "$journals",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$receipt_payments",
        preserveNullAndEmptyArrays: true,
      },
    },

    ////DR CR status/////////////////////////////////////
    {
      $addFields: {
        current_dr_cr: {
          $switch: {
            branches: [
              {
                //// Case 1 op!=0 && o.drcr = dr
                case: {
                  $and: [
                    { $ne: ["$opening_balance", 0] },
                    { $eq: ["$dr_cr_status", "Dr"] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$opening_balance",
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Dr",
              },
              //////case 2op!=0 && o.drcr =cr
              {
                case: {
                  $and: [
                    { $ne: ["$opening_balance", 0] },
                    { $eq: ["$dr_cr_status", "Cr"] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$opening_balance",
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Cr",
              },
              //////Case 3 op=0
              {
                case: {
                  $and: [
                    { $eq: ["$opening_balance", 0] },
                    {
                      $gte: [
                        {
                          $subtract: [
                            {
                              $sum: [
                                "$journals.debit_balance",
                                "$receipt_payments.debit_balance",
                              ],
                            },
                            {
                              $sum: [
                                "$journals.credit_balance",
                                "$receipt_payments.credit_balance",
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: "Dr",
              },
            ],
            default: "Cr",
          },
        },
      },
    },
    /////////////////////////////////////////////////////
    {
      $addFields: {
        closing_balance: {
          $cond: {
            if: { $eq: ["$current_dr_cr", "Dr"] },
            then: {
              $subtract: [
                {
                  $sum: [
                    "$opening_balance",
                    {
                      $sum: [
                        "$journals.debit_balance",
                        "$receipt_payments.debit_balance",
                      ],
                    },
                  ],
                },
                {
                  $sum: [
                    "$journals.credit_balance",
                    "$receipt_payments.credit_balance",
                  ],
                },
              ],
            },
            else: {
              $subtract: [
                {
                  $sum: [
                    "$opening_balance",
                    {
                      $sum: [
                        "$journals.credit_balance",
                        "$receipt_payments.credit_balance",
                      ],
                    },
                  ],
                },
                {
                  $sum: [
                    "$journals.debit_balance",
                    "$receipt_payments.debit_balance",
                  ],
                },
              ],
            },
          },
        },
      },
    },

    {
      $unset: ["journals", "receipt_payments", "ledger_account_details"],
    },
  ]);

  // console.log("HKHK", outStandingData);
  if (outStandingData) {
    return res.status(200).json(outStandingData);
  } else {
    return res.status(200).json([]);
  }
};

const vehicle_ExpiryDate_List = async (req, res) => {
  let condition = { deleted_by_id: 0 };
  console.log(
    Math.floor(
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
    ),
    "sankh15"
  );

  const expiry_date = await vehicle.aggregate([
    // {
    //   $match:{condition}
    // },

    {
      $match: {
        deleted_by_id: 0,
        $or: [
          {
            pollution_expiry_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },
            insurance_expire_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },

            permit_expiry_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },

            fitness_expiry_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },
            loan_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },
            bank_noc_date: {
              $lte: Math.floor(
                new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() / 1000
              ),
            },
          },
        ],
      },
    },

    {
      $project: {
        vehicle_id: 1,
        vehicle_no: 1,

        insurance_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "insurance_expire_date",
              ],
            },
            then: { $ifNull: ["$insurance_number", 0] },
            else: 0,
          },
        },
        insurance_expire_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "insurance_expire_date",
              ],
            },
            then: "$insurance_expire_date",
            else: 0,
          },
        },
        pollution_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "pollution_expiry_date",
              ],
            },
            then: { $ifNull: ["$pollution_number", 0] },
            else: 0,
          },
        },
        pollution_expiry_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "pollution_expiry_date",
              ],
            },
            then: "$pollution_expiry_date",
            else: 0,
          },
        },

        permit_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "permit_expiry_date",
              ],
            },
            then: { $ifNull: ["$permit_number", 0] },
            else: 0,
          },
        },
        permit_expiry_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "permit_expiry_date",
              ],
            },
            then: "$permit_expiry_date",
            else: 0,
          },
        },

        fitness_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "fitness_expiry_date",
              ],
            },
            then: { $ifNull: ["$fitness_number", 0] },
            else: 0,
          },
        },
        fitness_expiry_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "fitness_expiry_date",
              ],
            },
            then: "$fitness_expiry_date",
            else: 0,
          },
        },

        loan_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "loan_date",
              ],
            },
            then: { $ifNull: ["$loan_number", 0] },
            else: 0,
          },
        },
        loan_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "loan_date",
              ],
            },
            then: "$loan_date",
            else: 0,
          },
        },

        bank_noc_number: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "bank_noc_date",
              ],
            },
            then: { $ifNull: ["$bank_noc_number", 0] },
            else: 0,
          },
        },
        bank_noc_date: {
          $cond: {
            if: {
              $lte: [
                Math.floor(
                  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime() /
                    1000
                ),
                "bank_noc_date",
              ],
            },
            then: "$bank_noc_date",
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$vehicle_id",
        vehicle_no: { $first: "$vehicle_no" },
        document_expirations: {
          $push: {
$concatArrays: [
[
          {  
            document_name: "Insurance",
            document_number: "$insurance_number",
            expiry_date: "$insurance_expire_date",
          },
],
          [ {
            document_name: "Pollution",
            document_number: "$pollution_number",
            expiry_date: "$pollution_expiry_date",
          },],
          [{
            document_name: "Permit",
            document_number: "$permit_number",
            expiry_date: "$permit_expiry_date",
          },],
          [{
            document_name: "Fitness",
            document_number: "$fitness_number",
            expiry_date: "$fitness_expiry_date",
          },],
          [{
            document_name: "Bank_noc",
            document_number: "$bank_noc_number",
            expiry_date: "$bank_noc_date",
          },],

          ],
        },
      },
    }
    },
  ]);

  if (expiry_date) {
    return res.status(200).json(expiry_date);
  } else {
    res.status(200).json([]);
  }
};

module.exports = { ledgerList, outstandingByCustomer, vehicle_ExpiryDate_List };
