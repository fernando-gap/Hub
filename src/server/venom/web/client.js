const socket = io();

socket.on('qr', function(data) {
  console.log('received');
  const img = document.getElementById('img');
  img.src = data;
});
