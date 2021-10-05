const PS = new PerfectScrollbar("#cells", {
    wheelSpeed: 2,
    wheelPropogation: true
});

function findRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");

    //  let rowId=$(this).attr("id").split("-")[1];
    // let colId=$(this).attr("id").split("-")[3];

    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
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

$("#cells").scroll(function () {
    // console.log(this.scrollLeft);
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
});


let cellData = { "Sheet1": {} };
let totalSheets = 1;
let lastlyAddedSheetNumber = 1;
let selectedSheet = "Sheet1";

let mousemoved = false;
let startCellStored = false;
let startCell;
let endCell;

let defaultProperties = {
    "font-family": "Noto Sans",
    "font-size": 14,
    "text": "",
    "bold": false,
    "italic": false,
    "underlined": false,
    "alignment": "left",
    "color": "#444",
    "bgcolor": "#fff"

};

function loadNewSheet() {

    $("#cells").text("");

    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);

        for (let j = 1; j <= 100; j++) {
            row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`);

        }

        $("#cells").append(row);
    }
    addEventsToCells();
    addSheetTabEventListeners();
}
loadNewSheet();
/*
function addNewsheet(){
    $(".input-cell").text("");
    $(".input-cell").css({
        "font-family": "Noto Sans",
        "font-size": 14,
        "text": "",
        "bold": false,
        "italic": false,
        "underlined": false,
        "alignment": "left",
        "color": "#444",
        "background-color": "#fff"
    });
    addSheetTabEventListeners();
}
*/
function addEventsToCells() {

    $(".input-cell").dblclick(function () {
        $(this).attr("contenteditable", "true");
        $(this).focus();
    });

    $(".input-cell").blur(function () {
        $(this).attr("contenteditable", "false");

        // cellData[selectedSheet][rowId-1][colId-1].text=$(this).text();
        updateCellData("text", $(this).text());

    });
    $(".input-cell").click(function (e) {

        let [rowId, colId] = findRowCol(this);
        let [topCell, bottomCell, leftCell, rightCell] = getTopBottomLeftRightCell(rowId, colId);


        if ($(this).hasClass("selected") && e.shiftKey) {
            unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
        } else {
            selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
        }

    });


    $(".input-cell").mousemove(function (event) {
        event.preventDefault();// stops the bydefault work
        if (event.buttons == 1 && !event.shiftKey) {
            $(".input-cell.selected").removeClass("selected top-selected bottom-selected right-selected left-selected");

            mousemoved = true;
            if (!startCellStored) {
                let [rowId, colId] = findRowCol(event.target);
                startCell = { rowId: rowId, colId: colId };
                startCellStored = true;

            } else {
                let { rowId, colId } = findRowCol(event.target);
                endCell = { rowId: rowId, colId: colId };
                selectAllBetweenRange(startCell, endCell);
            }


        } else if (event.buttons == 0 && mousemoved) {
            startCellStored = false;
            mousemoved = false;
            let [rowId, colId] = findRowCol(event.target);
            endCell = { rowId: rowId, colId: colId };
            selectAllBetweenRange(startCell, endCell);
        }
    });

}



function getTopBottomLeftRightCell(rowId, colId) {
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return [topCell, bottomCell, leftCell, rightCell];
}



function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if (e.shiftKey && $(ele).attr("contenteditable") == "false") {
        if ($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }
        if ($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");

        }
        if ($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }
        if ($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }
        $(ele).removeClass("selected top-selected bottom-selected right-selected left-selected");
    }
}

function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell, mouseSelection) {
    if (e.shiftKey || mouseSelection) {
        //TOP SELECTED OR NOT
        let topSelected;
        if (topCell) {
            topSelected = topCell.hasClass("selected");
        }
        // BOTTOM SELECTED OR NOT
        let bottomSelected;
        if (bottomCell) {
            bottomSelected = bottomCell.hasClass("selected");
        }
        //LEFT SELECTED OR NOT
        let leftSelected;
        if (leftCell) {
            leftSelected = leftCell.hasClass("selected");
        }
        // RIGHT SELECTED OR NOT
        let rightSelected;
        if (rightCell) {
            rightSelected = rightCell.hasClass("selected");
        }

        if (topSelected) {
            topCell.addClass("bottom-selected");
            $(ele).addClass("top-selected");
        }
        if (leftSelected) {
            leftCell.addClass("right-selected");
            $(ele).addClass("left-selected");
        }
        if (rightSelected) {
            rightCell.addClass("left-selected");
            $(ele).addClass("right-selected");
        }
        if (bottomSelected) {
            bottomCell.addClass("top-selected");
            $(ele).addClass("bottom-selected");
        }
    } else {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected")
    }
    $(ele).addClass("selected");
    changeHeader(findRowCol(ele));
}

function changeHeader([rowId, colId]) {
    let data;
    if (cellData[selectedSheet][rowId - 1] && cellData[selectSheet][rowId - 1][colId - 1]) {
        data = cellData[selectedSheet][rowId - 1][colId - 1];

    } else {
        data = defaultProperties;
    }

    $("#font-family").val(data["font-family"]);
    $("#font-family").css("font-family", data["font-family"]);
    $("#font-size").val(data["font-size"]);
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
    $("#fill-color-icon").css("border-bottom", `4px solid ${data.bgcolor}`);
    $("#text-color-icon").css("border-bottom", `4px sold ${data.color}`);

}
function addRemoveSelectFromFontStyle(data, property) {
    if (data[property]) {
        $(`#${property}`).addClass("selected");
    } else {
        $(`#${property}`).removeClass("selected");
    }

}



