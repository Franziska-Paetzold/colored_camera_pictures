"use strict";

//##################################### varibales declaration ########################################

let block_row1 = [];
let block_row2 = [];

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

//let socket = io();

//####################################################################################################

//######################################## animation logic ###########################################

//####################################################################################################

function preload() 
{
	//font1 = loadFont('assets/Aileron-Light.otf');

	placeholderSrc = 'assets/placeholder2.jpg'; 
}

function setup() 
{
	block_row1 = document.getElementById("block_row1").children;
	block_row2 = document.getElementById("block_row2").children;

  addPlaceholder(block_row1);
	addPlaceholder(block_row2);
	colorFilter(img, colorNum);
}

//adds img elements with placeholder picture to the divs 
function addPlaceholder(list)
{
	for (let i=0; i<list.length; i++)
	{
		let img = document.createElement("img");
		img.src = placeholderSrc;
		

		//add the picture to a canvas to be able to set a color filter
		let imgCanvas = document.createElement("canvas");
		imgCanvas.width = img.width;
		imgCanvas.height = img.height;
		imgCanvas.ctx = imgCanvas.getContext("2d");
		imgCanvas.ctx.drawImage(img, 0, 0);


		//colorFilter(img, i);
		console.log(i);
		let currDivId = list[i].id;

		console.log(currDivId );
		let div = document.getElementById(currDivId);
		div.appendChild(img);
	}
}

function colorFilter(img, colorIndex)
{
	img.loadPixels();

	for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
					index = ((y * img.width) + x) * 4;
					img.pixels[0] *= colors[colorIndex][0]; 
					img.pixels[1] *= colors[colorIndex][1]; 
					img.pixels[2] *= colors[colorIndex][2];
					img.pixels[3] = 127; 
			}
	}
	img.updatePixels();

}

//####################################################################################################

//##################################### client-server communication ##################################

//####################################################################################################

