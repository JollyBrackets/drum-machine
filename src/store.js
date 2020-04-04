import Vue from 'vue'
import Tone from 'tone'


let resumedAudioContext = false
const resumeAudioContext = () => {
  if (!resumedAudioContext) {
    Tone.context.resume();
    resumedAudioContext = true;
  }
}

const soundNames = [
  'bass',
  'clap',
  'hat2',
  'hey',
  'hihat',
  'kick',
  'loop',
  'loop130',
  'nah',
  'openhihat',
  'snare',
  'sub',
  'yeah',
]

export default new Vue({
  created () {
    this.fetchSounds()

    Tone.Transport.scheduleRepeat((time) => {
      if(this.on) {
        this.tracks.forEach(({ steps, sound }) => {
          const snd = this.sounds.find((s) => s.name === sound);
          if (steps[this.step] === 1) {
            snd.buffer.start(time);
          } else if (steps[this.step] === 2) {
            snd.buffer.start();
            snd.buffer.start('+64n');
            snd.buffer.start('+32n');
          }
        });
        this.step = this.step > 14 ? 0 : this.step + 1
      }
    }, '16n');

  },
  data: {
    bpm: 65,
    on: false,
    step: 0,
    sounds: soundNames.map(name => ({
      name,
      buffer: null,
    })),
    tracks: [
      {
        name: 'Kick',
        sound: 'kick',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Sub1',
        sound: 'sub',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Sub2',
        sound: 'sub',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Snare',
        sound: 'snare',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Clap',
        sound: 'clap',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'HiHat',
        sound: 'hihat',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'OpenHiHat',
        sound: 'openhihat',
        steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }
    ]
  },
  computed: {
    ready() {
      return this.sounds
        .filter(({ buffer }) => buffer === null)
        .length === 0;
    }
  }, 
  methods: {
      setTrackStep({ shiftEnabled, track, step}) {
        const steps = this.tracks[track].steps.slice();
        const val = steps[step] === 0
          ? shiftEnabled
            ? 2
            : 1
          : shiftEnabled && steps[step] === 1
            ? 2
            : 0;
        steps[step] = val;
        this.tracks[track].steps = steps;
      },
      toggleOn() {
        resumeAudioContext();
        this.on = !this.on
        if (this.on) {
          Tone.Transport.bpm.value = this.bpm;
          Tone.Transport.start();
        } else {
          Tone.Transport.stop();
          this.step = 0          
        }
      },
      setBPM(bpm) {
        resumeAudioContext();
        this.bpm = bpm;
        Tone.Transport.bpm.value = this.bpm;
      },
      startSound({ name, volume, loop }) {
        resumeAudioContext();
        const { buffer } = this.sounds.find((s) => s.name === name);
        buffer.volume.value = volume;
        buffer.loop = loop;
        buffer.start();
      },
      stopSound({ name }) {
        resumeAudioContext();
        const { buffer } = this.sounds.find((s) => s.name === name);
        buffer.stop();
      },
      fetchSounds() {
        soundNames.forEach(name => {
          const buffer = new Tone.Player(`sounds/${name}.wav`, () => {
            const sound = this.sounds.find((s) => s.name === name);
            sound.buffer = buffer;
          }).toMaster();
        });
      }
  }
})