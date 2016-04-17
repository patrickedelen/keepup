// routes.js - routes for webapp

//require video
var Video = require('./models/video.js');

//require youtube downloader and torrent creator
var fs = require('fs');
var ytdl = require('ytdl-core');
var createTorrent = require('create-torrent');

//require youtube api
var ytapi = require('youtube-api-simple');
var youtube = ytapi({
	api: 'AIzaSyDI1kbpKt_vku6CTgjRnh0iZmLmSBYLgMY',
	uri: 'https://www.googleapis.com/youtube/v3/'
});



module.exports = function(app) {
	//allow cross region resource sharing
	app.all('/all', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	 });

	//add a video
	app.post('/add', function(req, res) {
		//create new video
		var video = new Video();

		var vUrl = req.body.url;
		var id = vUrl.split("=")[1];
		var title = '';

		//find title of youtube video
		youtube.videos().list({
			part: 'snippet',
			id: id
		}).then(function(data) {
			var d = JSON.parse(data);
			title = d.items[0].snippet.title;

			//save video with ytdl
			console.log('Saving ' + title);
			ytdl(vUrl, { filter: function(format) { return format.container === 'mp4'; } })
	  			.pipe(fs.createWriteStream('./views/public/videos' + title + '.mp4'));
			console.log('Finished saving...');

			//save to MongoDB
			video.url = vUrl;
			video.title = title;
			video.date = Date.now();
			video.status = true;

			//save db entry
			video.save(function(err) {
				if(err)
					res.send(err);

				res.send("Video added!");
			});
		});
		 
	});

	//see all videos
	app.get('/all', function(req, res){
		Video.find(function(err, videos) {
			if(err)
				res.send(err);

			res.json(videos);
		});
	});

	//stand-in API until I implement the scheduling
	app.get('/check', function(req, res){

		//checking the entire collection
		Video.find(function(err, cursor){
			if(err)
				res.send(err);

			//send request to see if video is up
			cursor.forEach(function(video){
				
				if(video.status){
					console.log('Checking ' + video.title);
					
					//find if video is available

					var vUrl = video.url;
					var id = vUrl.split("=")[1];

					youtube.videos().list({
						part: 'status',
						id: id
					}).then(function(data) {
						var d = JSON.parse(data);
						var status = d.items[0].status.uploadStatus;
						console.log(status);
						
						if(!status==='processed'){
							//change file status
							video.status = false;
							video.save(function(err) {
								if(err)
									console.log(err);
							});

							//create torrent
							var localPath = './app/videos/' + video.title + '.mp4';
							createTorrent(localPath, function(err, torrent) {
								if(err) {
									console.log(err);
								} else {
									var tName = './app/torrents/' + video.title + '.torrent';
									fs.writeFile(tName, torrent);
								}
							});
						}

					});
				}

			});
			//end checking videos

		});

		res.send('hi');
	});

}