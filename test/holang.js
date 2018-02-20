////////////////////////////////////////////////////////
// ho-lang 2018
// author : ho4040@nooslab.com
////////////////////////////////////////////////////////
window.holang = function() {

	var lex = [
		//{ reg:/^\$((\.([ㄱ-힣a-zA-Z]+))|(\[[0-9]+\])|(\[("[ㄱ-힣a-zA-Z]+"|'[ㄱ-힣a-zA-Z]+')\]))+/, eval:token=>{return {val:token.val, type:"DOTPATH"}} },
		{ reg:/^-?\d+(\.\d+)?/, eval:token=>{ return {val:Number(token.val), type:"NUMBER" }} },
		{ reg:/^(\"[^"]*\")|(\'[^']*\')/, eval:token=>{return {val:token.val, type:"STRING"}} },
		{ reg:/^[ㄱ-힣a-zA-Z][ㄱ-힣a-zA-Z0-9]*/, eval:token=>{return {val:token.val, type:"ID"}} },
		{ reg:/^\+\+/, eval:token=>{return {val:token.val, type:"++"}} },
		{ reg:/^\-\-/, eval:token=>{return {val:token.val, type:"--"}} },
		{ reg:/^\+\=/, eval:token=>{return {val:token.val, type:"+="}} },
		{ reg:/^\-\=/, eval:token=>{return {val:token.val, type:"-="}} },
		{ reg:/^\/\=/, eval:token=>{return {val:token.val, type:"/="}} },
		{ reg:/^\*\=/, eval:token=>{return {val:token.val, type:"*="}} },
		{ reg:/^\+/, eval:token=>{return {val:token.val, type:"+"}} },
		{ reg:/^\-/, eval:token=>{return {val:token.val, type:"-"}} },
		{ reg:/^\*/, eval:token=>{return {val:token.val, type:"*"}} },
		{ reg:/^\*\*/, eval:token=>{return {val:token.val, type:"**"}} },
		{ reg:/^\%/, eval:token=>{return {val:token.val, type:"%"}} },
		{ reg:/^\//, eval:token=>{return {val:token.val, type:"/"}} },
		{ reg:/^>=/, eval:token=>{return {val:token.val, type:">="}} },
		{ reg:/^<=/, eval:token=>{return {val:token.val, type:"<="}} },
		{ reg:/^==/, eval:token=>{return {val:token.val, type:"=="}} },
		{ reg:/^!=/, eval:token=>{return {val:token.val, type:"!="}} },
		{ reg:/^!/, eval:token=>{return {val:token.val, type:"!"}} },
		{ reg:/^>/, eval:token=>{return {val:token.val, type:">"}} },
		{ reg:/^</, eval:token=>{return {val:token.val, type:"<"}} },
		{ reg:/^\&\&/, eval:token=>{return {val:token.val, type:"&&"}} },
		{ reg:/^\|\|/, eval:token=>{return {val:token.val, type:"||"}} },
		{ reg:/^\(/, eval:token=>{return {val:token.val, type:"("}} },
		{ reg:/^\)/, eval:token=>{return {val:token.val, type:")"}} },
		{ reg:/^\{/, eval:token=>{return {val:token.val, type:"{"}} },
		{ reg:/^\}/, eval:token=>{return {val:token.val, type:"}"}} },
		{ reg:/^\:/, eval:token=>{return {val:token.val, type:":"}} },
		{ reg:/^\?/, eval:token=>{return {val:token.val, type:"?"}} },
		{ reg:/^\=/, eval:token=>{return {val:token.val, type:"="}} },
		{ reg:/^\,/, eval:token=>{return {val:token.val, type:","}} },
		{ reg:/^;/, eval:token=>{return {val:token.val, type:";"}} },
		{ reg:/^\s/, eval:token=>{return null} },
	]

	var grammar = {
		
		"CONDITIONAL_EXPRESSION":[
			{p:["LOGICAL_OR_EXPRESSION"]},
			{p:["LOGICAL_OR_EXPRESSION", "?", "EXPRESSION", ":", "CONDITIONAL_EXPRESSION"]},
		],
		"LOGICAL_OR_EXPRESSION":[
			{p:["LOGICAL_AND_EXPRESSION"]},
			{p:["LOGICAL_OR_EXPRESSION", "||", "LOGICAL_AND_EXPRESSION"]},
		],
		"LOGICAL_AND_EXPRESSION":[
			{p:["EQUALITY_EXPRESSION"]},
			{p:["LOGICAL_AND_EXPRESSION", "&&", "EQUALITY_EXPRESSION"]},
		],
		"EQUALITY_EXPRESSION":[
			{p:["RELATIONAL_EXPRESSION"]},
			{p:["EQUALITY_EXPRESSION", "==", "RELATIONAL_EXPRESSION"]},
			{p:["EQUALITY_EXPRESSION", "!=", "RELATIONAL_EXPRESSION"]},
			
		],
		"RELATIONAL_EXPRESSION":[
			{p:["ADDITIVE_EXPRESSION"]},
			{p:["RELATIONAL_EXPRESSION", "<", "ADDITIVE_EXPRESSION"]},
			{p:["RELATIONAL_EXPRESSION", ">", "ADDITIVE_EXPRESSION"]},
			{p:["RELATIONAL_EXPRESSION", "<=", "ADDITIVE_EXPRESSION"]},
			{p:["RELATIONAL_EXPRESSION", ">=", "ADDITIVE_EXPRESSION"]},
			{p:["!", "RELATIONAL_EXPRESSION"]},
		],
		"ADDITIVE_EXPRESSION":[
			{p:["MULTIPLICATIVE_EXPRESSION"]},
			{p:["ADDITIVE_EXPRESSION", "+", "MULTIPLICATIVE_EXPRESSION"]},
			{p:["ADDITIVE_EXPRESSION", "-", "MULTIPLICATIVE_EXPRESSION"]},
		],
		"MULTIPLICATIVE_EXPRESSION":[
			{p:["UNARY_EXPRESSION"]},
			{p:["MULTIPLICATIVE_EXPRESSION", "**", "UNARY_EXPRESSION"]},
			{p:["MULTIPLICATIVE_EXPRESSION", "*", "UNARY_EXPRESSION"]},
			{p:["MULTIPLICATIVE_EXPRESSION", "/", "UNARY_EXPRESSION"]},
			{p:["MULTIPLICATIVE_EXPRESSION", "%", "UNARY_EXPRESSION"]},
			
		],
		"UNARY_EXPRESSION":[
			{p:["POSTFIX_EXPRESSION"]},
			{p:["--", "UNARY_EXPRESSION"]},
			{p:["++", "UNARY_EXPRESSION"]},
			{p:["-", "MULTIPLICATIVE_EXPRESSION"]},
		],
		"POSTFIX_EXPRESSION":[
			{p:["PRIMARY_EXPRESSION"]},
			{p:["POSTFIX_EXPRESSION", "[", "EXPRESSION", "]"]},
			{p:["POSTFIX_EXPRESSION", "--"]},
			{p:["POSTFIX_EXPRESSION", "++"]},
		],
		"PRIMARY_EXPRESSION":[
			{p:["ID"]},
			{p:["CONSTANT"]},
			{p:["STRING"]},
			{p:["(", "EXPRESSION", ")"]},
		],
		"CONSTANT":[
			{p:["NUMBER"]},
		],
		"EXPRESSION" : [
			{p:["ASSIGNMENT_EXPRESSION"]},
			{p:["EXPRESSION", ",", "ASSIGNMENT_EXPRESSION"]},
		],

		"ASSIGNMENT_EXPRESSION" : [
			{p:["CONDITIONAL_EXPRESSION"]},
			{p:["UNARY_EXPRESSION", "ASSIGNMENT_OPERATOR", "ASSIGNMENT_EXPRESSION"]},
		],
		"ASSIGNMENT_OPERATOR":[
			{p:["="]},
			{p:["*="]},
			{p:["+="]},
			{p:["-="]},
			{p:["/="]},
		]
		
	}

	var tokenize = function( text ){

		var tokens = [];

		var loopLimit = 100;
		while(text.length > 0 && loopLimit > 0){

			loopLimit--;

			for(var i=0; i<lex.length; i++){

				var l = lex[i];
				var word = "";
				var index = -1;

				if(!!text.match(l.reg)){
					var matched = text.match(l.reg)			
					index = matched.index;
					word = matched[0];
				}
				
				if(index == 0)
					break;
			}

			if( i != lex.length )
			{
				//console.log(word, ">>", l);
				var token = l.eval({val:word})
				if(!!token)
					tokens.push(token);
				text = text.substring(word.length, text.length);
			}
			else
				throw Error("Invalid character found! >> " + text);
		}

		return tokens;	
	}

	var indexOfSeq = function(needle, heystack){
		if(needle.length > heystack.length)
			return -1;
		for(var i=0;i<=heystack.length-needle.length;i++)
		{
			for(var j=0; j<needle.length; j++)
			{			
				if(heystack[i+j] != needle[j]){
					break;
				}
			}

			if(needle.length == j) //All matched
				return i;
		}
		return -1;
	}

	var findPattern = function(tokens, grammar) {

		var types = tokens.map(e=>{return e.type;});

		var found = []

		for(var nodeName in grammar)
		{
			var grammars = grammar[nodeName];

			for(var i=0;i<grammars.length;i++)
			{
				var idx = indexOfSeq(grammars[i].p, types);
				if( idx != -1)
				{
					found.push({
						"type":nodeName,
						"index":idx,
						"grammar":grammars[i]
					});
				}

			}

		}

		return found;
	}

	var makeNode = function(tokens, grammar){
		var infoList = findPattern(tokens, grammar);
		var mostShallow = null;
		for(var i in infoList)
		{
			var info = infoList[i];

			var children = tokens.slice(info.index, info.index+info.grammar.p.length)
			info.depth = Math.max(...children.map(e=>{ return (('depth' in e)?e.depth:0); }))
			info.children = children;
			
			if(mostShallow == null || (mostShallow.depth >= info.depth))
			{
				if(mostShallow == null)
					mostShallow = info;
				else if(mostShallow.depth > info.depth)
					mostShallow = info;
				else if(mostShallow.grammar.p.length < info.grammar.p.length)
					mostShallow = info;
				else {
					//None
				}

			}
		}

		console.log(tokens.map(e=>{return e.type;}), infoList)


		var info = mostShallow;
		var newNode = { type:info.type }	
		newNode.children = tokens.splice(info.index, info.grammar.p.length, newNode)
		newNode.grammar = info.grammar;
		newNode.depth = info.depth+1;

		return info;
	}


	var makeTree = function(tokens, tryLimit){
		
		if(!tryLimit)
			tryLimit = -1;
		//MAKE NODE UNTIL JUST 1 NODE REMAIN
		do
		{
			var patternFound = makeNode(tokens, grammar);


			if(tokens.length > 1 && patternFound == null)
				throw Error(tokens.map(e=>{return e.type;}).join(" ")+", >> grammar error");
			
			if(tryLimit == 0)
				break;
			tryLimit--;

		}while( tokens.length > 1 && patternFound != null)
		
		return tokens;
	}


	var visit = function(node) {

		if(!node.grammer)
			return;

		if( !!node.children && node.children.length > 0 ){
			for(var i in node.children)
				visit(node.children[i])
		}

		console.log(node.grammer.eval)
	}

	var run = function(context, code) {
		var tree = makeTree(tokenize(code));		
		return tree;
	}

	return {
		tokenize:function(code){
			return tokenize(code)
		},
		makeTree:function(code, tryLimit) {
			return makeTree(tokenize(code), tryLimit)
		},
		run:function(context, code){
			return run(context, code);
		}
	};

}();
