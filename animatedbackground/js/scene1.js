(function() {

    var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;

    // Main
    initHeader();
    addListeners();

    function initHeader() {
        
        largeHeader = document.getElementById('wrapper');        
        width = largeHeader.offsetWidth;
        height = largeHeader.offsetHeight;
        // we do not need scrollbars on canvas - so clientWidth & height
        /*width = largeHeader.clientWidth;
        height = largeHeader.clientHeight;
            absolute positioning allow use offsetheight
        */

        console.log('w: ' + width + 'h:' + height);

/*
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};

        largeHeader = document.getElementById('wrapper');
        largeHeader.style.height = height+'px';
*/
        canvas = document.getElementById('snowcanv');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        resize();

        // create particles

        var particlesNum = width*0.5;
        particlesNum = width;

        circles = [];
        for(var x = 0; x < particlesNum; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        
        largeHeader = document.getElementById('wrapper');        
        width = largeHeader.clientWidth;
        height = largeHeader.clientHeight;
        canvas.width = width;
        canvas.height = height;


/*        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        
        canvas.width = width;
        canvas.height = height;
*/
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
            //console.log(_this);
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            //_this.pos.y = height+Math.random()*100; 
            
            // initial show particles position
            // - 100 to fill top line with snow
            _this.pos.y = (Math.random() * 100) - 100;
            
            //increase initial alpha to 0.4
            _this.alpha = 0.1+Math.random()*0.4;
            
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
        }

        this.draw = function() {
            if (_this.pos.y > 300) {
                // destroy if position more than 300px
                this.alpha = -1;
            }
            
            if (_this.pos.y > 250 && _this.alpha > 0.1) {
                // fade x10 times if 300-50px - 50px line to fade;
                _this.alpha -= 0.005;
            }
            
            if(_this.alpha <= 0) {
                init();
            }
            //_this.pos.y -= _this.velocity;
            this.pos.y += _this.velocity;

            
            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            ctx.fill();
        };
    }

})();