var Transform = require('readable-stream').Transform;
var inherits = require('inherits');

module.exports = Break;
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
}

Brake.prototype._transform = function (buf, enc, next) {
    this.push(buf);
    next();
};

Brake.prototype._flush = function (next) {
    this.push(null);
    next();
};
