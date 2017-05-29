const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import AddSequenceHandler from './cmd/AddSequenceHandler';

import { isRoot, isEmitter, isListener } from '../util/GitterUtil';

class Audio extends CommandInterceptor {
  constructor(commandStack, elementRegistry, eventBus, sounds) {
    super(eventBus);

    window.p5 = p5;

    this._commandStack = commandStack;
    this._elementRegistry = elementRegistry;
    this._sounds = sounds;

    commandStack.registerHandler('gitter.audio.addSequence', AddSequenceHandler);

    this.phrases = {};

    this.mainPart = new p5.Part(16);
    this.mainPart.loop();
    this.mainPart.start();

    eventBus.on('propertiesPanel.tempoInput', ({ tempo }) => {
      this.mainPart.setBPM(tempo);
    });

    this.postExecute('gitter.changeProperties', ({ context }) => {
      const { element, properties } = context;

      if (isRoot(element)) {
        this.mainPart.setBPM(properties.tempo);
      }
    });

    this.reverted('gitter.changeProperties', ({ context }) => {
      const { element, oldProperties } = context;

      if (isRoot(element)) {
        this.mainPart.setBPM(oldProperties.tempo);
      }
    });
  }

  addSequence(sequence, emitter, listener) {
    const { sound } = this._sounds.getSound(listener.sound);

    this._commandStack.execute('gitter.audio.addSequence', {
      sequence,
      emitter,
      listener,
      phrases: this.phrases,
      mainPart: this.mainPart,
      sound
    });
  }

  removeSequence(emitter, listener) {

  }

  updateSequence(sequence, emitter, listener) {

  }

  hasSequence(emitter, listener) {

  }
}

Audio.$inject = [ 'commandStack', 'elementRegistry', 'eventBus', 'sounds' ];

// export default doesn't work
module.exports = Audio;