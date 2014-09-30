
var txtin=$('#in');
var array;
var txt=$('#transl');
var ellipse= " ...";

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
    array = split_str(str, 100);
    txt.text(array.shift() + ellipse);
};

var show_next_par = function()
{
    txt.text(txt.text().substring(0, txt.text().length-ellipse.length) //old text without "..."
	     + array.shift()  //new paragraph
             + ellipse);        //new "..."
};



$('#start').on('click', split);
$('#more').on('click', show_next_par);