const downloadPlaylist = () => {

	const progress = document.createElement('p')
		progress.innerHTML = "Downloading ... 0%";
	const download_button = document.getElementById('download_button');
		download_button.insertAdjacentElement('afterend', progress);

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

	let i = 0;
	urls.reduce((prev, url) => {

		return prev.then(() => {
			const songFileName = url.substring(url.lastIndexOf('/') + 1);
			const promise = fetch(url)
							.then((res) => res.blob())
							.catch((err) => console.log("Error: ", err));

			i++;
			const percent = Math.round((i / urls.length) * 100);
			progress.innerHTML = "Downloading ... " + percent + "%";
			zip.file(songFileName, promise);

			return promise;
		})

	}, Promise.resolve())
		.then(() => zip.generateAsync({type:"blob"},
			(metadata) => progress.innerHTML = "Zipping ... " + Math.round(metadata.percent) + "%"))
	 	.then((blob) => saveAs(blob, zipFileName))
		.then(() => progress.innerHTML = "Done! Please support the artists that you enjoy :)");
}

const download_button = document.createElement('a');
	download_button.id = "download_button";
	download_button.innerHTML = '<a href="">Download Playlist</a>';
	download_button.addEventListener('click', downloadPlaylist)

const tracklist = document.getElementById('tracklist');
	tracklist.insertAdjacentElement('afterbegin', download_button);
