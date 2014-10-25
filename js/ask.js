var currentChild;

function documentReady()
{
  intialize();
  registerEvents();
  //select the tab
  $("#nav-checkin").trigger('click');
}
function loadMessages(messages)
{
  var list = document.getElementById("messages");
  for(var i = 0; i < messages.length; i++)
  {
    var message = messages[i];
    var listItem = document.createElement('li');
    var messageBody = document.createElement('a');
    messageBody.setAttribute('data-id',message.message_id);
    messageBody.href="#";
    messageBody.onclick = deleteMessage;
    var messageTitle = document.createElement('div');
    var messageTitleText = document.createElement('strong');
    messageTitleText.innerHTML = message.title;
    messageTitle.appendChild(messageTitleText);
    var fromSpan = document.createElement('span');
    fromSpan.setAttribute('class', "pull-right text-muted");
    fromText = document.createElement('em');
    fromText.innerHTML = message.from_name;
    fromSpan.appendChild(fromText);
    messageTitle.appendChild(fromSpan);
    messageBody.appendChild(messageTitle);
    messageText = document.createElement('div');
    messageText.innerHTML = message.message;
    messageBody.appendChild(messageText);
    listItem.appendChild(messageBody);
    list.appendChild(listItem);
  }
}
function deleteMessage()
{
  var button = this;
  $.post("http://xstonegames.net/api/removeMessage",{"authentication": parent.loginInfo,"message_id":this.getAttribute('data-id')}).done(function(data){
    button.parentNode.parentNode.removeChild(button.parentNode);
    console.log(data);
  });
}
function onCommand(cmd)
{
  console.log(cmd);
}
function intialize()
{
  $('.combobox').combobox();
  $.post("http://xstonegames.net/api/messages",{"authentication": parent.loginInfo}).done(loadMessages);
}
function registerEvents()
{
  chrome.commands.onCommand.addListener(onCommand);
  $('.nav-item').click(selectTab);
  $("#loadChild").click(loadChildClick);
  $("#saveChild").click(saveChildClick);
  $("#newChildForm").submit(createChild);
}

function selectTab()
{
  $(".page-wrapper").hide();
  $(this.getAttribute("data-target")).show();
}

function loadChildClick()
{
  $.post("http://xstonegames.net/api/getChild",
  {
    authentication: parent.loginInfo, 
    child: $("#childSelect").val()
  })
  .done(function(data){
      currentChild=data;
      loadChild();
  });
}
function loadChild(){
  loadForm(document['first-contact'],currentChild.primary_contact);
  loadForm(document['backup-contact'],currentChild.secondary_contact);
  loadForm(document['health-information'],currentChild.conditions);
  loadForm(document['health-information'],currentChild.problems);
  loadForm(document['health-information'],currentChild.allergies);
  loadValue(document['health-information'],'other-conditions',currentChild.problems.other);
  loadValue(document['health-information'],'other-allergies',currentChild.allergies.other);
  loadValue(document['health-information'],'over-the-counter',currentChild.medications);
  loadValue(document['health-information'],'other-info',currentChild.other_info);
}

function saveChildClick()
{
  saveChild();
  $.post("http://xstonegames.net/api/updateChild",{authentication: parent.loginInfo, child: currentChild}).done(function(data){
    console.log(data);
  });
}

function saveChild() {
  saveForm(document['first-contact'],currentChild.primary_contact);
  saveForm(document['backup-contact'],currentChild.secondary_contact);
  saveForm(document['health-information'],currentChild.conditions);
  saveForm(document['health-information'],currentChild.problems);
  saveForm(document['health-information'],currentChild.allergies);
  currentChild.problems.other = document['health-information']['other-conditions'].value;
  currentChild.allergies.other = document['health-information']['other-allergies'].value;
  currentChild.medications = document['health-information']['over-the-counter'].value;
  currentChild.other_info = document['health-information']['other-info'].value;
  
}
function loadForm(form, object) {
  for(var key in object)
  {
    if(form[key])
    {
      loadValue(form,key,object[key]);
    }
  }
}
function loadValue(form,key,object)
{
  if(form[key].type=="checkbox")
  {
    form[key].checked = object;
  }else
  {
    form[key].value = object;
  }
}
function saveForm(form,object)
{
  for(var key in object)
  {
    if(form[key])
    {
      if(form[key].type=="checkbox")
      {
        object[key] = form[key].checked;
      }else
      {
        object[key] = form[key].value;
      }
    }
  }
}
function selectcheckin()
{
  document.querySelector("#contentTitle").innerHTML="Check In";
}

function loadChildren(complete)
{
  $.post("http://xstonegames.net/api/children",{authentication: parent.loginInfo}).done(function(data){
    var select = document.getElementById("childSelect");
    for(var i = 0; i<data.length; i++)
    {
      var option = document.createElement('option');
      option.text = data[i].name;
      option.value=data[i]['child_id'];
      select.add(option);
    }
    complete();
  });
}
function createChild()
{
  var form = $("#newChildForm");
  $.post("http://xstonegames.net/api/createChild",{authentication: parent.loginInfo,child: $("input[name='child-name']").val(),leader: $("input[name='child-leader']").val(), club: $("input[name='child-name']").val()}).done(function(data){
    location.reload();
  });
  return false;
}
$(document).ready(function(){
  loadChildren(documentReady);
});