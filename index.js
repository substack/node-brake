var Stream = require('stream');
var util = require('util');

module.exports = function (rate, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'number') opts = { period : opts };
    if (typeof rate === 'object') {
        opts = rate;
        rate = opts.rate;
    }
    
    if (!opts.period) opts.period = 1000;
    
    if (rate < 1 && rate > 0) {
        opts.period /= rate;
        rate = 1;
    }
    opts.rate = rate;
    
    return new Limit(opts);
};

function Limit (opts) {
    Stream.call(this);
    this.writable = true;
    this.readable = true;
    
    this.pending = [];
    this.pendingSize = 0;
    this.sent = 0;
    this.rate = opts.rate;
    this.maxSize = opts.maxSize;
    
    this.interval = setInterval(function () {
        this.sent = 0;
        this.check();
    }.bind(this), opts.period);
}

util.inherits(Limit, Stream);

Limit.prototype.checkSize = function () {
    if (!this.maxSize) return;
    if (this.pendingSize > this.maxSize) {
        var err = new Error('maximum buffer size exceeded');
        err.code = 'MAXSIZE';
        this.emit('error', err);
    }
};

Limit.prototype.check = function () {
    if (this._paused) return;
    if (this.sent === this.rate) return;
    var pending = this.pending;
    var sent0 = this.sent;
    
    for (var i = 0; i < pending.length; i++) {
        var msg = pending[i];
        
        if (this.sent + msg.length < this.rate) {
            this.sent += msg.length;
            this.emit('data', msg);
        }
        else {
            var n = Math.max(0, this.rate - this.sent);
            this.sent += n;
            if (n > 0) {
                this.emit('data', msg.slice(0, n));
                pending.splice(i + 1, 0, msg.slice(n));
                this.pendingSize += msg.length - n;
                if (this.maxSize) this.checkSize();
            }
            break;
        }
    }
    pending.splice(0, i + 1);
    this.pendingSize += this.sent - sent0;
    
    if (this._full && pending.length === 0) {
        this.emit('drain');
        this._full = false;
    }
    if (this._ended && pending.length === 0) {
        clearInterval(this.interval);
        this.readable = false;
        this.emit('end');
    }
};

Limit.prototype.write = function (msg) {
    if (!this.writable) {
        var err = new Error('stream not writable');
        err.code = 'EPIPE';
        this.emit('error', err);
        return false;
    }
    if (this._paused || this._full) {
        this.pending.push(msg);
        this.pendingSize += msg.length;
        if (this.maxSize) this.checkSize();
        return false;
    }
    
    if (this.sent + msg.length < this.rate) {
        this.emit('data', msg);
        this.sent += msg.length;
    }
    else {
        var n = Math.max(0, this.rate - this.sent);
        this.sent += n;
        if (n > 0) {
            this.emit('data', msg.slice(0, n));
            this.pending.push(msg.slice(n));
            this.pendingSize += msg.length - n;
            if (this.maxSize) this.checkSize();
        }
        this._full = true;
        return false;
    }
};

Limit.prototype.pause = function () {
    this._paused = true;
};

Limit.prototype.resume = function () {
    this._paused = false;
    this.check();
};

Limit.prototype.destroy = function () {
    clearInterval(this.interval);
    this._destroyed = true;
    this.writable = false;
    this.readable = false;
    this.emit('end');
};

Limit.prototype.end = function (msg) {
    if (msg !== undefined) return this.write(msg);
    this._ended = true;
    this.writable = false;
};
