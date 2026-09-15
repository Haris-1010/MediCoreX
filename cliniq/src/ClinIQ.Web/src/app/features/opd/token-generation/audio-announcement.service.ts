import { Injectable } from '@angular/core';

@Injectable()
export class AudioAnnouncementService {
  private isSpeaking = false;

  speak(text: string): void {
    if (this.isSpeaking) {
      this.stop();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      console.error('Speech error:', e);
    };

    this.isSpeaking = true;
    speechSynthesis.speak(utterance);
  }

  speakToken(tokenNumber: number, patientName: string, doctorName: string): void {
    let message = `Token number ${tokenNumber}, ${patientName}`;
    if (doctorName) {
      message += `, please proceed to Dr. ${doctorName}`;
    } else {
      message += `, please proceed`;
    }
    this.speak(message);
  }

  stop(): void {
    speechSynthesis.cancel();
    this.isSpeaking = false;
  }

  get speaking(): boolean {
    return this.isSpeaking;
  }
}
