const downloadPlaylist = () => {

	const tracks = document.getElementsByClassName('fap-single-track');
	const title = document.getElementsByTagName("title")[0].innerHTML;
	const zipFileName = title.substr(0, title.indexOf('|')).trim();
	const urls = [];
	const zip = new JSZip();

	for (const track of tracks) {
		const encodedUrl = track.getAttribute('href')

		try {
			urls.push(atob(encodedUrl));
		}
		catch (e) {
			continue;
		}
	}

	urls.reduce((prev, url) => {

		return prev.then(() => {
			const songFileName = url.substring(url.lastIndexOf('/') + 1);
			const promise = fetch(url)
							.then((res) => res.blob())
							.catch((err) => console.log("Error: ", err));

			zip.file(songFileName, promise);

			return promise;
		})

	}, Promise.resolve())
		.then(() => zip.generateAsync({type:"blob"}))
	 	.then((blob) => saveAs(blob, zipFileName));
}

const download_button = document.createElement('a');
	download_button.innerHTML = '<a href="#">Download Playlist</a>';
	download_button.addEventListener('click', downloadPlaylist)

const tracklist = document.getElementById('tracklist');
	tracklist.insertAdjacentElement('afterbegin', download_button);
