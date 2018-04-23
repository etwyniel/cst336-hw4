var canvas;
var ctx;
var i = 0;
var f;
var halfw;
var halfh;
var y;
var prevy;
var width = 1;

const trig = [Math.sin, Math.cos, Math.atan];
const trignames = ["sin", "cos", "atan"];


function rand(max) {
    return Math.floor(Math.random() * max);
}

function randrange(min, max) {
    return rand(max - min) + min;
}

function random_trig() {
    var ind = rand(trig.length);
    var f = trig[ind];
    var fact1 = randrange(-5, 5) * 10 + 4;
    var fact2 = randrange(50, 100);
    $("#function").append(trignames[ind] + "(x / " + fact1 + ") * " + fact2);
    return function(x) {
        return f(x / fact1) * fact2;
    }
}

function random_poly() {
    var poly = [];
    for (var i = 0; i < 5; i++) {
        if (rand(i + 1) < 2) {
            var factor1 = randrange(10, 50);
            var factor2 = Math.pow(200, i);
            $("#function").append(" + " + factor1 + "/" + factor2 +
                (i == 0 ? "" : " * x" + 
                (i == 1 ? "" : "^" + i)))
            poly.push(factor1 / factor2);
        } else {
            poly.push(0);
        }
    }
    return function (x) {
        var r = 0;
        for (var i = 0; i < 5; i++) {
            if (poly[i] == 0)
                continue;
            r += poly[i] * (x ** i);
        }
        return r;
    }
}

function random_function() {
    var func = []
    for (var i = rand(2) + 2; i > 0; i--) {
        func.push(random_trig());
        if (i > 1)
            $("#function").append(" + ");
    }
    func.push(random_poly());
    return function (x) {
        var r = 0;
        for (var i = 0; i < func.length; i++)
            r += func[i](x);

        return r;
    }
}

function start() {
	canvas = document.getElementById("mycanvas");
	ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, $("#mycanvas").attr("width"), $("#mycanvas").attr("height"));
	halfw = $("#mycanvas").attr("width") / 2;
	halfh = $("#mycanvas").attr("height") / 2;

    $("#function").html("f(x) = ");

    f = random_function();

	y = halfh - f(-halfw);
	prevy = y;
	ctx.moveTo(0, halfh);
	ctx.lineWidth = $("#thickness").val();
    if (i == 0) {
    	draw_function();
    } else {
        i = 0;
    }
}

window.onload = () => {
    $("#resetButton").click(start);
    $("#randomize").change(function () {
        if (!$(this).prop("checked"))
            ctx.strokeStyle = "#000000";
    });
    start();
};

function draw_function() {
	if (i < $("#mycanvas").attr("width")) {
		ctx.beginPath();
        ctx.lineWidth = $("#thickness").val();
		if ($("#randomize").prop("checked"))
			ctx.strokeStyle = randomColor();
		y = halfh - f(i - halfw);
		ctx.moveTo(i, prevy);
		ctx.lineTo(i, y);
		prevy = y;
		ctx.stroke();
		i++;
		setTimeout(draw_function, 50 / $("#speed").val());
	} else
		i = 0;
}

function random255() {
	return Math.floor(Math.random() * 255);
}

function randomColor() {
	var c = "#";
	for (var i = 0; i < 3; i++) {
		var val = random255().toString(16);
		if (val.length == 1)
			c += "0";
		c += val;
	}
	return c;
}
