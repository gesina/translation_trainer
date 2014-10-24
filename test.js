
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
var button_load=$('#button_load');
var BUTTON_LOAD=button_load.get(0);
var button_download=$('#button_download');

var txt=$('#txt');
var TXT=txt.get(0);
var txtin=$('#txtin');
var TXTIN=txtin.get(0);
var filein=$('#filein');
var FILEIN=filein.get(0);
var more = $('#more');
var MORE = more.get(0);
var vocab=$('#vocab');
var VOCAB=vocab.get(0);
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
var but_voc_id = "but_voc";
var but_voc_class = "but_voc";
var vocab_id = "voc";
var vocab_class = "voc_"; //followed by language
var voc_in_id = "voc_in";
var voc_in_class="voc_in";

var MAX_PARLENGTH=100;
var ellipse = $('<span>').text(" ...");

//--------------------------------------

var transl_stylebelow = function(id){
    var t = $('#'+transl_id+id);
    var w = $('#'+word_id+id);
    if(t)
    {return {'top' : (w.height()).toString()+ "px" ,
	    'left': (0.3*w.width()-10).toString() + "px"};}
    else { err_nomatchingtransl(); return false;}
};
var transl_styleover = function(id){
    var t = $('#'+transl_id+id);
    var w = $('#'+word_id+id);
    if(t)
    {return {'top' : (-t.height()-0.8*w.height()).toString()+"px",
	     'left':  (0.3*w.width()-10).toString() + "px"};}
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
var err_nocontent = function(){console.log('no content in file')};
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
            //DEBUGGING: console.log("split_pos: "+split_pos);

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
		//.text("Glosbe transl "+i) //for DEBUGGING
		//.append("<span>"+$('#langfrom').val()+" > "+$('#langto').val()+"</span>")
	        .hide();
	
	//span for language information
	$('<span>').attr({'id':"transl_lang"+i,'class':"transl_lang"})
	           .html($('#langfrom').val() +" - "+$('#langto').val())
	    .appendTo($('<div class="lang">').prependTo(transl));
	
	//div for actual text-spans
	$('<ul class="transl_entries">').appendTo(transl);
	
	// text field to add personal translation
	$('<input type="text">')
	    .attr({'id':voc_in_id+i, 'class':voc_in_class, 
		   'placeholder':"alternate translation"})
	    .appendTo(transl);
	
	// input button for personal translation
	$('<button>')
	    .attr({'id':but_voc_id+i, 'class': but_voc_class})
	    .html("add to vocab")
	    .on('click', function(){
		var nwvocab = $('#'+voc_in_id+i).val(); //get personal transl 
		if(nwvocab) {  //any input?
		    add_vocab($('#'+word_id+i).html(), nwvocab); //vocab list
		    add_transl_entry("* "+nwvocab, i);           //transl field
		}
	    })
	    .appendTo(transl);
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
    var start = 0;
    var last_word = $('#txt > div:nth-last-of-type(1)');   //DEBUGGING console.log(last_word);
    if(last_word.length){ start = get_word_div_id(last_word)+1;
			console.log('start: '+start);} //id-number of last word (for ids)
 
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
	TXT.appendChild(create_word_div(i+start, word).get(0));		    
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
    if(sessionStorage.length > sec_counter) //section left?
    {
	var str = sessionStorage.getItem(sessionStorage.key(sec_counter));

        ellipse.detach(); //remove "..."
	create_output(str); //show next section                                                                                     
	sec_counter++;      

	if(sessionStorage.length !== sec_counter) //sections left?
	{
	    ellipse.appendTo(txt);   //new "..."
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


var read_files = function(evt, file_pos, read)
{
    var pos = file_pos || 0; //console.log("file_pos: "+pos);

    //console.log("About to read file ...");
                                           
    var currfile = FILEIN.files[pos];
    var reader = read || new FileReader();
    var str = "";
    //when loaded
    reader.onload = (function(file) {
        return function(e) {
	    //DEBUGGING
	    console.log(
                "FILE: "+file.name+", "+file.type+", "
		    +file.size+", "+file.lastModifiedDate.toLocaleDateString());
	    
	    //PROCESS CONTENT: get, store, process and show
	    if(e.target.result)
	    {
		txt.append("<br> Sourcefile: "+file.name);
		str = "\n" + e.target.result;
		extract_input(str);
	    }
	    else {err_nocontent();};
	    
	    //RECURSION: next files
	    if(FILEIN.files.length>pos+1) {read_files(evt, pos+1, reader);} 
        };
	
    })(currfile);
    
    reader.readAsText(currfile);
};


var extract_filein = function(evt)
{
    if(FILEIN.files.length)
    {
	read_files(evt); //read files, store, process and show content
	filein.val(''); //remove from input
    }
    else
    {
	err_noinput();
	$('#input').hide();
	$('#output').show();
    };
};




var extract_txtin = function() 
{
    if(txtin.val())
    {
	extract_input(txtin.val()); //store, process and show input text
	txtin.val(''); //remove from input
    }
    else
    {
	err_noinput();
	$('#input').hide();
	$('#output').show();
    };
};




//------------------------------------------

var add_transl_entry = function(str, id)
{
    var div=$('#'+transl_id+id+'> .transl_entries');
    
    $('<li>')
	.html(str)
	.on('click', function(){
	    add_vocab($('#'+word_id+id).html(), str);
	    })
	.appendTo(div);
    
};



//   TRANSLATION
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
	//DEBUGGING: Some default data
	data: {"from": 'deu', "dest":'eng', "format":'json',
	       "phrase":'etwas', "pretty": 'true'}
    };
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
    var t = $('#'+transl_id+i); //transl field
    
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

    //console.log(DATA);

    //display for no transl
    if(DATA.tuc.length==0)
    {
	//t.text('no tanslation found');
	$('<span>')
	    .html("no translation found, click to try again")
	    .on('click', function(){
	        load_transl_Glosbe(i);
	        $(this).remove();
	    })
	    .prependTo(t);
	return;
    }


    //GLOSBE INTERPRETATION:
    for(var j=0; j<DATA.tuc.length; j++)
    {
	var means = "";
	//meanings:
	if(DATA.tuc[j].meanings) //any mentioned meanings?
	{
	    //example or description?
	    if(DATA.tuc[j].meanings[0].language === $('#langfrom').val())
	    {means = means + "<br> <b>e.g.</b> "; }   //example
	    else {means = means + "<br> <b>=</b> "; } //description
	    
	    means = means + "<i>"+DATA.tuc[j].meanings[0].text+"</i>"; //first


	    for(var k=1; k<DATA.tuc[j].meanings.length-1; k++)
	    {
		if(DATA.tuc[j].meanings[k].language === $('#langfrom').val())
		{means = means + "<br> <b>e.g.</b>  "; }   //example
		else {means = means + "<br> <b>=</b>  "; } //description
	    
		means = means + "<i>"+DATA.tuc[j].meanings[k].text+"</i>";
	    };
	};
	
	//phrase:
	var phrase="";
	if(DATA.tuc[j].phrase) //any phrase mentioned?
	{
	    phrase="<b>" + DATA.tuc[j].phrase.text + "</b>";
	}
	else {phrase = "--";};

	//DEBUGGING
	//console.log("still there?"); console.log($('#word00'));

	//insert
	add_transl_entry(phrase + means, i);
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
    if($("#"+transl_id+i).length){
    console.log($('#transl_lang'+i).html()+"\n"
		+$('#langfrom').val()+" ? "
                +$('#transl_lang'+i).html().substring(0,3) +"\n"
		+$('#langto').val()+" ? "
		+$('#transl_lang'+i).html().substring(6,9));
    console.log($('#langfrom').val()!=$('#transl_lang'+i).html().substring(0,3) +"\n");
    console.log($('#langto').val()!=$('#transl_lang'+i).html().substring(6,9))};



    if(!$("#"+transl_id+i).length) //does it already exist? 
       //and if so, are the languages ok?
        {
	    console.log("changing transl"+i);//DEBUGGING
	    var wdiv= $('#'+word_div_id+i);
	    if(wdiv.length) //word_div already defined?
	    {
		create_transl_div(i).appendTo(wdiv);
		load_transl_Glosbe(i);
		return true;
	    }
	    else {err_nomatchingword(); return false;}
	}
    else if($('#langfrom').val()!=$('#transl_lang'+i).html().substring(0,3) ||
            $('#langto').val()!=$('#transl_lang'+i).html().substring(6,9))
    {
	var lang=$('#transl_lang'+i).html($('#langfrom').val()
					  + " - "
					  +$('#langto').val());
	load_transl_Glosbe(i);
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
	if(event.clientY + $('body').scrollTop() < w.offset().top + 0.5*w.height()){//cursor in upper half
	    t.css(transl_styleover(id)).show();
	}	    
	else {//cursor in lower half
	    t.css(transl_stylebelow(id)).show();
	};
    }

    else {err_nomatchingtransl(); return false;}
    
    return true;
};





//   VOCABULARY
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
var add_vocab = function(expr, transl)
{
    var div= $('<div class="voc_div">').appendTo(vocab);
    $('<span>').html(expr+"    ").appendTo(div);
    $('<span>').html(transl).appendTo(div);
    $('<button>').html("X")
	.on('click', function(){
	    //DEBUGGING: console.log(this.parentNode);
	    $(this.parentNode).remove();
	})
	.appendTo(div);
    //for css (little hack to enable spacing):
    $('<div>').appendTo(div);
};



//-----------------------------------------------------


var download_txtfile = function(text, filename)
{
    var tmp_link = $('<a>')
        //create textfile and set as link
	.attr({'href': 'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
	       'download': filename})
        //execute Download
	.click();
    
};

var download_vocab = function()
{
    //create vocab text for download file
    var txt;
    var tmp_str;
    $('.voc_div').each(function() {
	var tmp_str = this.children[0].innerHTML;
	tmp_str= mod_newlines(tmp_str);
	txt += "\n" + tmp_str;
	});
	
};



//   ADD + RESET
//++++++++++++++++++++++++++++++++++++++++++++++++++++++

var reset_input = function()
{
    //surface
    $('#output').hide();
    $('.input').val('');
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

    ellipse.detach();  //remove "..."
    TXT.innerHTML = (TXT.innerHTML + "<br>"); //newline

    $('#input').show(); //new entries

};





//  EVENTHANDLERS
//++++++++++++++++++++++++++++++++++++++++++++++++++++

button_go.click(function(){ extract_txtin(); });

button_reset.on('click', reset_input);

button_add.on('click', add_input);

button_load.on('click', extract_filein);

more.on('click', create_next_sec);

$('#button_transl00').on('click', function(){

    //delete error message if existing
    if($('#transl00').html().match(/no\ translation\ found/g)) 
    {
	$('#transl00 >span:first-of-type').remove();
    };

    //save asked vocab
    var voc_tmp = $('#alt_voc_in').val();
    $('#word00').html(voc_tmp);
    //DEBUGGING: console.log('clicked' + ' value: ' +$('#alt_voc_in').val());    
    
    $('#transl00> .transl_entries').empty();
    //load transl and save in transl00
    load_transl_Glosbe('00');

    //translation not successful?
    if($('#word00').html()===voc_tmp)
	{
	    //$('#word00').empty();
	    //new ajax query with switched languages
	    var ajax_set=settings();
	    console.log('ajax_set : ');console.log(ajax_set);
	    var new_result = "";
	    //switch languages
	    DATA="blubb";
	    ajax_set.data.dest=$('#langto').val();
	    ajax_set.data.from=$('#langfrom').val();
	    ajax_set.data.phrase=voc_tmp;
	    ajax_set.dataType="jsonp";
	    ajax_set.error= function(obj, status, err) {
	    console.log("This is an error message: " + err + " "+obj); };
//function(){console.log("error with AJAX");};
	    ajax_set.success = function(data, status, obj) 
	    {
		DATA=data; console.log("data: ");console.log(DATA);
		if(DATA.tuc.length){
		    $('<span>')
			.html("<br>A translation is available for other direction!"
	    		      + "\n (click to show)")
			.on('click', function(){
			    $('#word00').empty().html(voc_tmp);
			    $('#transl00 >span:first-of-type').remove();
			    DATA=data;
			    console.log(data);
			    interpret_data_Glosbe('00');
			})
			.appendTo($('#word00'));
		};
    
	    };
	    console.log('ajax_set changed : ');console.log(ajax_set);
	    //ajax_Glosbe(ajax_set);
	    $.ajax('http://glosbe.com/gapi/translate', ajax_set);
	    
	    // console.log("DATA: "+DATA);
	    // console.log("DATA.tuc: "+DATA.tuc);
	    // //now better results?
	    // if(DATA.tuc.length != 0){
	    // 	$('<span>')
	    // 	    .html("A translation is available for other direction!"
	    // 		  + "(click to show)");
	    // };
    }}
);

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

// //################################################
// //   DATABASE
// //################################################

// var request = indexedDB.open("vocabbase");
// request.onsuccess = function(evt)
// {
//     var vb=evt.target.result;
// };






//});

var download_html_style = function()
{
    return  "<style\>"
	+".voc_div>span"
	+"{float:left;"
	+"border-top-style: solid;"
	+"border-radius: 0;"
	+"border-color: #999999;}"
	+".voc_div>span:last-of-type {width:70%;}"
	+".voc_div>span:first-of-type {width:20%;}"
	+".voc_div>dborder-color: blue; border-style: solid;iv {clear:both;}"
        +"</style>";
}



var html_prefix = 
		        "<!DOCTYPE html>"
		       +"<HTML>"
		       +"<HEAD> "
		       +"<meta charset=\"UTF-8\"/> "
		       + download_html_style()
		       +"<title>Personal Vocabulary List</title>"
		       +"</HEAD>"
		       +"<BODY>"
		       +"<h1>Your Vocab</h1>"
		       +"<div>";

var html_suffix =  "</div>"
		  +"</BODY>"
		  +"</HTML>";

var vocab_to_html = function()
{
    var txt = $('#vocab').get(0).innerHTML;
    //remove buttons:
    var button_regex = new RegExp("<button>X</button>", "g");
    txt = txt.replace(button_regex, "");

    return txt;
}

//EXAMPLE FOR URI WITH HTML:
var create_vocab_download = function(){
    var currtime = new Date();
    currtime =   currtime.getFullYear().toString()
               + "-" + (currtime.getMonth()+1).toString()
	       + "-" + currtime.getDate().toString()
	       + "_" + currtime.getHours().toString()
               + "-" + currtime.getMinutes().toString();

    // download link with URI-encoded html-text
    var link = $('<a>')
	     .attr({'href' : 'data:text/html;charset=utf-8,'
		              //URI encoding
		             + encodeURIComponent(html_prefix 
			          		+ vocab_to_html() 
				         	+ html_suffix),
		   'download' : "vocab"+currtime+".html"
		   });

    //execute download
    link.get(0).click();
    
    // and instantly remove link (prevent old versions from being downloaded)
    link.remove();
             // .html("Download (html)")
             // .insertAfter(button_download);
};
//FOR PLAIN TEXT:
//http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server



button_download.on('click', create_vocab_download);

$('#output').hide();


//TEST

add_vocab("some", "test");
add_vocab("vocab", "to");
add_vocab("quicken", "debugging");
add_vocab("of", "vocab <br>sheet");







//TODOs
//reset no transl found when lang changed
//dont show "show more" when all shown
//Howto
//Documentation

