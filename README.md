# Parallax

Simple 0.8KB plugin for [Animate Plus](https://github.com/bendc/animateplus) that lets you easily
create layered icons. [View demo](http://animateplus.com/demos/parallax/).

## Usage

1. Include `animate.min.js`
([download](https://github.com/bendc/animateplus/blob/master/animate.min.js)) and `parallax.min.js`
in your document.
2. Define a container with a `parallax` class and add your image layers in it.

```html
<script src=animate.min.js></script>
<script src=parallax.min.js></script>

<a class=parallax>
  <img src=back.png>
  <img src=middle.png>
  <img src=front.png>
</a>
```
