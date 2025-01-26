const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const seekBar = document.getElementById('seek-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playlist = document.getElementById('playlist');
const fileUpload = document.getElementById('file-upload');

let isShuffling = false;
let isRepeating = false;
let currentTrackIndex = 0;
let tracks = [];

volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  seekBar.max = Math.floor(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  seekBar.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
  audio.currentTime = seekBar.value;
});

playBtn.addEventListener('click', () => {
  audio.play();
});

pauseBtn.addEventListener('click', () => {
  audio.pause();
});

audio.addEventListener('playing', () => {
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
  console.log("Music is playing");
});

audio.addEventListener('pause', () => {
  playBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
  console.log("Music is paused");
});

fileUpload.addEventListener('change', (event) => {
  const files = event.target.files;
  tracks = Array.from(files);
  loadPlaylist();
});

function loadPlaylist() {
  playlist.innerHTML = '';
  tracks.forEach((file, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = file.name;
    listItem.dataset.index = index;
    playlist.appendChild(listItem);

    listItem.addEventListener('click', () => {
      currentTrackIndex = index;
      playTrack(file);
    });
  });
}

function playTrack(file) {
  audio.src = URL.createObjectURL(file);
  audio.play();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';

  document.getElementById('track-title').textContent = `Now Playing: ${file.name}`;
}

function playNextTrack() {
  currentTrackIndex = isShuffling ? getRandomIndex() : (currentTrackIndex + 1) % tracks.length;
  playTrack(tracks[currentTrackIndex]);
}

function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  playTrack(tracks[currentTrackIndex]);
}

function getRandomIndex() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * tracks.length);
  } while (randomIndex === currentTrackIndex);
  return randomIndex;
}

nextBtn.addEventListener('click', playNextTrack);
prevBtn.addEventListener('click', playPrevTrack);

shuffleBtn.addEventListener('click', () => {
  isShuffling = !isShuffling;
  shuffleBtn.style.backgroundColor = isShuffling ? '#1ed760' : '#1db954';
});

repeatBtn.addEventListener('click', () => {
  isRepeating = !isRepeating;
  repeatBtn.style.backgroundColor = isRepeating ? '#1ed760' : '#1db954';
});

audio.addEventListener('ended', () => {
  if (isRepeating) {
    audio.currentTime = 0;
    audio.play();
  } else {
    playNextTrack();
  }
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsPart = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secondsPart}`;
}
