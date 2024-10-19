$(document).ready(function(){ 
    var now = new Date(); 
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#log_date').val(today);


    $("#particulars").on("focus", function() {
        $("#particularsList").css("display","block");
    });   

    $("#particulars").on("keyup", function() {
      var value = $(this).val().toLowerCase(); 
      $("#particularsList li").filter(function() { 
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $(".plist").on("click", function(){
        var itemtext = $(this).html();
        if(itemtext != ""){
            $("#particulars").val(itemtext);
        }
        $("#particularsList").css("display","none");
    }) 
  });