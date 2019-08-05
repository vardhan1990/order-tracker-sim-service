var _ = require('lodash');
var json = require('./data.json');
const io = require('socket.io')();

io.on('connection', (client) => {
  console.log('user connected. waiting for ready event...');
  let clock = null;

  client.on('ready', () => {
    console.log('received ready event. starting clock...');

    const interval = 1000; 
    let currentTime = 0;

    // Clock ticks every second
    clock = setInterval(() => {
      currentTime++;

      // Emit clock tick event
      console.log('emiting timer event at time ' + currentTime + 's');
      client.emit('clockTick', currentTime);

      // Emit new updates event
      const newUpdatesToBeSent = _.filter(json, newUpdate => newUpdate.sent_at_second === currentTime);
      if (newUpdatesToBeSent.length > 0) {
        console.log('emiting newUpdates event at time ' + currentTime + 's');
        client.emit('newUpdates', JSON.stringify(newUpdatesToBeSent));
      }
    }, interval);
  });

  client.on('disconnect', function(){
    console.log('user disconnected');
    clearInterval(clock);
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);