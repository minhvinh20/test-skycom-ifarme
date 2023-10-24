
sap.m.Input.extend('InputWithAttrs', {
    metadata: {
      aggregations: {
        attributes: 'sap.ui.core.CustomData'
      }
    },
    renderer: {},
    onAfterRendering: function() {
      if (sap.m.Input.prototype.onAfterRendering) {
        sap.m.Input.prototype.onAfterRendering.apply(this, arguments);
      }
      var input = this.$().find('INPUT');
      this.getAttributes().forEach(function(attr) {
        input.attr(attr.getKey(), attr.getValue());
      });
    }
  });
  
  (new InputWithAttrs({
    value: 'sa',
    attributes: [new sap.ui.core.CustomData({
      key: 'inputmode',
      value: 'none'
    })]
  })).placeAt('content');
  
  
  