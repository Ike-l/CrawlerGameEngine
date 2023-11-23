await initRendererGlobal()


const svg = new CRAWLER_INTERFACE.SVGS.SVGSVG({ width: "100%", height: "100%" })

const rectComponent = CRAWLER_INTERFACE.SVGS.SVGRectangle
let currentShape
let currentLight


window.CRAWLER_GAME_ENGINE = {}

CRAWLER_GAME_ENGINE.Globals = {}

CRAWLER_GAME_ENGINE.Globals.rotationX = { valueX: 0 }
CRAWLER_GAME_ENGINE.Globals.rotationY = { valueX: 0 }
CRAWLER_GAME_ENGINE.Globals.rotationZ = { valueX: 0 }
CRAWLER_GAME_ENGINE.Globals.scaleIncrement = { valueX: 0 }
CRAWLER_GAME_ENGINE.Globals.translationIncrement = { valueX: 0 }
CRAWLER_GAME_ENGINE.Globals.lightTranslationIncrement = { valueX: 0 }
CRAWLER_GAME_ENGINE.Globals.currentMaterialAxis = [0, 0, 0]
CRAWLER_GAME_ENGINE.Globals.currentLightPropertiesAxis = [0, 0, 0]
CRAWLER_GAME_ENGINE.Globals.SVG = svg
CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape = currentShape
CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight = currentLight
CRAWLER_GAME_ENGINE.ShapeMapping = {}
CRAWLER_GAME_ENGINE.InterfaceComponents = {}

