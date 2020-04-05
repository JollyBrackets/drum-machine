<template>
  <v-app>
    <v-container v-if="ready">
      <v-row class="my-5" align="baseline">
        <v-col>
          <v-btn fab @click="toggle">
            <v-icon>{{ Tone.Transport.state === 'started' ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <v-slider
            v-model="Tone.Transport.bpm.value"
            :min="60"
            :max="180"
            :step="5"
            thumb-label
            label="BPM"
          />
        </v-col>

        <v-col>
          <v-select
            v-model="preset"
            @change="setPreset"
            :items="Object.keys(presets)"
            label="Preset"
            outlined
          />
        </v-col>
      </v-row>

      <v-row v-for="track in tracks" :key="track.name">
        <v-col style="min-width: 150px">
          <v-btn text @click="track.player.start()">{{ track.name }}</v-btn>
        </v-col>

        <v-col
          v-for="(active, i) in track.steps"
          :key="`${track.name}-${i}`"
          :class="{ 'grey darken-3': position === i}"
        >
          <v-card
            style="height: 100%; width: 100%"
            class="primary"
            :style="{ opacity: active ? 1 : 0.2 }"
            :class="{ 'accent': (i > 3 && i < 8) || (i > 11 && i < 16) }"
            @click="track.steps.splice(i, 1, active ? 0 : 1)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Tone from "tone";

export default {
  name: "app",
  created() {
    // Dark Mode
    this.$vuetify.theme.dark = true;

    // Listen for Space Key
    window.addEventListener("keyup", e => {
      if (e.keyCode == 32) this.toggle();
    });

    // Setup Transport
    Tone.Transport.scheduleRepeat(time => {
      this.tracks.forEach(({ steps, player }) => {
        if (steps[this.position]) player.start(time);
      });
      this.position = (this.position + 1) % 16;
    }, "16n");

    Tone.Transport.bpm.value = 60;
    this.setPreset("Rock 1");
  },
  data: () => ({
    position: 0,
    tracks: [],
    Tone,
    preset: "Rock 1",
    presets: {
      //         1     &       2     &      3     &       4     &  
      Empty: {
        kick:   [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0],
        sub:    [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0],
        snare:  [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0],
        clap:   [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0],
        hihat:  [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0],
        ohihat: [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0],
        bass:   [0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0]
      },      
      "Rock 1": {     
        hihat:  [1, 0, 1, 0,   1, 0, 1, 0,  1, 0, 1, 0,   1, 0, 1, 0],
        snare:  [0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0],
        kick:   [1, 0, 0, 0,   0, 0, 0, 0,  1, 0, 0, 0,   0, 0, 0, 0],
      },      
      "Rock 2": {     
        hihat:  [1, 0, 1, 0,   1, 0, 1, 0,  1, 0, 1, 0,   1, 0, 1, 0],
        snare:  [0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0],
        kick:   [1, 0, 0, 0,   0, 0, 0, 0,  0, 0, 1, 0,   0, 0, 0, 0],
      },
      "Rock 3": {     
        hihat:  [1, 0, 1, 0,   1, 0, 1, 0,  1, 0, 1, 0,   1, 0, 1, 0],
        snare:  [0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0],
        kick:   [1, 0, 0, 0,   0, 0, 1, 0,  0, 0, 1, 0,   0, 0, 0, 0],
      },
      "Rock 4": {     
        hihat:  [1, 0, 1, 0,   1, 0, 1, 0,  1, 0, 1, 0,   1, 0, 1, 0],
        snare:  [0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 1, 0],
        kick:   [1, 0, 0, 0,   0, 0, 0, 0,  1, 0, 1, 0,   0, 0, 0, 0],
      },
      "Rock 5": {     
        hihat:  [1, 0, 1, 0,   1, 0, 1, 0,  1, 0, 1, 0,   1, 0, 1, 0],
        snare:  [0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0],
        kick:   [1, 0, 1, 0,   0, 0, 1, 0,  1, 0, 1, 0,   0, 0, 1, 0],
      },
    }
  }),
  computed: {
    ready() {
      return this.tracks.every(track => track.player);
    },
  },
  methods: {
    toggle() {
      Tone.context.resume();
      Tone.Transport.toggle();
    },
    setPreset(preset) {
      this.tracks = Object.keys(this.presets[preset]).map(name => ({
        name,
        steps: this.presets[preset][name],
        player: new Tone.Player(`sounds/${name}.wav`).toMaster()
      }));
    }
  }
};
</script>
