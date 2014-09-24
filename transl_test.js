var DATA;
var result = function(){
    var txt;
    for(var i=0; i<DATA.tuc.length; i++)
    {
	try
	{
	txt = DATA.tuc[i].phrase.text;
	$('<span>').text(i + DATA.tuc[i].phrase.text).appendTo($('#dest'));
	$('<br>').appendTo($('#dest'));
	}
	catch(err){};
    };
};
    
var settings = 
{
    async: true, 
    cache: false,
    complete: function(obj, status) {console.log("complete"); },
    crossDomain: true, 
    data: {"from": 'deu', "dest":'eng', "format":'json', "phrase":'etwas', "pretty": 'true'} , 
    dataType: 'jsonp', 
    error: function(obj, status, err) {console.log("error: " + err); }, 
    success: function(data, status, obj) { console.log("data: "+data); DATA=data ; result();},
    type: 'GET'
 };



var set_data = function()
{
    settings.data = {"from": 'deu', "dest":'eng', "format":'json', "phrase":$('#in').val(), "pretty": 'true'};
    $.ajax('http://glosbe.com/gapi/translate', settings);
}
$('#button').on('click', set_data);