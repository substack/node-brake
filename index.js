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
    this.since = Date.now();
    this.bucket = 0;
    
    this._check = setInterval(function () {
        self.bytes = 0;
        self.since = Date.now();
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
        
        var now = Date.now();
        var elapsed = now - self.since;
        
        if (elapsed > 0) {
            self.bucket += self.rate / self.period - self.bytes / elapsed;
        }
        var n = Math.round(self.bucket);
        self.bucket -= n;
        
        var b = buf.slice(index, index + 1 + n);
        self.push(b);
        self.bytes += b.length;
        
        index += b.length;
        if (index === buf.length) {
            clearInterval(self._iv);
            setTimeout(next, delay);
        }
    }
};

Brake.prototype._flush = function (next) {
    clearInterval(this._iv);
    clearInterval(this._check);
    this.push(null);
    next();
};

Brake.prototype.destroy = function () {
    clearInterval(this._iv);
    clearInterval(this._check);
    this._destroyed = true;
};
