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
  trade_type: {
    iwant: {
      type: String
    },
    location: {
      type: String
    },
    payment_method: {
      type: String
    }
  },
  more_information: {
    currency: {
      type: String
    },
    margin: {
      type: Number
    },
    price_equation: {
      type: String
    },
    min_trans_limit: {
      type: Number
    },
    max_trans_limit: {
      type: Number
    },
    opening_hours: {
      sunday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      },
      monday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      },
      tuesday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      },
      wednesday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      },
      thursday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      },
      friday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      },
      saturday: {
        start: {
          type: String
        },
        end: {
          type: String
        }
      }
    },
    terms_of_trade: {
      type: String
    }
  },
  online_selling: {
    payment_details: {
      type: String
    },
    minimum_volume: {
      type: Number
    },
    minimum_feedback: {
      type: Number
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
    type: String
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
  }
});

postTradeSchema.plugin(_mongooseUniqueValidator2.default);

/* const buySell = new mongoose.Schema({
  _id: Schema.ObjectId,
  id: String,
  value: string,
}) */
exports.default = postTradeSchema;
//# sourceMappingURL=trade.js.map