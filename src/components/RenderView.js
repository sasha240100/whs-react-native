import Exponent from 'exponent';
import React, { PropTypes } from 'react';
import { View } from 'react-native';

import RenderingModule from '../modules/RenderingModule';

import * as WHS from 'whs';

export default class RenderView extends React.Component {
  constructor(...props) {
    super(...props);

    console.log(4);

    this.glResolver = new Promise((resolve) => {
      this._onContextCreate = (gl) => {
        gl.createFramebuffer = () => {
          return null;
        };
        gl.createRenderbuffer = () => {
          return null;
        };
        gl.bindRenderbuffer = (target, renderbuffer) => {};
        gl.renderbufferStorage = (target, internalFormat, width, height) => {};
        gl.framebufferTexture2D = (target, attachment, textarget, texture, level) => {};
        gl.framebufferRenderbuffer = (target, attachmebt, renderbuffertarget, renderbuffer) => {};

        let threeRendererOptions = {
          canvas: {
            width: gl.drawingBufferWidth,
            height: gl.drawingBufferHeight,
            style: {},
            addEventListener: () => {},
            removeEventListener: () => {},
            clientHeight: gl.drawingBufferHeight,
          },
          context: gl
        };

        this.rendererParams = threeRendererOptions;
        console.log(1);
        console.log(this.rendererParams);

        resolve(this.rendererParams);
      };
    });
  }

  wrapChild(child) {
    return React.cloneElement(child, {
      afterMountParams: this.glResolver
    });
  }

  render() {

    console.log(this._onContextCreate);
    // this._onContextCreate.bind(this)

    // eslint-disable-next-line no-unused-vars
    return (
      <View style={{ flex: 1 }}>
        <Exponent.GLView
          key='gl-view'
          onContextCreate={function() {
            console.log(5);
          }}
        />
        {this.wrapChild(this.props.children)}
      </View>
    );
  } // <View>{this.props.children}</View>
};
