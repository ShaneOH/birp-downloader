const getUrl = (track => {
	const encodedUrl = track.getAttribute('href')

	try {
		return atob(encodedUrl);
	}
	catch (e) {
		return '';
	}
});

const downloadPlaylist = () => {

	const progress = document.createElement('p')
		progress.innerHTML = "Downloading ... 0%";
	const download_playlist_button = document.getElementById('download_playlist_button');
		download_playlist_button.insertAdjacentElement('afterend', progress);

	const title = document.getElementsByTagName("title")[0].innerHTML;
	const zipFileName = title.substr(0, title.indexOf('|')).trim();
	const urls = [];
	const zip = new JSZip();

	for (const track of tracks) {
		url = getUrl(track);
		if (url !== '') urls.push(url);
	}

	let i = 0;
	urls.reduce((prev, url) => {

		return prev.then(() => {
			const songFileName = url.substring(url.lastIndexOf('/') + 1);

			const getSong = fetch(url)
				.then(res => {
					if(res.ok) {
						zip.file(songFileName, res.blob());
					}
					return Promise.resolve();
				})

			i++;
			const percent = Math.round((i / urls.length) * 100);
			progress.innerHTML = "Downloading ... " + percent + "%";

			return getSong;
		})

	}, Promise.resolve())
		.then(() => zip.generateAsync({type:"blob"},
			(metadata) => progress.innerHTML = "Zipping ... " + Math.round(metadata.percent) + "%"))
	 	.then((blob) => saveAs(blob, zipFileName))
		.then(() => progress.innerHTML = "Done! Please support the artists that you enjoy :)");
}

const tracks = document.getElementsByClassName('fap-single-track');
for (const track of tracks) {
	const url = getUrl(track);
	if (url !== '') {
		const download_track_button = document.createElement('a');
			download_track_button.href = url;
			download_track_button.download = track.title;
			download_track_button.target = '_blank';
			download_track_button.textContent = 'Download Track'
			download_track_button.style.color = 'grey';
			download_track_button.style.paddingLeft = '10px';
			track.insertAdjacentElement('afterend', download_track_button);
	}
}

const download_playlist_button = document.createElement('a');
	download_playlist_button.id = "download_playlist_button";
	download_playlist_button.innerHTML = '<a href="">Download Playlist</a>';
	download_playlist_button.addEventListener('click', downloadPlaylist)

const tracklist = document.getElementById('tracklist');
	tracklist.insertAdjacentElement('afterbegin', download_playlist_button);
