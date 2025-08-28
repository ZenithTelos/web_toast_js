/*!
 * Toasty.js
 * Lightweight toast notifications for the web
 * MIT License
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Toasty = factory();
  }
})(this, function () {

  // Default config
  const defaults = {
    text: "This is a toast!",
    duration: 3000,
    position: "top-right", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
    style: {
      background: "#333",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "6px",
      fontSize: "14px"
    }
  };

  class Toasty {
    constructor(options = {}) {
      this.options = { ...defaults, ...options };
      this.toastEl = null;
      this.timeoutId = null;
    }

    // 🔹 Show toast
    show() {
      if (this.toastEl) this.hide();

      // Create element
      const el = document.createElement("div");
      el.className = "toasty";
      el.innerText = this.options.text;

      // Apply styles
      Object.assign(el.style, {
        position: "fixed",
        zIndex: 9999,
        ...this.options.style,
      });

      // Position
      this.applyPosition(el);

      // Append
      document.body.appendChild(el);
      this.toastEl = el;

      // Auto hide
      if (this.options.duration > 0) {
        this.timeoutId = setTimeout(() => this.hide(), this.options.duration);
      }
      return this;
    }

    // 🔹 Hide toast
    hide() {
      if (this.toastEl) {
        this.toastEl.remove();
        this.toastEl = null;
        clearTimeout(this.timeoutId);
      }
      return this;
    }

    // 🔹 Update text
    setText(text) {
      this.options.text = text;
      if (this.toastEl) this.toastEl.innerText = text;
      return this;
    }

    // 🔹 Update style
    setStyle(styleObj) {
      this.options.style = { ...this.options.style, ...styleObj };
      if (this.toastEl) Object.assign(this.toastEl.style, styleObj);
      return this;
    }

    // 🔹 Update position
    setPosition(position) {
      this.options.position = position;
      if (this.toastEl) this.applyPosition(this.toastEl);
      return this;
    }

    // 🔹 Update multiple options
    update(options) {
      this.options = { ...this.options, ...options };
      if (this.toastEl) {
        this.setText(this.options.text);
        this.setStyle(this.options.style);
        this.setPosition(this.options.position);
      }
      return this;
    }

    // 🔹 Apply position helper
    applyPosition(el) {
      el.style.top = el.style.bottom = el.style.left = el.style.right = "auto";
      const pos = this.options.position;

      if (pos.includes("top")) el.style.top = "20px";
      if (pos.includes("bottom")) el.style.bottom = "20px";
      if (pos.includes("left")) el.style.left = "20px";
      if (pos.includes("right")) el.style.right = "20px";
      if (pos.includes("center")) {
        if (pos.includes("top") || pos.includes("bottom")) {
          el.style.left = "50%";
          el.style.transform = "translateX(-50%)";
        } else {
          el.style.top = "50%";
          el.style.left = "50%";
          el.style.transform = "translate(-50%, -50%)";
        }
      }
    }

    // 🔹 Static method → clear all toasts
    static clearAll() {
      document.querySelectorAll(".toasty").forEach(el => el.remove());
    }
  }

  // Main entry
  function toasty(options) {
    return new Toasty(options);
  }

  // Attach static methods
  toasty.clearAll = Toasty.clearAll;

  // Expose globally
  window.toasty = toasty;

  return toasty;
});