function selectAllBetweenRange(start, end) {
    for (let i = (start.rowId < end.rowId ? start.rowId : end.rowId); i <= (start.rowId < end.rowId ? end.rowId : start.rowId); i++) {
        for (let j = (start.colId < end.colId ? start.colId : end.colId); j <= (start.colId < end.colId ? end.colId : start.colId); j++) {
            let [topCell, bottomCell, leftCell, rightCell] = getTopBottomLeftRightCell(i, j);
            selectCell($(`#row-${i}-col-${j}`)[0], {}, topCell, bottomCell, leftCell, rightCell, true);
        }

    }
}

$(".menu-selector").change(function (e) {
    let value = $(this).val();
    let key = $(this).attr("id");
    if (key == "font-family") {
        $("#font-family").css(key, value);
    }
    if (!isNaN(value)) {
        value = parseInt(value);
    }

    $(".input-cell.selected").css(key, value);
    // $(".input-cell.selected").each(function (index, data) {
    //  let [rowId, colId] = findRowCol(data);
    // cellData[selectedSheet][rowId - 1][colId - 1][key] = value;
    //  });
    updateCellData(key, value);

});


$(".alignment").click(function (e) {
    $(".alignment.selected").removeClass("selected");
    $(this).addClass("selected");
    let alignment = $(this).attr("data-type");
    $(".input-cell.selected").css("text-align", alignment);
    // $(".input-cell.selected").each(function (index, data) {
    //    let [rowId, colId] = findRowCol(data);
    //    cellData[selectedSheet][rowId - 1][colId - 1].alignment = alignment;
    // });
    updateCellData("alignment", alignment);
});

$("#bold").click(function (e) {
    setFontStyle(this, "bold", "font-weight", "bold");

});

$("#italic").click(function (e) {
    setFontStyle(this, "italic", "font-style", "italic");
})

$("#underlined").click(function (e) {
    setFontStyle(this, "underlined", "text-decoration", "underline");

});
function setFontStyle(ele, property, key, value) {
    if ($(ele).hasClass("selected")) {
        $(ele).removeClass("selected");
        $(".input-cell.selected").css(key, "");
        // $(".intput-cell.selected").each(function (index, data) {
        //    let [rowId, colId] = findRowCol(data);
        //     cellData[selectedSheet][rowId - 1][colId - 1][property] = false;
        //  });
        updateCellData(property, false);
    } else {
        $(ele).addClass("selected");
        $(".input-cell.selected").css(key, value);
        // $(".input-cell.selected").each(function (index, data) {
        //    let [rowId, colId] = findRowCol(data);
        //    cellData[selectedSheet][rowId - 1][colId - 1][property] = true;
        // })
        updateCellData(property, true);
    }
}
function updateCellData(property, value) {
    if (value != defaultProperties[property]) {
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = findRowCol(data);
            if (cellData[selectedSheet][rowId - 1] == undefined) {
                cellData[selectedSheet][rowId - 1] = {};
                cellData[selectedSheet][rowId - 1][colId - 1] = { ...defaultProperties };
                cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
            } else {
                if (cellData[selectedSheet][rowId - 1][colId - 1] == undefined) {
                    cellData[selectedSheet][rowId - 1][colId - 1] = { ...defaultProperties };
                    cellData[selectedSheet][rowId - 1][colId - 1][property] = value;

                } else {
                    cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
                }

            }
        });
    } else {
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = findRowCol(data);
            if (cellData[selectedSheet][rowId - 1] && cellData[selectedSheet][rowId - 1][colId - 1]) {
                cellData[selectedSheet][rowId - 1][colId - 1][property] = value;
                if (JSON.stringify(cellData[selectedSheet][rowId - 1][colId - 1]) == JSON.stringify(defaultProperties)) {
                    delete cellData[selectedSheet][rowId - 1][colId - 1];
                    if (Object.keys(cellData[selectedSheet][rowId - 1]).length == 0) {
                        delete cellData[selectedSheet][rowId - 1];
                    }
                }
            }
        })

    }
}

