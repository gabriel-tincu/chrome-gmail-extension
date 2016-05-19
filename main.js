var gmail;


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
    var user_mail = gmail.get.user_email();
    var mail_body = gmail.get.email_source();
    var response = {};
    response["mail_body"] = mail_body;
    response["mail_address"] = user_mail;
    return response;
  } else {
    return null;
  }
}

var post_email = function(is_receipt) {
  var r = get_email_data();
  if(r != null && r != "null"){
    r['is_receipt'] = is_receipt;
    var url = "http://localhost:9999/foo"
    console.log(JSON.stringify(r));
    // i'll have to write a function to deal with failure / success (alert the user maybe???)
    $.post(url, r);
  } else {
    alert("Not inside an email !")
  }
}

var post_receipt = function() {
  return post_email(true);
}

var post_non_receipt = function() {
  return post_email(false);
}

var main = function(){
  var send_receipt = document.createElement("a");
  send_receipt.set_attribute("class", "custom_anchor");
  send_non_receipt.set_attribute("class", "custom_anchor");
  var send_non_receipt = document.createElement("a");
  send_receipt.appendChild(document.createTextNode("RECEIPT   "));
  send_non_receipt.appendChild(document.createTextNode("NON RECEIPT"));
  send_receipt.addEventListener("click", post_receipt);
  send_non_receipt.addEventListener("click", post_non_receipt);
  document.body.insertBefore(send_non_receipt, document.body.childNodes[0]);
  document.body.insertBefore(send_receipt, document.body.childNodes[0]);
}


refresh(main);
