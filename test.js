
//$( function(){

//###########################################################################
//VALUES
//###########################################################################
var button_go=$('#button_go');
var BUTTON_GO=button_go.get(0);
var button_add=$('#button_add');
var BUTTON_ADD=button_add.get(0);
var button_reset=$('#button_reset');
var BUTTON_RESET=$('#button_reset').get(0);
var txt=$('#txt');
var TXT=txt.get(0);
var txtin=$('#txtin');
var TXTIN=txtin.get(0);
var filein=$('#filein');
var FILEIN=filein.get(0);
//-------------------------------------

var noword_char= "\\\\,\\.\\?\\$\\^\\{\\}\\[\\]\\(\\)\\+\\*\\|"
	+";:!<> \"#~§%&@";

var word_div_class = "word_div";
var word_div_id = "word_div";
var word_class = "word";
var word_id = "word";
var transl_class = "transl";
var transl_id = "transl";
var transl_height = "-4.5em";

var MAX_PARLENGTH=100;
var ellipse = $('<span>').text(" ...");

//--------------------------------------

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
//GLOBAL VARIABLES
//###########################################################################
var sec_counter = 0; //position (and key) of first not visible text section
var sec_total = 0;   //text elements stored in total


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
var err_sessStorExceeded = function()
    {alert('You managed the sheer impossible: Your input exceeded the local storage!');};



//   GET
//++++++++++++++++++++++++++++++++++++++++++++++++++++

var get_word_id = function(v){
    return parseInt(v.get(0).id.slice(word_id.length));};

var get_word_div_id = function(v){
    return parseInt(v.get(0).id.slice(word_div_id.length));};



//   ADDITIONAL OPERATIONS
//++++++++++++++++++++++++++++++++++++++++++++++++++

var split_str = function(str, pos)
{
    var arr = [];

    while(str)
    {
        if(str.length>pos+20) //splittable?                                                                                                                             
        {
            var split_pos= str.indexOf(' ', pos);
            //no space or some newline earlier                                                                                                                          
            if((!split_pos) || (split_pos && str.indexOf('\n', pos)<split_pos))
            {split_pos=str.indexOf('\n', pos);}
            console.log("split_pos: "+split_pos);

            if(split_pos) //set?                                                                                                                                        
            {
                arr.push(str.substring(0, split_pos));
                str = str.slice(split_pos);
            };
        }
        else{arr.push(str); str ="";}
    }

    return arr;
};



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
		.text("blabla "+i); //for debugging
	
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


//----------------------------------------------------

var create_output = function(str)
{
    console.log("extracting text ..."); //DEBUGGING

    //variables
    if(str.length===0) { err_noinput(); return false;}
    str = str.replace(/\n/g, "<br>"); //html-newlines

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
	console.log(i);
    };

    //last noword-phrase
    if(str.length) //still chars left?
    {
	TXT.innerHTML=(TXT.innerHTML + str);
    };//for(var i=0; i<10000; i++){for (var j=0; j<10000; j++){}}
    
    

    //set event handlers
    $('.word_div').each(function(i, v){set_word_div_events($(v));});


    //hide textarea
    
    $('#input').hide();
    $('#output').show();

    
    return true;
    
};


//--------------------------------------------------


var create_next_sec = function()
{
    if(sessionStorage.length >= sec_counter) //section left?
    {
	var str = sessionStorage.getItem(sessionStorage.key(sec_counter));
	//txt.text(txt.text().substring(0, txt.text().length-ellipse.length)); //old text without "..."  
        ellipse.detach();
	create_output(str); //show next section                                                                                     
	sec_counter++;      

	if(sessionStorage.length !== sec_counter) //reached last?
	{
	    ellipse.appendTo(txt);        //new "..."
	};
    };
    
    
};




//   EXTRACTION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++


var store_par = function(str, max_seclen)
{
    var array = split_str(str, max_seclen);
    for(var i=0; i<array.length; i++)
    {
	try{
        sessionStorage.setItem(sec_total, array[i]);
	sec_total++;
        }
        catch(e){if (e === QUOTA_EXCEEDED_ERR) err_sessStorExceeded(); };
    };
};

//---------------------------------------------------
var extract_input = function(str)
{
    //split str & store in sessionStore
    store_par(str, MAX_PARLENGTH);
    //create first section
    create_next_sec();
};

//----------------------------------------------------



var extract_txtin = function() { extract_input(txtin.val()); };


var extract_filein = function(evt)
{

    console.log("About to read the file ...");
                                           
    var currfile = evt.target.files[0];
    var reader = new FileReader();

    //when loaded
    reader.onload = (function(file) {
        return function(e) {
            //debug info
	    console.log(
                "FILE: "+file.name+", "+file.type+", "
                    +file.size+", "+file.lastModifiedDate.toLocaleDateString());

	    console.log (e.target.result);
            extract_txt(e.target.result);

	    console.log('finished');

        };

    })(currfile);

    reader.readAsText(currfile);
};