function updateLightRectangleText() {
    const lightRectangle = CRAWLER_GAME_ENGINE.InterfaceComponents.lightRectangle
    const textAmounts = lightRectangle.Text.length
    const pLights = CRAWLER_RENDERER.CONSTANTS.LIGHTS.Point
    const sLights = CRAWLER_RENDERER.CONSTANTS.LIGHTS.Spot
    const dLights = CRAWLER_RENDERER.CONSTANTS.LIGHTS.Directional
    const Lights = pLights.concat(sLights).concat(dLights)
    for (let i = Lights.length; i < textAmounts; i++) {
        lightRectangle.Text[i].Remove()
        lightRectangle.Text.splice(i, 1)
        lightRectangle.Buttons[i + 4].Remove()
        lightRectangle.Buttons.splice(i + 4, 1)
    }
    Lights.forEach((light, index) => {
        CRAWLER_GAME_ENGINE.InterfaceComponents.lightRectangle.ReplaceLine(`${light.Label}`, index, { fontSize: "30px", fontColour: "#eeeeee" })
        if (typeof lightRectangle.Buttons[index + 4] == "undefined") {
            CRAWLER_GAME_ENGINE.InterfaceComponents.lightRectangle.PushButton({
                shape: "ellipse",
                buttonType: "function",
                x: 1 - 15 / (50 * 7.08), y: 15 / (50 * 5.36) + (index * 30 / (50 * 5.36)),
                width: "30px", height: "30px",
                fill: "blue",
                onClickFunction: CRAWLER_GAME_ENGINE.Interface.PickLight,
                onClickArguments: [index],
                visible: CRAWLER_GAME_ENGINE.InterfaceComponents.lightRectangle.ButtonVisibility
            })
        }
    })
}
function updateLightLabelRectangleText() {
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightRelabelRectangle.ReplaceLine(`Relabel:`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateFunctionLightText() {
    const rect = CRAWLER_GAME_ENGINE.InterfaceComponents.lightFunctionRectangle
    const currentlySelected = CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight
    let lineNumber = 1
    rect.ReplaceLine(`Current: ${currentlySelected ? currentlySelected.Label : ""}`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
    rect.ReplaceLine(`Export:`, lineNumber++, { fontSize: "30px", fontColour: "#eeeeee" })
    rect.ReplaceLine(`Relabel:`, lineNumber++, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateLightTranslationRectangleText() {
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightTranslationRectangle.ReplaceLine(`Translation: ${CRAWLER_GAME_ENGINE.Globals.lightTranslationIncrement.valueX.toFixed(3)}`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateLightPropertiesRectangleText() {
    const rect = CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle
    const globals = CRAWLER_GAME_ENGINE.Globals
    const currentlySelected = globals.CurrentlySelectedLight
    rect.ReplaceLine(`Axis: [${globals.currentLightPropertiesAxis}]`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
    if (currentlySelected) {
        const colour = currentlySelected.Colour
        rect.ReplaceLine(`Colour: [${colour[0].toFixed(2)}, ${colour[1].toFixed(2)}, ${colour[2].toFixed(2)}]`, 1, { fontSize: "30px", fontColour: "#eeeeee" })
        const intensity = currentlySelected.Intensity
        rect.ReplaceLine(`Intensity: ${intensity.toFixed(2)}`, 2, { fontSize: "30px", fontColour: "#eeeeee" })
        const attenuation = currentlySelected?.Attenuation || [0, 0, 0]
        rect.ReplaceLine(`Attenuation: [${attenuation[0].toFixed(2)}, ${attenuation[1].toFixed(2)}, ${attenuation[2].toFixed(2)}]`, 3, { fontSize: "30px", fontColour: "#eeeeee" })
        const innercone = currentlySelected?.InnerCone || 0
        rect.ReplaceLine(`Innercone: ${innercone.toFixed(2)}`, 4, { fontSize: "30px", fontColour: "#eeeeee" })
        const outercone = currentlySelected?.OuterCone || 0
        rect.ReplaceLine(`Outercone: ${outercone.toFixed(2)}`, 5, { fontSize: "30px", fontColour: "#eeeeee" })
    }
}

function updateLabelRectangleText() {
    CRAWLER_GAME_ENGINE.InterfaceComponents.relabelRectangle.ReplaceLine(`Relabel:`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateFunctionShapeText() {
    const rect = CRAWLER_GAME_ENGINE.InterfaceComponents.functionRectangle
    const currentlySelected = CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape
    let lineNumber = 1
    rect.ReplaceLine(`Current: ${currentlySelected ? currentlySelected.Label : ""}`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
    rect.ReplaceLine(`Destroy:`, lineNumber++, { fontSize: "30px", fontColour: "#eeeeee" })
    rect.ReplaceLine(`Export:`, lineNumber++, { fontSize: "30px", fontColour: "#eeeeee" })
    rect.ReplaceLine(`Relabel:`, lineNumber++, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateTranslationRectangleText() {
    CRAWLER_GAME_ENGINE.InterfaceComponents.translationRectangle.ReplaceLine(`Translation: ${CRAWLER_GAME_ENGINE.Globals.translationIncrement.valueX.toFixed(3)}`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateRotationRectangleText() {
    const globals = CRAWLER_GAME_ENGINE.Globals
    CRAWLER_GAME_ENGINE.InterfaceComponents.rotationRectangle.ReplaceLine(`Rotation: [${globals.rotationX.valueX.toFixed(3)}, ${globals.rotationY.valueX.toFixed(3)}, ${globals.rotationZ.valueX.toFixed(3)}]`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateScaleRectangleText() {
    CRAWLER_GAME_ENGINE.InterfaceComponents.scaleRectangle.ReplaceLine(`Scale: ${CRAWLER_GAME_ENGINE.Globals.scaleIncrement.valueX.toFixed(3)}`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
}
function updateMaterialRectangleText() {
    const rect = CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle
    const globals = CRAWLER_GAME_ENGINE.Globals
    const currentlySelected = globals.CurrentlySelectedShape
    rect.ReplaceLine(`Axis: [${globals.currentMaterialAxis}]`, 0, { fontSize: "30px", fontColour: "#eeeeee" })
    if (currentlySelected) {
        const ambience = currentlySelected.Ambience
        rect.ReplaceLine(`Ambience: [${ambience[0].toFixed(2)}, ${ambience[1].toFixed(2)}, ${ambience[2].toFixed(2)}]`, 1, { fontSize: "30px", fontColour: "#eeeeee" })
        const diffusivity = currentlySelected.Diffusivity
        rect.ReplaceLine(`Diffusivity: [${diffusivity[0].toFixed(2)}, ${diffusivity[1].toFixed(2)}, ${diffusivity[2].toFixed(2)}]`, 2, { fontSize: "30px", fontColour: "#eeeeee" })
        const specularity = currentlySelected.Specularity
        rect.ReplaceLine(`Specularity: [${specularity[0].toFixed(2)}, ${specularity[1].toFixed(2)}, ${specularity[2].toFixed(2)}]`, 3, { fontSize: "30px", fontColour: "#eeeeee" })
        rect.ReplaceLine(`Shininess: ${currentlySelected.Shininess.toFixed(2)}`, 4, { fontSize: "30px", fontColour: "#eeeeee" })
    }
}
function updateCreateRectangle() {
    const buttons = CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle.Buttons.slice(4)
    buttons.forEach((button, index) => {
        CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle.ReplaceLine(`${button.ClickArguments}`, index, { fontSize: "30px", fontColour: "#eeeeee" })
    })
}
function updateShapeRectangle() {
    const shapeRectangle = CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle
    const textAmounts = shapeRectangle.Text.length
    for (let i = CRAWLER_RENDERER.CONSTANTS.TriangleListShapes.length; i < textAmounts; i++) {
        shapeRectangle.Text[i].Remove()
        shapeRectangle.Text.splice(i, 1)
        shapeRectangle.Buttons[i + 4].Remove()
        shapeRectangle.Buttons.splice(i + 4, 1)
    }
    CRAWLER_RENDERER.CONSTANTS.TriangleListShapes.forEach((shape, index) => {
        CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle.ReplaceLine(`${shape.Label}`, index, { fontSize: "30px", fontColour: "#eeeeee" })
        if (typeof shapeRectangle.Buttons[index + 4] == "undefined") {
            CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle.PushButton({
                shape: "ellipse",
                buttonType: "function",
                x: 1 - 15 / (50 * 7.08), y: 15 / (50 * 5.36) + (index * 30 / (50 * 5.36)),
                width: "30px", height: "30px",
                fill: "blue",
                onClickFunction: CRAWLER_GAME_ENGINE.Interface.PickShape,
                onClickArguments: [index],
                visible: CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle.ButtonVisibility
            })
        }
    })

}

function TranslateLight(_, axisVector) {
    const translation = axisVector.map(axisValue => {
        return axisValue ? CRAWLER_GAME_ENGINE.Globals.lightTranslationIncrement.valueX : 0
    })
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Translate(translation)
    }
}
function UpdateColour(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        const index = CRAWLER_GAME_ENGINE.Globals.currentLightPropertiesAxis.indexOf(1)

        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Colour[index] = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Colour[index] + dx, 0)
        CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle._UpdateText()
    }
}
function UpdateAttenuation(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Attenuation != "undefined") {
            const map = ["Constant", "Linear", "Quadratic"]
            const index = CRAWLER_GAME_ENGINE.Globals.currentLightPropertiesAxis.indexOf(1)
            CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight[map[index]] = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight[map[index]] + dx, 0)
            CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle._UpdateText()
        }
    }
}
function UpdateIntensity(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Intensity = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Intensity + dx, 0)
        CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle._UpdateText()
    }
}
function UpdateInnercone(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.InnerCone != "undefined") {
            CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.InnerCone = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.InnerCone + dx, 0)
            CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle._UpdateText()
        }
    }
}
function UpdateOutercone(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.InnerCone != "undefined") {
            CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.OuterCone = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.OuterCone + dx, 0)
            CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle._UpdateText()
        }
    }
}

function Rotate(_x, _y, _xy, dx, _dy, _dxy, args) {
    if (dx !== 0) {
        if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
            console.log("Rotation BY:", args)
            CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Rotate(args, dx)
            this.Parent._UpdateText()
        }
    }
}
function UpdateAmbience(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        const index = CRAWLER_GAME_ENGINE.Globals.currentMaterialAxis.indexOf(1)
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Ambience[index] = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Ambience[index] + dx, 0)
        CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle._UpdateText()
    }
}
function UpdateDiffusivity(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        const index = CRAWLER_GAME_ENGINE.Globals.currentMaterialAxis.indexOf(1)
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Diffusivity[index] = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Diffusivity[index] + dx, 0)
        CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle._UpdateText()
    }
}
function UpdateSpecularity(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        const index = CRAWLER_GAME_ENGINE.Globals.currentMaterialAxis.indexOf(1)
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Specularity[index] = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Specularity[index] + dx, 0)
        CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle._UpdateText()
    }
}
function UpdateShininess(_x, _y, _xy, dx) {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Shininess = Math.max(CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Shininess + dx, 0)
        CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle._UpdateText()
    }
}
function Scale(_, axisVector) {
    const scaleFactor = axisVector.map(axisValue => {
        return axisValue ? CRAWLER_GAME_ENGINE.Globals.scaleIncrement.valueX : 1
    })
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Stretch(scaleFactor)
    }
}
function Translate(_, axisVector) {
    const translation = axisVector.map(axisValue => {
        return axisValue ? CRAWLER_GAME_ENGINE.Globals.translationIncrement.valueX : 0
    })
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Translate(translation)
    }
}

