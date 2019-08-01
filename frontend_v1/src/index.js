import { startApp } from "./App";

if(!window.cordova) {
  // Just start the app. We are already in a browser window.
  startApp();
} else {
  // Start the app when Cordova is ready

  /* "License"); you may not use this file except in compliance
  * with the License.  You may obtain a copy of the License at
  *
  * http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing,
  * software distributed under the License is distributed on an
  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  * KIND, either express or implied.  See the License for the
  * specific language governing permissions and limitations
  * under the License.
  */

  const app = {
    // Application Constructor
    initialize() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent() {
      startApp();
    }
  };

  app.initialize();
}
