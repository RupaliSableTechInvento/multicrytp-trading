var Login = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    login: API.login,
    validateFields: function() {},
    showErrorMsg: function(form, type, msg) {
      var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
                <span></span>\
            </div>');

      form.find('.alert').remove();
      alert.prependTo(form);
      alert.animateClass('fadeIn animated');
      alert.find('span').html(msg);
    },

  }

  var _bind = {
    login: function() {
      $('#m_aside_left').css('display', 'none');

      $('.m-nav-sticky').css('display', 'none');

      $('#m_login_signin_submit').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');

        form.validate({
          rules: {
            email: {
              required: true,
              email: true
            },
            password: {
              required: true,
              minlength: 6

            }
          },
          messages: {
            email: {
              required: "please enter your email"
            },
            password: {
              required: "please provide a password",
              minlength: "your password must be at least 6 characters long"
            }

          }
        });

        if (!form.valid()) {
          return;
        }

        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        var dataObj = {
          email: $('#txtlogin').val(),
          password: $('#txtpwd').val(),
        }

        form.ajaxSubmit({
          url: "/login",

          type: "POST",
          success: function(successData) {
            if (successData.isError) {
            } else {
              console.log("sucessdata=>", successData);
              var first_name = successData.user.first_name;
              var last_name = successData.user.last_name;
              localStorage.setItem("token", successData.data);
              localStorage.setItem('email', dataObj.email);
              localStorage.setItem("first_name", first_name);
              localStorage.setItem("last_name", last_name);
              localStorage.setItem('email', dataObj.email);
              localStorage.setItem('user_id', successData.user.id);
              // var socket = io.connect('http://localhost:9004');

              // socket.on('connect', function() {
              //   socket.emit('setUser', 'hello world');
              // });

              // socket.emit('get friends', function(data) {
              //   console.log("data get freinds", data)
              // });

              // socket.on('users', function(data) {
              //   console.log("users using soket io ", data);
              // });

              // socket.on('friend_list', function(data) {
              //   var friendList = '';
              //   $(".olUserList").empty();
              //   console.log("users friend_list using soket io", data);
              //   for (let index = 0; index < data.length; index++) {
              //     console.log("Friend list==>", data[index].senderFirstName);
              //     friendList += "<li data-email=" + data[index].senderEmail + ">" + data[index].senderFirstName + "</li>";

              //   }

              //   $(".olUserList").append(friendList);

              // });

              // socket.on('pending_list', function(data) {
              //   console.log("users pending_list using soket io", data);
              //   var requestCount = data.length;
              //   console.log("Request count==>", requestCount);
              //   var friend_req_list = '';

              //   $('.friend_req_count').html(requestCount + "  New")
              //   if (requestCount > 0) {
              //     $('.friend_req_list').empty();
              //     for (let index = 0; index < data.length; index++) {
              //       friend_req_list += `<div class="m-list-timeline__item">
              //                                     <span class="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
              //                                     <span class="m-list-timeline__text">` +
              //         data[index].senderFirstName + `</span>
              //                                     <span class="m-list-timeline__time ">

              //                                   <button type="button" data-user="` + data[index].senderEmail + `"class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent  btnAcceptReq">Accept</button>

              //                                     </span>
              //                                   </div>`;

              //     }
              //     $('.friend_req_list').append(friend_req_list);
              //   }

              // });

              $('.m-dropdown__inner ').css('display', 'block');
              window.location.replace("/");
              // window.location = 'updateProductById/' + sku;



            }

            // similate 2s delay
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              _core.showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
            }, 2000);
          },
          error: function(err) {
            alert(err);
          }
        });
      });

      $('#m_login_forget_password').click(function() {
        window.location.replace("#/forgetPassword");
      });
      $('#m_login_signup').click(function() {
        window.location.replace("#/signup");
      });


    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/login.html', 'login', function() {

        _bind.login()

      })
    }
  }
}).bind(Login))()
//Login.init();