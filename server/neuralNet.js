var brain = require('brain');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

//every layer could have different size later on
var layer_size = 4;

module.exports = {
    // create neural network for deer
    createNetwork : function(){
        var inputLayer = new Layer(layer_size);
        var hiddenLayer = new Layer(layer_size);
        var outputLayer = new Layer(layer_size);

        inputLayer.project(hiddenLayer);
        hiddenLayer.project(outputLayer);

        var myNetwork = new Network({
            input: inputLayer,
            hidden: [hiddenLayer],
            output: outputLayer
        });

        return myNetwork;
    },

    neuralNetworkToJSON : function(neuralNetwork){
        return neuralNetwork.toJSON()
    },

    //activate networks
    activateNet : function(deerNetworks) {
        var output;
        var directions = [];
        for (var i = 0; i < deerNetworks.length; i++) {
            var myNetwork = Network.fromJSON(deerNetworks[i].neuralNetwork);
            output = myNetwork.activate(deerNetworks[i].eyesValues);
            directions.push(output.indexOf(Math.max.apply(Math, output)));
        }
        //returning array of directions which should deers move, so array is as long as count of deers
        return directions;
    },

    /**
     * sort deers by health and then mutate best n of them.
     * Return neural networks with mutated weights.
     * @param deers
     * @returns {Array}
     */
    mutation : function(deers) {
        var mutationCount = 5;
        var i,j;

        //sort deers by health
        deers.sort(function(a, b){
            return a.health - b.health;
        });

        var mutationDeers = [];
        for (j=deers.length-1; j>deers.length-mutationCount-1; j--){
            mutationDeers.push(deers[j])
        }

        var mutatedNetworks = [];
        var keys;
        var newKeys;
        var actNetwork;
        var mutatedNetwork;
        for (var index = 0; index<mutationDeers.length; index++){
            actNetwork = Network.fromJSON(mutationDeers[index].neuralNetwork);
            mutatedNetwork = this.createNetwork();


            for (j = 0; j < layer_size; j++) {
                keys = Object.keys(actNetwork.layers.input.list[j].connections.projected);
                newKeys = Object.keys(mutatedNetwork.layers.input.list[j].connections.projected);

                for (i = 0;i < keys.length; i++){
                    mutatedNetwork.layers.input.list[j].connections.projected[newKeys[i]].weight =
                        weightMutation(actNetwork.layers.input.list[j].connections.projected[keys[i]].weight);
                }
            }


            for (j = 0; j < layer_size; j++) {
                keys = Object.keys(actNetwork.layers.output.list[j].connections.inputs);
                newKeys = Object.keys(mutatedNetwork.layers.output.list[j].connections.inputs);
                for (i = 0; i < keys.length; i++) {
                    mutatedNetwork.layers.output.list[j].connections.inputs[newKeys[i]].weight =
                        weightMutation(actNetwork.layers.output.list[j].connections.inputs[keys[i]].weight);
                }
            }
            mutatedNetworks.push(mutatedNetwork);
        }

        return mutatedNetworks;
    }
};

function weightMutation(weight){
    //50% chance it add 0.1 to weight or subtract 0.1
    //TO DO exp when weight go more than 1 orr less than -1
    var weightChange = 0.1;
    var threshold = 0.5;
    if (Math.random() > threshold){
        return weight + weightChange;
    }else{
        return weight - weightChange
    }
}

/**
 * print weights of neural network
 * @param network
 */
function printWeights(network){
    var i,j;
    for (j = 0; j < layer_size; j++) {
        var keys = Object.keys(network.layers.input.list[j].connections.projected);
        for (i in keys) {
            console.log(network.layers.input.list[j].connections.projected[keys[i]].weight);
        }
    }

    console.log();

    for (j = 0; j < layer_size; j++) {
        keys = Object.keys(network.layers.output.list[j].connections.inputs);
        for (i in keys) {
            console.log(network.layers.output.list[j].connections.inputs[keys[i]].weight);
        }
    }
}