var Transform = require('readable-stream').Transform;
var inherits = require('inherits');

module.exports = Brake;
inherits(Brake, Transform);

function Brake (rate, opts) {
    var self = this;
    if (!(this instanceof Brake)) return new Brake(rate, opts);
    Transform.call(this);
    
    if (!opts) opts = {};
    if (typeof opts === 'number') opts = { period : opts };
    if (typeof rate === 'object') {
        opts = rate;
        rate = opts.rate;
    }
    
    this.rate = rate;
    this.period = opts.period || 1000;
    this.since = null;
    this.bytes = 0;
}

Brake.prototype._transform = function (buf, enc, next) {
    var self = this;
    var index = 0;
    var delay = this.period / this.rate;
    this._iv = setInterval(advance, delay);
    advance();
    
    function advance () {
        if (this._destroyed) return clearInterval(self._iv);
        self.push(buf.slice(index, index+1));
        if (++ index === buf.length) {
            clearInterval(self._iv);
            setTimeout(next, delay);
        }
    }
};

Brake.prototype._flush = function (next) {
    clearInterval(this._iv);
    this.push(null);
    next();
};

Brake.prototype.destroy = function () {
    clearInterval(this._iv);
    this._destroyed = true;
};
