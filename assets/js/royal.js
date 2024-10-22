var script_url_royal = "https://script.google.com/macros/s/AKfycbznoLRbxmiu2HT4N6FKJTJnssDmNEovXq5oU1XgKiqqpV35r7P4la9DVwDqCMvp-JP58Q/exec";
$(document).ready(function(){  
    var now = new Date(); 
    var today = dateConvert(now);
    $('#log_date').val(today);

    hideTableTemplate();
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
        var action = "create";
        if($("#ID").val() != "" && $("#ID").val().length > 0){
            ID = $("#ID").val();
            action = "update";
        } 
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
            if(jsonString != null &&  jsonString != "")
            {
                createTable(jsonString, action);
            }
        }
    });  
    $(".income_prop").on("keyup", function(){
        var amount_1 = $("#cash_in_shop_income").val() != "" ?$("#cash_in_shop_income").val() : 0;
        var amount_2 = $("#cash_from_shop_income").val() != "" ? $("#cash_from_shop_income").val() : 0;
        var amount_3 = $("#cash_in_gpay_income").val() != "" ?$("#cash_in_gpay_income").val() : 0;
        var sum_income = parseInt(parseInt(amount_1) + parseInt(amount_2) + parseInt(amount_3));
        $("#income_sum").html(sum_income);
    });

    $("#btnsubmit").on("click", function(){
        var log_date = $("#log_date").val();
        var open_balance = $("#opening_balance").val();
        var json_expense_string = getExpensejson();
        var cash_in_shop_income = $("#cash_in_shop_income").val();
        var cash_from_shop_income = $("#cash_from_shop_income").val();
        var cash_in_gpay_income = $("#cash_in_gpay_income").val();
        var sum_expense = parseInt($("#expense_sum").html());
        var sum_income = parseInt($("#income_sum").html());
        var action = "insert"; 
        var table = "";
        if($("#ID").val() != ""){
            table = "DailyLog";
            action = "update";
        }
        if(log_date != "" && open_balance > 0){
            json_expense_string= encodeURIComponent(json_expense_string);
            var parameters="id="+$("#ID").val()+"&log_date="+log_date+"&open_balance="+open_balance+"&cash_in_shop="+cash_in_shop_income+"&cash_from_shop="+cash_from_shop_income+"&cash_in_gpay="+cash_in_gpay_income+"&sum_expense="+sum_expense+"&sum_income="+sum_income+"&json_expense_data="+json_expense_string+"&action="+action+"&table="+table+"";
            var url = script_url_royal + "?callback=dailylogadded&"+parameters+""; 
            var request = $.ajax({
                crossDomain: true,
                url: url,
                method: "GET",
                dataType: "jsonp"
              }); 
        }
    });

  });
  function dailylogadded(result){
    if(result.result == true){
        bootbox.alert("Daily log added successfully");
    }
    else  if(result.result == "value updated successfully"){
        bootbox.alert("Daily log added successfully"); 
    }
    else{
        bootbox.alert("Sorry, something went wrong!");
    }
    loadBussinessLogs();
  }
  function getExpensejson(){
    let jsonData = 
            {
                "expenses":[]
            };
    $.each($("#tbl_tempdata_expense tbody tr"), function(i,v){
        var item_t = $(this).find($("td[key=particulars]")).html();
        var amount_t = $(this).find($("td[key=amount_exp]")).html();
        var cash_from_t = $(this).find($("td[key=cash_from_exp]")).html();
        var description = "default";
        var id =  $(this).attr("identifier");
        let newExpense = {
            "ID": id,
            "item": item_t,
            "descr": description,
            "amount": amount_t,
            "source": cash_from_t
          };
          jsonData.expenses.push(newExpense); 
    });
    console.log(jsonData);
    return JSON.stringify(jsonData);
  }
  function createTable(jsonString, action){
    var jsondata = JSON.parse(jsonString);
    var html_content = ""; 
    var ID = "";
    $.each(jsondata.expenses, function(i, v){
        ID = jsondata.expenses[i].ID;
        var item = jsondata.expenses[i].item;
        var amount =  jsondata.expenses[i].amount;
        var source =  jsondata.expenses[i].source; 
        html_content= html_content + ("<tr identifier='"+ID+"'><th scope='row'> <a onclick='fnedit(this)' class='edit link'><i class='fa fa-edit'></i></a> <a onclick='fndelete(this)' class='delete link'><i class='fa fa-trash'></i></a> </th><td key='particulars'>"+item+"</td> <td key='amount_exp'>"+amount+"</td> <td key='cash_from_exp'>"+source+"</td></tr>");
    });
    if(html_content != ""){
        if(action == "update"){
            $("#tbl_tempdata_expense tbody").find($("tr[identifier='"+ID+"']")).remove();
        }
        $("#tbl_tempdata_expense tbody").append(html_content); 
        $("#particulars").val("");
        $("#amount_exp").val(""); 
    } 
    hideTableTemplate();
  } 
  function hideTableTemplate(){
    findExpSum();
    if($("#tbl_tempdata_expense").find($("tbody tr")).length <= 0){
        $("#tbl_tempdata_expense").hide();
    }
    else{
        $("#tbl_tempdata_expense").show();
    }
  }
  function findExpSum(){
    var exp_sum =0;
    $.each($("#tbl_tempdata_expense tbody tr"), function(i,v){
        exp_sum = exp_sum + parseInt($(this).find("td[key='amount_exp']").html());
    });
    $("#expense_sum").html(exp_sum);
  }
  function fnedit(id){
    var ID = $(id).parents("tr").attr("identifier");
    var item =  $(id).parents("tr").find($("td[key='particulars']")).html();
    var amount =  $(id).parents("tr").find($("td[key='amount_exp']")).html(); 
    var source =  $(id).parents("tr").find($("td[key='cash_from_exp']")).html(); 
    $("#ID").val(ID);
    $("#particulars").val(item);
    $("#amount_exp").val(amount);
    $("#cash_from_exp").val(source); 
} 
function fndelete(id){
    bootbox.confirm('Do you want to delete the record from the list?',
        function(result) {
        if(result == true){
            $(id).parents("tr").remove(); 
            hideTableTemplate();
        }
        });  
}  
function loadBussinessLogs_localstorage(dateFilter)
{ 
    if(localStorage.getItem("BussinessLogs") != null){
        var data_json_string  = localStorage.getItem("BussinessLogs");
        fnsetLogsUI(JSON.parse(data_json_string));
    } 
    else{
        window.location.href="RoyalHome.html";
    }
}
function fnsetLogsUI(result){ 
    if(result.length > 0){
        var htmlDOM = "";
        $.each(result, function(i,v){
            var date = dateConvert(result[i].log_date);
            var open_balance = result[i].open_balance;
            var sum_income = result[i].sum_income;
            var sum_expense = result[i].sum_expense; 
            var id = result[i].id;
            htmlDOM = htmlDOM + "<div class='card mt-2'><div class='card-header' id='headingOne_" +i+"' data-toggle='collapse' data-target='#collapseOne_" +i+"'><div class='col-10'><h5 class='mb-0'><a data-toggle='collapse' data-target='#collapseOne_" +i+"'>"+date+"</a></h5></div><div class='col-2'><i class='fa fa-arrow-down mt-1'/></div></div></div><div id='collapseOne_" +i+"' class='collapse' aria-labelledby='headingOne_" +i+"' data-parent='#accordion'><div class='card-body' style='background-color:#8080801c'><div class='col-12 d-flex justify-content-start rounded-3 p-2 mb-2 bg-body-tertiary'><div class='col-4'><p class='small text-muted mb-1'>OPEN</p><p class='mb-0'>"+open_balance+"</p></div><div class='col-4'><p class='small mb-1' style='color:red;'>EXPENSE</p><p class='mb-0'>"+sum_expense+"</p></div><div class='col-4'><p class='small mb-1' style='color:green;'>INCOME</p><p class='mb-0'>"+sum_income+"</p></div></div><div class='col-4'><div><button class='btn btn-normal' key="+id+" onclick='redirectDailyTrack(this)'>More Info</button></div></div></div></div>";
        });
        if(htmlDOM != ""){
            $("#accordion").append(htmlDOM);
        }
    }
}
function dateConvert(input){ 
    if(input != ""){
        const date = new Date(input);
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var today = date.getFullYear()+"-"+(month)+"-"+(day) ; 
        return today;
    }
}
function getdetails(id){   
    var log_data = {};
    var log_expense_data = {};
    if(localStorage.getItem("BussinessLogs") != null){
        log_data = JSON.parse(localStorage.getItem("BussinessLogs"));
        if(log_data != null && log_data.length > 0){
            log_data = log_data.filter(s=>s.id == id && s.is_deleted == 0);
            $.each(log_data, function(i,v){ 
                $("#ID").val(log_data[i].id);
                $("#log_date").val(dateConvert(log_data[i].log_date));
                $("#opening_balance").val(log_data[i].open_balance);
                $("#cash_in_shop_income").val(log_data[i].cash_in_shop);
                $("#cash_from_shop_income").val(log_data[i].cash_from_shop);
                $("#cash_in_gpay_income").val(log_data[i].cash_in_gpay);
                $("#income_sum").html(log_data[i].sum_income);
                $("#expense_sum").html(log_data[i].sum_expense);
            });
        } 
    }
    if(localStorage.getItem("BussinessLogDetails") != null && localStorage.getItem("BussinessLogDetails") != "")
    {
        let jsonData = 
            {
                "expenses":[]
            };
        var data = JSON.parse(localStorage.getItem("BussinessLogDetails"));
        if(data != null){
            var records = data.filter(s=>s.daily_log_id == id && s.is_deleted == 0);
            if(records != null && records.length > 0){
                $.each(records, function(i,v){
                    let newExpense = {
                        "ID": records[i].id,
                        "item": records[i].particulars,
                        "descr": records[i].description,
                        "amount": records[i].amount,
                        "source": records[i].cash_from
                      };
                      jsonData.expenses.push(newExpense);
                });
                createTable(JSON.stringify(jsonData), "");
            }
        }
    } 
} 
function redirectDailyTrack(id){
    var key = $(id).attr("key");
    window.location.href = "DailyTrack.html?log_id="+key+"";
}
function loadBussinessLogs()
{
    var tableName = "DailyLog"; 
    var url = script_url_royal + "?table="+tableName+"&action=read"; 
    var request = $.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp",
        async:false,
        success:function(data){ 
            if(data != null){ 
                if(localStorage.getItem("BussinessLogs") != null){
                    localStorage.removeItem("BussinessLogs");
                }
                localStorage.setItem("BussinessLogs", JSON.stringify(data.records));
                GetExpenseDetails();
            } 
        }
      });  
}  
function GetExpenseDetails(){
    var tableName = "ExpenseDetail"; 
    var url = script_url_royal + "?table="+tableName+"&action=read"; 
    var request = $.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp",
        success:function(data){ 
            if(localStorage.getItem("BussinessLogDetails") != null){
                localStorage.removeItem("BussinessLogDetails");
            }
            localStorage.setItem("BussinessLogDetails",JSON.stringify(data.records));
        }
      });  
}