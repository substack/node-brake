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
    
    this.bytes = 0;
    this.factor = 0;
    
    this._checker = setInterval(function () {
        self.factor += self.rate - self.bytes;
        self.bytes = 0;
    }, this.period);
}

Brake.prototype._transform = function (buf, enc, next) {
    var self = this;
    var index = 0;
    var delay = this.period / this.rate;
    this._iv = setInterval(advance, delay);
    advance();
    
    function advance () {
        if (this._destroyed) return clearInterval(self._iv);
        self.push(buf.slice(index, index + 1 + self.factor));
        self.factor = 0;
        
        self.bytes ++;
        if (++ index === buf.length) {
            clearInterval(self._iv);
            setTimeout(next, delay);
        }
    }
};

Brake.prototype._flush = function (next) {
    clearInterval(this._iv);
    clearInterval(this._checker);
    this.push(null);
    next();
};

Brake.prototype.destroy = function () {
    clearInterval(this._iv);
    clearInterval(this._checker);
    this._destroyed = true;
};
