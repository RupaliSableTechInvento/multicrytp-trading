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
  	}
  	
  }
  var _bind={
  	submitForm:function () {
  		$('#btnlogin').unbind().click(function () {
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
  				if (dataObj.password==$('#txtpwd2').val()) {
  					_core.submitForm(dataObj, function (res) {
  						if (res) {
  							alert("data inserted");
  						}
  					})
  						
  					
  				}
  				else{
  					$('#txtpwd').addClass('error');
  					$('#txtpwd2').addClass('error');
  				}
  			}
  			
  		})
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
