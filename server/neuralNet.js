var brain = require('brain');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

module.exports = function(){
    var net = new brain.NeuralNetwork({
        hiddenLayers: [3]
    });

    //console.log(net.weights);

    net.train([{input: [0, 0], output: [0]},
        {input: [0, 1], output: [1]},
        {input: [1, 0], output: [1]},
        {input: [1, 1], output: [0]}]);

    var output = net.run([1, 0]);  // [0.987]
    //console.log(output);

   // console.log(net.weights[1][0][0]);
    net.weights[1][0][0] = 1000;

   // console.log(net.weights[1][0][0]);


    var output = net.run([1, 0]);  // [0.987]
   // console.log(output);



};
