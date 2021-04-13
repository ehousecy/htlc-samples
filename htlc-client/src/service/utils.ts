
const ExcelJS = require('exceljs');


async function appendData(startTime:number, endTime:number, duration:number, operation:string) {
    let nameFileExcel = 'cc2.xlsx'
    var workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(nameFileExcel)
    var worksheet = workbook.getWorksheet(1);
    var lastRow = worksheet.lastRow;
    console.log(lastRow.number)
    var getRowInsert = worksheet.getRow(lastRow.number+1);
    console.log(getRowInsert)
    getRowInsert.getCell('A').value = startTime;
    getRowInsert.getCell('B').value = endTime;
    getRowInsert.getCell('C').value = duration;
    getRowInsert.getCell('D').value = operation;

    getRowInsert.commit();
    return workbook.xlsx.writeFile(nameFileExcel);

}


// appendData(110,120,10,"sdad")

function getCurrentTime() {
    var moment = require('moment')
    let time = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS")
    let timestamp = Date.parse(time);
    return timestamp
}



export {
    getCurrentTime,
    appendData
}