$(".color-pick").colorPick({
    'initialColor': '#TYPECOLOR',
    'allowRecent': true,
    'recentMax': 5,
    'allowCustomColor': true,
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
    'onColorSelected': function () {
        if (this.color != "#TYPECOLOR") {
            if (this.element.attr("id") == "fill-color") {
                $("#fill-color-icon").css("border-bottom", `4px solid ${this}.color`);
                $(".input-cell.selected").css("background-color", this.color);
                // $(".input-cell.selected").each((index, data) => {
                //     let [rowId, colId] = findRowCol(data);
                //    cellData[selectedSheet][rowId - 1][colId - 1].bgcolor = this.color;
                // })
                updateCellData("bgcolor", this.color);
            } else {
                $("#text-color-icon").css("border-bottom", `4px solid ${this}.color`);
                $(".input-cell.selected").css("color", this.color);
                // $(".input-cell.selected").each((index, data) => {
                //     let [rowId, colId] = findRowCol(data);
                //      cellData[selectedSheet][rowId - 1][colId - 1].color = this.color;
                // });

                updateCellData("color", this.color);

            }
        }
    }
});

$("#fill-color-icon,#text-color-icon").click(function (e) {
    setTimeout(() => {
        $(this).parent().click();
    }, 10);
});




/*$(".sheet-tab").click(function (e) {
    if(!$(this).hasClass("selected")){
        
        selectSheet(this);
    }
});
*/
$(".container").click(function (e) {
    $(".sheet-options-modal").remove();

});


function selectSheet(ele) {

    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    loadSheet();

}
function emptySheet() {
    let data = cellData[selectedSheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
        let rowId = parseInt(i);
        let colKeys = Object.keys(data[rowId]);
        for (let j of colKeys) {
            let colId = parseInt(j);
            let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);// first cell that have changes
            cell.text("");
            cell.css({
                "font-family": "Noto Sans",
                "font-size": 14,
                "background-color": "#fff",
                "color": "#444",
                "font-weight": "",
                "font-style": "",
                "text-decoration": "",
                "text-align": "left"
            });

        }

    }
}


function loadSheet() {

    let data = cellData[selectedSheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
        let rowId = parseInt(i);
        let colKeys = Object.keys(data[rowId]);
        for (let j of colKeys) {
            let colId = parseInt(j);
            let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);// first cell that have changes
            cell.text(data[rowId][colId].text);
            cell.css({
                "font-family": data[rowId][colId]["font-family"],
                "font-size": data[rowId][colId]["font-size"] + "px",
                "background-color": data[rowId][colId]["bgcolor"],
                "color": data[rowId][colId].color,
                "font-weight": data[rowId][colId].bold ? "bold" : "",
                "font-style": data[rowId][colId].italic ? "italic" : "",
                "text-decoration": data[rowId][colId].underlined ? "underline" : "",
                "text-align": data[i - 1][colId].alignment
            });

        }

    }

}




$(".add-sheet").click(function (e) {
    emptySheet();
    totalSheets++;
    lastlyAddedSheetNumber++;
    while (Object.keys(cellData).includes("Sheet" + lastlyAddedSheetNumber)) {
        lastlyAddedSheetNumber++;
    }
    cellData[`Sheet${lastlyAddedSheetNumber}`] = {};
    selectedSheet = `Sheet${lastlyAddedSheetNumber}`;

    $(".sheet-tab.selected").removeClass("selected");
    $(".sheet-tab-container").append(
        `<div class="sheet-tab selected">Sheet${lastlyAddedSheetNumber}</div>`
    );
    $(".sheet-tab.selected")[0].scrollIntoView();

    addSheetTabEventListeners();


});

