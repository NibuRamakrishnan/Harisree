$(function(){
    fnCallExcel();  
    $("#btnsave").on("click", function(){ 
        var url = ""; 
        if(validationCheck()){
            $("#preloader-active").show();
            var pdf_name = $("#name").val();
            var display_text = $("#displaytext").val();
            var pdf_path = $("#pdf_loc").val();
            if(pdf_path != null && pdf_path.length > 0){
                var index = pdf_path.lastIndexOf("/");
                if(index > -1){
                    pdf_path = pdf_path.substring(0, index) + "/preview";
                }
            } 
            var pdf_category = $("#pdf_category").val(); 
            var id = 0;
            if($("#btnsave").val() == "Submit"){
                url = script_url + "?callback=ctrlq&pdf_name=" + pdf_name + "&display_text=" + display_text + "&pdf_path="+pdf_path+"&pdf_category="+pdf_category+"&action=insert";
            }
            else if($("#btnsave").val() == "Update"){
                id = $("#identifier").val();
                if(id > -1){
                    url = script_url + "?callback=ctrlq&pdf_name=" + pdf_name + "&display_text=" + display_text + "&pdf_path="+pdf_path+"&pdf_category="+pdf_category+"&id="+id+"&action=update";
                }  
            } 
            var request = jQuery.ajax({
                crossDomain: true,
                url: url,
                method: "GET",
                dataType: "jsonp"
              });
        }
    });
    $(document).on("ajaxSend", function(){
        $("#preloader-active").show();
      }).on("ajaxComplete", function(){
        $("#preloader-active").hide();
      }).on("ajaxError", function(){
        $("#preloader-active").hide();
    }); 
}); 
function fnCallExcel(){
    $("#preloader-active").show();
    var read_url=script_url+"?action=read";
    $.getJSON(read_url, function (json) {
        fnBindData(json);
    });
}
function fnBindData(data){
    var json_data = data.records; 
    if(json_data != null && json_data.length>0){
        $("#pdftable").find("tbody").html("");
        var dynamic_html = "";
        $.each(json_data, function(i,v){ 
            var category = "";
            switch(json_data[i].pdf_category){
                case 0: category = "--Select PDF Category--";
                break; 
                case 1: category = "Question Paper Set";
                break; 
                case 2: category = "Syllabus - Preliminary Exam";
                break; 
                case 3: category = "Syllabus - Main";
                break; 
                case 4: category = "Question Papers Set (Download PDF)";
                break; 
            }
            dynamic_html = dynamic_html + "<tr><td name='id' id="+json_data[i].id+"><a dataid="+json_data[i].id+" href='javascript:void(0);' onclick='fngetdata_byid(this);'><span><i class='fas fa-edit'></i></span></a><a dataid="+json_data[i].id+" href='javascript:void(0);' onclick='fnDeleteData(this);' class='mleft10'><span><i class='fas fa-trash'></i></span></a></td><td name='category' category="+json_data[i].pdf_category+">"+category+"</td><td name='pdfname'>"+formatstring_value(json_data[i].pdf_name)+"</td><td name='display_text'>"+formatstring_value(json_data[i].display_text)+"</td><td name='path'>"+formatstring_value(json_data[i].pdf_path)+"</td></tr>";
        });
        if(dynamic_html.length > 0){ 
            $("#pdftable").find("tbody").append(dynamic_html);
        }  
    } 
    setDataTableGrid();
}

function formatstring_value(data){
    if(data != null && data.length > 10){
        return data.substring(0,9) + "...";
    }
    else{
        return data;
    }
}

function fnDeleteData(id){
    bootbox.confirm('Do you want to permanently delete the pdf from the portal?',
                                function(result) {
                                if(result == true){
                                    var data_id = 0;
                                    data_id =  $(id).attr("dataid");
                                    if(data_id > -1){
                                      var delete_url = script_url + "?callback=ctrlq&id=" + data_id + "&action=delete";
                                      var request = jQuery.ajax({
                                        crossDomain: true,
                                        url: delete_url,
                                        method: "GET",
                                        dataType: "jsonp"
                                      });
                                    }
                                    else{
                                        bootbox.alert("Sorry, the dpdf is not found to delete!");
                                    }
                                }
                                }); 
}

function setDataTableGrid(){
    if ( ! $.fn.DataTable.isDataTable('#pdftable')) {
        $('#pdftable').dataTable();
      }
}
function ctrlq(result){  
    $("#preloader-active").hide();
    if(result.result != ""){
        bootbox.alert(result.result, reloadPage); 
    }
    else{
    bootbox.alert("Sorry, something went wrong, please contact your development support!!");  
    } 
    clearInputs();
}
function reloadPage(){
    location.reload(); 
}
function fngetdata_byid(id){ 
    $("#preloader-active").show();
    var identifier = $(id).attr("dataid");
    var read_url=script_url+"?action=read";
    $.getJSON(read_url, function (json) {
       if(json !=null && json.records != null && json.records.length > 0){
        json.records =  $.grep(json.records, function (element, index) { 
            return element.id == identifier;
        });
        if(json.records != null && json.records.length > 0){
            $("#identifier").val(identifier);
            $("#name").val(json.records[0].pdf_name);
            $("#displaytext").val(json.records[0].display_text); 
            $("#pdf_category").val(json.records[0].pdf_category);
            $("#pdf_loc").val(json.records[0].pdf_path); 
            $("#btnsave").val("Update");
        } 
       }
    });   
} 
function clearInputs(){
    $("#pdf_category").val("0");
    $("#displaytext").val("");
    $("#pdf_loc").val(""); 
    $("#name").val("");
    $("#identifier").val("");
    $("#btnsave").val("Save");
}
function validationCheck(){
    if($("#pdf_category").val() == "0"){
        $("#lblerror").html("*Please select pdf category from the dropdown!");
        $("#lblerror").css("display","block");
        return false;
    }
    else if($("#displaytext").val()==""){
        $("#lblerror").html("*Please enter display name for the pdf!");
        $("#lblerror").css("display","block");
        return false;
    }
    else if($("#pdf_loc").val()==""){
        $("#lblerror").html("*Please enter location for the pdf!");
        $("#lblerror").css("display","block");
        return false;
    } 
    else{
        $("#lblerror").css("display","none");
        return true;
    }
}