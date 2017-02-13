import {
  WebGLRenderer,
  Vector2
} from 'three';

import {Loop} from 'whs';

export default class RenderingModule {
  static additional = {
    shadow(renderer) {
      renderer.shadowMap.enabled = true;
    }
  }

  constructor(params = {}, {shadow: isShadow} = {shadow: false}) {
    this.params = Object.assign({
      width: window.innerWidth,
      height: window.innerHeight,

      resolution: new Vector2(1, 1),

      bgColor: 0x000000,
      bgOpacity: 1,

      renderer: {}
    }, params);

    console.log("RenderingModule 1");
    this.renderer = new WebGLRenderer(this.params.renderer);
    this.applyAdditional('shadow', isShadow);

    this.renderer.setClearColor(
      this.params.bgColor,
      this.params.bgOpacity
    );

    this.setSize(
      Number(this.params.width * this.params.resolution.x).toFixed(),
      Number(this.params.height * this.params.resolution.y).toFixed()
    );

    console.log("RenderingModule");
  }

  applyAdditional(name, isApplied = false) {
    if (!isApplied) return;
    RenderingModule.additional[name].apply(this, [this.renderer]);
  }

  integrateRenderer(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    const gl = this.params.renderer.context;

    console.log("integrateRenderer");

    this.renderLoop = new Loop(() => {
      this.renderer.render(this.scene, this.camera);
      gl.flush();
      gl.endFrameEXP();
    });
    // this.attachToCanvas(element);

    return this.renderLoop;
  }

  setSize(width, height) {
    if (this.renderer) this.renderer.setSize(width, height);
  }

  // attachToCanvas(element) {
  //   const canvas = this.renderer.domElement;
  //
  //   // attach to new parent world dom
  //   element.appendChild(canvas);
  //   canvas.style.width = '100%';
  //   canvas.style.height = '100%';
  // }

  manager(manager) {
    this.renderLoop = this.integrateRenderer(
      manager.get('scene'),
      manager.get('camera').native
    );

    manager.update({
      element: element => {
        this.attachToCanvas(element);
      },
      scene: scene => {
        this.scene = scene;
      },
      camera: camera => {
        this.camera = camera.native;
      }
    });

    manager.add('renderer', this.renderer, {alias: '$rendering'});
  }

  integrate(self) {
    self.renderLoop.start(this);
  }
}
