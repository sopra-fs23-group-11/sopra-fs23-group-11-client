<img src=https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/ReadMePics/WelcomeToBattleShip.JPG />

# Battleship Game - Client

## Table of Content

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Main Components](#main-components)
- [Launch](#launch)
- [Deployment](#deployment)
- [Illustrations](#illustrations)
- [Roadmap](#roadmap)
- [Authors and Acknowledgment](#authors-and-acknowledgment)
- [License](#license)

## Introduction
Welcome to the Battleship Game project! This is a digital implementation of the classic strategy game where players engage in a battle of wits and strategy on the high seas. The game challenges players to strategically position their fleet of ships on a grid and tactically guess the locations of their opponent's ships.

This project aims to provide an enjoyable gaming experience while showcasing the use of modern web technologies. Whether you're a fan of the original board game or simply looking for a fun and engaging online game, Battleship Game offers an immersive experience that will keep you hooked.

[Play here.](http://sopra-fs23-group-11-client.oa.r.appspot.com/)

![](https://placehold.it/200x25/ff0000/000000?text=Disclaimer!)</br>

Be sure to use the "http" instead of "https" when using the App.

## Technologies Used
* <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg" width="16" height="16" /> [React](https://react.dev/) - Front-end JavaScript library concerning the user interface
* <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" width="16" height="16" /> [Vite](https://vitejs.dev/) - Front-end tool that is used for building fast and optimized web applications
* <img src="https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/ReadMePics/reactRouter.JPG" width="16" height="16" /> [React Router](https://reactrouter.com/en/main) - Library for implementing routing in React applications
* <img src="https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/ReadMePics/ChakraUI.JPG" width="16" height="16" /> [Chakra UI](https://chakra-ui.com/) - Open-source React component library
* <img src="https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/ReadMePics/FramerMotionIcon.JPG" width="16" height="16" /> [Framer Motion](https://www.framer.com/?utm_source=google&utm_medium=adwords&utm_campaign=TW-WW-All-GS-UA-Traffic-20190326-Brand.Bmm_WW-All-GS-KEY-x-1399-Brand.Bmm-Framer&gad=1&gclid=Cj0KCQjwjryjBhD0ARIsAMLvnF_uZHGpdD7MYHUUQ34hhEkd8ach3c2c8CYLYqVokFWwPmjae8hsQZEaAv1WEALw_wcB) - Animation library for React
* <img src="https://user-images.githubusercontent.com/91155454/170843632-39007803-3026-4e48-bb78-93836a3ea771.png" width="16" height="16" /> [STOMP](https://stomp-js.github.io/stomp-websocket/) - Used for Websockets
* <img src="https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/ReadMePics/DicebearAPI.JPG" width="16" height="16" />[Dicebear API](https://www.dicebear.com/) - For creating Avatars

## Main Components
 
### Setup
The [Setup](https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/pages/Setup.jsx) is an essential part of the battleship game as it handles the preparation phase where players place their ships on the game board before the game starts. The component establishes a WebSocket connection using the Stomp.js library to enable real-time communication between players. After this stage you will be directed to the game.

### Game
The [Game](https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/pages/Game.jsx) represents the main gameplay screen where the actual game is played between two players. It contains the logic and user interface for managing the game state, handling player actions, communicating with the server using websockets, rendering the game boards, displaying messages between players, and managing the overall flow of the game.
 
### GameContext
The [GameContext](https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/contexts/GameContext.jsx) file is an important component of our BattleShip game. It serves as a context provider for the game's state and functionality. It encapsulates the state related to the game, including the player's and enemy's boards, ships, turns, readiness, and game results. It also provides various functions to handle actions such as placing ships, shooting missiles, handling sunk ships, resetting the game state, and more.
 
### BattleShipBoard
The [BattleshipBoard](https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/src/components/BattleShipBoard.jsx) represents the game board where the players place their ships, track their own shots, and view the opponent's shots. It handles the rendering of the grid, cells, and ships on the board, as well as the interaction and logic related to placing ships, shooting at cells, and displaying the game state. The BattleShipBoard is used in both the setup and the game.

## Launch

### Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Clone the client-repository onto your local machine with the help of [Git](https://git-scm.com/downloads).

```git clone https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client.git```

You can find the corresponding server repository [here](https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-server).

### Prerequisites and Installation
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org).<br /> After downloading Node.js we have to install all other dependencies by using the following command. Please run the command before starting the application for the first time.

```npm install```

If you want to see your development, run the following command:

```npm run dev```

Now [http://localhost:5173](http://localhost:5173) gets opened in a new browser tap, and you see your application. Do not forget to start the server for full functionality.

### Build
You may run `npm run build` command to build the app. 
By default, the build output will be placed at `dist` folder. 

### Testing the App Locally
Once you've built the app, you may test it locally by running `npm run preview` command. 
This will boot up a local static web server that serves the files form `dist` at [http://localhost:4173](http://localhost:4173). It's an easy way to check if the production build looks OK in you local environment.

## Deployment
The main branch is automatically mirrored onto Google Cloud App Engine via GitHub workflow, each time you push onto the main branch.
See this section about [deployment](https://vitejs.dev/guide/static-deploy.html) for more information
about deployment using Vite.

### Create Releases
- [Follow GitHub documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- Database is reset during a release with the current settings!

## Illustrations
<h3 align="center">
  <br>
  <a href="https://github.com/sopra-fs23-group-11"><img src="src/ReadMePics/startup.gif" alt="Battleship" width="500"></a>
  <br>
  LANDING - As a player, you can register or log in with an avatar.
  <br>
</h3>


<h3 align="center">
  <br>
  <a href="https://github.com/sopra-fs23-group-11"><img src="src/ReadMePics/setup.gif" alt="Battleship" width="500"></a>
  <br>
  SET-UP - In the set-up stage, the player needs to place ships onto the board.
  <br>
</h3>
<h3 align="center">
  <br>
  <a href="https://github.com/sopra-fs23-group-11"><img src="src/ReadMePics/game.gif" alt="Battleship" width="500"></a>
  <br>
  Game - The two players take turns shooting missiles, hit/miss/sunk show different icons.
  <br>
</h3>
<h3 align="center">
  <br>
  <a href="https://github.com/sopra-fs23-group-11"><img src="src/ReadMePics/endscreen.gif" alt="Battleship" width="500"></a>
  <br>
  End-screen - Once the game finishes, a winner or loser page displays.
  <br>
</h3>


## Roadmap
- Add secure connection (https instead of http)
- Make ships drag and drop at setup
- Different game modes
- Different shot types (salvo, grenade, atomic bomb)
- Make game responsive for mobile screens

## Authors and Acknowledgment

### Authors
* **Kalil Subaan Buraaleh** - [kalilsub](https://github.com/kalilsub)
* **Nazek Olabi** - [Olabi98](https://github.com/Olabi98)
* **Louis Zürcher** - [LouisZuercher2](https://github.com/LouisZuercher2)
* **Qing Dai** - [qing-dai](https://github.com/qing-dai)
* **Nick Schlatter** - [Nickschlaedde](https://github.com/Nickschlaedde)

### Acknowledgment
We would like to thank our TA [Isabella](https://github.com/bellachesney) and the whole team of the course Software Engineering Lab from the University of Zurich.

#### Credits
##### Images
[Sinking Ship](https://www.freepik.com/free-vector/broken-junk-ship-sinking-sea_24157524.htm#query=sinking%20ship&position=5&from_view=keyword&track=ais) Image by brgfx <br />
[Winning Ship](https://pngtree.com/freepng/ship_3683653.html?sol=downref&id=bef) Image by islam elzayat <br />
[Setup Ships](https://www.freepik.com/free-vector/military-boats-collection_9585890.htm#query=navy%20battleship&position=2&from_view=keyword&track=ais) Images by macrovector
##### Sounds
[Cannonball Sound](https://www.fesliyanstudios.com/royalty-free-sound-effects-download/water-splashing-20) as "placing ship" sound. <br />
[Bubbles](https://elements.envato.com/de/bubbles-9HUSJBM?_ga=2.76043477.175351568.1685008728-1436866847.1683553923&utm_campaign=elements_mixkit_cs_sfx_tag&utm_medium=referral&utm_source=mixkit) as "placing ship" sound.<br />
[Arcade Explosion](https://mixkit.co/free-sound-effects/explosion) as "hit" sound. <br />
[Water drop](https://www.videvo.net/sound-effect/bubble-pop-classic-pl-pe570910/237477) as "miss" sound.<br />
[Morse Sound](https://pixabay.com/sound-effects/morse-code-131798/) as "radio" sound.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/sopra-fs23-group-11/sopra-fs23-group-11-client/blob/main/LICENSE) file for details.
