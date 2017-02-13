import Exponent from 'exponent';
import React, { PropTypes } from 'react';
import { View } from 'react-native';

import RenderingModule from '../modules/RenderingModule';

import * as WHS from 'whs';

export default class RenderView extends React.Component {
  constructor(...props) {
    super(...props);

    this.glResolver = new Promise((resolve) => {
      this.onContextCreate = (gl) => {
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
        gl.VERSION = 7938;

        const getParameter = gl.getParameter;

        gl.getParameter = function (value) {
          if (value === gl.VERSION) return "WebGL 1.0 (OpenGL ES 2.0 Chromium)";
          else return getParameter(value);
        }


        let threeRendererOptions = {
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
        };

        this.rendererParams = threeRendererOptions;

        resolve(this.rendererParams);
      };
    });
  }

  // _handleResponderGrant = (event) => {
  //   this._update(event);
  // };
  //
  // _handleResponderMove = (event) => {
  //   this._update(event);
  // };
  //
  // _handleResponderRelease = (event) => {
  //   this.singleTouchMice.forEach(mouse => {
  //     mouse.handleResponderRelease(event);
  //   });
  //   this.singleTouchMice.length = 0;
  //   this.previousTouchIdentifiers.length = 0;
  // };
  //
  // _handleResponderTerminate = (event) => {
  //   this.singleTouchMice.forEach(mouse => {
  //     mouse.handleResponderTerminate(event);
  //   });
  //   this.singleTouchMice.length = 0;
  //   this.previousTouchIdentifiers.length = 0;
  // };

  wrapChild(child) {
    return React.cloneElement(child, {
      afterMountParams: this.glResolver,
      handleRenderView: app => {
        this.app = app;
      }
    });
  }

  handleEvent(event) {
    return function (e) {
      if (this.app) this.app.emit(event, e);
    }
  }

  render() {
    const handleEvent = this.handleEvent.bind(this);

    return (
      <View style={{ flex: 1 }}>
        <Exponent.GLView
          style={{ flex: 1 }}
          key='gl-view'
          onContextCreate={this.onContextCreate}
          onStartShouldSetResponder={event => true}
          onResponderGrant={handleEvent('touchstart')}
          onResponderMove={handleEvent('move')}
          onResponderRelease={handleEvent('touchend')}
          onResponderTerminationRequest={event => true}
          onResponderTerminate={handleEvent('touchcancel')}
        />
        {this.wrapChild(this.props.children)}
      </View>
    );
  }
};
