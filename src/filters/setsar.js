/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('setsar', {
		render: function(contexts){ return contexts; },
		parse: function(contexts, scope){ return scope; }
});
