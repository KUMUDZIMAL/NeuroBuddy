'use client';

import { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface VideoCallProps {
  roomID: string;
  userID: string;
  userName: string;
}

export default function VideoCall({ roomID, userID, userName }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initVideoCall = async () => {
      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID, 
        serverSecret || '', 
        roomID, 
        userID, 
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'Copy link',
            url: `${window.location.origin}/room/${roomID}`
          }
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
      });
    };

    if (containerRef.current) {
      initVideoCall();
    }

    return () => {
      // Cleanup if needed
    };
  }, [roomID, userID, userName]);

  return <div ref={containerRef} className="w-full h-[600px]" />;
}