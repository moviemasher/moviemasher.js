var Constant = {
	audio: 'audio',
	both: 'both',
	effect: 'effect',
	filter: 'filter',
	font: 'font',
	gain: 'gain',
	image: 'image',
	merger: 'merger',
	mute_shorthand: '0',
	mute: '0,0,1,0',
	property_types: {
		rgba: {
			type: String,
			value: '#000000FF',
		},
		rgb: {
			type: String,
			value: '#000000',
		},
		font: {
			type: String,
			value: 'com.moviemasher.font.default',
		},
		fontsize: {
			type: Number,
			value: 13,
		},
		direction4:{
			type: Number,
			values: [0, 1, 2, 3],
			value: 0,
		},
		direction8:{
			type: Number,
			values: [0, 1, 2, 3, 4, 5, 6, 7],
			value: 0,
		},
		string: {
			type: String,
			value: '',
		},
		text: {
			type: String,
			value: '',
		},
	},
	scaler: 'scaler',
	source: 'source',
	theme: 'theme',
	transition: 'transition',
	video: 'video',
	volume: 'volume',
};
Constant.track_types = [Constant.video, Constant.audio];
MovieMasher['Constant'] = Constant;
