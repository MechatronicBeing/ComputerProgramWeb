
var input_lock=true;
var key_rep_state=0;
var step=0;
var login="";
var q1=[];
var q2=[];
var host="amnesicOS";
var can_autocomp=false;
var term_history=[];
var term_history_pos=0;

var man={};
man['cat']="CAT(1)                   User Commands                               CAT(1)\n\nNAME\n       cat - concatenate files and print on the standard output\n\nSYNOPSIS\n       cat [FILE]...\n\nDESCRIPTION\n       Concatenate FILE(s), or standard input, to standard output.\n\nEXAMPLES\n       cat README.txt\n              Output README.txt's contents to standard output.\n";

var prs={};
prs['..']=null;
prs['help']=function(a){var c="Available commands :";for(var e in prs){if(e!='..'){c+="\n    "+e;}} return c+"\nYou can use Tab for autocomplete.\nSource code here : https://github.com/Oros42/js_terminal/";};
prs['ls']=function(a){if(typeof a!='string'){a=a.join('');}if(a==''|| a=='.'){return fs.ls().join("\n");}else{var p="/"+fs.pwd.join('/');if(prs['cd'](a)){a="ls: "+a+": No such file or directory";}else{a=fs.ls().join("\n");}prs['cd'](p);return a;}};
prs['cd']=function(a){if(typeof a!='string'){a=a.join('/');}if(a==''){a='/home/'+login;}if(a=='.'){return '';}else{a=a.split('/');if(a[0]==''){while(fs.pwd!=''){fs.cd('..');}a.shift();}while(d=a.shift()){if(d!=''){if(!fs.cd(d)){return "cd: "+d+": No such file or directory of this type"}}}}};
prs['cat']=function(a){if(typeof a!='string'){a=a.join('');}if(a==''){return "Please give me a file name !";}else{var s=fs.cat(a);if(typeof s=='function'){s=s.toString();}if(s){if(typeof s!='string'){return ''}else{return s;}}else{return "cat: "+a+": No such file or directory";}}};
prs['pwd']=function(a){return "/"+fs.pwd.join('/');};
prs['mkdir']=function(a){if(typeof a!='string'){a=a.join('');}if(a==''|| a=='.'){return '';}else{a=a.split('/');var p="/"+fs.pwd.join('/');if(a[0]==''){prs['cd']('/');a.shift();}while(d=a.shift()){if(d!=''){if(d!='..'){fs.mkdir(d);}fs.cd(d);}}prs['cd'](p);}return '';};
prs['man']=function(a){a=a.join('');if(man[a]!=undefined){return man[a];}else{return "No manual entry for "+a;}};
prs['clear']=function(a){ clear_term();};
prs['exit']=function(a){document.body.innerHTML='Connection close';input_lock=true;return false;};
prs['echo']=function(a){if(typeof a!='string'){a=a.join(' ');}var d=a[0];if(a.lastIndexOf('>')<a.lastIndexOf(d)){return a.substr(1,a.lastIndexOf(d)-1);}if(fs.pwd.join('/')=='usr/bin'){try{eval("var s= "+a.substr(1,a.lastIndexOf(d)-1));}catch(e){return "SyntaxError: You should write a javascript function";}}else{var s=a.substr(1,a.lastIndexOf(d)-1).replace('\\n','\n');}/* FIXME for all \\n ->\n */a=a.substr(a.lastIndexOf(d));var n=a.substr(1+a.lastIndexOf('>')).trim();if(a.replace('>>','').length<a.length){s=fs.cat(n)+s;}fs.write(n,s);}

