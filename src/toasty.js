(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Toasty = factory();
  }
})(this, function(global) {

  return Toasty;
});