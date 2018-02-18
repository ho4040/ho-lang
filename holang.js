var tokenize = function( text ){

	var tokens = [];

	var lex = [
		{ reg:/^-?\d+(\.\d+)?/, eval:token=>{ return {val:Number(token.val), type:"NUMBER" }} },
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
		{ reg:/^;/, eval:token=>{return {val:token.val, type:"EOS"}} },
		{ reg:/^=/, eval:token=>{return {val:token.val, type:"ASSIGN"}} },
		{ reg:/^\s/, eval:token=>{  return null } },
	]
	
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


var makeTree = function(tokens){

	var grammar = {
		"VARIABLE" : [
						["NUMBER"],
						["ID"],
						["VARIABLE", "PLUS", "VARIABLE"],
						["VARIABLE", "MINUS", "VARIABLE"],
						["VARIABLE", "MULT", "VARIABLE"],
						["VARIABLE", "DIVID", "VARIABLE"],
						["VARIABLE", "MULT", "VARIABLE"],
						["LP", "VARIABLE", "RP"]
		],
		"CONDITION" : [
						["VARIABLE", "LT", "VARIABLE"],
						["VARIABLE", "GT", "VARIABLE"],
						["VARIABLE", "LTE", "VARIABLE"],
						["VARIABLE", "GTE", "VARIABLE"],
						["VARIABLE", "EQUAL", "VARIABLE"],
						["VARIABLE", "NOTEQUAL", "VARIABLE"],						
						["LP", "CONDITION", "RP"],
						["NOT", "CONDITION"],
						["CONDITION", "AND", "CONDITION"],
						["CONDITION", "OR", "CONDITION"]
		],
		"SENTENCE" : [
						["ID", "ASSIGN", "CONDITION", "EOS"],
						["ID", "ASSIGN", "VARIABLE", "EOS"]
		],
	}

	var types = tokens.map(e=>{return e.type;});
	//console.log(types);


	var findPattern = function(tokens, grammar) {

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

		var types = tokens.map(e=>{return e.type;});
			
		for(var nodeName in grammar)
		{
			var grammars = grammar[nodeName];
			var foundIndex = -1;
			var g = null;						
			
			for(var i=0;i<grammars.length;i++)
			{
				var idx = indexOfSeq(grammars[i], types);
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
		if(!!info){
			var newNode = {type:info.type}	
			newNode.children = tokens.splice(info.index, info.grammar.length, newNode)			
			newNode.grammer = info.grammar.slice(0, info.grammar.length).join("_");
		}
		return info;
	}


	//MAKE NODE UNTIL JUST 1 NODE REMAIN
	do{
		var patternFound = makeNode(tokens, grammar);
		if(tokens.length > 1 && patternFound == null)
			throw Error(tokens.map(e=>{return e.type;}).join(" ")+", >> grammar error");
	}while( tokens.length > 1 && patternFound != null)
	
	return tokens;
}


window.holang = {
	parse:function(text) {
		return makeTree(tokenize(text))
	},
	run:function(tree){
		return "blabla";
	}
};
