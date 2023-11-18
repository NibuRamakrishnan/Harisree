$(function(){
GetPDFData();
$(document).on("ajaxSend", function(){
    $('#preloader-active').show();
  }).on("ajaxComplete", function(){
    $('#preloader-active').hide();
  }).on("ajaxError", function(){
    $('#preloader-active').hide();
}); 
});
function GetPDFData(){
    $("#preloader-active").show();
    var read_url=script_url+"?action=read"; 
    $.getJSON(read_url, function (json) {
        fnBindDatatoBar(json);
    }); 
}
function fnBindDatatoBar(json){
    $("#category_QPS_1").html();
    if(json != null && json.records != null && json.records.length > 0)
    {
        var category_QPS_1 = $.grep(json.records, function (element, index) { 
            return element.pdf_category == 1;
        });
        var category_SPE_2 =$.grep(json.records, function (element, index) { 
            return element.pdf_category == 2;
        });
        var category_SM_3 = $.grep(json.records, function (element, index) { 
            return element.pdf_category == 3;
        });
        var category_QPSD_4 = $.grep(json.records, function (element, index) { 
            return element.pdf_category == 4;
        }); 
        if(category_QPS_1 != null && category_QPS_1.length > 0){
            $("#category_QPS_1").parents(".card").show();
            var dynamic_pdf_holder_c1 = "";
            $.each(category_QPS_1, function(i,v){
                var likes_no = category_QPS_1[i].user_likes;
                if(likes_no == "" || likes_no == null){
                    category_QPS_1[i].user_likes = 0;
                }
                dynamic_pdf_holder_c1 = dynamic_pdf_holder_c1 + "<li><a class='d-flex' onclick='fnShowPDF(this)' numberof_likes="+category_QPS_1[i].user_likes+"  pdf_id="+category_QPS_1[i].id+" pdfname="+category_QPS_1[i].display_text+" href='javascript:void(0);' pdf_path="+category_QPS_1[i].pdf_path+">"+category_QPS_1[i].display_text+"</a></li>"; 
            });
            if(dynamic_pdf_holder_c1 != null && dynamic_pdf_holder_c1.length > 0){
                $("#category_QPS_1").append(dynamic_pdf_holder_c1);
            }
        }
        else{
            $("#category_QPS_1").parents(".card").hide();
        }

        if(category_SPE_2 != null && category_SPE_2.length > 0){
            $("#category_SPE_2").parents(".card").show();
            var dynamic_pdf_holder_c2 = "";
            $.each(category_SPE_2, function(i,v){
                var likes_no = category_QPS_1[i].user_likes;
                if(likes_no == "" || likes_no == null){
                    category_SPE_2[i].user_likes = 0;
                }
                dynamic_pdf_holder_c2 = dynamic_pdf_holder_c2 + "<li><a onclick='fnShowPDF(this)'  numberof_likes="+category_SPE_2[i].user_likes+"  pdf_id="+category_SPE_2[i].id+" pdfname="+category_SPE_2[i].display_text+" href='javascript:void(0);' pdf_path="+category_SPE_2[i].pdf_path+">"+category_SPE_2[i].display_text+"</a></li>"; 
            });
            if(dynamic_pdf_holder_c2 != null && dynamic_pdf_holder_c2.length > 0){
                $("#category_SPE_2").append(dynamic_pdf_holder_c2);
            }
        }
        else{
            $("#category_SPE_2").parents(".card").hide();
        }

        if(category_SM_3 != null && category_SM_3.length > 0){
            $("#category_SM_3").parents(".card").show();
            var dynamic_pdf_holder_c3 = "";
            $.each(category_SM_3, function(i,v){
                if(likes_no == "" || likes_no == null){
                    category_SM_3[i].user_likes = 0;
                }
                dynamic_pdf_holder_c3 = dynamic_pdf_holder_c3 + "<li><a onclick='fnShowPDF(this)'   numberof_likes="+category_SM_3[i].user_likes+"  pdf_id="+category_SM_3[i].id+" pdfname="+category_SM_3[i].display_text+" href='javascript:void(0);' pdf_path="+category_SM_3[i].pdf_path+">"+category_SM_3[i].display_text+"</a></li>"; 
            });
            if(dynamic_pdf_holder_c3 != null && dynamic_pdf_holder_c3.length > 0){
                $("#category_SM_3").append(dynamic_pdf_holder_c3);
            }
        }
        else{
            $("#category_SM_3").parents(".card").hide();
        }

        if(category_QPSD_4 != null && category_QPSD_4.length > 0){
            $("#category_QPSD_4").parents(".card").show();
            var dynamic_pdf_holder_c4 = "";
            $.each(category_QPSD_4, function(i,v){
                if(likes_no == "" || likes_no == null){
                    category_QPSD_4[i].user_likes = 0;
                }
                dynamic_pdf_holder_c4 = dynamic_pdf_holder_c4 + "<li><a onclick='fnShowPDF(this)'   numberof_likes="+category_QPSD_4[i].user_likes+"  pdf_id="+category_QPSD_4[i].id+" pdfname="+category_QPSD_4[i].display_text+" href='javascript:void(0);' pdf_path="+category_QPSD_4[i].pdf_path+">"+category_QPSD_4[i].display_text+"</a></li>"; 
            });
            if(dynamic_pdf_holder_c4 != null && dynamic_pdf_holder_c4.length > 0){
                $("#category_QPSD_4").append(dynamic_pdf_holder_c4);
            }
        }
        else{
            $("#category_QPSD_4").parents(".card").hide();
        }
    }
   
}
function fnShowPDF(element){
    $("#preloader-active").show();
    var pdf_text =  $(element).text();
    var pdf_path = $(element).attr("pdf_path");
    var pdf_id = $(element).attr("pdf_id");
    var user_likes = $(element).attr("numberof_likes");
    $("#lbllike").text(user_likes + " people like this");
    if(pdf_id > -1){
        $("#like-a").attr("pdf_id", pdf_id);
        if(user_likes == "" || user_likes == null){
            user_likes = 0;
        }
        $("#like-a").attr("user_likes", user_likes);
    }
    if(pdf_path != null && pdf_path.length > 0){
        $("#myFrame").attr("src", pdf_path); 
    }
    if(pdf_text != null && pdf_text.length > 0){
        $("#lblpdfname").html(pdf_text);
    }  
    var iframe = document.getElementById("myFrame"); 
    if (iframe.attachEvent){
    iframe.attachEvent("onload", function(){
        $("#preloader-active").hide();
    });
    } 
    else {
    iframe.onload = function(){
        $("#preloader-active").hide();
    };
    }
}  
function fnlikePDF(element){
var pdf_id = $(element).attr("pdf_id");
if(pdf_id > -1){
var user_likes = 0;
user_likes =  $(element).attr("user_likes");
user_likes = parseInt(user_likes) + 1;
$("#like-a").attr("user_likes", user_likes);
$("#like-a").addClass("likes");
var url = script_url + "?callback=callbacklike&id="+pdf_id+"&user_likes="+user_likes+"&action=update_userlikes";
var request = jQuery.ajax({
    crossDomain: true,
    url: url,
    method: "GET",
    dataType: "jsonp"
  });
}
}
function callbacklike(result)
{
  $("#lbllike").text(result.result);

}