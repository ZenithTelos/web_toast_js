/*!
 * Toasty.js
 * Lightweight toast notifications for the web
 * that utilize tailwind
 * MIT License
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Toasty = factory();
  }
})(this, function (global) {
  var Toasty = function (options) {
      return new Toasty.lib.init(options);
    },
    version = "0.1.0";

  Toasty.defaults = {
    oldestFirst: true,
    text: "<default toast message>",
    duration: 3000,
    selector: undefined,
    callback: function () {},
    close: false,
    x: "top",
    y: "right",
    theme: "dark",
    keepOnHover: true,
    className: "",
  };

  Toasty.lib = Toasty.prototype = {
    toasty: version,
    constructor: Toasty,

    init: function (options) {
      if (!options) {
        options = {};
      }

      this.options = {};
      this.toastElement = null;

      this.options.text = options.text || Toasty.defaults.text;
      this.options.duration === 0 ? 0 : options.duration || Toasty.defaults.duration;
      this.options.selector = options.selector || Toasty.defaults.selector;
      this.options.callback = options.callback || Toasty.defaults.callback;
      this.options.keepOnHover = options.keepOnHover === undefined ? Toasty.defaults.keepOnHover : options.keepOnHover;
      this.options.className = options.className || Toasty.defaults.className;

      return this;
    },

    generateToast: function () {
      if (!this.options) throw "Toasty initialization error.";

      var divElement = document.createElement("div");
      divElement.className =
        "toasty py-2 px-4 inline-block shadow fixed opacity-100 duration-400 ease-[cubic-bezier(0.215, 0.61, 0.355, 1)] rounded cursor-pointer no-underline m-w-[50%-20px] z-index-[2147483647] " +
        this.options.className;

      divElement.className += " " + this.options.x + "-[-150px]";
      divElement.className += " " + this.options.y + "-[15px]";

      divElement.className +=
        this.options.theme === "light" ? " text-black bg-neutral-200" : " text-white bg-neutral-600";

      if (this.options.close === true) {
        // Create a span for close element
        var closeElement = document.createElement("button");
        closeElement.type = "button";
        closeElement.className = "toast-close";
        closeElement.innerHTML = "&#10006;";

        // Triggering the removal of toast from DOM on close click
        closeElement.addEventListener(
          "click",
          function (event) {
            event.stopPropagation();
            this.removeElement(this.toastElement);
            window.clearTimeout(this.toastElement.timeOutValue);
          }.bind(this)
        );

        //Calculating screen width
        var width = window.innerWidth > 0 ? window.innerWidth : screen.width;

        // Adding the close icon to the toast element
        // Display on the right if screen width is less than or equal to 360px
        if (this.options.x == "left" && width > 360) {
          // Adding close icon on the left of content
          divElement.insertAdjacentElement("afterbegin", closeElement);
        } else {
          // Adding close icon on the right of content
          divElement.appendChild(closeElement);
        }
      }

      if (this.options.keepOnHover && this.options.duration > 0) {
        var self = this;
        // stop countdown
        divElement.addEventListener("mouseover", function (event) {
          window.clearTimeout(divElement.timeOutValue);
        });
        // add back the timeout
        divElement.addEventListener("mouseleave", function () {
          divElement.timeOutValue = window.setTimeout(function () {
            // Remove the toast from DOM
            self.removeElement(divElement);
          }, self.options.duration);
        });
      }

      return divElement;
    },

    show: function () {
      this.toastElement = this.generateToast();

      var rootElement;
      if (typeof this.options.selector === "string") {
        rootElement = document.getElementById(this.options.selector);
      } else if (
        this.options.selector instanceof HTMLElement ||
        (typeof ShadowRoot !== "undefined" && this.options.selector instanceof ShadowRoot)
      ) {
        rootElement = this.options.selector;
      } else {
        rootElement = document.body;
      }

      if (!rootElement) {
        throw rootElement + " is not defined.";
      }

      var elementToInsert = Toasty.defaults.oldestFirst ? rootElement.firstChild : rootElement.lastChild;
      rootElement.insertBefore(this.toastElement, elementToInsert);

      Toasty.reposition();

      if (this.options.duration > 0) {
        this.toastElement.timeOutValue = window.setTimeout(
          function () {
            this.removeElement(this.toastElement);
          }.bind(this),
          this.options.duration
        );
      }

      return this;
    },

    hide: function () {
      if (this.toastElement.timeOutValue) {
        clearTimeout(this.toastElement.timeOutValue);
      }
      this.removeElement(this.toastElement);
    },

    // Removing the element from the DOM
    removeElement: function (toastElement) {
      // Hiding the element
      // toastElement.classList.remove("on");
      toastElement.className = toastElement.className.replace(" opacity-100", "opacity-0");

      // Removing the element from DOM after transition end
      window.setTimeout(
        function () {
          // remove options node if any
          if (this.options.node && this.options.node.parentNode) {
            this.options.node.parentNode.removeChild(this.options.node);
          }

          // Remove the element from the DOM, only when the parent node was not removed before.
          if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
          }

          // Calling the callback function
          this.options.callback.call(toastElement);

          // Repositioning the toasts again
          Toasty.reposition();
        }.bind(this),
        400
      ); // Binding `this` for function invocation
    },
  };

  Toasty.reposition = function () {
    var topLeftOffsetSize = {
      top: 15,
      bottom: 15,
    };
    var topRightOffsetSize = {
      top: 15,
      bottom: 15,
    };
    var offsetSize = {
      top: 15,
      bottom: 15,
    };

    return this;
  };

  Toasty.lib.init.prototype = Toasty.lib;

  return Toasty;
});