var filesys=function(){this.fs=[];this.pwd=[];this.write=function(n,c){this.fs[n]=c;};this.mkdir=function(n){if(!this.fs[n]){this.write(n,{"..": this.fs});}};this.cat=function(n){if(this.fs[n]){return this.fs[n];}else{return false;}};this.cd=function(n){if(this.fs[n]){this.fs=this.fs[n];if(n==".."){this.pwd.pop();}else{this.pwd.push(n);}return true;}else{return false;}};this.ls=function(){var r=[];for(f in this.fs){r.push(f);}return r;};};
fs=new filesys();
prs['mkdir']('/usr/');
prs['cd']('/usr/');
prs['..']=fs.fs;
fs.write('bin',prs);

function make_home(){prs['mkdir']("/home/"+login);prs['cd']("/home/"+login);prs['echo']('"This is a funny javascript terminal.\nI make it juste for fun ^_^\n" > README.txt');}

function write(t, b, f, s){if(t.length>0){input_lock=true;if(s!=undefined&&s>0){c.className="";document.getElementsByClassName(b)[0].innerHTML+=clean(t.substring(0,1));window.setTimeout(function(){write(t.substring(1,t.length),b,f,s);},s);}else{document.getElementsByClassName(b)[0].innerHTML+=clean(t);window.scroll(0,window.scrollMaxY);input_lock=false;if(f!=undefined){f();}}}else{c.className="curs";window.scroll(0,window.scrollMaxY);input_lock=false;if(f!=undefined){f();}}}

function newline(s){document.getElementsByClassName('a')[0].className='i';c.remove();c2.remove();var r=document.getElementsByClassName('r')[0];r.className='i';r.insertAdjacentHTML('afterEnd','<div class="i a"></div><div class="i r">'+q1.join('')+'<span id="c2" class="curs" style="display:none">&nbsp;</span>'+q2.join('')+'</div><span id="c" class="curs">&nbsp;</span>');s+="\n"+login+"@"+host+":"+prs['pwd']().replace('/home/'+login,'~')+"$ ";write(s,'a',curs_switch,0);}

function clean(s) {return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/ /g,'&nbsp;').replace(/\n/g,'<br/>');}

function h(){if(q1.length==1 && q1[0]=="\r"){q1=[];}var o=q1.join('');o=clean(o);if(q2.length>0){o+='<span id="c2" class="curs">'+clean(q2[0])+'</span>';var o2='';for(var i=1,end=q2.length;i<end;i++){o2+=q2[i];};o+=clean(o2);}else{o+='<span id="c2" class="curs">&nbsp;</span>';}document.getElementsByClassName('r')[0].innerHTML=o;}

function clear_term(){term.innerHTML='<div id="a" class="i a"></div><div id="r" class="i r"><span id="c2" class="curs" style="display:none">&nbsp;</span></div><span id="c" class="curs">&nbsp;</span>';}

var curs_switch=function(){c.style.display='none';c2.style.display='';}

