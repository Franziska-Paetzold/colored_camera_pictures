"use strict";

//########################### varibales declaration and initialization ################################

let block_row1 = [];
let block_row2 = [];
let allBlocks = [];

let placeholderSrc;

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

//block canvases + images
let canvasDataLists = [];

//let socket = io();

//####################################################################################################

//######################################## animation logic ###########################################

//####################################################################################################

//just for testing
function preload() 
{
	//font1 = loadFont('assets/Aileron-Light.otf');

	placeholderSrc = 'assets/placeholder2.jpg'; 
}

function setup() 
{
	block_row1 = document.getElementById("block_row1").children;
	allBlocks.push(block_row1);
	block_row2 = document.getElementById("block_row2").children;
	allBlocks.push(block_row2);

 	addPlaceholder(block_row1);
	addPlaceholder(block_row2);
	
	//sets color filters
	moveContent();
//TODO: correct resizing
//	window.addEventListener("resize", resizeImages);
}

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


		//fillEmptyBlock(list, context, i);

		//add image
		canvasDataLists.push([canvas, addImage(placeholderSrc, canvas, context)]);
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


function addImage(imgSrc, canvas, context)
{
	let img = new Image();
	img.src = imgSrc;
	img.onload = function()
	{
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
	
	};

	//console.log(canvas.parentElement, canvas.width, canvas.height);
	return img;
}

function resizeImages()
{
	console.log("trigger");
	for (let i=0; i < canvasDataLists.length; i++)
	{
		let canvas = canvasDataLists[i][0];
		let img = canvasDataLists[i][1];
		let imgData = canvasDataLists[i][2];
		let context = canvas.getContext("2d");
		canvas.width = window.innerWidth/8; 
		canvas.height = window.innerHeight/2;
		img.onload = function () 
		{
			console.log("trigger-mod");
			let scaleFactor;
			if (img.height>canvas.height)
			{
				scaleFactor = img.height/canvas.height;
			}		
			else
			{
				scaleFactor = canvas.height/img.height;
			}
			context.drawImage(img, 0, 0, img.width, img.height,     // source rectangle
														0, 0, img.width/scaleFactor, canvas.height); // destination rectangle
		}
	}											
}

function moveCanvases()
{
	
	let id = setInterval(frame, 1000);
	let index = 0;
	function frame() 
	{
		//move picture

		//move filter
		colorFilter(index);
		index++;

	}
}

//TODO
function moveContent()
{
	
	let counter = 0;
	//iterate trough canvases
	for (let i=0; i < canvasDataLists.length; i++)
	{
		let colorIndexOrigin =i;
		let canvas = canvasDataLists[i][0];
		let img = canvasDataLists[i][1];
		let context = canvas.getContext("2d");
		setInterval(function()
				{
					counter++;
					console.log(counter);
				}, 1000)
			(counter);
		colorFilter(canvas, img, context, colorIndexOrigin, counter);
		
	}	
}


function colorFilter(canvas, img, context,index, counter)
{
	let localColorIndex = index;
	let helpIndex = index + counter;
	if (helpIndex >= colors.length)
	{
		localColorIndex = helpIndex-colors.length;
	}
	else
	{
		localColorIndex = helpIndex;
	}		
	let currColor = colors[localColorIndex];

	img.onload = function() 
	{			
		console.log("trigger");
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
	}
}

//####################################################################################################

//##################################### client-server communication ##################################

//####################################################################################################

