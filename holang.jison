
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"-="                  return '-='
"+="                  return '+='
"/="                  return '/='
"*="                  return '*='
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!="                  return '!='
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
"&&"                  return '&&'
"||"                  return '||'
"{"                   return '{'
"}"                   return '}'
"<"                   return '<'
">"                   return '>'
"<="                  return '<='
">="                  return '>='
"=="                  return '=='
"="                   return '='
";"                   return ';'
"true"                return 'TRUE'
"false"               return 'FALSE'
"PI"                  return 'PI'
"E"                   return 'E'
[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣0-9]* return 'ID'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left ';'
%right '=', '/=', '*=', '-=', '+='
%left '&&' '||'
%left LOGICAL_COMPAPRE
%left '>' '<' '>=' '<=' '==' '!='
%left NOT
%left '+' '-'
%left '*' '/'
%left '^'
%right '%'
%left UMINUS


%start program


%{
var _ctx = {};
var _debug = function(v){ 
    //console.log(v); 
};

parser.setContext = function(ctx){
  _ctx = ctx;
}
parser.getContext = function(){
  return _ctx;
}

%}

%% /* language grammar */

program : l EOF
        { $$ = $1; /*console.log('Result:'); console.log(JSON.stringify(_ctx, null, 4))*/ }
        ;

l  : s
       { $$ = $1; _debug('l->s'); }
   | l s 
       { $$ = $2; _debug('l->l s'); }
   ;

s : ID '=' c ';'
          { $$ = $1; _ctx[$1]=$3; _debug("s -> ID=c"); }
      | ID '=' e ';'
          { $$ = $1; _ctx[$1]=$3; _debug("s -> ID=e"); }
      | ID '+=' e ';'
          { _ctx[$1]+=$3; $$ = _ctx[$1]; _debug("s -> ID+=e"); }
      | ID '-=' e ';'
          { _ctx[$1]-=$3; $$ = _ctx[$1]; _debug("s -> ID-=e"); }
      | ID '*=' e ';'
          { _ctx[$1]*=$3; $$ = _ctx[$1]; _debug("s -> ID*=e"); }
      | ID '/=' e ';'
          { _ctx[$1]/=$3; $$ = _ctx[$1]; _debug("s -> ID/=e"); }
      | e ';'
          { $$ = $1; _debug("s -> e"); }
      | c ';'
          { $$ = $1; _debug("s -> c"); }
      ;

c   :  c '||' c
        { $$ = ($1 || $3); _debug("c -> c||c");}
    |  c '&&' c
        { $$ = $1 && $3; _debug("c -> c&&c");}
    |  '(' c ')'
        { $$ = $2; _debug("c -> (c)");}
    |  '!' c %prec NOT
        { $$ = !$2; _debug("c -> !c");}
    |  e '>' e
        { $$ = $1 > $3; _debug("c -> e>e");}
    |  e '<' e
        { $$ = $1 < $3; _debug("c -> e<e");}
    |  e '>=' e
        { $$ = $1 >= $3; _debug("c -> e>=e");}
    |  e '<=' e
        { $$ = $1 <= $3; _debug("c -> e<=e");}
    |  c '==' c %prec LOGICAL_COMPAPRE
        { $$ = $1 == $3; _debug("c -> c==c");}
    |  c '!=' c %prec LOGICAL_COMPAPRE
        { $$ = $1 != $3; _debug("c -> c!=c");}
    |  e '==' e
        { $$ = $1 == $3; _debug("c -> e==e");}
    |  e '!=' e
        { $$ = $1 != $3; _debug("c -> e!=e");}
    |   TRUE
        { $$ = true; _debug("c -> TRUE");}
    |   FALSE
        { $$ = false; _debug("c -> FALSE");}
    ;

e
    : e '+' e
        {$$ = $1+$3; _debug("e->e+e");}
    | e '-' e
        {$$ = $1-$3; _debug("e->e-e");}
    | e '*' e
        {$$ = $1*$3; _debug("e->e*e");}
    | e '/' e
        {$$ = $1/$3; _debug("e->e/e");}
    | e '^' e
        {$$ = Math.pow($1, $3); _debug("e->e^e");}
    | e '%' e
        {$$ = $1 % $3; _debug("e->e%e");}
    | '-' e %prec UMINUS
        {$$ = -$2; _debug("e->-e");}
    | '(' e ')'
        {$$ = $2; _debug("e->(e)");}
    | NUMBER
        {$$ = Number(yytext); _debug("e->NUMBER");}
    | E
        {$$ = Math.E; _debug("e->E");}
    | PI
        {$$ = Math.PI;  _debug("e->PI");}
    | ID
        {$$ = _ctx[yytext]; _debug("e->ID"); }
    ;
