export default class ChangeNotifier {
  listeners = [];
  
  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    
    if(index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  notifyListeners(change, editor, people) {
    let i = 0;
    const iLength = this.listeners.length; 
    for(; i < iLength; i += 1) {
      this.listeners[i](change, editor, people);
    }
  }
}