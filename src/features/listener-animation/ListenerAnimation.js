import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgCreate from 'tiny-svg/lib/create';
import svgRemove from 'tiny-svg/lib/remove';

class ListenerAnimation {
  constructor(eventBus, canvas, config) {
    const listenerAnimationLayer = canvas.getLayer('gitterListenerAnimation');

    this.circles = [];

    this.updateAnimation();

    eventBus.on('gitter.audio.playSound', ({ listener }) => {
      const { x, y, width } = listener;

      const circle = svgCreate('circle');

      let radius = 20;

      svgAttr(circle, {
        cx: Math.round(x + (width / 2)),
        cy: Math.round(y + (width / 2)),
        r: radius
      });

      svgAttr(circle, {
        stroke: 'none',
        fill: config.emitterColor
      });

      svgAppend(listenerAnimationLayer, circle);

      this.circles.push({
        listener,
        gfx: circle,
        radius,
        created: Date.now()
      });
    });

    eventBus.on('commandStack.shape.delete.postExecuted', ({ context }) => {
      const { shape } = context;

      this.circles.forEach(circle => {
        if (circle.listener === shape) {
          svgRemove(circle.gfx);
        }
      });

      this.circles = this.circles.filter(c => c.listener !== shape);
    });
  }

  updateAnimation() {
    requestAnimationFrame(this.updateAnimation.bind(this));

    this.circles.forEach(circle => {
      circle.radius = Math.max(0, circle.radius - 1);

      svgAttr(circle.gfx, {
        r: circle.radius
      });

      if (Date.now() - circle.created > 500) {
        svgRemove(circle.gfx);

        this.circles = this.circles.filter(c => c !== circle);
      }
    });
  }
}

ListenerAnimation.$inject = [ 'eventBus', 'canvas', 'config' ];

export default ListenerAnimation;
