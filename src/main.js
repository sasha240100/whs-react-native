import './FakeBrowser';
import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as WHS from 'whs';
import {App} from 'react-whs';

const {
  SceneModule,
  CameraModule
} = WHS.app;

import RenderView from './components/RenderView';
import RenderingModule from './modules/RenderingModule';

class Application extends React.Component {
  render() {
    return (
      <View>
        <RenderView>
          <App
            modules={[
              new SceneModule(),
              new CameraModule()
            ]}

            afterMount={function(glResolver) {
              glResolver.then(params => {
                console.log(2);
                console.log(params);
                this.native.applyModule(new RenderingModule({renderer: params, bgColor: 0xff0000}));
              });
            }}

            parent={View}
          />
        </RenderView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Exponent.registerRootComponent(Application);