function addSheetTabEventListeners() {


    $(".sheet-tab.selected").bind("contextmenu", function (e) {
        e.preventDefault();

        $(".sheet-options-modal").remove();
        let modal = $(`<div class="sheet-options-modal">
                            <div class="option sheet-rename">Rename</div>
                            <div class="option sheet-delete">Delete</div>
                        </div>`);

        $(".container").append(modal);
        $(".sheet-options-modal").css({ "bottom": 0.04 * $(".container").height(), "left": e.pageX });
        $(".sheet-rename").click(function (e) {
            let renameModal = `<div class="sheet-modal-parent">
            <div class="sheet-rename-modal">
                <div class="sheet-modal-title">
                    <span>Rename Sheet</span>
                </div>
                <div class="sheet-modal-input-container">
                    <span class="sheet-modal-input-title">Rename Sheet to:</span>
                    <input class="sheet-modal-input" type="text" />
                </div>
                <div class="sheet-modal-confirmation">
                    <div class="button ok-button">OK</div>
                    <div class="button cancel-button">Cancel</div>
                </div>
            </div>
        </div>`
            $(".container").append(renameModal);
            $(".cancel-button").click(function (e) {
                $(".sheet-modal-parent").remove();
            })
            $(".ok-button").click(function (e) {

                renameSheet();

            })
            $(".sheet-modal-input").keypress(function (e) {
                if (e.key == "Enter") {
                    renameSheet();
                }
            })
        });

        $(".sheet-delete").click(function (e) {
            let deleteModal = `<div class="sheet-modal-parent">
            <div class="sheet-delete-modal">
                <div class="sheet-modal-title">
                    <span>Sheet Name</span>
                </div>
                <div class="sheet-modal-detail-container">
                    <span class="sheet-modal-detail-title">Are you sure?</span>
                </div>
                <div class="sheet-modal-confirmation">
                    <div class="button delete-button">
                        <div class="material-icons delete-icon">delete</div>
                        Delete
                    </div>
                    <div class="button cancel-button">Cancel</div>
                </div>
            </div>
         </div>`;
            $(".container").append(deleteModal);
            $(".cancel-button").click(function (e) {
                $(".sheet-modal-parent").remove();
            });
            $(".delete-button").click(function (e) {
                if (totalSheets > 1) {
                    $(".sheet-modal-parent").remove();
                    let keysArray = Object.keys(cellData);
                    let selectedSheetIndex = keysArray.indexOf(selectedSheet);
                    let currentSelectedSheet = $(".sheet-tab.selected");

                    if (selectedSheetIndex == 0) {

                        selectSheet(currentSelectedSheet.next()[0]);

                    } else {

                        selectSheet(currentSelectedSheet.prev()[0]);

                    }
                    delete cellData[currentSelectedSheet.text()];
                    currentSelectedSheet.remove();
                    // selectSheet($(".sheet-tab.selected")[0]);
                    totalSheets--;
                }
            })

        })
        if (!$(this).hasClass("selected")) {
            selectSheet(this);
        }
    });
    $(".sheet-tab.selected").click(function (e) {
        if (!$(this).hasClass("selected")) {
            selectSheet(this);
        }
    });
}

function renameSheet() {
    let newSheetName = $(".sheet-modal-input").val();
    if (newSheetName && !Object.keys(cellData).includes(newSheetName)) {
        // need to change
        let newCellData = {};
        for (let i of Object.keys(cellData)) {
            if (i == selectedSheet) {
                newCellData[newSheetName] = cellData[i];
            } else {
                newCellData[i] = cellData[i];
            }
        }

        cellData = newCellData;

        selectedSheet = newSheetName;
        $(".sheet-tab.selected").text(newSheetName);
        $(".sheet-modal-parent").remove();

    } else {
        $(".error").remove();
        $(".sheet-modal-input-container").append(`

        <div class="error"> Sheet name is not valid or sheet already exists</div>

        `)
    }

}
$(".left-scroller").click(function (e) {
    let keysArray = Object.keys(cellData);
    let selectedSheetIndex = keysArray.indexOf(selectedSheet);
    if (selectedSheetIndex != 0) {
        selectSheet($(".sheet-tab.selected").prev()[0]);
    }
    $(".sheet-tab.selected")[0].scrollIntoView();
})

$(".right-scroller").click(function (e) {
    let keysArray = Object.keys(cellData);
    let selectedSheetIndex = keysArray.indexOf(selectedSheet);
    if (selectedSheetIndex != (keysArray.length - 1)) {
        selectSheet($(".sheet-tab.selected").next()[0]);
    }
    $(".sheet-tab.selected")[0].scrollIntoView();
})

