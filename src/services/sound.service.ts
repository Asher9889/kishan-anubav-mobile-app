// src/services/SoundService.ts

import { AudioPlayer, createAudioPlayer } from "expo-audio";

class SoundService {
  private players = new Map<string, AudioPlayer>();

  async load() {
    this.players.set(
      "connected",
      createAudioPlayer(require("@/assets/sound/connected.mp3"))
    ); 
  }

  play(name: string) {
    const player = this.players.get(name);

    if (!player) return;

    player.seekTo(0);
    player.play();
  }
}

const soundService = new SoundService();
export default soundService;