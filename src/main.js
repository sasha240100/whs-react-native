import Exponent from 'exponent';
import React from 'react';
import {
  View,
  Text
} from 'react-native';

import './FakeBrowser';

import * as WHS from 'whs';

// import {
//   MeshPhongMaterial,
//   Vector3
// } from 'three';

import {
  App,
  Sphere,
  Plane,
  PointLight,
  AmbientLight
} from 'react-whs';

const {
  SceneModule,
  CameraModule
} = WHS.app;

const {
  OrbitModule
} = WHS.controls;

import RenderView from './components/RenderView';
import RenderingModule from './modules/RenderingModule';
import RandomMaterial from './modules/RandomMaterial';

class Application extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <RenderView>
          <App
            modules={[
              new SceneModule(),
              new CameraModule({
                position: {
                  z: 50
                }
              })
            ]}

            afterMount={function (glResolver) {
              glResolver.then(params => {
                // console.log(params);

                this.native
                  .module(new RenderingModule({
                    bgColor: 0x162129,

                    renderer: params
                  }, {shadow: true}));
                  // .module(new OrbitModule({}, false));
              });
            }}

            parent={View}
          >
            <Sphere
              geometry={{
                radius: 15,
                widthSegments: 32,
                heightSegments: 32
              }}

              material={new THREE.MeshPhongMaterial({
                color: 0xF2F2F2
              })}

              modules={[
                new RandomMaterial()
              ]}

              position={new THREE.Vector3(30, 40, 0)}
            />

            <Plane
              geometry={{
                width: 100,
                height: 100
              }}

              material={new THREE.MeshPhongMaterial({color: 0x447F8B})}

              position={new THREE.Vector3(0, -5, 0)}

              rotation={{
                x: -Math.PI / 2
              }}
            />

            <PointLight
              light={{
                intensity: 0.5,
                distance: 100
              }}

              shadow={{
                fov: 90
              }}

              position={new THREE.Vector3(0, 10, 10)}
            />

            <AmbientLight
              light={{
                intensity: 0.4
              }}
            />

          </App>
        </RenderView>
      </View>
    );
  }
}

/*
<Plane
  geometry={{
    width: 100,
    height: 100
  }}

  material={new THREE.MeshPhongMaterial({color: 0x447F8B})}

  rotation={{
    x: -Math.PI / 2
  }}
/>

<PointLight
  light={{
    intensity: 0.5,
    distance: 100
  }}

  shadow={{
    fov: 90
  }}

  position={new THREE.Vector3(0, 10, 10)}
/>

<AmbientLight
  light={{
    intensity: 0.4
  }}
/>
*/

Exponent.registerRootComponent(Application);
