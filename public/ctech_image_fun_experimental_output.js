"use strict";
//this script centeres the filtered image data afterwards
//########################### varibales declaration and initialization ################################

//children of block divs
let block_row1 = [];
let block_row2 = [];
//all block rows together
let allBlocks = [];
//added data for block divs saves [list, canvas, context, currindex]
let blockData = [];

//original colors of ctech logo in rgb
let color1 = [50,50,130];
let color2 = [34,112,182];
let color3 = [56, 167,224];
let color4 = [0,160,152];
let color5 = [50,170,102];
let color6 = [0,140,56];
let color7 = [61,169,56];
let color8 = [145,192,39];
let color9 = [160,28,92];
let color10 = [228,0,125];
let color11 = [188,28,39];
let color12 = [228,53,46];
let color13 = [231,78,34];
let color14 = [241,144,0];
let color15 = [248,175,53];
let color16 = [252,233,21];

let colors = [color1,color2,color3,color4,color5,color6,color7,color8,color9,color10,color11,color12,color13,color14,color15,color16];

//block canvases + current images elements
let canvasDataLists = [];
//lists images from data + the taken one
let imageList = [];

// for the color filteriteration at one canvas
let animationCounter;
// for the iteration over all canvasas
let globalIndex;

//camera equipment
let camera;
let capture;
let button;
let cameraCanvas;

//client-server communication
// to test the client-server communication, plaese comment all line under the #csc tag in
// #csc
//let socket = io();
//socket.on('initSketch', receivingInitSketch);

//####################################################################################################

//###############################################  setup #############################################

//####################################################################################################

//just for testing
function preload() 
{
	srcToImage('assets/harry.png'); 
	srcToImage('assets/catherine.png'); 
	srcToImage('assets/meghan.png'); 
	//srcToImage('assets/william.png'); 
	srcToImage('assets/queen.png'); 
	srcToImage('assets/charles.png'); 
	srcToImage('assets/camilla.png'); 
	srcToImage('assets/charlotte.png'); 
	srcToImage('assets/louis.png'); 
	srcToImage('assets/george.png'); 
}

// add test data
function srcToImage(src)
{
	let img = new Image();
	img.src = src;
	imageList.push(img);
}

function setup() 
{
	animationCounter = 0;
	globalIndex =0;
	
	block_row1 = document.getElementById("block_row1").children;
	allBlocks.push(block_row1);
	block_row2 = document.getElementById("block_row2").children;
	allBlocks.push(block_row2);

	addPlaceholder(block_row1);
	addPlaceholder(block_row2);

	if (imageList.length == 0)
	{
		for(let block in blockData)
		{
			fillEmptyBlock(blockData[block][0], blockData[block][2], blockData[block][3]);
		}
	}
	else
	{
		for(let block in blockData)
		{
			let img = new Image();
			let canvas =blockData[block][1];
			let context =  blockData[block][2];
			img.src = imageList[Math.floor(Math.random() * imageList.length)].src;
			img.onload = function()
			{
				addImage(img,context);
			}
			//#csc
			//socket.emit('setNewImage', {imgSrc: img.Src});
			canvasDataLists.push([canvas, img]);
		}
	}
	cameraContentOn();
	
	//sets color filters every sec
	moveContent();
//TODO: correct resizing
//	window.addEventListener("resize", resizeImages);
}

//####################################################################################################

//############################################# camera ###############################################

//####################################################################################################

function cameraContentOn()
{
	let overlayDiv = document.getElementById("overlay").style.width = "100%";
	let overlayContentDiv = document.getElementById("overlayContent");
	noCanvas();
	capture = createCapture(VIDEO);
	capture.parent(overlayContentDiv);
	
	camera = document.getElementsByTagName("video")[0];
	camera.width = window.innerWidth/3;
	camera.style.display = "block";
	camera.style.margin = "auto";

	button = document.createElement("button");
	button.style.margin = "3vh";
	button.id ="camTrigger";
	button.onclick = takeAPicture;
	let buttonText = document.createTextNode("Take a picture!");
	
	button.appendChild(buttonText);
	overlayContentDiv.appendChild(button);


}

