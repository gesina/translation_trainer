
var txtin=$('#in');
var array;
var txt=$('#transl');
var ellipse= " ...";
var par_cnt =0; //counter for paragraphs
//catch if no sessionStorage
var storage = (typeof(sessionStorage) == 'undefined') ? [] : sessionStorage;
var storage_get = (typeof(sessionStorage) == 'undefined') ? 
	function(name){return storage[name];} : storage.getItem ;
var storage_remove= (typeof(sessionStorage) == 'undefined') ? 
	function(name){return storage.splice(indexOf(name), 1);} : storage.removeItem ;
var storage_add = (typeof(sessionStorage) == 'undefined') ? 
	function(name, val){return storage.splice(indexOf(name), 1);} : storage.setItem ;


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

var split = function()
{
    var str=txtin.val(); console.log("str: "+str);
    var array = split_str(str, 100);
    for(var i=0; i<array.length; i++)
    {
	try{
	sessionStorage.setItem(i, array[i]);
	}
	catch(e){ };
    };
    show_next_par();
};

var show_next_par = function()
{
    txt.text(txt.text().substring(0, txt.text().length-ellipse.length) //old text without "..."
	     + sessionStorage.getItem(sessionStorage.key(par_cnt))  //new paragraph
             + ellipse);        //new "..."
    par_cnt++;
};



$('#start').on('click', split);
$('#more').on('click', show_next_par);