var start=function(){clear_term();term.className='';login=q1.join('')+q2.join('');make_home();q1=[];q2=[];var s="Hello, "+login+"\n\n";write(s,'a',function(){a.innerHTML+='<span class="l"></div>';s='   \\\\ '+"\n"+'  __().'+"\n"+'o(_-\\_'+"\n";write(s,'l',function(){newline('');q1="help".split('');write("help",'a',function(){c.style.display='none';c2.style.display='';start=function (){var output=q1.join('')+q2.join('');term_history.push(output);term_history_pos=0;s='';var a=output.split(' ');var p=a.shift();if(p!=''&&p!="\n"){if(prs[p]!=undefined){try{s=prs[p](a);}catch(e){s="SyntaxError : Please fix /usr/bin/"+p;}}else{s="\n"+p+" : command not found";}}if(s){s="\n"+s;} else {s='';}q1=[];q2=[];newline(s);};can_autocomp=true;start();},50);},50);},50);};
function autocomp(){if(!can_autocomp){return;}var o=q1.join('');var s=[];if(prs[o.split(' ')[0]]!=undefined){o=o.split(' ');if(o.length>1){o=o[o.length-1];}else{o="";}var l=fs.ls();var g=o.length;while(e=l.shift()){if(e.substring(0,g)==o){s.push(e);}}}else{var l=prs;var g=o.length;for(e in l){if(e.substring(0,g)==o){s.push(e);}}}if(s.length==1){q1=q1.slice(0,q1.length-g);if(q1.length >1 && q1[q1.length-1]!=' '){q1.push(' ');}q1=q1.concat(s.pop().split(''));h();}else if(s.length>0){newline("\n"+s.join(' '));}}
kd=function(c){if(input_lock){return false;}var s="";switch(c.keyCode){case 8:if(c.altKey){while(q1.length>0){if(q1.pop()==' '){break;}}}else{q1.pop();}h();break;case 9:autocomp();break;case 13:start();break;case 27:s="\x1b";break;case 37:if(q1.length>0){q2.unshift(q1.pop());}h();break;case 39:if(q2.length>0){q1.push(q2.shift());}h();break;case 38:if(c.ctrlKey){this.scroll_disp(-1);}else{if(term_history.length>0){term_history_pos++;if(term_history_pos>term_history.length){term_history_pos=term_history.length;}q1=term_history[term_history.length-term_history_pos].split('');q2=[];h();}}break;case 40:if(c.ctrlKey){this.scroll_disp(1);}else{if(term_history.length>0){term_history_pos--;if(term_history_pos<1){term_history_pos=0;q1=[];}else{q1=term_history[term_history.length-term_history_pos].split('');}q2=[];h();}}break;case 46:q2.shift();h();break;case 45:s="\x1b[2~";break;case 36:q2=q1.concat(q2);q1=[];h();break;case 35:q2=q1.concat(q2);q1=q2;q2=[];h();break;case 33:if(c.ctrlKey){this.scroll_disp(-(this.h-1));}else{s="\x1b[5~";}break;case 34:if(c.ctrlKey){this.scroll_disp(this.h-1);}else{s="\x1b[6~";}break;default:if(c.ctrlKey){switch(true){case c.keyCode==68:if(c.stopPropagation)c.stopPropagation();if(c.preventDefault)c.preventDefault();prs['exit']();break;case c.keyCode==86:pastearea.focus();return true;break;case c.keyCode>=65&&c.keyCode<=90:s=String.fromCharCode(c.keyCode-64);break;case c.keyCode==32:s=String.fromCharCode(0);break;}}else if((!this.is_mac&&c.altKey)||(this.is_mac&&c.metaKey)){if(c.keyCode>=65&&c.keyCode<=90){s="\x1b"+String.fromCharCode(c.keyCode+32);}}break;}if(s){if(c.stopPropagation)c.stopPropagation();if(c.preventDefault)c.preventDefault();this.key_rep_state=1;this.key_rep_str=s;q1.push(s);h();return false;}else{this.key_rep_state=0;return true;}};
kp=function(c){if(input_lock){return false;}if(c.ctrlKey && c.keyCode==86){pastearea.focus();return true;}else{if(c.keyCode!=86 && !c.ctrlKey){if(c.stopPropagation)c.stopPropagation();if(c.preventDefault)c.preventDefault();}}var s,t;s="";if(!("charCode"in c)){t=c.keyCode;if(this.key_rep_state==1){this.key_rep_state=2;return false;}else if(this.key_rep_state==2){q1.push(s);h();return false;}}else{t=c.charCode;}if(t!=0){if(!c.ctrlKey&&((!this.is_mac&&!c.altKey)||(this.is_mac&&!c.metaKey))){s=String.fromCharCode(t);}}if(s){q1.push(s);h();return false;}else{return true;}};
ku=function(c){if(c.keyCode==86 && pastearea.value!=""){var s= pastearea.value;pastearea.value="";q1=q1.join('')+s;q1=q1.split('');h();}}

document.addEventListener("keydown",kd,true);
document.addEventListener("keypress",kp,true);
document.addEventListener("keyup",ku,true);

write("Hello, who are you ?\n",'a',function(){c.style.display='none';c2.style.display='';},50);