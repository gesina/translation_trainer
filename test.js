//$( function(){

//###########################################################################
//ATTRIBUTES
//###########################################################################
var button_go=$('#button_go');
var BUTTON_GO=button_go.get(0);
var button_reset=$('#button_reset');
var BUTTON_RESET=$('#button_reset').get(0);
var txt=$('#txt');
var TXT=txt.get(0);
var txtin=$('#txtin');
var TXTIN=txtin.get(0);

var noword_char= "\\\\,;:!<> \\.\\?\\$\\^\\{\\}\\[\\]\\(\\)\\+\\*\\|";

//###########################################################################
//VALUES
//###########################################################################
var word_div_class = "word_div";
var word_div_id = "word_div";
var word_class = "word";
var word_id = "word";
var transl_class = "transl";
var transl_id = "transl";
var transl_height = "-4.5em";

var transl_stylebelow = function(id){
    var t = $('#'+transl_id+id);
    var w = $('#'+word_id+id);
    if(t)
    {return {'top' : "1em" ,
	    'left': (0.5*w.width()).toString()};}
    else { err_nomatchingtransl(); return false;}
};
var transl_styleover = function(id){
    var t = $('#'+transl_id+id);
    var w = $('#'+word_id+id);
    if(t)
    {return {'top' : (-t.height()-0.5*w.height()).toString()+"px",
	     'left': (0.5*w.width()).toString()};}
    else { err_nomatchingtransl(); return false;}
};

//###########################################################################
//PREDEFINITIONS
//###########################################################################
var set_word_div_events;
var set_transl_events;


//###########################################################################
//FUNCTIONS
//###########################################################################

//   ERRORS
//++++++++++++++++++++++++++++++++++++++++++++++++++
var err_noinput= function(){console.log('no input');};
var err_nomatchingword = function(){console.log('no matching word');};
var err_nomatchingtransl= function(){console.log('no matching translation');};


//   CREATE
//+++++++++++++++++++++++++++++++++++++++++++++++++++
var create_word = function(i, text)
{
    var word = $('<span>').text(text)
	    .attr({'id': word_id + i , 'class' : word_class});
    
    return word;
};


//----------------------------------------------------


var create_transl_div = function(i)
{
    //check, whether wordi exists:
    if($('#word'+i))
    {
	var transl = $('<div>')
		.attr({'id' : transl_id + i, 'class' : transl_class})
		.text("blabla"+i); //for debugging
	
	transl.hide();
	return transl;
    }
    else {err_nomatchingword(); return null;}
};


//----------------------------------------------------


var create_word_div = function(i, text)
{
    var word_div = $('<div>')
	    .attr({'id': word_div_id + i , 'class' : word_div_class});
    var word = create_word(i, text)
	    .appendTo(word_div);

    return word_div;
};



//   GET
//++++++++++++++++++++++++++++++++++++++++++++++++++++

var get_word_id = function(v){
    return parseInt(v.get(0).id.slice(word_id.length));};

var get_word_div_id = function(v){
    return parseInt(v.get(0).id.slice(word_div_id.length));};




//   EXTRACTION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++
var extract_txt = function()
{
    console.log("extracting text ..."); //start

    //variables
    var str=txtin.val();
    if(str.length===0) { err_noinput(); return false;}
    str = str.replace(/\n/g, "<br>"); //html-newlines

    var pos_whitespace = "";
    var word = "";
    var noword = "";
    var word_arr = [];
    var word_pattern = new RegExp("((<br){0}[^"+noword_char+"](br>){0}){1,}", "g");
    var noword_pattern = "";


    //word extraction
    word_arr = str.match(word_pattern);
    for(var j=0; j<word_arr.length; j++) //remove "br"
    {
	if(word_arr[j]=="br"){word_arr.splice(j, 1); j--;};
    };
    

    //ACTUAL TEXT CREATION
    for (var i=0; i<word_arr.length; i++)
    {
	//get next word
	word=word_arr[i];
	//get noword_char before
	noword_pattern= new RegExp("((<br>)|["+noword_char+"]){1,}(?="+word+")");
	noword = str.match(noword_pattern); //array
	noword = (noword) ? noword[0] : ""; //first (or no) result
	
	//cut string
	str = (!noword) ? str : str.slice(noword.length); //rm noword
	str = (!word) ? str : str.slice(word.length); //rm word
	
	//insert noword to TXT
	if(noword != null)
	{
	    TXT.innerHTML=(TXT.innerHTML + noword);
	    noword=""; //reset	
	};
	
	//create+insert word_div
	TXT.appendChild(create_word_div(i, word).get(0));		    
    };


    //set event handlers
    $('.word_div').each(function(i, v){set_word_div_events($(v));});


    //hide textarea
    
    $('#input').hide();
    $('#output').show();

    
    return true;
    
};



