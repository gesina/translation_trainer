//$( function(){

//###########################################################################
//ATTRIBUTES
//###########################################################################
    //wordbox_style?? (better in CSS-file)
    //infobox_style?? (better in CSS-file)
    var button_go=$('#button_go');
    var BUTTON_GO=button_go.get(0);
    var txt=$('#txt');
    var TXT=txt.get(0);
    var txtin=$('#txtin');
    var TXTIN=txtin.get(0);
    
    var noword_char= ",;:.?!<> "; //no -,'
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

    var transl_stylebelow =
	    {'top' : "2em"};
    var transl_styleover = 
	    {'top' : transl_height};


//###########################################################################
//PREDEFINITIONS
//###########################################################################
    var set_word_events;


//###########################################################################
//FUNCTIONS
//###########################################################################
    //ERRORS
    //++++++++++++++++++++++++++++++++++++++++++++++++++
    var err_noinput= function(){console.log('no input');};
    var err_nomatchingword = function(){console.log('no matching word');};


    //CREATE
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
//	var transl = create_transl_div(i)
//		.appendTo(word_div);
	
	return word_div;
    };

    
    //EXTRACTION
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++
    var extract_txt = function()
    {
	//variables
	var str=txtin.get(0).value;
	if(str.length===0) { err_noinput(); return false;}
	str = str.replace(/\n/g, "<br>"); //html-newlines

	var pos_whitespace = "";
	var word = "";
	var noword = "";
	var word_arr = [];
	var word_pattern = new RegExp("((<br){0}[^"+noword_char+"](br>){0}){1,}", "g");
	var noword_pattern = "";

	//words
	word_arr = str.match(word_pattern);
	for(var i=0; i<word_arr.length; i++) //remove "br"
	{
	    if(word_arr[i]=="br"){word_arr.splice(i, 1); i--;};
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
	    
	    //insert noword
	    if(noword != null)
	    {
		txt.get(0).innerHTML=(txt.get(0).innerHTML + noword);
		noword=""; //reset	
	    };
	    
	    
	    TXT.appendChild(create_word_div(i, word).get(0));		    
	};


	//set events
	set_word_events();
	

	//hide textarea
	txtin.hide();
	button_go.hide();
	
	return true;
    	
    };



    //GET
    //----------------------------------------------------
    var load_transl = function(i)
    {
	console.log("transl"+i+" now initialized: " + $('#'+transl_id+i).get(0));
    };


    var init_transl = function(i)
    {
	if($("#"+transl_id+i).length) {console.log("transl"+i + " already initialized");}
	else {
	    var wdiv= $('#'+word_div_id+i); console.log(wdiv.get(0));
	    console.log(!wdiv);
	    if(wdiv.length)
		{
		    create_transl_div(i).appendTo(wdiv);
		    load_transl(i);
		    return true;
		}
	    else {err_nomatchingword(); return false;}
	    };
    };
    
//###########################################################################
//...... 
//###########################################################################	
	//css properties
	//eventhandler
	//.appendTo(txt);




//EVENTHANDLERS
    button_go.click(extract_txt);
    //event with id 
    button_go.bind('mouseover', function()
		   {console.log(this);//obj that triggered
					  });
    

    //RESET BUTTON EVENT
    //MOUSEMOVED-EVENT FOR CURRENT WORD



    set_word_events = function ()
    {
	    $('.word').each(function(i, v)
			    {
				$(v).bind('mouseenter', function(){ 
				    //MOUSE ON WORD:
				    //check, whether translation loaded			  
				    var id = parseInt(v.id.charAt(v.id.length - 1));
				    init_transl(id);
				    //show translation
	//CHOOSE CORRECT STYLE (OVER, BELOW)!!!!!!!!!!!!!!!!!!!!!
				    $('#'+transl_id+id).css(transl_styleover).show();
        //ATTACH MOUSEMOVED EVENT TO ADJUST TRANSL-POSITION
				    //style change for word: IN CSS!!
				});
			    });
	
	$('.word').each(function(i, v)
			{
			    $(v).bind('mouseleave', function(){
				//MOUSE OFF WORD:
				var id = parseInt(v.id.charAt(v.id.length - 1));
				$('#'+transl_id+id).hide();
				//reset word style: IN CSS!!
	//REMOVE MOUSEMOVED EVENT!!!!!!!!!!!!!!!!
			    });
			});
	
	
    };
    







//DEBUGGING:
extract_txt();    
   






//});