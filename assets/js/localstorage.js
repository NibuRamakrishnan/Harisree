var script_url_royal = "https://script.google.com/macros/s/AKfycbznoLRbxmiu2HT4N6FKJTJnssDmNEovXq5oU1XgKiqqpV35r7P4la9DVwDqCMvp-JP58Q/exec";
$(document).ready(function(){
    localStorage.removeItem('BussinessLogs');
    localStorage.removeItem('BussinessLogDetails');
    loadBussinessLogs();
});
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
                var logs_count = data.records.length;
                $("#total_logs").html(logs_count);
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