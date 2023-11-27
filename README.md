CrawlerGameEngine
Introduction

Welcome to the CrawlerGameEngine, a UI framework for a custom renderer. This engine facilitates the manipulation of rendering components, offering an interactive experience for shape and light management.
Interface Components
Shape Creation

    createRectangle: Allows users to create predefined shapes. Example usage:

    CRAWLER_GAME_ENGINE.ShapeMapping = {
        "Cube": { constructor: CRAWLER_RENDERER.SHAPES.THREED.Cube, label: "Cube" },
        // Other shapes...
    };
    CRAWLER_GAME_ENGINE.Interface.UpdateCreateTool();

Shape Functions

    functionRectangle: Access and execute functions like "Destroy", "Export", and "Relabel" for the current shape.

Lighting Components

    lightFunctionRectangle: Similar to functionRectangle, but for light manipulation.
    lightRectangle: User interface for specifying current light settings.
    lightRelabelRectangle: Interface for relabeling lights.
    lightTranslationRectangle: Adjusts light position based on user input.
    lightPropertiesRectangle: Modifies properties of the current light.
    materialRectangle: Changes material properties of the current material.
    relabelRectangle: Interface for relabeling shapes.
    rotationRectangle: Controls the rotation of the current shape.
    scaleRectangle: Adjusts the scale of the current shape.
    shapeRectangle: UI for selecting the current object.
    translationRectangle: Similar to lightTranslationRectangle, but for shapes.

Global Variables

    CurrentlySelectedLight: Reference to the currently selected light.
    CurrentlySelectedShape: Reference to the currently selected shape.
    SVG: Holds UI elements.
    currentLightPropertiesAxis: Axis specified by the light properties rectangle.
    currentMaterialAxis: Axis specified by the material properties rectangle.
    lightTranslationIncrement: Increment for light translation.
    rotationX, rotationY, rotationZ: Values for shape rotation.
    scaleIncrement: Increment for scaling shapes.
    translationIncrement: Increment for shape translation.

Usage

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
        integrity="sha512-zhHQR0/H5SEBL3Wn6yYSaTTZej12z0hVZKOv3TwCUXT1z5qeqGcXJLLrbERYRScEDDpYIJhPC1fk31gqR783iQ=="
        crossorigin="anonymous" defer>
    </script>

    <script type="module" src="https://crawlerinterfaceserver.ike5.repl.co/InterfaceManager.js" defer></script>
    <script type="module" src="https://crawlerrendererserver.ike5.repl.co/RendererManager.js" defer></script>
    <script type="module" src="https://crawlergameengineserver.ike5.repl.co/EngineManager.js" defer></script>
