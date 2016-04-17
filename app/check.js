//connect to video
var Video = require('./models/video.js');

//torrent creating
var fs = require('fs');
var createTorrent = require('create-torrent');

//require youtube api
var ytapi = require('youtube-api-simple');
var youtube = ytapi({
	api: 'AIzaSyDI1kbpKt_vku6CTgjRnh0iZmLmSBYLgMY',
	uri: 'https://www.googleapis.com/youtube/v3/'
});

module.exports = function() {
	//checking the entire collection
		Video.find(function(err, cursor){
			if(err)
				console.log(err);

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
						if(d.pageInfo.totalResults === 0){
             console.log("Alert! Video removed!");
            //change file status
							video.status = false;
							video.save(function(err) {
								if(err)
									console.log(err);
							});

							//create torrent
							var localPath = './views/public/' + video.title + '.mp4';
							createTorrent(localPath, function(err, torrent) {
								if(err) {
									console.log(err);
								} else {
									var tName = './views/public/' + video.title + '.torrent';
									fs.writeFile(tName, torrent);
								}
							});
						}else if(!d.items[0].status.uploadStatus==='processed'){
              console.log("Alert! Video removed!");
							//change file status
							video.status = false;
							video.save(function(err) {
								if(err)
									console.log(err);
							});

							//create torrent
							var localPath = './views/public/' + video.title + '.mp4';
							createTorrent(localPath, function(err, torrent) {
								if(err) {
									console.log(err);
								} else {
									var tName = './views/public/' + video.title + '.torrent';
									fs.writeFile(tName, torrent);
								}
							});
						}

					});
				}

			});
			//end checking videos

		});
}