'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var postTradeSchema = new _mongoose2.default.Schema({

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
    type: String
  },
  payment_method: {
    type: String
  },

  more_information: {
    currency: {
      type: String
    },
    bank_name: {
      type: String
    },
    margin: {
      type: Number,
      default: 0
    },
    price_equation: {
      type: String,
      default: 0
    },
    max_trans_limit: {
      type: Number,
      default: 0
    },
    min_trans_limit: {
      type: Number,
      default: 0
    },
    opening_hours: {
      sunday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      },
      monday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      },
      tuesday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      },
      wednesday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      },
      thursday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      },
      friday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      },
      saturday: {
        start: {
          type: String,
          default: ''
        },
        end: {
          type: String,
          default: ''
        }
      }
    },
    terms_of_trade: {
      type: String,
      default: 'No terms of Trade added'
    }
  },
  online_selling: {

    minimum_volume: {
      type: Number,
      default: 0
    },
    minimum_feedback: {
      type: Number,
      default: 0
    },
    new_buyer_limit: {
      type: Number
    },
    transaction_volume_coefficient: {
      type: Number
    },
    display_reference: {
      type: String
    },
    reference_type: {
      type: String
    }
  },
  payment_window: {
    type: String,
    default: '90'
  },
  liquidity_options: {
    track_liquidity: {
      type: String
    }
  },
  security_options: {
    identified_people_only: {
      type: String
    },
    identify_user_before: {
      type: String
    },
    real_name_required: {
      type: String
    },
    sms_verification_required: {
      type: String
    },
    trusted_people_only: {
      type: String
    }
  },
  user: {
    type: String
  },
  firstName: {
    type: String
  }
}); /* import mongoose from 'mongoose';
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
    
      payment_window: {
        type: String,
      },
      track_liquidity: {
        type: String,
      },
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

postTradeSchema.plugin(_mongooseUniqueValidator2.default);

/* const buySell = new mongoose.Schema({
  _id: Schema.ObjectId,
  id: String,
  value: string,
}) */
exports.default = postTradeSchema;

// export default postTradeSchema;
//# sourceMappingURL=trade.js.map