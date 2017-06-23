const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

class ChangeListenerProperties {
  execute(context) {
    const { mainPart, listener, properties, oldProperties, sounds } = context;

    if (properties.sound) {
      const oldPhrase = context.oldPhrase = mainPart.getPhrase(listener.id);

      const { sound } = sounds.getSound(properties.sound);

      const phrase = new p5.Phrase(listener.id, (time, playbackRate) => {
        sound.rate(playbackRate);
        sound.play(time);
      }, oldPhrase.sequence);

      mainPart.removePhrase(listener.id);
      mainPart.addPhrase(phrase);
    }
  }

  revert({ mainPart, listener, oldProperties, oldPhrase }) {
    if (oldProperties.sound && oldPhrase) {
      mainPart.removePhrase(listener.id);
      mainPart.addPhrase(oldPhrase);
    }
  }
}

export default ChangeListenerProperties;