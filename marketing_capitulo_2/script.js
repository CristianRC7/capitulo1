var numQuestions = 10;
var data = [
  {
    "label": "Pregunta 1",
    "value": 1,
    "question": "¿Qué experiencia tuvo el autor como Brand manager en Spinnaker y cuál fue su principal aprendizaje en cuanto al gasto publicitario?"
  },
  {
    "label": "Pregunta 2",
    "value": 2,
    "question": "¿Cómo define el autor el marketing que impregna nuestras vidas y cuál es el tipo de marketing que él promueve?"
  },
  {
    "label": "Pregunta 3",
    "value": 3,
    "question": "El autor presenta un enfoque de marketing en cinco pasos. ¿Cuáles son esos cinco pasos y cómo se relacionan entre sí para lograr un impacto efectivo?"
  },
  {
    "label": "Pregunta 4",
    "value": 4,
    "question": "¿Qué importancia tiene el concepto de 'mercado mínimo viable' en la estrategia de marketing según el autor?"
  },
  {
    "label": "Pregunta 5",
    "value": 5,
    "question": "Según el autor, ¿cuál es el papel principal de los profesionales del marketing en relación con el cambio y la cultura?"
  },
  {
    "label": "Pregunta 6",
    "value": 6,
    "question": "¿Qué diferencias clave señala el autor entre el marketing directo y el marketing de marca?"
  },
  {
    "label": "Pregunta 7",
    "value": 7,
    "question": "El autor menciona que 'la cultura supera la estrategia'. ¿Qué quiere decir con esta afirmación y cómo se relaciona con el marketing?"
  },
  {
    "label": "Pregunta 8",
    "value": 8,
    "question": "¿Cuáles son las cosas que los profesionales del marketing saben según el autor y por qué son importantes para el éxito en marketing?"
  },
  {
    "label": "Pregunta 9",
    "value": 9,
    "question": "Según el capítulo, ¿cómo influyen las historias que contamos sobre nosotros mismos y nuestra percepción del estatus en nuestras decisiones y comportamientos?"
  },
  {
    "label": "Pregunta 10",
    "value": 10,
    "question": "¿Cuál es el consejo principal del autor para los profesionales del marketing que buscan generar un impacto duradero en sus audiencias?"
  }
];

var padding = {top:20, right:40, bottom:0, left:0},
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top  - padding.bottom,
    r = Math.min(w, h)/2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();

var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width",  w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
var vis = container
    .append("g");

var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
var arc = d3.svg.arc().outerRadius(r);
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs.append("path")
    .attr("fill", function(d, i){ return color(i); })
    .attr("d", function (d) { return arc(d); });

arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle)/2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
    })
    .attr("text-anchor", "end")
    .text( function(d, i) {
        return data[i].label;
    });

container.on("click", spin);

function spin(d) {
    container.on("click", null);
    var spinSound = document.getElementById("spinSound");
    spinSound.play();
    if (oldpick.length == data.length) {
        console.log("done");
        container.on("click", null);
        document.getElementById("restartButton").style.display = "block";
        document.getElementById("restartButton").addEventListener("click", function() {
            location.reload();
        });
        return;
    }
    var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);
        
    rotation = (Math.round(rng / ps) * ps);
    
    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps / 2);
    vis.transition()
        .duration(5000)
        .attrTween("transform", rotTween)
        .each("end", function () {
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "#111");
            var selectedQuestion = data[picked].question;
            d3.select("#question h1")
                .text(selectedQuestion);
            oldrotation = rotation;

            var questionSound = document.getElementById("questionSound");
            questionSound.play();

            // Imprimir historial en la consola
            console.log("Pregunta seleccionada:", selectedQuestion);

            container.on("click", spin);

            Swal.fire({
                title: 'Pregunta seleccionada:',
                text: selectedQuestion,
                icon: 'info',
                confirmButtonText: 'Entendido'
            });
        });
}

svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
    .style({"fill":"black"});

container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({"fill":"white","cursor":"pointer"});

container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Girar")
    .style({"font-weight":"bold", "font-size":"30px","cursor":"pointer"});

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function(t) {
    return "rotate(" + i(t) + ")";
  };
}
