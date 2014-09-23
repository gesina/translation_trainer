$( function(){

//ATTRIBUTES
    //wordbox_style?? (better in CSS-file)
    //infobox_style?? (better in CSS-file)
    var button_go=$('#button_go');
    var BUTTON_GO=button_go.get(0);
    var txt=$('#txt');
    var TXT=txt.get(0);
    var txtin=$('#txtin');
    var TXTIN=txtin.get(0);
    
    var noword_char= ",;:.?!<> "; //no -,'





//FUNCTIONS


    var err_noinput= function(){console.log('no input');};



    var create_txt = function()
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
	var word_div;
	var word_transl;

	//words
	word_arr = str.match(word_pattern);
	for(var i=0; i<word_arr.length; i++) //remove "br"
	{
	    if(word_arr[i]=="br"){word_arr.splice(i, 1); i--;};
	};
	    
	//actual text creation
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
	    
	    //create+insert word text
	    word_div = $('<div>').attr({'id': "wdiv"+i});
	    word = $('<span>').text(word).appendTo(word_div);
	    word_transl = $('<div>')
		.attr({'id' : "transl"+i, 'text':"blabla"+i })
		.appendTo(word_div);
	    
	    TXT.appendChild(word_div.get(0));		    
	    };
	
    	
    };
	//create <span>-objects from single words
	//create corresponding <div>-objects for the words
	//css properties
	//eventhandler
	//.appendTo(txt);




//EVENTHANDLERS
    button_go.click(create_txt);
    //event with id 
    button_go.bind('mouseover', function(){console.log('Mouse over GO');
					  console.log(this);//obj that triggered
					  });
    

    









});
