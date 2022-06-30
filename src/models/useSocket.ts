import { useState, useEffect } from 'react';
import { urlPrefix } from '@/api/request';

let curReConnectNum = 0;
// 最大重连次数
const maxReConnectNum = 20;

export default function useSocket() {
  const [socketInstance, setSocketInstance] = useState<any>(null);

  const connectSocket = () => {
    try {
      const socket = new window.SockJS(
        `${urlPrefix}/mugen-art-backed/mugenArt/webSocket`,
        '',
        {
          transports: ['xhr-polling'],
        },
      );
      const stompInstance = window?.Stomp.over(socket);
      stompInstance.heartbeat.outgoing = 20000;
      stompInstance.connect(
        {},
        function (frame: any) {
          // connect WebSocket
          setSocketInstance(stompInstance);
        },
        function (error: any) {
          if (curReConnectNum <= maxReConnectNum) {
            curReConnectNum++;
            console.log('catch socket lost connection, try reconnect~');
            // 避免断网一直重连
            setTimeout(connectSocket, 500);
          } else {
            console.warn('socket reconnect times is over limit max');
          }
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeSocketAllSubscribe = async () => {
    try {
      const socket = await socketInstance;
      if (socket?.connected) {
        Object.keys(socket.subscriptions)?.forEach((id) => {
          socket.unsubscribe(id);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    connectSocket();
    // 网络恢复连接，重连 socket
    window.addEventListener(
      'online',
      () => {
        connectSocket();
      },
      true,
    );
  }, []);

  return {
    socketInstance,
    removeSocketAllSubscribe,
  };
}