function PickLight(_, index) {
    this.Parent._UpdateText()
    const pLights = CRAWLER_RENDERER.CONSTANTS.LIGHTS.Point
    const sLights = CRAWLER_RENDERER.CONSTANTS.LIGHTS.Spot
    const dLights = CRAWLER_RENDERER.CONSTANTS.LIGHTS.Directional
    const Lights = pLights.concat(sLights).concat(dLights)
    CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight = Lights[index]
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightFunctionRectangle._UpdateText()
}
function SwitchLightPropertiesAxis(_, axis) {
    CRAWLER_GAME_ENGINE.Globals.currentLightPropertiesAxis = axis
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle._UpdateText()
}
function ExportLight() {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Export()
    }
}
function ReLabelLight() {
    const text = CRAWLER_GAME_ENGINE.InterfaceComponents.lightRelabelRectangle.Text[1]
    if (text) {
        const label = text.Text
        if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight != "undefined") {
            let offset = 0

            if (label.charAt(label.length - 1) == "_") {
                offset = 1
            }
            CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedLight.Label = label.slice(0, label.length - offset)
            CRAWLER_GAME_ENGINE.InterfaceComponents.lightFunctionRectangle._UpdateText()
        }
    }
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightRectangle._UpdateText()
}

function PickShape(_, index) {
    this.Parent._UpdateText()
    CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape = CRAWLER_RENDERER.CONSTANTS.TriangleListShapes[index]
    CRAWLER_GAME_ENGINE.InterfaceComponents.functionRectangle._UpdateText()
}
function SwitchMaterialAxis(_, axis) {
    CRAWLER_GAME_ENGINE.Globals.currentMaterialAxis = axis
    CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle._UpdateText()
}
function CreateShape(_, objName) {
    const object = CRAWLER_GAME_ENGINE.ShapeMapping[objName]
    CRAWLER_RENDERER.CONSTANTS.TriangleListShapes.push(new object.constructor({ label: object.label }))
    CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle._UpdateText()
}
function DestroyShape() {
    if (CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape) {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Destroy(CRAWLER_RENDERER.CONSTANTS.TriangleListShapes)
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape = undefined
        CRAWLER_GAME_ENGINE.InterfaceComponents.functionRectangle._UpdateText()
        CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle._UpdateText()
    }
}
function ExportShape() {
    if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
        CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Export()
    }
}
function ReLabel() {
    const text = CRAWLER_GAME_ENGINE.InterfaceComponents.relabelRectangle.Text[1]
    if (text) {
        const label = text.Text
        if (typeof CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape != "undefined") {
            let offset = 0

            if (label.charAt(label.length - 1) == "_") {
                offset = 1
            }
            CRAWLER_GAME_ENGINE.Globals.CurrentlySelectedShape.Label = label.slice(0, label.length - offset)
            CRAWLER_GAME_ENGINE.InterfaceComponents.functionRectangle._UpdateText()
        }
    }
    CRAWLER_GAME_ENGINE.InterfaceComponents.shapeRectangle._UpdateText()
}
function UpdateCreateTool() {
    const buttons = CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle.Buttons
    CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle.ClearText()
    buttons.splice(4)
    Object.entries(CRAWLER_GAME_ENGINE.ShapeMapping).forEach((shape, index) => {
        CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle.PushButton({
            shape: "ellipse",
            buttonType: "function",
            x: 1 - 15 / 250, y: (15 + index * 30) / 250,
            width: "30px", height: "30px",
            fill: "red",
            onClickFunction: CRAWLER_GAME_ENGINE.Interface.CreateShape,
            onClickArguments: [shape[0]]
        })
    })
    CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle._UpdateText()
    CRAWLER_GAME_ENGINE.InterfaceComponents.createRectangle.UpdateTransformations()
}
CRAWLER_GAME_ENGINE.Interface = {
    Rotate, UpdateAmbience, UpdateDiffusivity, UpdateSpecularity, UpdateShininess, Scale, Translate, PickShape, SwitchMaterialAxis, CreateShape, DestroyShape, ExportShape, ReLabel, UpdateCreateTool,
    SwitchLightPropertiesAxis, UpdateColour, UpdateIntensity, UpdateAttenuation, UpdateInnercone, UpdateOutercone, TranslateLight, PickLight, ReLabelLight, ExportLight
}

