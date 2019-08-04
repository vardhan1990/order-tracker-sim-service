const io = require('socket.io')();

io.on('connection', (client) => {
  console.log('user connected. waiting for ready event...');

  client.on('ready', () => {
    console.log('received ready event');
    console.log('starting timer and will check for new orders every second...');
    const interval = 1000; // 1 second
    let currentTime = 0; // start timer with 0 as initial value
    const newCard = {
      id: "01",
      name: "Cheese Pizza",
      event_name: "CREATED",
      sent_at_second: 1,
      destination: "1041 S Fairfax Ave, LA, CA 90019"
    };
    setInterval(() => {
      console.log('emiting newCard event at time ' + currentTime + 's: ' + JSON.stringify(newCard));
      client.emit('newCard', newCard);
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