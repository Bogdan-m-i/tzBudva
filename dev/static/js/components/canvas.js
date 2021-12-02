let canv = document.getElementById('canv-big'),
    ctx = canv.getContext('2d'),
    canvMin = document.getElementById('canv-min'),
    ctxMin = canvMin.getContext('2d');

canv.width = 600
canv.height = 600

canvMin.width = 50
canvMin.height = 600

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.fillStyle=color;
    ctx.fill();
}

const getpixelcolour = e =>{
    let x = e.offsetX || e.originalEvent.layerX || e.layerX,
        y = e.offsetY || e.originalEvent.layerY || e.layerY,
        pixel = ctx.getImageData(x, y, 1, 1),
        color = `rgba(${pixel.data[0]},${pixel.data[1]},${pixel.data[2]},${pixel.data[3]})`
    ctxMin.fillStyle = color;
    if (color === 'rgba(0,0,0,0)') ctxMin.fillStyle = '#fff';
    ctxMin.fillRect(0,0,canvMin.width,canvMin.height);
}

drawStar(375, 100, 5, 70, 30, '#ffaaaa');
drawStar(300, 200, 5, 70, 30, '#a4a4f9');
drawStar(225, 300, 5, 70, 30, '#89b589');
drawStar(150, 400, 5, 70, 30, '#f9f99f');
drawStar(75, 500, 5, 70, 30, '#555');

canv.addEventListener('click', getpixelcolour);