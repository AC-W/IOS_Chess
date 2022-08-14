import {createContext} from 'react';
import socketio from "socket.io-client";

export const socket = socketio.connect("https://socketioserveracw.herokuapp.com");
export const SocketContext = createContext();