const UpdateObjectMappings = {
    Label: updateLabelRectangleText,
    Function: updateFunctionShapeText,
    Translation: updateTranslationRectangleText,
    Rotation: updateRotationRectangleText,
    Scale: updateScaleRectangleText,
    Material: updateMaterialRectangleText,
    Create: updateCreateRectangle,
    Shape: updateShapeRectangle,
    Light: updateLightRectangleText,
    LightRelabel: updateLightLabelRectangleText,
    LightFunction: updateFunctionLightText,
    LightTranslation: updateLightTranslationRectangleText,
    LightProperties: updateLightPropertiesRectangleText
}
const componentMappings = [
    { name: "shapeRectangle", label: "Shape", x: "10%", y: "10%", },
    { name: "translationRectangle", label: "Translation", x: "10%", y: "30%" },
    { name: "scaleRectangle", label: "Scale", x: "10%", y: "50%" },
    { name: "rotationRectangle", label: "Rotation", x: "10%", y: "70%" },
    { name: "createRectangle", label: "Create", x: "30%", y: "10%" },
    { name: "functionRectangle", label: "Function", x: "30%", y: "30%" },
    { name: "relabelRectangle", label: "Label", textEditable: true, x: "30%", y: "50%" },
    { name: "materialRectangle", label: "Material", x: "30%", y: "70%" },
    { name: "lightRectangle", label: "Light", x: "50%", y: "10%" },
    { name: "lightRelabelRectangle", label: "LightRelabel", textEditable: true, x: "50%", y: "30%" },
    { name: "lightFunctionRectangle", label: "LightFunction", x: "50%", y: "50%" },
    { name: "lightTranslationRectangle", label: "LightTranslation", x: "50%", y: "70%" },
    { name: "lightPropertiesRectangle", label: "LightProperties", x: "70%", y: "10%" },
]
// Create the Interface SVGs
for (let i = 0; i < componentMappings.length; i++) {
    const currentComponent = componentMappings[i]
    CRAWLER_GAME_ENGINE.InterfaceComponents[currentComponent.name] = new rectComponent({
        parent: CRAWLER_GAME_ENGINE.Globals.SVG,
        buttons: "default",
        label: currentComponent.label,
        x: currentComponent.x, y: currentComponent.y,
        width: "50px", height: "50px",
        scale: [5, 5],
        fill: "#2d2d2d",
        moveable: true, textEditable: currentComponent.textEditable
    })
    CRAWLER_GAME_ENGINE.InterfaceComponents[currentComponent.name]._UpdateText = UpdateObjectMappings[currentComponent.label]
    CRAWLER_GAME_ENGINE.InterfaceComponents[currentComponent.name]._UpdateText()
}
// Create a line for the user to type on
CRAWLER_GAME_ENGINE.InterfaceComponents.relabelRectangle.Write("", true, false, { fontSize: "20px", fontColour: "#aaaaaa" })
CRAWLER_GAME_ENGINE.InterfaceComponents.lightRelabelRectangle.Write("", true, false, { fontSize: "20px", fontColour: "#aaaaaa" })
// forgot comma
const axisArgs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
for (let i = 0; i < 3; i++) {
    const x = 0.25 + 0.25 * i
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: x, y: 30 / 250,
        width: "30px", height: "30px",
        fill: "red",
        onClickFunction: CRAWLER_GAME_ENGINE.Interface.SwitchLightPropertiesAxis,
        onClickArguments: [axisArgs[i]]
    })
}
const lightPropertyArgs = [{ value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateColour }, { value: 10, function: CRAWLER_GAME_ENGINE.Interface.UpdateIntensity }, { value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateAttenuation }, { value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateInnercone }, { value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateOutercone }]
for (let i = 0; i < lightPropertyArgs.length; i++) {
    const y = (60 + i * 30) / 250
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle.PushButton({
        shape: "ellipse",
        buttonType: "slider",
        x: 0.5, y: y,
        width: "30px", height: "30px",
        fill: "#811a55",
        startPosition: { x: 0, y: y, value: 0 },
        endPosition: { x: 1, y: y, value: lightPropertyArgs[i].value },
        linkedFunction: lightPropertyArgs[i].function,
    })
}
function resetLightPropertiesSliders() {
    this.Parent.Buttons.forEach(button => {
        if (button.buttonType == "slider") {
            button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
            button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)
            button.ValueX = (button.StartPosition.value + button.EndPosition.value) * 0.5
            button.ValueY = (button.StartPosition.value + button.EndPosition.value) * 0.5
        }
    })
    this.Parent.UpdateTransformations()
}
CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle.Buttons.forEach(button => {
    if (button.buttonType == "slider") {
        button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
        button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)
        button.ValueX = (button.StartPosition.value + button.EndPosition.value) * 0.5
        button.ValueY = (button.StartPosition.value + button.EndPosition.value) * 0.5
    }
})
CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle.UpdateTransformations()

