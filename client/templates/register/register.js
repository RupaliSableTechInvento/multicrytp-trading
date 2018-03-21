var Register = {};
((function() { 

  this.init = function() {
    _render.content();
  }
  var _core={
  	submitForm:function (dataObj, cb) {
  		$.ajax({
  		url:"/register",
  		data:dataObj,
  		type:"post",
  		success:function (successData) {
  			cb(successData)
  		},
  		error:function (err) {
  			alert(err);
  		}
  	})
		},
		validateFields:function () {

		},
	  //fuction defination for Email Validation

	  validateEmail:function (sEmail) {
		var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (filter.test(sEmail)) {
		return true;
		}
		else {
		return false;
		}
	}
  	
  }
  var _bind={
  	submitForm:function () {
  		$('#btnregister').unbind().click(function () {
		
		
  			var input=$('.div-registraion input[type!=button]');
		
  			for (var i = input.length - 1; i >= 0; i--) {
  				if ($(input[i]).val()=="") {
  					$(input[i]).addClass('error');
  				}
  				else{
  					$(input[i]).removeClass('error');
  				}
  			
			  }
			  
  			if ($('.div-registraion .error').length<=0) {
  				var dataObj={
  				first_name:$('#firsttxtlogin').val(),
  				last_name:$('#secondtxtlogin').val(),
  				email:$('#txtemail').val(),
  				password:$('#txtpwd').val(),
					}
					var isError = false;
					
					var isPassLengthValid = (dataObj.password.length <= 6);
					$("#lbl_error").empty();
					$("#lbl_error").show();
					if(isPassLengthValid) {
						$("#lbl_error").append("<p>password is too short  </p>");
						isError = true;
					}
				  if((!_core.validateEmail(dataObj.email)) ){
						$("#lbl_error").empty();
					$("#lbl_error").append("<p> Invalid Email address </p>");
					isError = true;
						
				}
				 if(dataObj.password !== $('#txtpwd2').val()) {
						$("#lbl_error").append("<p> Password missmatch </p>");
						isError = true;
				}
				else if(isError=== false) {
					$("#lbl_error").hide();
					_core.submitForm(dataObj, function (res) {
						if (res) {	
							if(res.errors)  {
								$("#lbl-reg-emailId").show();
								$('#txtemail').addClass('error');
								console.log("res in if block",res);
								console.log(res.error)
							}
							else{
	 
								console.log("res",res);
								window.location.replace("/#/login");
							}
						}
					})
				}
  			
  		}
  	});
  }
}
  var _render = {
    content: function() {
      renderMainFrame('templates/register/register.html', 'register', function() {
      	_bind.submitForm()


    	})
  	}
}
}).bind(Register))()
