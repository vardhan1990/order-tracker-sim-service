var _ = require('lodash');
var json = require('./data.json');
const io = require('socket.io')();

io.on('connection', (client) => {
  console.log('user connected. waiting for ready event...');

  client.on('ready', () => {
    console.log('received ready event');
    console.log('starting timer and will check for new orders every second...');
    const interval = 1000; // 1 second
    let currentTime = 0; // start timer with 0 as initial value
    let clock = setInterval(() => {
      console.log('emiting timer event at time ' + currentTime + 's');
      client.emit('timer', currentTime);

      const newCardsToBeSent = _.remove(json, newCard => newCard.sent_at_second <= currentTime);
      if (newCardsToBeSent.length > 0) {
        console.log('emiting newCards event at time ' + currentTime + 's');
        client.emit('newCards', JSON.stringify(newCardsToBeSent));
      }

      currentTime++;
    }, interval);
  });

  client.on('disconnect', function(){
    console.log('user disconnected');
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);