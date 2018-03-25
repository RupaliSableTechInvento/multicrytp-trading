var API = {
  submitForm: function (dataObj, cb) {
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
