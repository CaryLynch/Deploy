var net = require('net');
var server = net.createServer();

var fs = require('fs');
var json = fs.readFileSync("./netAppInput.json", "utf8");
var jsonArray = JSON.parse(json);

server.on('connection', function(client) { 
  console.log('client connected');
  client.setEncoding('utf8');

    client.on('data', function(stringFromClient) { 
     var input = stringFromClient.trim();
     var splitInput = input.split(" "); 
        console.log(splitInput);
     var command = splitInput[0];
    if(command === "write") {
         var statusFromInput = splitInput[1];
         var taskFromInput = splitInput[2];
         var newObject = {
            status: statusFromInput,
            task: taskFromInput,
        }
        client.write(newObject.status);
        jsonArray.push(newObject);
        var backToJson = JSON.stringify(jsonArray);
        fs.writeFileSync("./netAppInput.json", backToJson, "utf8");
        client.write("Task saved! Don't forget to mark it as complete once finished!");
    }else if(command === "read"){
        jsonArray.forEach(function(objects){
            client.write(objects.task + " is " + objects.status + "\n");
        })
    };
  });
});

server.listen(8124, function() { 
  console.log('connected');
});