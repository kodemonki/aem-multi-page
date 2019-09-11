let reactRenderer = (function() {
  let init = () => {
    renderComponents();
  };

  let renderComponents = () => {
    let elements = document.querySelectorAll("[data-component]");
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let componentClass = getComponentClass(
        element.getAttribute("data-component")
      );
      let data = JSON.parse(element.getAttribute("data-props"));
      renderComponent(componentClass, data, element);
    }
  };

  let getComponentClass = className => {
    return allComponents[className];
  };

  let renderComponent = (className, data, target) => {
    ReactDOM.render(React.createElement(className, data, null), target);
  };

  return {
    init: init
  };
})();
reactRenderer.init();
