import time
from django.conf import settings

# Try to safely import socketio
# This is needed because running with live reload, in development, interferes
# with the import of socketio
try:
  import socketio
except Exception as e:
  print(e)


def try_emit(event, data=None, namespace=None):
  
  if socketio:
    try:
      socket = socketio.Client()
      server_address = '%s:%s' %(settings.SOCKET_IO_SERVER_HOST, settings.SOCKET_IO_SERVER_PORT)
      
      if namespace:
        socket.connect(server_address, namespaces=[namespace,])
      else:
        socket.connect(server_address)

      time.sleep(.1) # Wait for the connection to have a chance to be connected
      socket.emit(event, data=data, namespace=namespace)
      time.sleep(.1) # Wait for the emit event to have a chance to be sent
      
      socket.disconnect()
    except Exception as e:
      print('An error occurred pushing new post data to Socket.IO')