CRAWLER_GAME_ENGINE.InterfaceComponents.lightPropertiesRectangle.PushButton({
    shape: "ellipse",
    buttonType: "function",
    x: 1, y: 0,
    width: "50px", height: "50px",
    fill: "#aaaaaa",
    onClickFunction: resetLightPropertiesSliders,
})
const lightFunctionArgs = [CRAWLER_GAME_ENGINE.Interface.ExportLight, CRAWLER_GAME_ENGINE.Interface.ReLabelLight]
for (let i = 0; i < lightFunctionArgs.length; i++) {
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightFunctionRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: 1 - 15 / 250, y: (45 + i * 30) / 250,
        width: "30px", height: "30px",
        fill: "red",
        onClickFunction: lightFunctionArgs[i],
    })
}

for (let i = 0; i < axisArgs.length; i++) {
    const x = 0.25 + 0.25 * i
    CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: x, y: 30 / 250,
        width: "30px", height: "30px",
        fill: "red",
        onClickFunction: CRAWLER_GAME_ENGINE.Interface.SwitchMaterialAxis,
        onClickArguments: [axisArgs[i]]
    })
}
const propertyArgs = [{ value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateAmbience }, { value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateDiffusivity }, { value: 1, function: CRAWLER_GAME_ENGINE.Interface.UpdateSpecularity }, { value: 64, function: CRAWLER_GAME_ENGINE.Interface.UpdateShininess }]
for (let i = 0; i < propertyArgs.length; i++) {
    const y = (60 + i * 30) / 250
    CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle.PushButton({
        shape: "ellipse",
        buttonType: "slider",
        x: 0.5, y: y,
        width: "30px", height: "30px",
        fill: "#811a55",
        startPosition: { x: 0, y: y, value: 0 },
        endPosition: { x: 1, y: y, value: propertyArgs[i].value },
        linkedFunction: propertyArgs[i].function,
    })
}

