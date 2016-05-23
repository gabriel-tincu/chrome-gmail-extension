var gmail;
var retries_count = 3;
var post_url = "https://email-classification-backend.shoeboxed.com/email"

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var get_email_data = function() {
  // this function should be called only after checking that we're inside an actual email
  var gmail = new Gmail();
  if(gmail.check.is_inside_email()){
    var response = {};
    response["mail_body"] = gmail.get.email_source();;
    response["mail_address"] = gmail.get.user_email();
    response["email_id"] = gmail.get.email_id();
    return response;
  } else {
    return null;
  }
}

var post_email = function(is_receipt, url) {
  var r = get_email_data();
  if(r != null && r != "null"){
    r['is_receipt'] = is_receipt;
    post_with_retries(url, r, retries_count);
  } else {
    alert("Not inside an email !")
  }
}

var post_with_retries = function(url, data, retries){
  console.log(retries + " retries left");
  if(retries==0){
    alert("Giving up on email with id "+data["email_id"]+" after exhausting "+retries_count+" retries");
  } else {
    params = {
      url: url,
      data: JSON.stringify(data),
      contentType: "text/plain",
      type: "POST",
      dataType: "json",
      success: function(){ console.log("successfully sent "+data["email_id"]); },
      error: function(){ post_with_retries(url, data, retries-1); }
    };
    $.ajax(params);   
  }
}

var post_receipt = function() {
  return post_email(true, post_url);
}

var post_non_receipt = function() {
  return post_email(false, post_url);
}

var main = function(){
  var send_receipt = document.createElement("a");
  var send_non_receipt = document.createElement("a");
  
  send_receipt.className = "receipt_link"
  send_non_receipt.className = "receipt_link"

  send_receipt.appendChild(document.createTextNode("RECEIPT   "));
  send_non_receipt.appendChild(document.createTextNode("NON RECEIPT"));
  
  send_receipt.href = "javascript:post_receipt()";
  send_non_receipt.href = "javascript:post_non_receipt()";
  
  document.body.insertBefore(send_non_receipt, document.body.childNodes[0]);
  document.body.insertBefore(send_receipt, document.body.childNodes[0]);
}


refresh(main);
