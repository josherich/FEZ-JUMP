var Utils = require('./utils');

var Diamond = function() {

  this.insertDiamond = function() {
    var template = document.createElement('template');
    template.id = 'diamond_template';
    template.innerHTML = this.template.trim();
    // Utils.dom('body').appendChild(template);

    var dom = document.importNode(template.content, true);
    // Utils.dom('body').appendChild(dom);
    return dom;
  }

  this.template = `
    <div id="diamond">
      <div class="front"><div class="inner"></div></div>
      <div class="back"><div class="inner"></div></div>
      <div class="top"><div class="inner"></div></div>
      <div class="bottom"><div class="inner"></div></div>
      <div class="left"><div class="inner"></div></div>
      <div class="right"><div class="inner"></div></div>
    </div>`

  this.el = this.insertDiamond();
  this.dom = this.el;
}

module.exports = Diamond;