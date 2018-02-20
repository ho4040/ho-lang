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
		{ reg:/^\+/, eval:token=>{return {val:token.val, type:"PLUS"}} },
		{ reg:/^\-/, eval:token=>{return {val:token.val, type:"MINUS"}} },
		{ reg:/^\*/, eval:token=>{return {val:token.val, type:"MULT"}} },
		{ reg:/^\//, eval:token=>{return {val:token.val, type:"DIVID"}} },
		{ reg:/^>=/, eval:token=>{return {val:token.val, type:"GTE"}} },
		{ reg:/^<=/, eval:token=>{return {val:token.val, type:"LTE"}} },
		{ reg:/^==/, eval:token=>{return {val:token.val, type:"EQUAL"}} },
		{ reg:/^!=/, eval:token=>{return {val:token.val, type:"NOTEQUAL"}} },
		{ reg:/^!/, eval:token=>{return {val:token.val, type:"NOT"}} },
		{ reg:/^>/, eval:token=>{return {val:token.val, type:"GT"}} },
		{ reg:/^</, eval:token=>{return {val:token.val, type:"LT"}} },
		{ reg:/^\&/, eval:token=>{return {val:token.val, type:"AND"}} },
		{ reg:/^\|/, eval:token=>{return {val:token.val, type:"OR"}} },
		{ reg:/^\(/, eval:token=>{return {val:token.val, type:"LP"}} },
		{ reg:/^\)/, eval:token=>{return {val:token.val, type:"RP"}} },
		{ reg:/^\{/, eval:token=>{return {val:token.val, type:"LB"}} },
		{ reg:/^\}/, eval:token=>{return {val:token.val, type:"RB"}} },
		{ reg:/^;/, eval:token=>{return {val:token.val, type:"EOS"}} },
		{ reg:/^=/, eval:token=>{return {val:token.val, type:"ASSIGN"}} },
		{ reg:/^\s/, eval:token=>{return null} },
	]

	var grammar = {
		"VARIABLE" : [
			{p:["NUMBER"], 							eval:""},
			{p:["ID"], 								eval:""},
			{p:["VARIABLE", "PLUS", "VARIABLE"], 	eval:""},
			{p:["VARIABLE", "MINUS", "VARIABLE"], 	eval:""},
			{p:["VARIABLE", "MULT", "VARIABLE"], 	eval:""},
			{p:["VARIABLE", "DIVID", "VARIABLE"], 	eval:""},
			{p:["VARIABLE", "MULT", "VARIABLE"], 	eval:""},
			{p:["LP", "VARIABLE", "RP"], 			eval:""},
		],
		"CONDITION" : [
			{p:["VARIABLE", "LT", "VARIABLE"], 			eval:""},
			{p:["VARIABLE", "GT", "VARIABLE"], 			eval:""},
			{p:["VARIABLE", "LTE", "VARIABLE"], 		eval:""},
			{p:["VARIABLE", "GTE", "VARIABLE"], 		eval:""},
			{p:["VARIABLE", "EQUAL", "VARIABLE"], 		eval:""},
			{p:["VARIABLE", "NOTEQUAL", "VARIABLE"], 	eval:""},
			{p:["LP", "CONDITION", "RP"], 				eval:""},
			{p:["NOT", "CONDITION"], 					eval:""},
			{p:["CONDITION", "AND", "CONDITION"], 		eval:""},
			{p:["CONDITION", "OR", "CONDITION"], 		eval:""},
		],
		"SENTENCE" : [
			{p:["VARIABLE", "ASSIGN", "CONDITION", "EOS"], eval:""},
			{p:["VARIABLE", "ASSIGN", "VARIABLE", "EOS"], eval:""},
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
			
		for(var nodeName in grammar)
		{
			var grammars = grammar[nodeName];
			var foundIndex = -1;
			var g = null;						
			
			for(var i=0;i<grammars.length;i++)
			{
				var idx = indexOfSeq(grammars[i].p, types);
				if( idx != -1){
					foundIndex = idx;
					g = grammars[i];
					break;
				}
			}

			if(foundIndex != -1){
				return {
					"type":nodeName,
					"index":foundIndex,
					"grammar":g
				}
			}
		}

		return null;
	}

	var makeNode = function(tokens, grammar){
		var info = findPattern(tokens, grammar);
		console.log(info)
		if(!!info){
			var newNode = {type:info.type}	
			newNode.children = tokens.splice(info.index, info.grammar.p.length, newNode)						
			newNode.grammer = info.grammar;
		}
		return info;
	}


	var makeTree = function(tokens){
		var types = tokens.map(e=>{return e.type;});
		//MAKE NODE UNTIL JUST 1 NODE REMAIN
		do{
			var patternFound = makeNode(tokens, grammar);
			if(tokens.length > 1 && patternFound == null)
				throw Error(tokens.map(e=>{return e.type;}).join(" ")+", >> grammar error");
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
	}

	return {
		tokenize:function(code){
			return tokenize(code)
		},
		makeTree:function(code) {
			return makeTree(tokenize(code))
		},
		run:function(context, code){
			return run(context, code);
		}
	};

}();
