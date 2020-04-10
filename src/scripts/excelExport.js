// Require library
const xl = require('excel4node');

import { writeFile } from './fileUtil.js';
 
export default function createExcel(){
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();
    
    // Add Worksheets to the workbook
    var year = new Date().getFullYear()
    var ws = wb.addWorksheet(year);
    
    // Create a reusable style
    var style = wb.createStyle({
    font: {
        color: '#000000',
        size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
    });
    
    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    ws.cell(1, 1)
    .number(100)
    .style(style);
    
    // Set value of cell B1 to 200 as a number type styled with paramaters of style
    ws.cell(1, 2)
    .number(200)
    .style(style);
    
    // Set value of cell C1 to a formula styled with paramaters of style
    ws.cell(1, 3)
    .formula('A1 + B1')
    .style(style);
    
    // Set value of cell A2 to 'string' styled with paramaters of style
    ws.cell(2, 1)
    .string('string')
    .style(style);
    
    // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
    ws.cell(3, 1)
    .bool(true)
    .style(style)
    .style({font: {size: 14}});

    wb.writeToBuffer().then(function(buffer) {
        writeFile('reakreacne-poukazy-export.xlsx', buffer);
    });
}