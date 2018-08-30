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

    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      console.log("hashes=>", hashes);
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        console.log("hash=>", hash);

        vars.push(hash[0]);
        console.log("vars in loop=>", vars);

        vars[hash[0]] = hash[1];
      }
      console.log("vars=>", vars);

      return vars;
    },

  }
  var _bind = {

    getFriendsList: function() {

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
            _bind.SetUserData(Data);
          }
        }
      })

      $('#userNotTrusted').unbind().click(function() {
        $(this).hide();
        $('#userTrusted').show();
      })

    },
    SetUserData: function(Data) {
      var firstName = Data.user.first_name;
      var last_name = Data.user.last_name;
      var email_verified = Data.user.verification.email_verified;
      var mobile_verified = Data.user.verification.mobile_verified;
      var account_created = moment(Data.user.account_created).format('MMMM Do YYYY');
      var userActiveTime = Data.tokenData.userActiveTime;
      var htmlUserName = '';
      htmlUserName += '<label>' + firstName + '</label>' +
        '<span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
      $('#userName').html(htmlUserName);
      $('#email').append(email_verified);
      $('#Phone_number').append(mobile_verified);
      // $('#trustUser').append('Trust    <br>' + firstName);
      $('#trustUser').html('TrustNewUser <br>' + firstName);

      $('#AlreadytrustUser').html('Already Trusting  <br>' + firstName);
      $('#account_created').append(account_created);
      $('#last_seen').append(moment(userActiveTime).format('LLLL'));
      $('#frndReqModalTitle').html("Are you sure you want to connect to" + firstName);

      for (let index = 0; index < friendsList.length; index++) {
        console.log("Friendlist==>", friendsList[index], Data.user.email);
        if (friendsList[index].trim() == Data.user.email.trim()) {
          $("#sendFriendReq").hide();
          $("#friendReqAlreadySend").hide();
          $("#sendUnFriendReq").show();
          console.log("Friends True ==>>");
        }
      }

      for (let index = 0; index < pending.length; index++) {
        console.log("Pending List==>", pending[index], Data.user.email);
        if (pending[index].trim() == Data.user.email.trim()) {
          $("#sendFriendReq").hide();
          $("#sendUnFriendReq").hide();
          $("#friendReqAlreadySend").show();
          console.log("Friends True ==>>");
        }
      }




      $("#btn_Confirm").unbind().click(function() {
        var dataObj = {
          To: Data.user.email,
        }
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
        /*  sortable: true,
         filterable: false,
         pagination: true, */
        columns: [{
            field: "firstName",
            template: function(field, type, row) {
              //   for (let index = 0; index < activeUSer.length; index++) {
              //     // console.log("field.firstName", field.firstName, index, activeUSer[index].name);
              //     if (Date(activeUSer[index].userActiveTime) <= before) {
              //       // console.log("time matched", Date(activeUSer[index].userActiveTime), before);
              //     }
              //     if (activeUSer[index].name == field.firstName) {
              //       // console.log("activeUSer[index].name in if", activeUSer[index].name);
              //       return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
              //     }
              //   }
              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
            },
            /*   template: function(field, type, row) {
                    if (field.firstName === ({ $in: activeUSer })) {
                      return field.firstName + '  active';
    
                    }
                    return field.firstName + '  inactive';
                  }, */
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "",
            template: function(field, type, row) {
              if (field.payment_method == undefined || '') {
                field.payment_method = '';
              }
              if (field.location == undefined || '') {
                field.location = '';
              }

              return field.payment_method + ' :' + field.location;
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

            template: function(field, type, row) {
              if (field.more_information.price_equation == undefined || '' || isNaN(field.more_information.price_equation)) {
                field.more_information.price_equation = '';
              } else {
                var priceTemp = field.more_information.price_equation;
                var price = Number(priceTemp).toFixed(2);
                return price;
              }

            },

            title: 'Price/' + "",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field, type, row) {
              if (field.more_information.min_trans_limit == undefined || '' || isNaN(field.more_information.min_trans_limit)) {
                field.more_information.min_trans_limit = 0;
              }
              if (field.more_information.max_trans_limit == undefined || '' || isNaN(field.more_information.max_trans_limit)) {
                field.more_information.max_trans_limit = 0;
              }

              return field.more_information.min_trans_limit + '-' + field.more_information.max_trans_limit;
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