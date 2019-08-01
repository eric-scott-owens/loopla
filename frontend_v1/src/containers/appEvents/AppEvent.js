/**
 * Event data package to be sent to subscribers
 */
export default class AppEvent {
  constructor(name, event, data) {
    this.name = name;
    this.event = event;
    this.data = data;
  }
}