function resetLightTranslation() {
    this.Parent.Buttons.forEach(button => {
        if (button.buttonType == "slider") {
            button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
            button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)

            button.ValueX = 0.5 * (button.StartPosition.value + button.EndPosition.value)

            button.ValueY = 0.5 * (button.StartPosition.value + button.EndPosition.value)
        }
    })
    CRAWLER_GAME_ENGINE.Globals.lightTranslationIncrement.valueX = 0
    this.Parent.UpdateTransformations()
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightTranslationRectangle._UpdateText()
}
CRAWLER_GAME_ENGINE.InterfaceComponents.lightTranslationRectangle.PushButton({
    shape: "ellipse",
    buttonType: "function",
    x: 1, y: 0,
    width: "50px", height: "50px",
    fill: "#aaaaaa",
    onClickFunction: resetLightTranslation,
})
CRAWLER_GAME_ENGINE.InterfaceComponents.lightTranslationRectangle.PushButton({
    shape: "ellipse",
    buttonType: "slider",
    x: 0.5, y: 0.25,
    width: "50px", height: "50px",
    fill: "#811a55",
    startPosition: { x: 0, y: 0.25, value: -10 },
    endPosition: { x: 1, y: 0.25, value: 10 },
    linkedObject: CRAWLER_GAME_ENGINE.Globals.lightTranslationIncrement,
    linkedFunction: CRAWLER_GAME_ENGINE.InterfaceComponents.lightTranslationRectangle._UpdateText
})
for (let i = 0; i < axisArgs.length; i++) {
    const x = 0.2 + 0.3 * i
    CRAWLER_GAME_ENGINE.InterfaceComponents.lightTranslationRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: x, y: 0.5,
        width: "50px", height: "50px",
        fill: "#aaaaaa",
        onClickFunction: CRAWLER_GAME_ENGINE.Interface.TranslateLight,
        onClickArguments: [axisArgs[i]],
    })
}



