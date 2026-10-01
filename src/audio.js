export class AmbientAudio {
  constructor(){this.context=null;this.nodes=[];}
  setEnabled(enabled){if(enabled)this.start();else this.stop();}
  start(){
    if(this.context){this.context.resume();return;}const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
    this.context=new AudioContext();const master=this.context.createGain();master.gain.value=.018;master.connect(this.context.destination);
    [110,164.81,220].forEach((frequency,index)=>{const oscillator=this.context.createOscillator();const gain=this.context.createGain();oscillator.type=index===1?'sine':'triangle';oscillator.frequency.value=frequency;gain.gain.value=1/(index+1);oscillator.connect(gain).connect(master);oscillator.start();this.nodes.push(oscillator);});
  }
  stop(){this.context?.suspend();}
}
