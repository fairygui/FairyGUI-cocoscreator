
export enum ButtonMode {
    Common,
    Check,
    Radio
}
export enum AutoSizeType {
    None,
    Both,
    Height,
    Shrink
}
export enum AlignType {
    Left,
    Center,
    Right
}
export enum VertAlignType {
    Top,
    Middle,
    Bottom
}
export enum LoaderFillType {
    None,
    Scale,
    ScaleMatchHeight,
    ScaleMatchWidth,
    ScaleFree,
    ScaleNoBorder
}
export enum ListLayoutType {
    SingleColumn,
    SingleRow,
    FlowHorizontal,
    FlowVertical,
    Pagination
}
export enum ListSelectionMode {
    Single,
    Multiple,
    Multiple_SingleClick,
    None
}
export enum OverflowType {
    Visible,
    Hidden,
    Scroll
}
export enum PackageItemType {
    Image,
    MovieClip,
    Sound,
    Component,
    Atlas,
    Font,
    Swf,
    Misc,
    Unknown,
    Spine,
    DragonBones
}
export enum ObjectType {
    Image,
    MovieClip,
    Swf,
    Graph,
    Loader,
    Group,
    Text,
    RichText,
    InputText,
    Component,
    List,
    Label,
    Button,
    ComboBox,
    ProgressBar,
    Slider,
    ScrollBar,
    Tree,
    Loader3D
}
export enum ProgressTitleType {
    Percent,
    ValueAndMax,
    Value,
    Max
}
export enum ScrollBarDisplayType {
    Default,
    Visible,
    Auto,
    Hidden
}
export enum ScrollType {
    Horizontal,
    Vertical,
    Both
}
export enum FlipType {
    None,
    Horizontal,
    Vertical,
    Both
}
export enum ChildrenRenderOrder {
    Ascent,
    Descent,
    Arch
}
export enum GroupLayoutType {
    None,
    Horizontal,
    Vertical
}
export enum PopupDirection {
    Auto,
    Up,
    Down
}
export enum RelationType {
    Left_Left = 0,
    Left_Center = 1,
    Left_Right = 2,
    Center_Center = 3,
    Right_Left = 4,
    Right_Center = 5,
    Right_Right = 6,

    Top_Top = 7,
    Top_Middle = 8,
    Top_Bottom = 9,
    Middle_Middle = 10,
    Bottom_Top = 11,
    Bottom_Middle = 12,
    Bottom_Bottom = 13,

    Width = 14,
    Height = 15,

    LeftExt_Left = 16,
    LeftExt_Right = 17,
    RightExt_Left = 18,
    RightExt_Right = 19,
    TopExt_Top = 20,
    TopExt_Bottom = 21,
    BottomExt_Top = 22,
    BottomExt_Bottom = 23,

    Size = 24
}

export enum FillMethod {
    None,
    Horizontal,
    Vertical,
    Radial90,
    Radial180,
    Radial360,
}

export enum FillOrigin {
    Top,
    Bottom,
    Left,
    Right
}

export enum ObjectPropID {
    Text,
    Icon,
    Color,
    OutlineColor,
    Playing,
    Frame,
    DeltaTime,
    TimeScale,
    FontSize,
    Selected
}