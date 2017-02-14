import Exponent from 'exponent';
import React, { PropTypes } from 'react';
import { View } from 'react-native';

import RenderingModule from '../modules/RenderingModule';

import * as WHS from 'whs';

export default class RenderView extends React.Component {
  static glToParams(gl) {
    return {
      renderer: {
        canvas: {
          width: gl.drawingBufferWidth,
          height: gl.drawingBufferHeight,
          style: {},
          addEventListener: () => {},
          removeEventListener: () => {},
          clientHeight: gl.drawingBufferHeight,
          clientWidth: gl.drawingBufferWidth
        },
        context: gl
      },

      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      aspect: gl.drawingBufferWidth / gl.drawingBufferHeight
    };
  }

  constructor(...props) {
    super(...props);

    this.helper = 2;

    this.glResolver = new Promise((resolve) => {
      this.onContextCreate = (gl) => {
        // gl.createFramebuffer = () => {
        //   return null;
        // };
        //
        gl.createRenderbuffer = () => {
          return null;
        };

        gl.bindRenderbuffer = (target, renderbuffer) => {};
        gl.renderbufferStorage = (target, internalFormat, width, height) => {};
        // gl.framebufferTexture2D = (target, attachment, textarget, texture, level) => {};
        gl.framebufferRenderbuffer = (target, attachmebt, renderbuffertarget, renderbuffer) => {};
        gl.VERSION = 7938;

        const getParameter = gl.getParameter;

        gl.getParameter = function (value) {
          if (value === gl.VERSION) return "WebGL 1.0 (OpenGL ES 2.0 Chromium)";
          else return getParameter(value);
        }

        resolve(gl);
      };
    });
  }

  wrapChild(child) {
    const view = this;

    return React.cloneElement(child, {
      afterMountParams: this.glResolver,
      passAppToView: (app) => {
        view.app = app.native;
        view.element = app.element;
      }
    });
  }

  render() {
    const handleEvents = event => e => {
      const evt = e.nativeEvent;
      evt.preventDefault = () => {};
      evt.stopPropagation = () => {};

      this.app.emit(event, evt);
    };

    const child = this.wrapChild(this.props.children);

    return (
      <View style={{ flex: 1 }}>
        <Exponent.GLView
          style={{ flex: 1 }}
          key='gl-view'
          onLayout={(evt) => {
            this.element.clientWidth = evt.nativeEvent.layout.width;
            this.element.clientHeight = evt.nativeEvent.layout.height;
          }}
          onContextCreate={this.onContextCreate}
          onStartShouldSetResponder={event => true}
          onResponderGrant={handleEvents('touchstart')}
          onResponderMove={handleEvents('touchmove')}
          onResponderRelease={handleEvents('touchend')}
          onResponderTerminationRequest={event => true}
          onResponderTerminate={handleEvents('touchcancel')}
        />
        <View style={{ flex: 0 }}>{child}</View>
      </View>
    );
  }
};
