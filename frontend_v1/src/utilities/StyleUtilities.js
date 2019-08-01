function getBodyElement() {
  return document.getElementsByTagName('body')[0];
}

export function addBodyClass(className) {
  getBodyElement().classList.add(className);
}

export function removeBodyClass(className) {
  getBodyElement().classList.remove(className);
}

export function getElementCoordinates(element) { 
  const box = element.getBoundingClientRect();

  const { body } = document;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top  = box.top +  scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

export function scrollToElement(element, config = {}) {
  const coordinates = getElementCoordinates(element);
  const defaultConfig = { topOffset: null, bottomOffset: null, behavior: 'smooth' };
  const currentConfig = { ...defaultConfig, ...config };
  
  // handle configurable offset
  let windowOffset = 175;
  
  if (currentConfig.topOffset) {
    windowOffset = currentConfig.topOffset;
  }
  
  if (currentConfig.bottomOffset) {
    windowOffset = window.innerHeight - currentConfig.bottomOffset; // Put the item 100 pixels from the bottom of the screen
  }

  // handle configurable behavior
  let behavior = 'smooth';
  if(currentConfig.behavior) {
    behavior = currentConfig.behavior;
  }

  window.scrollTo({ left: 0, top: coordinates.top - windowOffset, behavior });
}

export function scrollToTopOfPage(config = {}) {
  const defaultConfig = { top: 0, left: 0, topOffset: null, bottomOffset: null, behavior: 'smooth' };
  const currentConfig = { ...defaultConfig, ...config };
  window.scrollTo(currentConfig);
}


export function scrollToBottomOfPage(config = {}) {
  const defaultConfig = { top: document.body.scrollHeight, left: 0, topOffset: null, bottomOffset: null, behavior: 'smooth' };
  const currentConfig = { ...defaultConfig, ...config };
  window.scrollTo(currentConfig);
}
