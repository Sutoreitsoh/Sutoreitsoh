document.addEventListener('DOMContentLoaded', (event) => {
    // --- Random Background Video (local files for audio enhancement) ---
    const videos = [
        "img/beztebyabottomfarger.mp4",
        "img/hvh.mp4",
        "img/space.mp4"
    ];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const videoElement = document.getElementById('background-video');
    if (videoElement) {
        const sourceElement = videoElement.querySelector('source');
        if (sourceElement) {
            sourceElement.src = randomVideo;
        } else {
            videoElement.src = randomVideo;
        }
        videoElement.load();
        console.log("🎬 Video selected:", randomVideo);

        videoElement.addEventListener('error', function (e) {
            console.error("❌ Video error:", e);
        });
    }

    let title = "Sutoreitso";
    let currentTitle = "";
    let direction = 1;
    let index = 0;

    setInterval(() => {
        if (direction === 1) {
            currentTitle += title[index];
            if (index === title.length - 1) {
                direction = -1;
            } else {
                index++;
            }
        } else {
            currentTitle = currentTitle.slice(0, -1);
            if (index === 0) {
                direction = 1;
            } else {
                index--;
            }
        }
        document.title = "/" + currentTitle;
    }, 1000);


    // --- Falling  Text ---
    const creepyTexts = [
        "...",
        "watching",
        "silence",
        "void",
        "lost",
        "forgotten",
        "hollow",
        "whispers",
        "darkness",
        "fading",
        "eternal",
        "shadows",
        "decay",
        "emptiness",
        "nowhere",
        "help",
        "run",
        "behind you"
    ];

    function createFallingText() {
        const text = document.createElement('div');
        text.className = 'falling-text';
        text.textContent = creepyTexts[Math.floor(Math.random() * creepyTexts.length)];
        text.style.left = Math.random() * 90 + 5 + 'vw';
        text.style.animationDuration = (Math.random() * 6 + 8) + 's';
        document.body.appendChild(text);

        setTimeout(() => {
            text.remove();
        }, 15000);
    }

    setInterval(createFallingText, 3000);

    document.querySelector('.button').addEventListener('click', function () {
        const video = document.getElementById('background-video');

        // Audio enhancement for local videos
        if (video && window.location.protocol !== 'file:') {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioContext();

                if (!video.crossOrigin) {
                    video.crossOrigin = "anonymous";
                }

                const source = audioCtx.createMediaElementSource(video);

                // Create Impulse Response for Reverb
                function createImpulseResponse(audioContext, duration, decay) {
                    const sampleRate = audioContext.sampleRate;
                    const length = sampleRate * duration;
                    const impulse = audioContext.createBuffer(2, length, sampleRate);

                    for (let channel = 0; channel < 2; channel++) {
                        const channelData = impulse.getChannelData(channel);
                        for (let i = 0; i < length; i++) {
                            const envelope = Math.pow(1 - i / length, decay);
                            const earlyReflections = i < length * 0.1 ? Math.random() * 0.5 : 0;
                            const diffusion = (Math.random() * 2 - 1) * envelope;
                            const stereoWidth = channel === 0 ? 0.9 : 1.1;
                            channelData[i] = (diffusion + earlyReflections) * stereoWidth * 0.8;
                        }
                    }
                    return impulse;
                }

                // 1. Convolver (Reverb) - Longer duration for atmospheric feel
                const convolver = audioCtx.createConvolver();
                convolver.buffer = createImpulseResponse(audioCtx, 6, 1.5);

                // 2. Delay with Feedback - Ambience Mode values
                const delay = audioCtx.createDelay(2);
                delay.delayTime.value = 0.25; // Ambience: 0.25s

                const feedback = audioCtx.createGain();
                feedback.gain.value = 0.25; // Ambience: 0.25

                // 3. Filters
                const lowPassFilter = audioCtx.createBiquadFilter();
                lowPassFilter.type = "lowpass";
                lowPassFilter.frequency.value = 800; // Ambience: 800 Hz
                lowPassFilter.Q.value = 0.7;

                const highPassFilter = audioCtx.createBiquadFilter();
                highPassFilter.type = "highpass";
                highPassFilter.frequency.value = 200; // Ambience: 200 Hz
                highPassFilter.Q.value = 0.7;

                // 4. Wet/Dry Gains
                const wetGain = audioCtx.createGain();
                wetGain.gain.value = 0.7; // Ambience: 0.7 (effet)

                const dryGain = audioCtx.createGain();
                dryGain.gain.value = 0.5; // Ambience: 0.5 (son original)

                const masterGain = audioCtx.createGain();
                masterGain.gain.value = 1.2; // Ambience: 1.2

                // 5. Compressor - Tighter for broadcast presence
                const compressor = audioCtx.createDynamicsCompressor();
                compressor.threshold.value = -12;
                compressor.knee.value = 2;
                compressor.ratio.value = 8;
                compressor.attack.value = 0.003;
                compressor.release.value = 0.1;

                // --- Routing ---
                // Dry path (original sound)
                source.connect(dryGain);
                dryGain.connect(masterGain);

                // Wet path (reverb + delay)
                source.connect(highPassFilter);
                highPassFilter.connect(convolver);
                convolver.connect(delay);

                delay.connect(feedback);
                feedback.connect(lowPassFilter);
                lowPassFilter.connect(delay);

                delay.connect(wetGain);
                wetGain.connect(masterGain);

                // Final output
                masterGain.connect(compressor);
                compressor.connect(audioCtx.destination);

                // Resume context if suspended (browser policy)
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }

            } catch (e) {
                console.error("Web Audio API AudioContext failed or blocked (likely CORS/file protocol):", e);
            }
        }

        let noise = document.getElementById('noise');
        if (noise) {
            noise.muted = false;
            noise.play();
        }

        let enter = document.getElementById('enter');
        if (enter) {
            enter.muted = false;
            enter.play();
        }

        setTimeout(() => {
            this.style.display = 'none';
        }, 800);

        document.body.classList.add('transition-to-video');

        setTimeout(() => {
            this.style.display = 'none';
            document.body.classList.remove('transition-to-video');

            if (video) {
                video.style.display = 'block';
                video.muted = false;
                document.querySelector('.overlay').style.display = 'block';
                document.querySelector('.mute-button').style.display = 'block';
                video.classList.add('show');
                video.play();
            }
        }, 800);
    });

    let muteButton = document.getElementById('mute-button');
    if (muteButton) {
        muteButton.addEventListener('click', function () {
            let video = document.getElementById('background-video');
            if (video) {
                video.muted = !video.muted;
                let img = muteButton.querySelector('img');
                if (img) {
                    img.src = video.muted ? './img/mute.png' : './img/unmute.png';
                }
            }
        });
    }
});