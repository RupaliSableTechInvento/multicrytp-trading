var Login = {};
((function() { 

  this.init = function() {
    _render.content();
  }
  var _core={
  	submitForm:function (dataObj, cb) {
  		$.ajax({
  		url:"/login",
  		data:dataObj,
  		type:"POST",
  		success:function (successData) {
  			cb(successData)
  		},
  		error:function (err) {
  			alert(err);
  		}
  	})
  	}
  	
  }
  var _bind = {
    submitForm:function(){
      $('#btnlogin').unbind().click(function () {

  			var input=$('.div-login input[type!=button]');
		
  			for (var i = input.length - 1; i >= 0; i--) {
  				if ($(input[i]).val()=="") {
  					$(input[i]).addClass('error');
  				}
  				else{
  					$(input[i]).removeClass('error');
  				}
  			}
  				if ($('.div-login .error').length<=0) {
  				var dataObj={
  				email:$('#txtlogin').val(),
  				password:$('#txtpwd').val(),
  				}
  					_core.submitForm(dataObj, function (res) {
  						if (res) {
								console.log("res=>",res);
								if(!res.token) {
									$("#lbl_msg").show();
									console.log("auth failed",res)
								}
								else {
									$("#lbl-login-sucess").show();
									$(".div_right_header_log-in").removeClass("hidden");
									$(".div_right_header").addClass("hidden");
									localStorage.setItem("token", res.token);
									localStorage.setItem('email', dataObj.email);
									//redirerect tp home page
									window.location.replace("/#/");
									
								}
						
  						}
  					})
  			}
  			
  		})
    }
     }

  var _render = {
    content: function() {
      renderMainFrame('templates/login/login.html', 'login', function() {
				_bind.submitForm()
    	})
  	}
}
}).bind(Login))()