function takeAPicture()
{
	cameraCanvas = document.createElement('canvas');
	cameraCanvas.width = camera.width;
	cameraCanvas.height = camera.height;
	let context = cameraCanvas.getContext('2d');
	context.drawImage(camera, 0, 0, cameraCanvas.width, cameraCanvas.height);
	let pictureData = context.getImageData(0,0, camera.width, camera.width);
	//convert data to image to save savetly
	let picture = new Image();
    picture.src = cameraCanvas.toDataURL();
	imageList.push(picture);

	let math =Math.floor(Math.random() * blockData.length);
	let picCanvas = blockData[math][1];
	let picContext = picCanvas.getContext("2d");
	console.log(math, canvas);
	picture.onload = function()
	{
		addImage(picture.src, picCanvas);
	}	
	cameraContentOff();
}

function cameraContentOff()
{

	let overlay = document.getElementById("overlay");
	overlay.style.width = "0%";
	
	capture.stop();
	camera.style.display = "none";
	button.style.display = "none";
	
}


//####################################################################################################

//####################################  filling the blocks ###########################################

//####################################################################################################

//adds img elements with placeholder picture to the divs 
function addPlaceholder(list)
{
	for (let i=0; i<list.length; i++)
	{
		let currDivId = list[i].id;
		let div = document.getElementById(currDivId);
		//create canvas to make modifying (filter) of images possible
		let canvas = document.createElement("canvas");
		canvas.width = window.innerWidth/8; 
		canvas.height = window.innerHeight/2;
		//add element as child
		div.appendChild(canvas);

		//add placeholder color
		let context = canvas.getContext("2d");

		blockData.push([list,canvas,context,i]);
	}
}

//get rgb(r,g,b) as string from a specific index
function getColor(index)
{
	return "rgb("+colors[index][0]+","+colors[index][1]+","+colors[index][2]+")"
}


function fillEmptyBlock(list, context, i)
{
	//change i to get the right color index
	if(list == block_row1)
	{
		context.fillStyle = getColor(i);
	}
	else
	{
		context.fillStyle = getColor(i+8);
	}		
	context.fillRect(0,0,canvas.width,canvas.height);
}


function addImage(img, canvas)
{
		console.log("hey");
		let scaleFactor;
		if (img.height>canvas.height)
		{
			scaleFactor = img.height/canvas.height;
		}		
		else
		{
			scaleFactor = canvas.height/img.height;
		}
		context.drawImage(img,-img.width*0.25, 0, img.width,    img.height,     // source rectangle
								0, 0, img.width/scaleFactor, canvas.height); // destination rectangle
}


function resizeImages()
{
	
	//console.log("trigger");
	for (let i=0; i < canvasDataLists.length; i++)
	{
		let canvas = canvasDataLists[i][0];
		let img = canvasDataLists[i][1];
		let imgData = canvasDataLists[i][2];
		let context = canvas.getContext("2d");
		//essential part
		canvas.width = window.innerWidth/8; 
		canvas.height = window.innerHeight/2;
		img.onload = function () 
		{
			//console.log("trigger-mod");
			let scaleFactor;
			//todo
		}
	}											
}

//####################################################################################################

//###########################################  animation #############################################

//####################################################################################################

//TODO
function moveContent()
{	
	//iterate trough canvases
	for (let i=0; i < canvasDataLists.length; i++)
	{
		globalIndex =i;
		//console.log("rechaed: "+globalIndex);
		let canvas = canvasDataLists[i][0];
		let img = canvasDataLists[i][1];
		let context = canvas.getContext("2d");
		colorFilter(canvas, img, context);
	}
}


function colorFilter(canvas, img, context)
{
	img.onload = function() 
	{		
		let localAnimator = setInterval(frame, 1000 );	
		function frame()
		{
			if (animationCounter < colors.length)
			{
				let currIndex = animationCounter;
				let helpIndex = globalIndex + currIndex;
				if (helpIndex >= colors.length)
				{
					currIndex = helpIndex-colors.length;
				}
				else
				{
					currIndex = helpIndex;
				}		
				//console.log(currIndex, animationCounter, globalIndex);
				let currColor = colors[currIndex];
				let scaleFactor;
				if (img.height>canvas.height)
				{
					scaleFactor = img.height/canvas.height;
				}		
				else
				{
					scaleFactor = canvas.height/img.height;
				}
				context.drawImage(img,-img.width*0.25, 0, img.width,    img.height,     // source rectangle
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
				context.putImageData(imgData,-img.width*0.25,0, 0,0, img.width, img.height);

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


//####################################################################################################

//##################################### client-server communication ##################################

//####################################################################################################

//get all pictures from database
function receivingInitSketch(data)
{
	console.log("All data received");
	let picture = new Image();
    picture.src = data;
	imageList.push(picture);	
}