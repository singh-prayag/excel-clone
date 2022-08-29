let body=document.querySelector("body");
body.spellcheck = false;

let menuBarPtags = document.querySelectorAll(".menu-bar p");

let file = menuBarPtags[0];

let columnTags=document.querySelector(".column-tags");

let rowNumbers =  document.querySelector(".row-numbers");

let grid = document.querySelector(".grid");

let oldCell=undefined;

let formulaSelectCell = document.querySelector("#selected-cell-formula");

let dataObj = {};

let formulaInput = document.querySelector("#complete-formula");
//here I need to highlight the option selected and also remove the highlight on clicking it or any other
// option in menu bar 

file.addEventListener("click",function(e){
    if(e.currentTarget.classList.contains("menu-bar-option-selected"))
    {
        e.currentTarget.innerHTML=`File`;
    }
    else
    //if(e.currentTarget.classList.length==0)
    //ki koi class nhi hai to selected nhi hai to isme modal daaldo
    {     
    e.currentTarget.innerHTML=`File
    <span class="modal-container">
        <span>Clear</span>
        <span>Open</span>
        <span>Save</span>
        </span>`;
    

    let allFileOptions = e.currentTarget.querySelectorAll("span>span");
// console.log(allFileOptions);

    //clear
    allFileOptions[0].addEventListener("click",function(e){
        // console.log(1);
        let allCells=document.querySelectorAll(".cell");
        for(let i=0;i<allCells.length;i++)
        {
            allCells[i].innerText="";

        let cellAddress = allCells[i].getAttribute("data-address");
        dataObj[cellAddress]={
            value: "",
            formula: "",
            upstream: [],
            downstream: [],
            fontSize: 10,
            fontFamily: "Arial",
            fontWeight: "normal",
            color: "black",
            backgroundColor: "white",
            underline: "none",
            italics: "normal",
            textAlign: "left"
        }
        };
    });
    
    //open
    allFileOptions[1].addEventListener("click",function(e){
        // console.log(2);
        //1.fetch the dataObj from the localStorage
        //2.update the current dataObj as taken from the localStorage
        dataObj = JSON.parse(localStorage.getItem("sheet"));
        // console.log(dataObj);
        //3.show on ui the previously saved dataObj
        for(let j=1;j<=100;j++)
        {
            for(let i=0;i<26;i++)
            {
                let cellAddress = String.fromCharCode(i+65) + j;
                let cellOnUI = document.querySelector(`[data-address=${cellAddress}]`);
                let cellObj = dataObj[cellAddress];
                // console.log(cellAddress,cellOnUI,cellObj);
                cellOnUI.innerText=cellObj.value;
                // cellOnUI.style.fontSize = cellObj.style.fontSize;
                cellOnUI.style.fontFamily = cellObj.fontFamily;
                cellOnUI.style.fontWeight = cellObj.fontWeight;
                cellOnUI.style.color = cellObj.color;
                cellOnUI.style.backgroundColor = cellObj.backgroundColor;
                cellOnUI.style.underline = cellObj.underline;
                cellOnUI.style.italics = cellObj.italics;
                cellOnUI.style.textAlign= cellObj.textAlign;
            }
        }
    });
    
    //save
    allFileOptions[2].addEventListener("click",function(e){
        // console.log(3);
        localStorage.setItem("sheet", JSON.stringify(dataObj));
    });
}
});

for(let i=0;i<menuBarPtags.length;i++)
{
    menuBarPtags[i].addEventListener("click",function(e){
        if(e.currentTarget.classList.contains("menu-bar-option-selected"))
        {
            e.currentTarget.classList.remove("menu-bar-option-selected");
        }
        else
        {
            for(let j=0;j<menuBarPtags.length;j++)
            {
                if(menuBarPtags[j].classList.contains("menu-bar-option-selected"))
                menuBarPtags[j].classList.remove("menu-bar-option-selected");
            }
            e.currentTarget.classList.add("menu-bar-option-selected");
        }
    });
}

for(let i=0;i<26;i++)
{
    let div = document.createElement("div");
    div.classList.add("column-tag-cell");
    div.innerText = String.fromCharCode(65+i);
    columnTags.append(div);
}


for(let i=1;i<=100;i++)
{
    let div = document.createElement("div");
    div.classList.add("row-number-cell");
    div.innerText = i;
    rowNumbers.append(div);
}

