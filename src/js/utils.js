var Utils = {
  dom: function(dom, sel) {
    if (typeof dom == 'string')
      return document.querySelector(dom);
    if (dom instanceof HTMLElement)
      return dom.querySelector(sel);
    else
      return null;
  }
}

module.exports = Utils;