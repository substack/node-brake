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
    
    var iv = setInterval(function () {
        self.push(buf.slice(index, index+1));
        if (++ index === buf.length) {
            clearInterval(iv);
            next();
        }
    }, this.period / this.rate);
};

Brake.prototype._flush = function (next) {
    this.push(null);
    next();
};
