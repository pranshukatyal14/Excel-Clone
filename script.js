const PS = new PerfectScrollbar("#cells", {
    wheelSpeed: 2,
    wheelPropogation: true
});

function findRowCol(ele){
    let idArray = $(ele).attr("id").split("-");
      
    //  let rowId=$(this).attr("id").split("-")[1];
    // let colId=$(this).attr("id").split("-")[3];

    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId,colId];
}

for (let i = 1; i <= 100; i++) {
    let str = "";
    let n = i;

    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = 'Z' + str;
            n = Math.floor((n / 26)) - 1;
        } else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor((n / 26));

        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`);
}

for (let j = 1; j <= 100; j++) {

    $("#rows").append(`<div class="row-name">${j}</div>`);
}

for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`)
    for (let j = 1; j <= 100; j++) {
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false">`)
    }
    $("#cells").append(row);
}

$("#cells").scroll(function () {
    // console.log(this.scrollLeft);
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
});

$(".input-cell").dblclick(function () {
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function () {
    $(this).attr("contenteditable", "false");
});

function getTopBottomLeftRightCell(rowId,colId){
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return[topCell,bottomCell,leftCell,rightCell];
}

$(".input-cell").click(function(e) {
 
   let[rowId,colId]=findRowCol(this);
   let[topCell,bottomCell,leftCell,rightCell]=getTopBottomLeftRightCell(rowId,colId);


    if ($(this).hasClass("selected")) {
        unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    } else {
        selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }

});

function unselectCell(ele,e,topCell,bottomCell,leftCell,rightCell){
    if(e.shiftKey && $(ele).attr("contenteditable")=="false"){
        if($(ele).hasClass("top-selected")){
            topCell.removeClass("bottom-selected");
        }
        if($(ele).hasClass("left-selected")){
            leftCell.removeClass("right-selected");

        }
        if($(ele).hasClass("right-selected")){
            rightCell.removeClass("left-selected");
        }
        if($(ele).hasClass("bottom-selected")){
            bottomCell.removeClass("top-selected");
        }
        $(ele).removeClass("selected top-selected bottom-selected right-selected left-selected");
    }
}

function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell,mouseSelection) {
    if(e.shiftKey || mouseSelection){
        //TOP SELECTED OR NOT
        let topSelected;
        if(topCell){
            topSelected=topCell.hasClass("selected");
        }
        // BOTTOM SELECTED OR NOT
        let bottomSelected;
        if(bottomCell){
            bottomSelected=bottomCell.hasClass("selected");
        }
        //LEFT SELECTED OR NOT
        let leftSelected;
        if(leftCell){
            leftSelected=leftCell.hasClass("selected");
        }
        // RIGHT SELECTED OR NOT
        let rightSelected;
        if(rightCell){
            rightSelected=rightCell.hasClass("selected");
        }

        if(topSelected){
            topCell.addClass("bottom-selected");
            $(ele).addClass("top-selected");
        }
        if(leftSelected){
            leftCell.addClass("right-selected");
            $(ele).addClass("left-selected");
        }
        if(rightSelected){
            rightCell.addClass("left-selected");
            $(ele).addClass("right-selected");
        }
        if(bottomSelected){
            bottomCell.addClass("top-selected");
            $(ele).addClass("bottom-selected");
        }
    }else{
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected")
    }
    $(ele).addClass("selected");
}

let mousemoved=false;
let startCellStored=false;
let startCell;
let endCell;

$(".input-cell").mousemove(function(event){
    if(event.buttons==1 && !startCellStored){
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected right-selected left-selected");
        startCellStored=true;
        mousemoved=true;
        let[rowId,colId]=findRowCol(event.target);
        startCell={rowId:rowId,colId:colId};
    }else if(event.buttons==0 && mousemoved){
        startCellStored=false;
        mousemoved=false;
       let [rowId,colId]=findRowCol(event.target);
       endCell={rowId:rowId,colId:colId};
       selectAllBetweenRange(startCell,endCell);
    }
});

function selectAllBetweenRange(start,end){
    for(let i=start.rowId;i<=end.rowId;i++){
        for(let j=start.colId;j<=end.colId;j++){
            let [topCell,bottomCell,leftCell,rightCell]=getTopBottomLeftRightCell(i,j);
            selectCell($(`#row-${i}-col-${j}`)[0],{},topCell,bottomCell,leftCell,rightCell,true);
        }

    }
}


