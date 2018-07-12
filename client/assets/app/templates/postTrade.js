var PostATrade = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    postTrade: API.postTrade,
    getPriceEquation: API.getPriceEquation,
    validateFields: function() {},
    priceEquation: function(cryptoCurrency_in_usd, USD_in_currency, margin) {
      var equation = cryptoCurrency_in_usd * USD_in_currency;
      var priceEq = '';
      if (margin == 0) {
        return priceEq = equation * 1;
      } else if (margin > 0) {
        return priceEq = equation * (1 + margin / 100);
      } else {
        return priceEq = equation * (1 - margin / 100);
      }
    },

    setValueDropDwn: function(id, value) {
      console.log(" Set Drop Down ", id, value);
      $(id).empty();
      $(id).append(value);
    },

    showErrorMsg: function(form, type, msg) {
      var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
        <span></span>\
      </div>');
      form.find('.alert').remove();
      alert.prependTo(form);
      alert.animateClass('fadeIn animated');
      alert.find('span').html(msg);
    }


  }

  var _bind = {
    ckEditor: function() {
      CKEDITOR.replace('editor1');

      var getData = CKEDITOR.instances.editor1.getData();
      console.log(" CKEDITOR.instances.editor1.getData()", getData);
    },

    postTrade: async function() {
      var btn, form;
      var margin = $("#margin_ad-commission").val();
      var cryptoCurrency, location;
      var currency, price_equation;
      var USD = 'USD';
      var cryptoCurrency_in_usd;
      var USD_in_currency;
      var payment_method, reference_type;
      var code;
      var sun_start, mon_start, tue_start, wed_start, thu_start, fri_start, sat_start;
      var sun_end, mon_end, tue_end, wed_end, thu_end, fri_end, sat_end;
      var endTimeValid = false;


      $('#select_ad-cryptocurrency li').on('click', async function() {
        var value = $(this).attr('name');


        code = $(this).attr('data-code');
        _core.setValueDropDwn('#titile_cryptocurrency', value)
        var htmlpriceEq = code + '_in_USD  *  USD_in_' + currency;
        $('#id_ad-price_equation').val(htmlpriceEq);


        $('.price-info').empty();
        cryptoCurrency = value;
        var dataObjPriceEq = {
          from: code,
          to: USD,
        }
        const res = await _core.getPriceEquation(dataObjPriceEq);
        if (res.success) {

          console.log("price Equation=>>", res);
          cryptoCurrency_in_usd = res.ticker.price;

          var htmlPriceInfo = "   " + cryptoCurrency_in_usd + ' ' + 'USD / ' + ' ' + code;
          $('.price-info').append(htmlPriceInfo)
        } else {
          console.log("", res.error);
        }
      });
      $('#select_ad-online_provide li').on('click', function() {
        var value = $(this).attr('name');
        _core.setValueDropDwn('#title_online_provide', value)
        payment_method = value;
      })
      await $('#select_ad-currency li').on('click', async function() {
        $('.price-info').empty();
        var value = $(this).attr('name');
        _core.setValueDropDwn('#titile_currency', value)
        currency = value;

        var htmlpriceEq = code + '_in_USD  *  USD_in_' + currency;
        $('#id_ad-price_equation').val(htmlpriceEq);

        var dataObjPriceEq = {
          from: USD,
          to: currency,
        }

        const res = await _core.getPriceEquation(dataObjPriceEq);
        console.log("price Equation=>>", res);
        if (res.success) {
          USD_in_currency = res.ticker.price;
          if (margin == '' || undefined) {
            margin = 0;
          }
          price_equation = _core.priceEquation(cryptoCurrency_in_usd, USD_in_currency, margin);
          console.log("Price Equation=>>", price_equation);


          var htmlPriceInfo = price_equation + ' ' + 'USD / ' + ' ' + code;
          $('.price-info').append(htmlPriceInfo)
        } else {
          console.log("", res.error);
        }

      })



      await $("#margin_ad-commission").change(async function() {
        $('.price-info').empty();
        if (margin == '' || undefined) {
          margin = 0;
        }
        margin = $("#margin_ad-commission").val();
        price_equation = _core.priceEquation(cryptoCurrency_in_usd, USD_in_currency, margin);
        console.log("Price Equation=>>", price_equation);

        var htmlPriceInfo = price_equation + ' ' + 'USD / ' + ' ' + code;
        $('.price-info').append(htmlPriceInfo)

      })

      $('#ad-reference_type li').on('click', function() {

        var value = $(this).attr('name');
        _core.setValueDropDwn('#titile_reference_type', value)
        reference_type = value;

      })

      $('#select_ad-location li').on('click', function() {
        var value = $(this).attr('name');
        _core.setValueDropDwn('#titile_location', value)

        var country_code = $(this).attr('data-country-code');
        console.log("country code=>", country_code, this);

        $('#select_ad-currency li').each(function(i) {
          var temp = $(this).attr('name');
          console.log("Temp =>", temp, this);
          if (temp == country_code) {
            console.log("currency matched", $(this).attr('name'), country_code);
            _core.setValueDropDwn('#titile_currency', country_code)
          }
        })





        location = value;
      })




      /* Opening hours  */
      $('#ad-opening_hours_sun_start li').on('click', function() {
        $('#ad-opening_hours_sun_start li').removeClass('selected');
        var value = $(this).attr('name');
        // $(this).attr('selected', 'selected');
        $(this).addClass('selected');

        _core.setValueDropDwn('#titile_StartTime_sun', value)
        sun_start = value;


      })
      $('#ad-opening_hours_sun_end li').on('click', function() {

        $('#ad-opening_hours_sun_end li').removeClass('selected');
        $(this).addClass('selected');
        var value = $(this).attr('name');

        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_sun', "End")
          endTimeValid = false;
          // $("#ad-opening_hours_sun_end li").val("-1");

        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);

            endTimeValid = false;

          }

        }
        if (endTimeValid) {
          console.log('endtime valid in sun end  =>', endTimeValid);
          _core.setValueDropDwn('#titile_EndTime_sun', value)
          sun_end = value;

        }
        console.log("sun end", sun_end);
      })

      $('#ad-opening_hours_mon_start li').on('click', function() {

        var value = $(this).attr('name');
        $(this).attr('selected', 'selected');
        $(this).addClass('selected');

        _core.setValueDropDwn('#titile_StartTime_mon', value)
        mon_start = value;


      })
      $('#ad-opening_hours_mon_end li').on('click', function() {

        var value = $(this).attr('name');
        $(this).addClass('selected');
        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_mon', "End")
          endTimeValid = false;
        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
            endTimeValid = false;
          }
        }
        if (endTimeValid) {
          _core.setValueDropDwn('#titile_EndTime_mon', value)
          mon_end = value;
        }
      })

      $('#ad-opening_hours_tue_start li').on('click', function() {

        var value = $(this).attr('name');
        $(this).attr('selected', 'selected');
        $(this).addClass('selected');
        _core.setValueDropDwn('#titile_StartTime_tue', value)
        tue_start = value;

      })
      $('#ad-opening_hours_tue_end li').on('click', function() {
        var value = $(this).attr('name');
        $(this).addClass('selected');
        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_tue', "End")
          endTimeValid = false;
        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
            endTimeValid = false;
          }
        }
        if (endTimeValid) {
          _core.setValueDropDwn('#titile_EndTime_tue', value)
          mon_end = value;
        }

      })

      $('#ad-opening_hours_wed_start li').on('click', function() {


        var value = $(this).attr('name');
        $(this).attr('selected', 'selected');
        $(this).addClass('selected');

        _core.setValueDropDwn('#titile_StartTime_wed', value)
        wed_start = value;

      })
      $('#ad-opening_hours_wed_end li').on('click', function() {
        var value = $(this).attr('name');
        $(this).addClass('selected');
        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_wed', "End")
          endTimeValid = false;
        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
            endTimeValid = false;
          }
        }
        if (endTimeValid) {
          _core.setValueDropDwn('#titile_EndTime_wed', value)
          mon_end = value;
        }

      })

      $('#ad-opening_hours_thu_start li').on('click', function() {

        var value = $(this).attr('name');
        $(this).attr('selected', 'selected');
        $(this).addClass('selected');

        _core.setValueDropDwn('#titile_StartTime_thu', value)
        thu_start = value;


      })
      $('#ad-opening_hours_thu_end li').on('click', function() {
        var value = $(this).attr('name');
        $(this).addClass('selected');
        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_thu', "End")
          endTimeValid = false;
        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
            endTimeValid = false;
          }
        }
        if (endTimeValid) {
          _core.setValueDropDwn('#titile_EndTime_thu', value)
          mon_end = value;
        }
      })

      $('#ad-opening_hours_fri_start li').on('click', function() {

        var value = $(this).attr('name');
        $(this).attr('selected', 'selected');
        $(this).addClass('selected');

        _core.setValueDropDwn('#titile_StartTime_fri', value)
        fri_start = value;

      })
      $('#ad-opening_hours_fri_end li').on('click', function() {

        var value = $(this).attr('name');
        $(this).addClass('selected');
        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_fri', "End")
          endTimeValid = false;
        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
            endTimeValid = false;
          }
        }
        if (endTimeValid) {
          _core.setValueDropDwn('#titile_EndTime_fri', value)
          mon_end = value;
        }

      })

      $('#ad-opening_hours_sat_start li').on('click', function() {

        var value = $(this).attr('name');
        $(this).attr('selected', 'selected');
        $(this).addClass('selected');

        _core.setValueDropDwn('#titile_StartTime_sat', value)
        sat_start = value;


      })
      $('#ad-opening_hours_sat_end li').on('click', function() {
        var value = $(this).attr('name');
        $(this).addClass('selected');
        var startTime = $(this).parents().parents().parents().find(".start_time li.selected").attr('value');
        var endTime = $(this).attr('value');
        if (endTime > 0 && startTime >= endTime) {
          endTimeValid = false;
          console.log(" end time start time ", endTime, startTime, endTimeValid);
          alert(" select time according to 24 hrs");
          _core.setValueDropDwn('#titile_EndTime_sat', "End")
          endTimeValid = false;
        } else {
          if ((endTime > 0) && (endTime > startTime) && (startTime != undefined)) {
            endTimeValid = true;
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
          } else {
            console.log(" end time start time in sun else", endTime, startTime, endTimeValid);
            endTimeValid = false;
          }
        }
        if (endTimeValid) {
          _core.setValueDropDwn('#titile_EndTime_sat', value)
          mon_end = value;
        }

      })


      $('#btn_publish_advertisement').unbind().click(function() {
        btn = $(this);
        form = $(this).closest('form');
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        var more_information = {};
        more_information.terms_of_trade = CKEDITOR.instances.editor1.getData();
        more_information.currency = currency;
        more_information.margin = $("#margin_ad-commission").val();
        more_information.price_equation = price_equation;
        more_information.min_trans_limit = $("#ad-min_amount").val();
        more_information.max_trans_limit = $("#ad-max_amount").val();
        more_information.bank_name = $("#ad-bank_name").val();

        var dataObj = {
          "tradeMethod": $(".add-adform-radio:checked").attr("data-trade-type"),
          "traderType": $(".add-adform-radio:checked").val(),
          "cryptoCurrency": cryptoCurrency,
          "location": location,
          "payment_method": payment_method,
          more_information: more_information,
          "more_information.opening_hours.sunday.start": sun_start,
          "more_information.opening_hours.sunday.end": sun_end,
          "more_information.opening_hours.monday.start": mon_start,
          "more_information.opening_hours.monday.end": mon_end,
          "more_information.opening_hours.tuesday.start": tue_start,
          "more_information.opening_hours.tuesday.end": tue_end,
          "more_information.opening_hours.wednesday.start": wed_start,
          "more_information.opening_hours.wednesday.end": wed_end,

          "more_information.opening_hours.thursday.start": thu_start,
          "more_information.opening_hours.thursday.end": thu_end,

          "more_information.opening_hours.friday.start": fri_start,

          "more_information.opening_hours.friday.end": fri_end,

          "more_information.opening_hours.saturday.start": sat_start,

          "more_information.opening_hours.saturday.end": sat_end,


          "online_selling.payment_details": $("#ad-account_info").val(),

          "online_selling.minimum_volume": $("#ad-require_trade_volume").val(),

          "online_selling.minimum_feedback": $("#ad-require_feedback_score").val(),

          "online_selling.new_buyer_limit": $("#ad-first_time_limit_btc").val(),
          "online_selling.transaction_volume_coefficient": $("#ad-volume_coefficient_btc").val(),
          "online_selling.display_reference": $("#id_ad-display_reference").is(':checked'),
          "online_selling.reference_type": reference_type,
          " payment_window": $("#ad-payment_window_minutes").val(),
          "liquidity_options.track_liquidity": $("#ad-track_max_amount").is(':checked'),
          "security_options.identified_people_only": $("#ad-require_identification ").is(':checked'),
          "security_options.identify_user_before": $("#ad-require_p2p_identification").is(':checked'),
          "security_options.real_name_required": $("#ad-real_name_required").is(':checked'),
          "security_options.sms_verification_required": $("#ad-sms_verification_required").is(':checked'),
          "security_options.trusted_people_only": $("#ad-require_trusted_by_advertiser ").is(':checked'),
          "user": localStorage.getItem('user_id') || null
        }
        var token = localStorage.getItem('token');
        console.log("published");
        _core.postTrade(dataObj, token, function(res) {
          $(window).scrollTop(0);
          if (res) {
            console.log("res", res);
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              form.clearForm();
              form.validate().resetForm();
              // display signup form
              // displaySignInForm();
              // var signInForm = login.find('.m-login__signin form');
              //signInForm.clearForm();
              //signInForm.validate().resetForm();
              _core.showErrorMsg(form, 'success', 'Your trade request post sucessfully');
            }, 2000);

          } else {

            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

              _core.showErrorMsg(form, 'danger', 'Unable to post a trade."' + res.data + '" ');

            }, 2000);
          }
        })
      })
      $(".trade_type input").unbind().click(function() {
          if ($(this).attr("data-trade-type") == "ONLINE") {
            $('.ad-online_provider').show();
            $('.ad-bank_name').show();
            if ($(this).attr("value") == "SELL") {
              console.log("online sell");
              $('.online_Buying').hide();
              $('.online_Selling').show();
              $('.sell_online_options').show();

            } else {
              console.log("online buy");
              $('.online_Selling').hide();
              $('.online_Buying').show();
              $('.sell_online_options').hide();
            }
          }
          if ($(this).attr("data-trade-type") == "LOCAL") {
            $('.online_Buying').hide();
            $('.online_Selling').hide();
            $('.ad-online_provider').hide();
            $('.ad-bank_name').hide();

            $('.sell_online_options').hide();
          }
        })
        /* 
              $('.opening_hours_row >.end_timeday').unbind().click(async function() {
                console.log("end time clicked===");
                var startTime = await parseInt($(this).parent().find(".start_time li.selected").attr('value'));
                console.log('start time=>>', startTime);
                var endTime = parseInt($(this).find(".end_time li.selected").attr('value'));
                console.log('End time=>', endTime);
                if (endTime > 0 && startTime >= endTime) {
                  endTimeValid = false;
                  console.log("endtime valid=>  end time start time", endTimeValid, endTime, startTime);
                  setTimeout(function() {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

                    _core.showErrorMsg(form, 'danger', ' select time according to 24 hrs.');

                  }, 2000)
                  alert(" select time according to 24 hrs");
                   $(this).find(".end_time li").val("-1");
                } else if (endTime != '' && endTime != undefined && !isNaN(endTime)) {
                  if (startTime >= endTime) {
                    endTimeValid = false;

                  } else {
                    endTimeValid = true;
                  }
                  console.log("endtime valid=>", endTimeValid);
                }
              }) */


    },

  }

  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/postTrade.html', 'postTrade', function() {
        _bind.postTrade()
        _bind.ckEditor();

      })
    }
  }

}).bind(PostATrade))();