import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autoIncrement from "mongoose-auto-increment";

const postTradeSchema = new mongoose.Schema({

  tradeMethod: { // local or online
    type: String, //LOCAL_SELL
    uppercase: true
  },
  traderType: { // sell or buy
    type: String,
    uppercase: true
  },
  cryptoCurrency: {
    type: String,
    uppercase: true
  },
  location: {
    type: String,
  },
  payment_method: {
    type: String,
  },

  more_information: {
    currency: {
      type: String,
    },
    margin: {
      type: Number,
    },
    price_equation: {
      type: String,
    },
    min_trans_limit: {
      type: Number,
    },
    max_trans_limit: {
      type: Number,
    },
    opening_hours: {
      sunday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
      monday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
      tuesday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
      wednesday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
      thursday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
      friday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
      saturday: {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
    },
    terms_of_trade: {
      type: String,
    },
  },
  online_selling: {
    payment_details: {
      type: String,
    },
    minimum_volume: {
      type: Number,
    },
    minimum_feedback: {
      type: Number,
    },
    new_buyer_limit: {
      type: Number,
    },
    transaction_volume_coefficient: {
      type: Number,
    },
    display_reference: {
      type: String,
    },
    reference_type: {
      type: String,
    },
  },
  payment_window: {
    type: String,
  },
  liquidity_options: {
    track_liquidity: {
      type: String,
    },
  },
  security_options: {
    identified_people_only: {
      type: String,
    },
    identify_user_before: {
      type: String,
    },
    real_name_required: {
      type: String,
    },
    sms_verification_required: {
      type: String,
    },
    trusted_people_only: {
      type: String,
    },
  },
  user: {
    type: String,
  },
  firstName: {
    type: String,
  }
});

postTradeSchema.plugin(uniqueValidator);

/* const buySell = new mongoose.Schema({
  _id: Schema.ObjectId,
  id: String,
  value: string,
}) */
export default postTradeSchema;