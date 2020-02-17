# UA (Universal Activity) Engine

A WIP 'engine' to wrap common functionality, classes and types used in immersive, audio-driven, graphically rich and gamified English langauge learning products, supporting the creation of a DRY codebase, and the seperation of concerns. To be published as an NPM package. Should build phaser, and bundle it internally.

One of the core goals is to make it almost unnecessary for the 'client' (the product using the engine) to access the Phaser framework directly -- the common types of actions, animations and behaviors will be encapsulated in the Engines API. It will function like an abstraction layer, or an adapter, between the client (learning product) and the framework. 

This has several key advantages; it allows for the seperation of concerns (single purpose for each object), and minimizes code duplication; it simplifies the creation of activity types for these products; creates a common programming framework (universality and homogeny); and seperate the business logic more completely from the lower level code; This means that, theoretically, were it necessary,the engine could be alterned in the future to output to a different HTML framework.

## Installing through NPM
UA Engine os available on NPM. To install, simply run *npm install ua-engine*. 