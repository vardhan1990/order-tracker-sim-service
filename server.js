var _ = require('lodash');
var json = require('./data.json');
const io = require('socket.io')();

io.on('connection', (client) => {
  console.log('user connected. waiting for ready event...');
  const newCardsSorted = _.orderBy(json, ['sent_at_second', 'id'], ['asc', 'desc']);  

  client.on('ready', () => {
    console.log('received ready event');
    console.log('starting timer and will check for new orders every second...');
    const interval = 1000; // 1 second
    let currentTime = 0; // start timer with 0 as initial value
    let arrayIndex = 0;
    let clock = setInterval(() => {
      client.emit('timer', currentTime);
      console.log('emiting timer event at time ' + currentTime + 's');
      if (currentTime === newCardsSorted[arrayIndex].sent_at_second) {
        const newCard = newCardsSorted[arrayIndex++];
        console.log('emiting newCard event at time ' + currentTime + 's');
        client.emit('newCard', newCard);

        if(arrayIndex === newCardsSorted.length) {
          clearInterval(clock);
          console.log('Clock stopped at '+currentTime+'s');
        }
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