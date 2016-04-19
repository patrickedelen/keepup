# keepup
Track and restore YouTube videos lost to DMCA takedown requests. KeepUp was developed during HackDFW 2016 by Patrick Edelen.

# Features
Allows content creators to input their video URL to the service, that video is then downloaded and monitored to see if it has been taken down. If it has, Keepup generates a torrent file and starts seeding the video.

# Planned Features
I tried to implement in-browser torrenting but could not get it to work. Will possibly add that in the future.

# Built With
KeepUp uses Node.js, Mongodb, HTML/CSS, Angular.js, BitTorrent, and the node packages create-torrent, ytdl-core, node-scheduler, and youtube-api-simple.
