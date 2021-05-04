export var ButtonMode;
(function (ButtonMode) {
    ButtonMode[ButtonMode["Common"] = 0] = "Common";
    ButtonMode[ButtonMode["Check"] = 1] = "Check";
    ButtonMode[ButtonMode["Radio"] = 2] = "Radio";
})(ButtonMode || (ButtonMode = {}));
export var AutoSizeType;
(function (AutoSizeType) {
    AutoSizeType[AutoSizeType["None"] = 0] = "None";
    AutoSizeType[AutoSizeType["Both"] = 1] = "Both";
    AutoSizeType[AutoSizeType["Height"] = 2] = "Height";
    AutoSizeType[AutoSizeType["Shrink"] = 3] = "Shrink";
})(AutoSizeType || (AutoSizeType = {}));
export var AlignType;
(function (AlignType) {
    AlignType[AlignType["Left"] = 0] = "Left";
    AlignType[AlignType["Center"] = 1] = "Center";
    AlignType[AlignType["Right"] = 2] = "Right";
})(AlignType || (AlignType = {}));
export var VertAlignType;
(function (VertAlignType) {
    VertAlignType[VertAlignType["Top"] = 0] = "Top";
    VertAlignType[VertAlignType["Middle"] = 1] = "Middle";
    VertAlignType[VertAlignType["Bottom"] = 2] = "Bottom";
})(VertAlignType || (VertAlignType = {}));
export var LoaderFillType;
(function (LoaderFillType) {
    LoaderFillType[LoaderFillType["None"] = 0] = "None";
    LoaderFillType[LoaderFillType["Scale"] = 1] = "Scale";
    LoaderFillType[LoaderFillType["ScaleMatchHeight"] = 2] = "ScaleMatchHeight";
    LoaderFillType[LoaderFillType["ScaleMatchWidth"] = 3] = "ScaleMatchWidth";
    LoaderFillType[LoaderFillType["ScaleFree"] = 4] = "ScaleFree";
    LoaderFillType[LoaderFillType["ScaleNoBorder"] = 5] = "ScaleNoBorder";
})(LoaderFillType || (LoaderFillType = {}));
export var ListLayoutType;
(function (ListLayoutType) {
    ListLayoutType[ListLayoutType["SingleColumn"] = 0] = "SingleColumn";
    ListLayoutType[ListLayoutType["SingleRow"] = 1] = "SingleRow";
    ListLayoutType[ListLayoutType["FlowHorizontal"] = 2] = "FlowHorizontal";
    ListLayoutType[ListLayoutType["FlowVertical"] = 3] = "FlowVertical";
    ListLayoutType[ListLayoutType["Pagination"] = 4] = "Pagination";
})(ListLayoutType || (ListLayoutType = {}));
export var ListSelectionMode;
(function (ListSelectionMode) {
    ListSelectionMode[ListSelectionMode["Single"] = 0] = "Single";
    ListSelectionMode[ListSelectionMode["Multiple"] = 1] = "Multiple";
    ListSelectionMode[ListSelectionMode["Multiple_SingleClick"] = 2] = "Multiple_SingleClick";
    ListSelectionMode[ListSelectionMode["None"] = 3] = "None";
})(ListSelectionMode || (ListSelectionMode = {}));
export var OverflowType;
(function (OverflowType) {
    OverflowType[OverflowType["Visible"] = 0] = "Visible";
    OverflowType[OverflowType["Hidden"] = 1] = "Hidden";
    OverflowType[OverflowType["Scroll"] = 2] = "Scroll";
})(OverflowType || (OverflowType = {}));
export var PackageItemType;
(function (PackageItemType) {
    PackageItemType[PackageItemType["Image"] = 0] = "Image";
    PackageItemType[PackageItemType["MovieClip"] = 1] = "MovieClip";
    PackageItemType[PackageItemType["Sound"] = 2] = "Sound";
    PackageItemType[PackageItemType["Component"] = 3] = "Component";
    PackageItemType[PackageItemType["Atlas"] = 4] = "Atlas";
    PackageItemType[PackageItemType["Font"] = 5] = "Font";
    PackageItemType[PackageItemType["Swf"] = 6] = "Swf";
    PackageItemType[PackageItemType["Misc"] = 7] = "Misc";
    PackageItemType[PackageItemType["Unknown"] = 8] = "Unknown";
    PackageItemType[PackageItemType["Spine"] = 9] = "Spine";
    PackageItemType[PackageItemType["DragonBones"] = 10] = "DragonBones";
})(PackageItemType || (PackageItemType = {}));
export var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["Image"] = 0] = "Image";
    ObjectType[ObjectType["MovieClip"] = 1] = "MovieClip";
    ObjectType[ObjectType["Swf"] = 2] = "Swf";
    ObjectType[ObjectType["Graph"] = 3] = "Graph";
    ObjectType[ObjectType["Loader"] = 4] = "Loader";
    ObjectType[ObjectType["Group"] = 5] = "Group";
    ObjectType[ObjectType["Text"] = 6] = "Text";
    ObjectType[ObjectType["RichText"] = 7] = "RichText";
    ObjectType[ObjectType["InputText"] = 8] = "InputText";
    ObjectType[ObjectType["Component"] = 9] = "Component";
    ObjectType[ObjectType["List"] = 10] = "List";
    ObjectType[ObjectType["Label"] = 11] = "Label";
    ObjectType[ObjectType["Button"] = 12] = "Button";
    ObjectType[ObjectType["ComboBox"] = 13] = "ComboBox";
    ObjectType[ObjectType["ProgressBar"] = 14] = "ProgressBar";
    ObjectType[ObjectType["Slider"] = 15] = "Slider";
    ObjectType[ObjectType["ScrollBar"] = 16] = "ScrollBar";
    ObjectType[ObjectType["Tree"] = 17] = "Tree";
    ObjectType[ObjectType["Loader3D"] = 18] = "Loader3D";
})(ObjectType || (ObjectType = {}));
export var ProgressTitleType;
(function (ProgressTitleType) {
    ProgressTitleType[ProgressTitleType["Percent"] = 0] = "Percent";
    ProgressTitleType[ProgressTitleType["ValueAndMax"] = 1] = "ValueAndMax";
    ProgressTitleType[ProgressTitleType["Value"] = 2] = "Value";
    ProgressTitleType[ProgressTitleType["Max"] = 3] = "Max";
})(ProgressTitleType || (ProgressTitleType = {}));
export var ScrollBarDisplayType;
(function (ScrollBarDisplayType) {
    ScrollBarDisplayType[ScrollBarDisplayType["Default"] = 0] = "Default";
    ScrollBarDisplayType[ScrollBarDisplayType["Visible"] = 1] = "Visible";
    ScrollBarDisplayType[ScrollBarDisplayType["Auto"] = 2] = "Auto";
    ScrollBarDisplayType[ScrollBarDisplayType["Hidden"] = 3] = "Hidden";
})(ScrollBarDisplayType || (ScrollBarDisplayType = {}));
export var ScrollType;
(function (ScrollType) {
    ScrollType[ScrollType["Horizontal"] = 0] = "Horizontal";
    ScrollType[ScrollType["Vertical"] = 1] = "Vertical";
    ScrollType[ScrollType["Both"] = 2] = "Both";
})(ScrollType || (ScrollType = {}));
export var FlipType;
(function (FlipType) {
    FlipType[FlipType["None"] = 0] = "None";
    FlipType[FlipType["Horizontal"] = 1] = "Horizontal";
    FlipType[FlipType["Vertical"] = 2] = "Vertical";
    FlipType[FlipType["Both"] = 3] = "Both";
})(FlipType || (FlipType = {}));
export var ChildrenRenderOrder;
(function (ChildrenRenderOrder) {
    ChildrenRenderOrder[ChildrenRenderOrder["Ascent"] = 0] = "Ascent";
    ChildrenRenderOrder[ChildrenRenderOrder["Descent"] = 1] = "Descent";
    ChildrenRenderOrder[ChildrenRenderOrder["Arch"] = 2] = "Arch";
})(ChildrenRenderOrder || (ChildrenRenderOrder = {}));
export var GroupLayoutType;
(function (GroupLayoutType) {
    GroupLayoutType[GroupLayoutType["None"] = 0] = "None";
    GroupLayoutType[GroupLayoutType["Horizontal"] = 1] = "Horizontal";
    GroupLayoutType[GroupLayoutType["Vertical"] = 2] = "Vertical";
})(GroupLayoutType || (GroupLayoutType = {}));
export var PopupDirection;
(function (PopupDirection) {
    PopupDirection[PopupDirection["Auto"] = 0] = "Auto";
    PopupDirection[PopupDirection["Up"] = 1] = "Up";
    PopupDirection[PopupDirection["Down"] = 2] = "Down";
})(PopupDirection || (PopupDirection = {}));
export var RelationType;
(function (RelationType) {
    RelationType[RelationType["Left_Left"] = 0] = "Left_Left";
    RelationType[RelationType["Left_Center"] = 1] = "Left_Center";
    RelationType[RelationType["Left_Right"] = 2] = "Left_Right";
    RelationType[RelationType["Center_Center"] = 3] = "Center_Center";
    RelationType[RelationType["Right_Left"] = 4] = "Right_Left";
    RelationType[RelationType["Right_Center"] = 5] = "Right_Center";
    RelationType[RelationType["Right_Right"] = 6] = "Right_Right";
    RelationType[RelationType["Top_Top"] = 7] = "Top_Top";
    RelationType[RelationType["Top_Middle"] = 8] = "Top_Middle";
    RelationType[RelationType["Top_Bottom"] = 9] = "Top_Bottom";
    RelationType[RelationType["Middle_Middle"] = 10] = "Middle_Middle";
    RelationType[RelationType["Bottom_Top"] = 11] = "Bottom_Top";
    RelationType[RelationType["Bottom_Middle"] = 12] = "Bottom_Middle";
    RelationType[RelationType["Bottom_Bottom"] = 13] = "Bottom_Bottom";
    RelationType[RelationType["Width"] = 14] = "Width";
    RelationType[RelationType["Height"] = 15] = "Height";
    RelationType[RelationType["LeftExt_Left"] = 16] = "LeftExt_Left";
    RelationType[RelationType["LeftExt_Right"] = 17] = "LeftExt_Right";
    RelationType[RelationType["RightExt_Left"] = 18] = "RightExt_Left";
    RelationType[RelationType["RightExt_Right"] = 19] = "RightExt_Right";
    RelationType[RelationType["TopExt_Top"] = 20] = "TopExt_Top";
    RelationType[RelationType["TopExt_Bottom"] = 21] = "TopExt_Bottom";
    RelationType[RelationType["BottomExt_Top"] = 22] = "BottomExt_Top";
    RelationType[RelationType["BottomExt_Bottom"] = 23] = "BottomExt_Bottom";
    RelationType[RelationType["Size"] = 24] = "Size";
})(RelationType || (RelationType = {}));
export var FillMethod;
(function (FillMethod) {
    FillMethod[FillMethod["None"] = 0] = "None";
    FillMethod[FillMethod["Horizontal"] = 1] = "Horizontal";
    FillMethod[FillMethod["Vertical"] = 2] = "Vertical";
    FillMethod[FillMethod["Radial90"] = 3] = "Radial90";
    FillMethod[FillMethod["Radial180"] = 4] = "Radial180";
    FillMethod[FillMethod["Radial360"] = 5] = "Radial360";
})(FillMethod || (FillMethod = {}));
export var FillOrigin;
(function (FillOrigin) {
    FillOrigin[FillOrigin["Top"] = 0] = "Top";
    FillOrigin[FillOrigin["Bottom"] = 1] = "Bottom";
    FillOrigin[FillOrigin["Left"] = 2] = "Left";
    FillOrigin[FillOrigin["Right"] = 3] = "Right";
})(FillOrigin || (FillOrigin = {}));
export var ObjectPropID;
(function (ObjectPropID) {
    ObjectPropID[ObjectPropID["Text"] = 0] = "Text";
    ObjectPropID[ObjectPropID["Icon"] = 1] = "Icon";
    ObjectPropID[ObjectPropID["Color"] = 2] = "Color";
    ObjectPropID[ObjectPropID["OutlineColor"] = 3] = "OutlineColor";
    ObjectPropID[ObjectPropID["Playing"] = 4] = "Playing";
    ObjectPropID[ObjectPropID["Frame"] = 5] = "Frame";
    ObjectPropID[ObjectPropID["DeltaTime"] = 6] = "DeltaTime";
    ObjectPropID[ObjectPropID["TimeScale"] = 7] = "TimeScale";
    ObjectPropID[ObjectPropID["FontSize"] = 8] = "FontSize";
    ObjectPropID[ObjectPropID["Selected"] = 9] = "Selected";
})(ObjectPropID || (ObjectPropID = {}));