//   TRANSLATION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//incoming data
var DATA={};

var interpret_data = function(i){
    var txt;
    var t = $('#'+transl_id+i).empty();
    var txtarea = $('<textarea readonly id="transltxt" placeholder="Loading ..."'+i+'>').appendTo(t);

    for(var j=0; j<DATA.tuc.length; j++)
    {
        try
        {
            txt = DATA.tuc[j].phrase.text;
            txtarea.text(txtarea.text() + "\n" + j +" "+ DATA.tuc[j].phrase.text);
            $('<br>').appendTo($('#dest'));
        }
        catch(err){};
    };
};


//------------------------------------------


var load_transl_Glosbe = function(i)
{
    var settings =
	    {
		async: true,
		cache: false,
		crossDomain: true,
		dataType: 'jsonp',
		type: 'GET',
		complete: function(obj, status) {
		    console.log("complete"); },
		error: function(obj, status, err) {
		    console.log("error: " + err); },
		success: function(data, status, obj) {
		    DATA=data ; interpret_data(i);},
		data: {"from": 'deu', "dest":'eng', "format":'json',
		       "phrase":'etwas', "pretty": 'true'}
		
	    };

    settings.data = {"from": 'deu', "dest":'eng', "format":'json', 
		     "phrase":$('#'+word_id+i).text(), "pretty": 'true'};

    $.ajax('http://glosbe.com/gapi/translate', settings);
    
};


//-----------------------------------------------------


var init_transl = function(i)
{

    if($("#"+transl_id+i).length) {}
    else {
	var wdiv= $('#'+word_div_id+i);
	if(wdiv.length) //word_div already defined?
	{
	    create_transl_div(i).appendTo(wdiv);
	    load_transl_Glosbe(i);
	    return true;
	}
	else {err_nomatchingword(); return false;}
    };

    return true;
};



//   DISPLAY
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++

var show_transl = function(id)
{
    var t = $('#'+transl_id+id); //transl. with id
    if(t.get(0)) //transl exists?
    {	
	var w = $('#'+word_id+id); //word with id
	if(event.clientY < w.offset().top + 0.5*w.height()){//cursor in upper half
	    t.css(transl_styleover(id)).show();
	}	    
	else {//cursor in lower half
	    t.css(transl_stylebelow(id)).show();
	};
    }

    else {err_nomatchingtransl(); return false;}
    
    return true;
};



//-----------------------------------------------------

var reset_input = function()
{
    $('#output').hide();
    txtin.empty();
    txt.empty();
    $('#input').show();
};








//   EVENTHANDLERS
//++++++++++++++++++++++++++++++++++++++++++++++++++++

button_go.click(extract_txt);

button_reset.on('click', reset_input);



set_word_div_events = function (w_div){ //defined above

    var id = parseInt(w_div.get(0).id.slice(word_div_id.length));
    
    //MOUSENTER
    w_div.on('mouseenter', function(){ 
	//check for/create transl
	init_transl(id);
	//show translation (in correct position)
	show_transl(id);
    });
     
    //MOUSEMOVE
    w_div.on('mousemove', function(){
	//check transl pos
	show_transl(id);
    });
        
    
    // MOUSELEAVE
    w_div.on('mouseleave', function(){
	//hide transl
	$('#'+transl_id+id).hide();
    });
    

    return w_div;
    
};




//DEBUGGING:
extract_txt();    







//});