//   TRANSLATION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//-----------------------------------------
//   incoming data, settings, url-----------
var DATA={};
var settings = function(){
    return	{
	async: true,
	cache: false,
	crossDomain: true,
	dataType: 'jsonp',
	type: 'GET',
	complete: function(obj, status) {
	    console.log("complete"); },
	error: function(obj, status, err) {
	    console.log("This is an error message: " + err); },
	//Some default data
	data: {"from": 'deu', "dest":'eng', "format":'json',
	       "phrase":'etwas', "pretty": 'true'}
    };
};

var iteration_obj_Glosbe = function(j)
{
    return [[DATA.tuc[j].phrase], DATA.tuc[j].meanings];
};


//------------------------------------------
var get_data_Glosbe = function(i)
{
    return  {"from": $('#langfrom').val(), "dest":$('#langto').val(),
	     "format":'json', "pretty": 'true',
	     "phrase":$('#'+word_id+i).text()};
    //with examples: "tm" : true
    //      in DATA: DATA.examples[]
};

//------------------------------------------

var ajax_Glosbe = function(sets){ $.ajax('http://glosbe.com/gapi/translate', sets); };



//------------------------------------------
//   call and interpretation ---------------

var interpret_data_Glosbe = function(i, recur){
    var t = $('#'+transl_id+i).empty(); //transl field
    
    //GLOSBE SPECIAL: Case-Sensitivity
    //if no match, try to capitalize/ set to lower case the first letter
    if(DATA.tuc.length==0 && !recur) //no match
	{
	    var w = $('#'+word_id+i);
	    var tmp_settings = settings();
	    tmp_settings.success =  function(data, status, obj) 
	    {
	   	DATA=data;
	  	interpret_data_Glosbe(i, true);  //NO LOOP!! if not successful
	    };
	    tmp_settings.data = get_data_Glosbe(); //current data

	    if(w.text().charAt(0).toUpperCase() === w.text().charAt(0)) //capital
	    {
		//phrase: capitalize first
		tmp_settings.data.phrase = 
		    w.text().charAt(0).toLowerCase() + w.text().slice(1);
		//second ajax call to Glosbe
		ajax_Glosbe(tmp_settings);    
		return;
	    }
	    else //first letter no capital:
	    {
		//phrase to lower case
		tmp_settings.data.phrase = 
		    w.text().charAt(0).toUpperCase() + w.text().slice(1);
		//second ajax call to Glosbe
		ajax_Glosbe(tmp_settings);
		return;
	    }
	}

    //display for no transl
    if(DATA.tuc.length==0){t.text('no tanslation found'); return;}



    //GLOSBE INTERPRETATION:
    var txtarea = $('<textarea readonly id="transltxt" placeholder="Loading ..."'+i+'>').appendTo(t);

    for(var j=0; j<DATA.tuc.length; j++)
    {
	//meanings:
	if(DATA.tuc[j].meanings) //any mentioned meanings?
	{
	    var means = "";
	    means = means + "\n  - " + DATA.tuc[j].meanings[0].text; //first
	    for(var k=1; k<DATA.tuc[j].meanings.length-1; k++)
	    {
		means = means + "\n  - " + DATA.tuc[j].meanings[k].text;
	    };
	};
	
	//phrase:
	var phrase="";
	if(DATA.tuc[j].phrase) //any phrase mentioned?
	{
	    phrase=DATA.tuc[j].phrase.text;
	}

	//insert
	if(phrase){txtarea.text(txtarea.text() + "\n" + j +" "+ phrase);}
	if(means){txtarea.text(txtarea.text() +  means);}
 	$('<br>').appendTo($('#dest'));
    };

};







//------------------------------------------

var load_transl_Glosbe = function(i, set)
{
    var currsettings = set;
    if(!currsettings) //default
    {
	currsettings = settings();
	currsettings.success = function(data, status, obj) {
	    DATA=data ; interpret_data_Glosbe(i);};
    };
    
    currsettings.data = get_data_Glosbe(i); //get lang, phrase etc.
    
    ajax_Glosbe(currsettings); //actual call to Glosbe-URL

};


//-----------------------------------------------------


var init_transl = function(i)
{
    if(!$("#"+transl_id+i).length)
    {
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
    //surface
    $('#output').hide();
    txtin.empty();
    txt.empty();
    $('#input').show();
    
    //storage
    sessionStorage.clear();
    sec_counter=0;
    sec_total=0;
};


//----------------------------------------------------

var add_input = function()
{
    $('#output').hide(); txt.show();
    txtin.empty();

    ellipse.detach();  //remove "..."
    TXT.innerHTML = (TXT.innerHTML + "<br>"); //newline
    $('#input').show();

};





//   EVENTHANDLERS
//++++++++++++++++++++++++++++++++++++++++++++++++++++

button_go.click(function(){
    // if(typeof(Worker) !== "undefined") {
    // 	var w= new Worker('extract_txt.js');
    // 	w.onmessage =  function(){this.terminate();};
    // } 
    // else {
    // window.alert("Your Browser does not support WebWorker"+
    // 		 "(Multithreading) - Readout may take a while ...");
    //};
  extract_txtin();
});

button_reset.on('click', reset_input);

button_add.on('click', add_input);

filein.on('change', extract_filein);


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
//extract_txt();    







//});
