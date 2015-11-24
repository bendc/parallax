document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const icons = Object.freeze([...document.getElementsByClassName("parallax")]);
  const threshold = .2;
  const perspective = 800;

  const isLast = (arr, el) => [...arr].pop() === el;

  const centerLayers = (icon, layers) => {
    const sizes = layers.map(layer => {
      const rect = layer.getBoundingClientRect();
      return Object.freeze({
        width: rect.width,
        height: rect.height
      });
    });

    layers.forEach((layer, index) => {
      const size = sizes[index];
      layer.style.position = "absolute";
      layer.style.top = `calc(50% - ${size.height / 2}px)`;
      layer.style.left = `calc(50% - ${size.width / 2}px)`;
    });

    icon.style.overflow = "hidden";
    if (getComputedStyle(icon).getPropertyValue("position") != "static") return;
    icon.style.position = "relative";
  };

  const getParallax = (event, coordinates, level) => {
    const cursor = Object.freeze({
      x: (event.clientX - coordinates.left) - (coordinates.width / 2),
      y: (event.clientY - coordinates.top) - (coordinates.height / 2)
    });

    const limit = 1 - level * threshold;

    return Object.freeze({
      x: cursor.x * (1 - Math.abs(cursor.x) / coordinates.width) * threshold * limit,
      y: cursor.y * (1 - Math.abs(cursor.y) / coordinates.height) * threshold * limit
    });
  };

  const setParallax = icon => {
    const coordinates = icon.getBoundingClientRect();
    const layers = Object.freeze([...icon.getElementsByTagName("img")]);

    const hover = event =>
      layers.forEach((layer, level) => {
        const {x, y} = getParallax(event, coordinates, level);
        layer.style.transform = `translate(${x}px, ${y}px)`;
        if (!isLast(layers, layer)) return;
        icon.style.transform = `perspective(${perspective}px) rotateX(${y}deg) rotateY(${-x}deg)`;
      });

    const events = Object.freeze({
      enter: event => {
        const easing = "easeOutQuad";
        const duration = 150;
        animate.stop([icon, ...layers]);
        layers.forEach((layer, level) => {
          const {x, y} = getParallax(event, coordinates, level);
          animate({
            el: layer,
            translateX: x,
            translateY: y,
            easing,
            duration
          });
          if (!isLast(layers, layer)) return;
          animate({
            el: icon,
            perspective: [perspective, perspective],
            rotateX: y,
            rotateY: -x,
            easing,
            duration,
            complete: () => icon.addEventListener("mousemove", hover)
          });
        });
      },
      leave: event =>
        layers.forEach((layer, level) => {
          const {x, y} = getParallax(event, coordinates, level);
          animate({
            el: layer,
            translateX: [x, 0],
            translateY: [y, 0]
          });
          if (!isLast(layers, layer)) return;
          animate({
            el: icon,
            perspective: [perspective, perspective],
            rotateX: [y, 0],
            rotateY: [-x, 0],
            complete: () => icon.removeEventListener("mousemove", hover)
          });
        })
    });

    centerLayers(icon, layers);
    Object.keys(events).forEach(event => icon.addEventListener(`mouse${event}`, events[event]));
  };

  icons.forEach(setParallax);
});