function resetMaterialSliders() {
    this.Parent.Buttons.forEach(button => {
        if (button.buttonType == "slider") {
            button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
            button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)
            button.ValueX = 0.5 * (button.StartPosition.value + button.EndPosition.value)
            button.ValueY = 0.5 * (button.StartPosition.value + button.EndPosition.value)
        }
    })
    this.Parent.UpdateTransformations()
}
CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle.Buttons.forEach(button => {
    if (button.buttonType == "slider") {
        button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
        button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)
        button.ValueX = 0.5 * (button.StartPosition.value + button.EndPosition.value)
        button.ValueY = 0.5 * (button.StartPosition.value + button.EndPosition.value)
    }
})
CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle.UpdateTransformations()
CRAWLER_GAME_ENGINE.InterfaceComponents.materialRectangle.PushButton({
    shape: "ellipse",
    buttonType: "function",
    x: 1, y: 0,
    width: "50px", height: "50px",
    fill: "#aaaaaa",
    onClickFunction: resetMaterialSliders,
})
function resetRotation() {
    this.Parent.Buttons.forEach(button => {
        if (button.buttonType == "slider") {
            button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
            button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)
            button.ValueX = 0
            button.ValueY = 0
            //error, is the above correct? line 588
        }
    })
    CRAWLER_GAME_ENGINE.Globals.rotationX.valueX = 0
    CRAWLER_GAME_ENGINE.Globals.rotationY.valueX = 0
    CRAWLER_GAME_ENGINE.Globals.rotationZ.valueX = 0
    this.Parent.UpdateTransformations()
    CRAWLER_GAME_ENGINE.InterfaceComponents.rotationRectangle._UpdateText()
}
CRAWLER_GAME_ENGINE.InterfaceComponents.rotationRectangle.PushButton({
    shape: "ellipse",
    buttonType: "function",
    x: 1, y: 0,
    width: "50px", height: "50px",
    fill: "#aaaaaa",
    onClickFunction: resetRotation,
})
const rotationArgs = [CRAWLER_GAME_ENGINE.Globals.rotationX, CRAWLER_GAME_ENGINE.Globals.rotationY, CRAWLER_GAME_ENGINE.Globals.rotationZ]
for (let i = 0; i < rotationArgs.length; i++) {
    const y = 0.25 + i * 0.25
    CRAWLER_GAME_ENGINE.InterfaceComponents.rotationRectangle.PushButton({
        shape: "ellipse",
        buttonType: "slider",
        x: 0.5, y: y,
        width: "50px", height: "50px",
        fill: "#811a55",
        startPosition: { x: 0, y: y, value: -Math.PI / 2 },
        endPosition: { x: 1, y: y, value: Math.PI / 2 },
        linkedFunction: CRAWLER_GAME_ENGINE.Interface.Rotate,
        linkedFunctionArguments: axisArgs[i],
        linkedObject: rotationArgs[i]
    })
}
const functionArgs = [CRAWLER_GAME_ENGINE.Interface.DestroyShape, CRAWLER_GAME_ENGINE.Interface.ExportShape, CRAWLER_GAME_ENGINE.Interface.ReLabel]
for (let i = 0; i < functionArgs.length; i++) {
    CRAWLER_GAME_ENGINE.InterfaceComponents.functionRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: 1 - 15 / 250, y: (45 + i * 30) / 250,
        width: "30px", height: "30px",
        fill: "red",
        onClickFunction: functionArgs[i],
    })
}
function resetScale() {
    this.Parent.Buttons.forEach(button => {
        if (button.buttonType == "slider") {
            button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
            button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)

            button.ValueX = 0.5 * (button.StartPosition.value + button.EndPosition.value)

            button.ValueY = 0.5 * (button.StartPosition.value + button.EndPosition.value)
        }
    })
    CRAWLER_GAME_ENGINE.Globals.scaleIncrement.valueX = 0
    this.Parent.UpdateTransformations()
    CRAWLER_GAME_ENGINE.InterfaceComponents.scaleRectangle._UpdateText()
}
CRAWLER_GAME_ENGINE.InterfaceComponents.scaleRectangle.PushButton({
    shape: "ellipse",
    buttonType: "function",
    x: 1, y: 0,
    width: "50px", height: "50px",
    fill: "#aaaaaa",
    onClickFunction: resetScale,
})
function resetTranslation() {
    this.Parent.Buttons.forEach(button => {
        if (button.buttonType == "slider") {
            button.RelativePosition[0] = 0.5 * (button.StartPosition.x + button.EndPosition.x)
            button.RelativePosition[1] = 0.5 * (button.StartPosition.y + button.EndPosition.y)

            button.ValueX = 0.5 * (button.StartPosition.value + button.EndPosition.value)

            button.ValueY = 0.5 * (button.StartPosition.value + button.EndPosition.value)
        }
    })
    CRAWLER_GAME_ENGINE.Globals.translationIncrement.valueX = 0
    this.Parent.UpdateTransformations()
    CRAWLER_GAME_ENGINE.InterfaceComponents.translationRectangle._UpdateText()
}
CRAWLER_GAME_ENGINE.InterfaceComponents.translationRectangle.PushButton({
    shape: "ellipse",
    buttonType: "function",
    x: 1, y: 0,
    width: "50px", height: "50px",
    fill: "#aaaaaa",
    onClickFunction: resetTranslation,
})

