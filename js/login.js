$(document).ready(documentReady);
function documentReady()
{
	//fill church select
	$.post("http://xstonegames.net/api/churches").done(getChurches);
	$("form[name='loginForm']").submit(loginSubmit);
}
function getChurches(data)
{
	for(var i = 0; i<data.length; i++)
	{
		var select = document.loginForm.church;
		var option = document.createElement('option');
		option.text = data[i].church;
		option.value=data[i].church;
		select.add(option);
	}
	chrome.storage.sync.get("loginData",loadLoginData);
}
function loadLoginData(data)
{
	if(data.loginData.church)
	{
		document.loginForm.church.value = data.loginData.church;
		document.loginForm.rememberChurch.checked = true;
	}
	if(data.loginData.username)
	{
		document.loginForm.username.value = data.loginData.username;
		document.loginForm.password.value = data.loginData.password;
		document.loginForm.rememberMe.checked = true;
	}
}
function loginSubmit()
{
	var form = document.loginForm;
	parent.loginInfo = {
		username: form.username.value,
		password: form.password.value,
		church: form.church.value
	};
	var loginData = {};
	if(form.rememberMe.checked)
	{
		loginData.username=parent.loginInfo.username;
		loginData.password=parent.loginInfo.password;
	}
	if(form.rememberChurch.checked)
	{
		loginData.church = parent.loginInfo.church;
	}
	chrome.storage.sync.set({loginData: loginData});
	$.post("http://xstonegames.net/api/login",parent.loginInfo).done(login);
	return false;
}
function login(data)
{
	if(data.Error)
	{
		bootbox.alert(data.Error);
	}else
	{
		parent.document.querySelector("#mainFrame").src="main.html";
	}
}