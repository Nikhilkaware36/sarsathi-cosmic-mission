// Optional quiet synthesized transmission; starts only from an explicit click.
export function createTransmission() {
  const context = new AudioContext();
  const master = context.createGain(); master.gain.value = 0.035; master.connect(context.destination);
  const oscillators = [55, 82.4, 110].map((frequency) => {
    const oscillator = context.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    oscillator.connect(master); oscillator.start(); return oscillator;
  });
  return { context, close: () => { oscillators.forEach((o) => o.stop()); void context.close(); } };
}