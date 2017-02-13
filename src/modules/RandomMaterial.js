export default class RandomMaterial {
  integrate() {

    setInterval(() => {
      this.native.material.color.setRGB(Math.random(), Math.random(), Math.random());
    }, 1000);
  }
}
