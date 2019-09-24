export{}

declare global {
    interface Transform{
        Forward(): Vector3
        Backward(): Vector3
        Right(): Vector3
        Left(): Vector3
        Up(): Vector3
        Down(): Vector3
        Clone(): Transform
    }
}

Transform.prototype.Forward = function(this:Transform){
    return Vector3.Forward().rotate(this.rotation)
}
Transform.prototype.Backward = function(this:Transform){
    return Vector3.Backward().rotate(this.rotation)
}
Transform.prototype.Right = function(this:Transform){
    return Vector3.Right().rotate(this.rotation)
}
Transform.prototype.Left = function(this:Transform){
    return Vector3.Left().rotate(this.rotation)
}
Transform.prototype.Up = function(this:Transform){
    return Vector3.Up().rotate(this.rotation)
}
Transform.prototype.Down = function(this:Transform){
    return Vector3.Down().rotate(this.rotation)
}
Transform.prototype.Clone = function(this:Transform){
    let clone = new Transform()
    clone.position = this.position
    clone.rotation = this.rotation
    clone.scale = this.scale
    return clone
}