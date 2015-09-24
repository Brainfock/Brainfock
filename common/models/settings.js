module.exports = function(Settings) {
  Settings.prototype.getPreparedValue = function () {
    return this.value;
  }
}