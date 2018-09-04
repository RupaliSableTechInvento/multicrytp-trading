var UserProfile = {};
((function() {
  var id = '';
  var currency = '';
  var token = localStorage.getItem('token');
  var friendsList = [];
  var pending = [];
  this.init = function() {
    console.log("USer profie js==>");
    _render.content();
  }

  var _core = {
    userProfile: API.userProfile,
    friendReq: API.friendReq,
    getFriendsList: API.getFriendsList,
    turstUser: API.turstUser,

    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      console.log("hashes=>", hashes);
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        // console.log("hash=>", hash);

        vars.push(hash[0]);
        // console.log("vars in loop=>", vars);

        vars[hash[0]] = hash[1];
      }
      // console.log("vars=>", vars);

      return vars;
    },


  }
  var _bind = {

    getFriendsList: function() {
      var isToken = GlobalEvent.checkIfToken(token)
      if (isToken) {
        _core.getFriendsList(token, function(res) {
          if (!res.isError) {
            var friendsReqList = res.data[0].friends;

            for (let index = 0; index < friendsReqList.length; index++) {
              if (friendsReqList[index].status == "Friend") {
                friendsList.push(friendsReqList[index].senderEmail)
              } else if (friendsReqList[index].status == "Pending") {
                pending.push(friendsReqList[index].senderEmail);
              } else {
                continue;
              }

            }


          }
        })
      } else {


        console.log("TOken is not present");
        $('#trustBtn').attr('disabled', true)

        $('#sendFriendReq').attr('disabled', true)
          // $("#divTrust").off("click");
        $('#divLoginSignup').removeClass('hidden');
        // $("#userNotTrusted").children().attr('disabled', 'disabled');

      }


    },

    userProfile: function() {
      var urlParams = _core.getUrlVars();
      id = urlParams.id;
      _bind.getFriendsList();

      _core.userProfile(id, function(res) {
        console.log("user profiles response==>", res);
        if (res) {
          if (!res.isError) {
            var Data = res.data;
            var isToken = GlobalEvent.checkIfToken(token)
            if (isToken) {
              var htmlLoginSignup = '';
              htmlLoginSignup = ` <p>
              Please
              <a class="login-link" id="login-link-ad" href="#/login">
                  <i class="fa fa-user"></i>
                  log in
              </a>
              or
              <a id="register-link-ad" class="register-link" href="#/signup">
                  <i class="fa fa-check-square-o "></i>
                  sign up
              </a>
              to give your trust to <strong>` + Data.user.first_name + `</strong>.
               </p>
               </br>
               <p>Signing up is free and takes only 30 seconds.</p>`;
              $('#divLoginSignup').html(htmlLoginSignup);
            }

            _bind.SetUserData(Data);
          }
        }
      })

      $('#trustBtn').unbind().click(function() {
        $(this).hide();

        var isToken = GlobalEvent.checkIfToken(token)
        if (isToken) {
          var trustUserTo = $(this).attr('trustUserTo');
          _core.turstUser(token, trustUserTo, function(res) {
            if (res) {
              console.log("turstUser res==>", res);
            }
          })

        }
        $('#userTrustedBtn').show();
      })

    },
    SetUserData: function(Data) {
      var userActiveTime = '';
      var firstName = Data.user.first_name;
      var last_name = Data.user.last_name;
      var trustBy = Data.user.trustBy;
      var email_verified = Data.user.verification.email_verified;
      var mobile_verified = Data.user.verification.mobile_verified;
      var account_created = moment(Data.user.account_created).format('MMMM Do YYYY');
      if (Data.tokenData) {
        userActiveTime = Data.tokenData.userActiveTime;
        $('#last_seen').html(moment(userActiveTime).format('LLLL'));

      } else {
        $('#last_seen').html('  ')
      }
      userActiveTime = userActiveTime === undefined ? '' : userActiveTime;
      var htmlUserName = '';
      htmlUserName += '<label>' + firstName + '</label>' +
        '<span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
      $('#userName').html(htmlUserName);
      $('#email').append(email_verified);
      $('#Phone_number').append(mobile_verified);
      $('#trustBtn').html('Trust  ' + firstName);
      $('#userTrustedBtn').html('Already Trusting ' + firstName);
      $('#account_created').append(account_created);
      $('#trustBtn').attr('trustUserTo', Data.user.email);
      $('#frndReqModalTitle').html("Are you sure you want to connect to" + firstName);

      var isToken = GlobalEvent.checkIfToken(token)
      if (isToken) {
        if (trustBy.length > 0) {
          for (let index = 0; index < trustBy.length; index++) {
            console.log("Friendlist==>", trustBy[index], Data.user.email);
            if (trustBy[index].senderEmail.trim() == localStorage.getItem('email')) {

              $('#trustBtn').hide();
              $('#userTrustedBtn').show();
              console.log("Friends True ==>>");
            } else {
              $('#trustBtn').show();
            }
          }

        }
      } else {
        $('#trustBtn').attr('disabled', true)
        $('#sendFriendReq').attr('disabled', true)
          // $("#divRequest").off("click");
          // $('#userNotTrusted').hide();
      }

      if (friendsList.length > 0) {
        for (let index = 0; index < friendsList.length; index++) {
          console.log("Friendlist==>", friendsList[index], Data.user.email);
          if (friendsList[index].trim() == Data.user.email.trim()) {
            $("#sendFriendReq").hide();
            $("#friendReqAlreadySend").hide();
            $("#sendUnFriendReq").show();
            console.log("Friends True ==>>");
          }
        }

      }

      if (pending.length > 0) {
        for (let index = 0; index < pending.length; index++) {
          console.log("Pending List==>", pending[index], Data.user.email);
          if (pending[index].trim() == Data.user.email.trim()) {
            $("#sendFriendReq").hide();
            $("#sendUnFriendReq").hide();
            $("#friendReqAlreadySend").show();
            console.log("Friends True ==>>");
          }
        }


      }



      $("#btn_Confirm").unbind().click(function() {
        var dataObj = {
          To: Data.user.email,
        }

        var isToken = GlobalEvent.checkIfToken(token)
        if (isToken) {
          _core.friendReq(token, dataObj, function(res) {
            if (res) {
              console.log("friend Request response:", res);
              var isFound = res.isFound;
              if (isFound) {
                console.log("Request already sent");
                $('#allreadyFrndModal').modal('show');
                $("#sendFriendReq").hide();
                $("#sendUnFriendReq").hide();
                $("#friendReqAlreadySend").show();
              }
            }
          })
        }

      })



      _bind.setDataTable();

    },
    setDataTable: async function() {
      await $('#m_datatable_latest_ordersOB').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              url: '/getTrade',
              method: 'GET',
              params: {
                query: {

                  user: id,
                },
              }
            }
          },
          saveState: {
            cookie: true,
            webstorage: true
          },
          serverPaging: true,
          serverFiltering: true,
          serverSorting: true
        },

        layout: {
          theme: 'default',
          class: '',
          scroll: true,
          height: 380,
          footer: false
        },

        columns: [{
            field: "firstName",
            template: function(field, type, row) {

              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
            },
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "",

            template: function(_ref) {
              var _ref$payment_method = _ref.payment_method;
              _ref$payment_method = _ref$payment_method === undefined ? '' : _ref$payment_method;
              var _ref$location = _ref.location;
              _ref$location = _ref$location === undefined ? '' : _ref$location.replace(/_/g, ' ');
              return _ref$payment_method + ' :<a href=./#/?cryptoCurrency=' + _ref.cryptoCurrency + '&location=' + _ref.location + '> ' + _ref$location + '</a>';
            },

            title: "Payment Method",
            sortable: false,
            width: 250,
            responsive: {
              visible: 'lg'
            }
          },
          {
            field: "more_information.price_equation",


            template: function(_ref) {
              var _ref$more_information = _ref.more_information;
              _ref$more_information = _ref$more_information === undefined ? '' : _ref$more_information;
              console.log("more_information OB==>", _ref, _ref$more_information);
              var price_equation = _ref$more_information.price_equation;
              price_equation = parseFloat(price_equation);
              var currency = _ref$more_information.currency;
              return `<div>` + (price_equation.toFixed(2) || 0) + `</div>
              <div>` + (currency || '') + `</div>
               `;

            },

            title: 'Price',
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field) {
              console.log("more_information field=>", field);
              var _ref$more_information = field.more_information;
              _ref$more_information = _ref$more_information === undefined ? '' : _ref$more_information;
              console.log("more_information1==>", _ref$more_information);
              var min_trans_limit = _ref$more_information.min_trans_limit;
              var max_trans_limit = _ref$more_information.max_trans_limit;
              return (min_trans_limit || 0) + '-' + (max_trans_limit || 0);
            },
            title: "Limits",
            sortable: false,
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            title: "Trader Type",
            sortable: false,
            template: function(row) {

              return '<a href="./#/sellBuyCurrency?id=' + row._id + '&code=' + "" + ' ">' +
                '<input type="button" class="btn btn-info  " name="Buy" id="traderType" value="Buy" style="color: white;  width: 70px; cursor:pointer;">' +
                '</a>';
            }
          }
        ]

      })

    }

  }

  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/accounts/userProfile.html', 'userProfile', function() {
        _bind.userProfile();


      })
    }
  }
}).bind(UserProfile))();