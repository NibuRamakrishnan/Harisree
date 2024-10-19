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
    });
    $("#btnadd").on("click", function(){
        var item = $("#particulars").val();
        var descr=$("#descr").val();
        var amount=$("#amount_exp").val();
        var source=$("#cash_from_exp").val();
        var ID=Date.now().toString(36) + Math.random().toString(36).substring(2);
        if(item != "" && amount > 0 && source != "")
        {
            let jsonData = 
            {
                "expenses":[{
                "ID":ID,
                "item": item,
                "descr": descr,
                "amount": amount,
                "source": source
                }]
            };
            let jsonString = JSON.stringify(jsonData);
            console.log(jsonString);
            if(jsonString != null &&  jsonString != "")
            {
                createTable(jsonString);
            }
        }
    });
  });
  function createTable(jsonString){
    var jsondata = JSON.parse(jsonString);
    var html_content = ""; 
    $.each(jsondata.expenses, function(i, v){
        var ID = jsondata.expenses[i].ID;
        var item = jsondata.expenses[i].item;
        var amount =  jsondata.expenses[i].amount;
        var source =  jsondata.expenses[i].source; 
        html_content= html_content + ("<tr><th identifier='"+ID+"' scope='row'> <a class='link'><i class='fa fa-edit'></i></a> <a class='link'><i class='fa fa-trash'></i></a> </th> <td key='particulars'>"+item+"</td> <td key='amount_exp'>"+amount+"</td> <td key='cash_from_exp'>"+source+"</td></tr>");
    });
    if(html_content != ""){
        $("#tbl_tempdata_expense tbody").append(html_content);
    }
  }