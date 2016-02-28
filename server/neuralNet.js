var brain = require('brain');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var inputLayer = new Layer(4);
var hiddenLayer = new Layer(4);
var outputLayer = new Layer(4);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

module.exports = {


    ///////////////////brain//////////////////////////

   // var net = new brain.NeuralNetwork({
   //     hiddenLayers: [3]
   // });
   //
   // //console.log(net.weights);
   //
   // net.train([{input: [0, 0], output: [0]},
   //     {input: [0, 1], output: [1]},
   //     {input: [1, 0], output: [1]},
   //     {input: [1, 1], output: [0]}]);
   //
   // var output = net.run([1, 0]);  // [0.987]
   // console.log(output);
   //
   // console.log(net.weights);
   // net.weights[1][0][0] = 1000;
   //
   //// console.log(net.weights[1][0][0]);
   //
   //
   // var output = net.run([1, 0]);  // [0.987]
   //// console.log(output);



    logWeights : function(){
        //console.log(myNetwork.layers.input.list[0].connections);
        var pole = [1,1,1,1];
        console.log(myNetwork.activate(pole));

        console.log();
        //console.log(myNetwork.layers.input.list[0].connections.projected);

        var jsonNet = myNetwork.toJSON();

        //jsonNet.activate(eyesValues[0]);
        myNetwork  = Network.fromJSON(jsonNet);
        console.log(myNetwork.activate(pole));


    },



///////////////SYNAPTIC//////////////

    // create neural network for deer
    createNetwork : function(){
        myNetwork = new Network({
            input: inputLayer,
            hidden: [hiddenLayer],
            output: outputLayer
        });


        layer_size = 4;
        for (var j = 0; j < layer_size; j++) {
            var keys = Object.keys(myNetwork.layers.input.list[j].connections.projected);
            for (var i in keys) {
                console.log(myNetwork.layers.input.list[j].connections.projected[keys[i]].weight)
            }
        }

        console.log();

        for (j = 0; j < layer_size; j++) {
            keys = Object.keys(myNetwork.layers.output.list[j].connections.inputs);
            for (i in keys) {
                console.log(myNetwork.layers.output.list[j].connections.inputs[keys[i]].weight)
            }
        }

        console.log()
        for (j = 0; j < 10; j++) {
            console.log(Math.random());// * .2 - .1)
        }

        return myNetwork.toJSON();
    },

    //activate networks
    activateNet : function(deerNetworks) {
        var output;
        var directions = [];
        for (var i = 0; i < deerNetworks.length; i++) {
            myNetwork = Network.fromJSON(deerNetworks[i].neuralNetwork);
            output = myNetwork.activate(deerNetworks[i].eyesValues);
            directions.push(output.indexOf(Math.max.apply(Math, output)));

            //directions.push(1);
        }


        //returning array of directions which should deers move, so array is as long as count of deers
        return directions;
    },

    getWeights : function() {
        //layer_size = 4;
        //for (var j = 0; j < layer_size; j++) {
        //    var keys = Object.keys(myNetwork.layers.input.list[j].connections.projected);
        //    for (var i in keys) {
        //        console.log(myNetwork.layers.input.list[j].connections.projected[keys[i]].weight)
        //    }
        //}
        //
        //console.log();
        //
        //for (j = 0; j < layer_size; j++) {
        //    keys = Object.keys(myNetwork.layers.output.list[j].connections.inputs);
        //    for (i in keys) {
        //        console.log(myNetwork.layers.output.list[j].connections.inputs[keys[i]].weight)
        //    }
        //}
        //
        //console.log()
        //for (j = 0; j < 10; j++) {
        //    console.log(Math.random());// * .2 - .1)
        //}
    }

};
