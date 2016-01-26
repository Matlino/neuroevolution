var brain = require('brain');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var inputLayer = new Layer(4);
var hiddenLayer = new Layer(6);
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
        }


        //returning array of directions which should deers move, so array is as long as count of deers
        return directions;
    }



 ////train the network
 //   var learningRate = .3;
 //   for (var i = 0; i < 20000; i++)
 //   {
 //       // 0,0 => 0
 //       myNetwork.activate([0,0]);
 //       myNetwork.propagate(learningRate, [0]);
 //
 //       // 0,1 => 1
 //       myNetwork.activate([0,1]);
 //       myNetwork.propagate(learningRate, [1]);
 //
 //       // 1,0 => 1
 //       myNetwork.activate([1,0]);
 //       myNetwork.propagate(learningRate, [1]);
 //
 //       // 1,1 => 0
 //       myNetwork.activate([1,1]);
 //       myNetwork.propagate(learningRate, [0]);
 //   }


// test the network
//    myNetwork.activate([0,0]); // [0.015020775950893527]
//    myNetwork.activate([0,1]); // [0.9815816381088985]
//    myNetwork.activate([1,0]); // [0.9871822457132193]
//    myNetwork.activate([1,1]); // [0.012950087641929467]

    //console.log(myNetwork.activate([eyesValues[0],eyesValues[1],eyesValues[2],eyesValues[3]]));

    //console.log(myNetwork.activate([100000,1,-10000,1]));



    // var myNetwork = new Architect.Perceptron(2,4,1);

    //tymto zistim ake je to pole velke
    //console.log(Object.keys(myNetwork.layers.input.list[0].connections.projected));

    //console.log(Object.keys(myNetwork.layers.hidden.list));


    //console.log(myNetwork.layers.input.list[0].connections.projected[7].weight) // -0.09417646038345993
//
//    myNetwork.trainer.XOR(); // <- train the network
   // console.log(myNetwork.layers.input.list[0].connections.projected[6].weight) // -0.09417646038345993
   // myNetwork.restore(); // <- popullate the network

   // console.log(myNetwork.layers.output.list[0].connections.inputs[12].weight);
   // console.log(myNetwork.layers.output.list[0].connections.inputs[13].weight);
    //console.log(myNetwork.layers.input);

    //myNetwork.layers.input.list[0].connections.projected[7].weight = 10000;
    //myNetwork.layers.input.list[0].connections.projected[8].weight = 10000;
    //myNetwork.layers.input.list[0].connections.projected[10].weight = 10000;
  //  console.log(myNetwork.layers.input.list[0].connections.projected[5].weight) // 0.9376776976219627
 //   console.log(myNetwork.activate([10,5]));
};
