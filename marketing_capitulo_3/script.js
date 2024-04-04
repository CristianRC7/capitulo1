var numQuestions = 11;
var data = [
  {
    "label": "Pregunta 1",
    "value": 1,
    "question": "¿Cuál es el principal objetivo de VisionSpring como empresa?"
  },
  {
    "label": "Pregunta 2",
    "value": 2,
    "question": "¿Por qué se enfrenta VisionSpring a un desafío creciente en la actualidad en comparación con años anteriores?"
  },
  {
    "label": "Pregunta 3",
    "value": 3,
    "question": "Describa la estrategia de VisionSpring para distribuir sus gafas y cómo logran mantenerse financieramente sostenibles."
  },
  {
    "label": "Pregunta 4",
    "value": 4,
    "question": "¿Qué observaciones hizo el autor sobre las personas que se acercaban a la mesa de VisionSpring en la India?"
  },
  {
    "label": "Pregunta 5",
    "value": 5,
    "question": "¿Qué estrategia implementó el autor para incrementar las ventas de gafas?"
  },
  {
    "label": "Pregunta 6",
    "value": 6,
    "question": "¿Cómo se compara la mentalidad de compra de las personas que viven en la pobreza con la de las personas en condiciones más afortunadas, según el autor?"
  },
  {
    "label": "Pregunta 7",
    "value": 7,
    "question": "El autor menciona un cambio en el relato durante el proceso de venta de gafas. Explique este cambio y su impacto en las ventas."
  },
  {
    "label": "Pregunta 8",
    "value": 8,
    "question": "¿Cuál es la lección detrás de la anécdota de la broca de 0,5 milímetros compartida por Theodore Levitt?"
  },
  {
    "label": "Pregunta 9",
    "value": 9,
    "question": "Según el autor, ¿qué es lo que realmente quiere la gente al comprar un producto o servicio?"
  },
  {
    "label": "Pregunta 10",
    "value": 10,
    "question": "¿Cuál es la diferencia entre centrarse en el mercado y centrarse en el marketing según el autor?"
  },
  {
    "label": "Pregunta 11",
    "value": 11,
    "question": "¿Qué crítica realiza el autor sobre la suposición de la elección racional en la microeconomía?"
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
