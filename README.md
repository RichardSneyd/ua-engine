# UA (Universal Activity) Engine

A WIP 'engine' to wrap common functionality, classes and types used in immersive, audio-driven, graphically rich and gamified English langauge learning products, supporting the creation of a DRY codebase, and the seperation of concerns. To be published as an NPM package. Should build phaser, and bundle it internally.

One of the core goals is to make it almost unnecessary for the 'client' (the product using the engine) to access the Phaser framework directly -- the common types of actions, animations and behaviors will be encapsulated in the Engines API. It will funciton like an abstarction layer, or an adapter.

