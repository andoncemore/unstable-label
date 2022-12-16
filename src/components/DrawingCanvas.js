import React from 'react'

class DrawingClass extends React.Component{
  constructor(props){
    super(props);
    this.canvas = React.createRef();
    this.onDrawStart = this.onDrawStart.bind(this);
    this.onDrawing = this.onDrawing.bind(this);
    this.onDrawEnd = this.onDrawEnd.bind(this);
    this.drawing = false;
    this.currentShape = [];
  }
  
  onDrawStart({ nativeEvent }){
    this.drawing = true;
    this.currentShape.push({x:nativeEvent.offsetX,y:nativeEvent.offsetY});
  }
  
  onDrawing({ nativeEvent }){
    if(this.drawing){
      var last = this.currentShape[this.currentShape.length-1];
      var a = last.x - nativeEvent.offsetX;
      var b = last.y - nativeEvent.offsetY;
      if(Math.sqrt(a*a+b*b) > 3){
        this.ctx.clearRect(0,0,this.canvas.current.width,this.canvas.current.height);
        this.currentShape.push({x:nativeEvent.offsetX,y:nativeEvent.offsetY});
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentShape[0].x,this.currentShape[0].y);
        for(let i=1; i<this.currentShape.length; i++){
          this.ctx.lineTo(this.currentShape[i].x,this.currentShape[i].y);
        }
        this.ctx.lineWidth = 5;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.setLineDash([]);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(nativeEvent.offsetX,nativeEvent.offsetY);
        this.ctx.lineTo(this.currentShape[0].x,this.currentShape[0].y);
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([3, 6])
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
      }
    }
  }
  
  onDrawEnd(event){
    this.drawing = false;
    this.ctx.clearRect(0,0,this.canvas.current.width,this.canvas.current.height);
    if(this.currentShape.length > 10){
      let xpoints = this.currentShape.map(function(o) { return o.x; });
      let ypoints = this.currentShape.map(function(o){ return o.y; });
      let minX = Math.min.apply(Math,xpoints);
      let minY = Math.min.apply(Math,ypoints);
      let w = Math.max.apply(Math,xpoints) - minX;
      let h = Math.max.apply(Math,ypoints) - minY;
      let scaled = this.currentShape.map(point => ({x:(point.x-minX)/w, y:(point.y-minY)/h}))
      this.props.addNewShape({
        x: minX/this.props.width,
        y: minY/this.props.width,
        w: w/this.props.width,
        h: h/this.props.width,
        points: scaled
      });
      
    }
    this.currentShape = [];
  }
  
  
  
  componentDidMount(){
    this.ctx = this.canvas.current.getContext('2d');
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 10;
  }
  
  render(){
    return(
      <canvas 
        ref={this.canvas}
        width={this.props.width}
        height={this.props.height}
        onMouseDown={this.props.active ? this.onDrawStart : null}
        onMouseMove={this.props.active ? this.onDrawing : null}
        onMouseUp={this.props.active ? this.onDrawEnd : null}
        onMouseLeave={this.props.active ? this.onDrawEnd : null}
        />
    
    )
  }
  
}

export default DrawingClass