CRAWLER_GAME_ENGINE.InterfaceComponents.scaleRectangle.PushButton({
    shape: "ellipse",
    buttonType: "slider",
    x: 0.5, y: 0.25,
    width: "50px", height: "50px",
    fill: "#811a55",
    startPosition: { x: 0, y: 0.25, value: 0.01 },
    endPosition: { x: 1, y: 0.25, value: 2 },
    linkedObject: CRAWLER_GAME_ENGINE.Globals.scaleIncrement,
    linkedFunction: CRAWLER_GAME_ENGINE.InterfaceComponents.scaleRectangle._UpdateText
})
CRAWLER_GAME_ENGINE.InterfaceComponents.translationRectangle.PushButton({
    shape: "ellipse",
    buttonType: "slider",
    x: 0.5, y: 0.25,
    width: "50px", height: "50px",
    fill: "#811a55",
    startPosition: { x: 0, y: 0.25, value: -10 },
    endPosition: { x: 1, y: 0.25, value: 10 },
    linkedObject: CRAWLER_GAME_ENGINE.Globals.translationIncrement,
    linkedFunction: CRAWLER_GAME_ENGINE.InterfaceComponents.translationRectangle._UpdateText
})
for (let i = 0; i < axisArgs.length; i++) {
    const x = 0.2 + 0.3 * i
    CRAWLER_GAME_ENGINE.InterfaceComponents.scaleRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: x, y: 0.75,
        width: "50px", height: "50px",
        fill: "#aaaaaa",
        onClickFunction: CRAWLER_GAME_ENGINE.Interface.Scale,
        onClickArguments: [axisArgs[i]],
    })
}
for (let i = 0; i < axisArgs.length; i++) {
    const x = 0.2 + 0.3 * i
    CRAWLER_GAME_ENGINE.InterfaceComponents.translationRectangle.PushButton({
        shape: "ellipse",
        buttonType: "function",
        x: x, y: 0.5,
        width: "50px", height: "50px",
        fill: "#aaaaaa",
        onClickFunction: CRAWLER_GAME_ENGINE.Interface.Translate,
        onClickArguments: [axisArgs[i]],
    })
}