let animation;
let start = date.now();

function step(timestamp) {
  let progress = timestamp - start;
  d.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    animation = requestAnimationFrame(moveContent);
  }
}
animation = requestAnimationFrame(moveContent);

cancelAnimationFrame(animation);
_________

moveContent();

//TODO
function moveContent()
{	
	//iterate trough canvases
	for (let i=0; i < canvasDataLists.length; i++)
	{
		let colorIndexOrigin =i;
		let canvas = canvasDataLists[i][0];
		let img = canvasDataLists[i][1];
		let context = canvas.getContext("2d");
		colorFilter(canvas, img, context, colorIndexOrigin);
	}
}


function colorFilter(canvas, img, context,index)
{

	img.onload = function() 
	{		
		localAnimator = setInterval(frame, 1000 );	
		function frame(){
			console.log("trigger");
			let currIndex = animationCounter;
			let helpIndex = index + currIndex;
			if (helpIndex >= colors.length)
			{
				currIndex = helpIndex-colors.length;
			}
			else
			{
				currIndex = helpIndex;
			}		

			let currColor = colors[index];
			let scaleFactor;
			if (img.height>canvas.height)
			{
				scaleFactor = img.height/canvas.height;
			}		
			else
			{
				scaleFactor = canvas.height/img.height;
			}
			context.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
				0, 0, img.width/scaleFactor, canvas.height); // destination rectangle

			let imgData = context.getImageData(0,0,img.width,img.height);
			let filterOpacity = 0.4;
			for (let pixelIndex=0;pixelIndex<imgData.data.length;pixelIndex+=4)
			{
				imgData.data[pixelIndex] = imgData.data[pixelIndex] * (1-filterOpacity) + currColor[0] * (filterOpacity); 
				imgData.data[pixelIndex+1] =  imgData.data[pixelIndex] * (1-filterOpacity) + currColor[1] * (filterOpacity); 
				imgData.data[pixelIndex+2] =  imgData.data[pixelIndex] * (1-filterOpacity) + currColor[2] * (filterOpacity); 
				imgData.data[pixelIndex+3] = 255; 
			}
			context.putImageData(imgData,0, 0, 0,0, img.width, img.height);
			if (animationCounter < colors.length)
			{
				animationCounter++;
			}
			else
			{
				animationCounter = 0;
				clearInterval(localAnimator);
			}
		}
	}
}
