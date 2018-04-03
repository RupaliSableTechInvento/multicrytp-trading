var PostATrade = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    postTrade: API.postTrade,
    validateFields: function() {},
    priceEquation: function(btc_in_usd, currency, margin) {


    }
  }
  var _bind = {
    postTrade: function() {
      $(headerElms.btn_publish_advertisement).unbind().click(function() {
        var dataObj = {
          "trade_type.iwant": $(".trade_type .radio input:checked").val(),
          "trade_type.location": $("#ad-location").val(),
          "trade_type.payment_method": $("#select_ad-online_provider option:checked").val(),
          "more_information.currency": $("#select_ad-currency option:checked").val(),
          "more_information.margin": $("#margin_ad-commission").val(),
          "more_information.price_equation": $(".price-info").val(),
          "more_information.min_trans_limit": $("#ad-min_amount").val(),
          "more_information.max_trans_limit": $("#ad-max_amount").val(),

          "more_information.opening_hours.sunday.start": $("#ad-opening_hours_sun_start option:checked").val(),
          "more_information.opening_hours.sunday.end": $("#ad-opening_hours_sun_end option:checked").val(),

          "more_information.opening_hours.monday.start": $("#ad-opening_hours_mon_start option:checked").val(),
          "more_information.opening_hours.monday.end": $("#ad-opening_hours_mon_end option:checked").val(),
          "more_information.opening_hours.tuesday.start": $("#ad-opening_hours_tue_start option:checked").val(),

          "more_information.opening_hours.tuesday.end": $("#ad-opening_hours_tue_end option:checked").val(),

          "more_information.opening_hours.wednesday.start": $("#ad-opening_hours_wed_start option:checked").val(),
          "more_information.opening_hours.wednesday.end": $("#ad-opening_hours_wed_end option:checked").val(),

          "more_information.opening_hours.thursday.start": $("#ad-opening_hours_thu_start option:checked").val(),
          "more_information.opening_hours.thursday.end": $("#ad-opening_hours_thu_end option:checked").val(),

          "more_information.opening_hours.friday.start": $("#ad-opening_hours_fri_start option:checked").val(),

          "more_information.opening_hours.friday.end": $("#ad-opening_hours_fri_end option:checked").val(),

          "more_information.opening_hours.saturday.start": $("#ad-opening_hours_sat_start option:checked").val(),

          [ApiConfig.saturdayEnd]: $("#ad-opening_hours_sat_end option:checked").val(),

          "more_information.terms_of_trade": $("#ad-other_info").val(),

          "online_selling.payment_details": $("#ad-account_info").val(),

          "online_selling.minimum_volume": $("#ad-require_trade_volume").val(),

          "online_selling.minimum_feedback": $("#ad-require_feedback_score").val(),

          "online_selling.new_buyer_limit": $("#ad-first_time_limit_btc").val(),

          "online_selling.transaction_volume_coefficient": $("#ad-volume_coefficient_btc").val(),

          "online_selling.display_reference": $("#id_ad-display_reference").is(':checked'),

          "online_selling.reference_type": $("#ad-reference_type option:checked").val(),

          " payment_window": $("#ad-payment_window_minutes").val(),

          "liquidity_options.track_liquidity": $("#ad-track_max_amount").is(':checked'),
          "security_options.identified_people_only": $("#ad-require_identification ").is(':checked'),
          "security_options.identify_user_before": $("#ad-require_p2p_identification").is(':checked'),
          "security_options.real_name_required": $("#ad-real_name_required").is(':checked'),
          "security_options.sms_verification_required": $("#ad-sms_verification_required").is(':checked'),
          "security_options.trusted_people_only": $("#ad-require_trusted_by_advertiser ").is(':checked'),
          "user": "0"
        }
        _core.postTrade(dataObj, function(res) {
          console.log("res", res)
        })
      })
      $(".trade_type input").unbind().click(function() {
        if ($(this).attr("data-trade-type") == "online") {
          $('.sell_online_options').removeClass('active');
          console.log("online", $("#id_ad-online_provider option:checked").val());
          $('.ad-online_provider').removeClass('active_local');
          $('.ad-online_provider').addClass('active_online');
          $('.online_Selling').removeClass('active_local_sell');
          $('.online_Buying').removeClass('active_local_buy');
          if ($(this).attr("value") == "ONLINE_SELL") {
            console.log("online sell");
            $('.online_Buying').removeClass('active_online_buy');
            $('.online_Buying').addClass('active_local_buy');
            $('.online_Selling').addClass('active_online_sell');
            $('.sell_online_options').addClass('active');

          } else {
            console.log("online buy");
            $('.sell_online_options').removeClass('active');

            $('.online_Selling').removeClass('active_online_sell');
            $('.online_Selling').addClass('active_local_sell');

            $('.online_Buying').addClass('active_online_buy');
          }
        }
        if ($(this).attr("data-trade-type") == "local") {
          console.log("local", $("#id_ad-online_provider option:checked").val());
          $('.sell_online_options').removeClass('active');

          $('.ad-online_provider').removeClass('active_online');
          $('.ad-online_provider').addClass('active_local');
          $('.online_Selling').removeClass('active_online_sell');
          $('.online_Buying').removeClass('active_online_buy');
          $('.online_Selling').addClass('active_local_sell');
          $('.online_Buying').addClass('active_local_buy');

        }


        /*   console.log("asdsad",$(".trade_type input").click(function(){
console.log("asdsad",$(this).attr("data-trade-type")) 
}))  */
      })
      $(".end_time").unbind().click(function() {
        var startTime = $(".start_time option:checked").val();
        var endTime = $(".end_time option:checked").val();
        if (endTime > 0) {
          if (startTime > endTime) {
            alert(" select time according to 24 hrs");

            $(this).val("-1");
          }

        }
      })


    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/postTrade/postTrade.html', 'postTrade', function() {
        _bind.postTrade()


      })
    }
  }
}).bind(PostATrade))()