for(let j=1;j<=100;j++)
{
let row=document.createElement("div");
row.classList.add("row");
//j=1 
//i=0; i+65 => 65 (A)  ==> A1
//i=1; i+65 => 66(B)   ==>B1

//                        Z1
//j=2 repeat
for(let i=0;i<26;i++)
{
    let cell = document.createElement("div");
    cell.classList.add("cell");
    let address = String.fromCharCode(i+65)+j;
    cell.setAttribute("data-address",String.fromCharCode(i+65)+j);

    dataObj[address] = {
        value: "",
        formula: "",
        upstream: [],
        downstream: [],
        fontSize: 10,
        fontFamily: "Arial",
        fontWeight: "normal",
        color: "black",
        backgroundColor: "white",
        underline: "none",
        italics: "normal",
        textAlign: "left"
    };



//nye cell ko select and pichle ko deselect karne ka event
//and jo cell selected hai use upar dikhane ka 

    cell.addEventListener("click",function(e){
        
     //check kro koi old cell hai kya pehli se selected
        if(oldCell)
        {
      // agr han to use deselect kro class remove krke
            oldCell.classList.remove("grid-selected-cell");
        }
        //jis cell pr click kra use select kro class add krke
        e.currentTarget.classList.add("grid-selected-cell");

        let cellAddress = e.currentTarget.getAttribute("data-address");
        formulaSelectCell.value = cellAddress;

      //and ab jo naya cell select hogya use save krdo old cell wali variable taki next time agr click ho kisi nye cell pr to ise deselect kr pai
        oldCell = e.currentTarget;
    });

    
    cell.addEventListener("input",function(e){
        console.log(e.currentTarget.innerText);
        let address = e.currentTarget.getAttribute("data-address");
        dataObj[address].value = Number(e.currentTarget.innerText);

        dataObj[address].formula = "";

        //upstream clear karni hai

        let currCellUpstream = dataObj[address].upstream;

        for(let i = 0; i < currCellUpstream.length; i++)
        {
            removeFromUpstream(address, currCellUpstream[i]);
        }

        dataObj[address].upstream = [];

        //downstream ke cells ko update karna hai

        let currCellDownStream = dataObj[address].downstream;

        for(let i = 0; i < currCellDownStream.length; i++)
        {
            updateDownStreamElements(currCellDownStream[i]);
        }
    });



    cell.contentEditable=true;
    row.append(cell);
}

grid.append(row);
}

console.log(dataObj);

formulaInput.addEventListener("change", function(e){
    let formula = e.currentTarget.value; 
    //"2 * A1"

    let selectedCellAddress = oldCell.getAttribute("data-address");

    dataObj[selectedCellAddress].formula = formula;
    let formulaArr = formula.split(" "); // ["2","*","A1"]

    let elementsArray = [];

    for(let i=0;i<formulaArr.length;i++)
    {
        if( 
            formulaArr[i] != "+" &&
            formulaArr[i] != "-" &&
            formulaArr[i] != "*" &&
            formulaArr[i] != "/" &&
            isNaN(Number(formulaArr[i]))
        ){
            elementsArray.push(formulaArr[i]);
        }
    }

    //Before setting new upstream
    //clear old upstream

    let oldUpstream = dataObj[selectedCellAddress].upstream;

    for(let k=0;k<oldUpstream.length;k++)
    {
        removeFromUpstream(selectedCellAddress, oldUpstream[k]);   
    }

    dataObj[selectedCellAddress].upstream = elementsArray;

    for(let j=0;j<elementsArray.length;j++)
    {
        addToDownstream(selectedCellAddress, elementsArray[j]);
    }

    
});

function addToDownstream(toBeAdded, inWHichWeAreAdding){
    //get downstream of the cell in which we have to add
    let reqDownstream = dataObj[inWHichWeAreAdding].downstream;

    reqDownstream.push(toBeAdded);
}



function removeFromUpstream(dependent, onWhichItIsDepending)
{
    let newDownstream = [];

    let oldDownstream = dataObj[onWhichItIsDepending].downstream;

    for(let i = 0; i<oldDownstream.length; i++)
    {
        if(oldDownstream[i] != dependent) newDownstream.push(oldDownstream[i]);
    }

    dataObj[onWhichItIsDepending].downstream = newDownstream;
}

function updateUpstreamElements(elementAddress)
{
  //1- jis element ko update kr rhe hai unki upstream elements ki current value leao
  //unki upstream ke elements ka address use krke dataObj se unki value lao 
  //unhe as key value pair store krdo valObj naam ke obj me
    let valObj = {};

    let currCellUpstream = dataObj[elementAddress].upstream;

    for(let i = 0;i < currCellUpstream.length; i++)
    {
        let upstreamCellAddress = currCellUpstream[i];
        let upstreamCellValue = dataObj[upstreamCellAddress].value;

        valObj[upstreamCellAddress] = upstreamCellValue;
    }
     //2- jis element ko update kr rhe hai uska formula leao
    let currFormula = dataObj[elementAddress].formula;
  //formula ko space ke basis pr split maro
    let formulaArr = currFormula.split(" ");
   //split marne ke baad jo array mili uspr loop kara and formula me jo variable h(cells) unko unki value se replace krdo using valObj
  
    for(let j=0;j<formulaArr.length;j++)
    {
        if(valObj[formulaArr[j]])
        {
            formulaArr[j] = valObj[formulaArr[j]];
        }
    }
  
  //3- Create krlo wapis formula from the array by joining it
    currFormula = formulaArr.join(" ");
  //4- evaluate the new value using eval function
    let newValue = eval(currFormula);

  //update the cell(jispr function call hua) in dataObj
    dataObj[elementAddress].value = newValue;
  //5- Ui pr update krdo new value
    let cellOnUI = document.querySelector(`[data-address=${elementAddress}]`);
    cellOnUI.innerText = newValue;

  //6- Downstream leke ao jis element ko update kra just abhi kuki uspr bhi kuch element depend kr sakte hai
  //unko bhi update krna padega
    let currCellDownstream = dataObj[elementAddress].downstream;
 //check kro ki downstream me elements hai kya agr han to un sab pr yehi function call krdo jise wo bhi update hojai with new value
  
    if(currCellDownstream.length > 0)
    {
        for(let k=0; k<currCellDownstream.length;i++)
        {
            updateUpstreamElements(currCellDownstream[k]);
        }
    }

}



