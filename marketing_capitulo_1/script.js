var numQuestions = 10;
var data = [
  {
    "label": "Pregunta 1",
    "value": 1,
    "question": "¿Cuál es el concepto fundamental que el autor sugiere que ha cambiado en el marketing moderno y cómo afecta esto a las estrategias tradicionales de marketing?"
  },
  {
    "label": "Pregunta 2",
    "value": 2,
    "question": "Según el capítulo, ¿cómo se compara el acto de hacer marketing con una brújula en lugar de un mapa de carreteras tradicional?"
  },
  {
    "label": "Pregunta 3",
    "value": 3,
    "question": "¿Qué diferencias clave señala el autor entre internet como medio de comunicación masiva y otros medios tradicionales?"
  },
  {
    "label": "Pregunta 4",
    "value": 4,
    "question": "¿Por qué el autor argumenta que la magia publicitaria es una trampa y cómo afecta esto a la construcción de una historia útil en marketing?"
  },
  {
    "label": "Pregunta 5",
    "value": 5,
    "question": "¿Cuál es la crítica principal del autor hacia la percepción y práctica actuales del marketing, especialmente en comparación con el enfoque ético y generoso del marketing efectivo?"
  },
  {
    "label": "Pregunta 6",
    "value": 6,
    "question": "En el caso de estudio de Penguin Magic, ¿qué estrategias específicas emplea la empresa para conectar con su público objetivo y diferenciarse de la competencia?"
  },
  {
    "label": "Pregunta 7",
    "value": 7,
    "question": "¿Cómo describe el autor la relación entre los profesionales del marketing y la búsqueda de atención a expensas de la verdad?"
  },
  {
    "label": "Pregunta 8",
    "value": 8,
    "question": "¿Qué se sugiere sobre la mentalidad y prácticas de los profesionales del marketing que actúan de manera egoísta según el capítulo?"
  },
  {
    "label": "Pregunta 9",
    "value": 9,
    "question": "¿Cuál es el significado y la importancia del concepto de 'voluntarios, no víctimas' en el contexto del marketing moderno, según el autor?"
  },
  {
    "label": "Pregunta 10",
    "value": 10,
    "question": "¿Cómo describe el autor el papel del marketing en la cultura y qué oportunidades ofrece para cambiarla para mejor?"
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
