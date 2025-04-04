'use client'

import { useEffect, useState } from "react";
import ModemDashboard from "@/components/modem-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { DateTimeDisplay } from "@/components/date-time-display";
import mqtt from 'mqtt';

export default function Home() {
  // Explicitly type messages as an array of strings
  const [messages, setMessages] = useState<string[]>([]);

  // Set up the MQTT client and subscribe to the topic
  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');
 
    // Handle connection
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('test/topic', (err) => {
        if (!err) {
          console.log('Subscribed to test/topic');
        } else {
          console.log('Error subscribing: ', err);
        }
      });
    });

    // Handle incoming messages
    client.on('message', (topic, message) => {
      setMessages(prevMessages => [
        ...prevMessages, 
        `Received: ${message.toString()} from ${topic}`
      ]);
    });

    // Clean up on component unmount
    return () => {
      client.end();
    };
  }, []);  // The empty array ensures this effect runs only once on mount

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modem Monitor</h1>
        <div className="flex items-center gap-4">
          <DateTimeDisplay />
          <ThemeToggle />
        </div>
      </div>
      <ModemDashboard />

      {/* Display incoming MQTT messages */}
      <div className="flex mt-6">
        <div id="messages">
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
