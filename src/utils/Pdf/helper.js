import { footerImg, headerLogo, headerUsLogo, footerUS, headerInvestmentInvoiceUK } from './base64-img'
import jsPDF from 'jspdf';

const addFooter = (doc) => { 
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.addImage(footerImg,0,270,218,30);
}
const addUSFooter = (doc) => {
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    // doc.addImage(footerUS,0,280,218,15);
    doc.addImage(footerUS,10,280,200,13);
}
const addFooterUKInvoice = (doc) => {
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    // doc.addImage(footerUS,0,280,218,15);
    doc.addImage(footerImg,0,255,218,30);
}



const handleCurrencyFormat = (value) => {
    let str_value = value.toString();
    let str_length = str_value.length;
    
        if(str_value.slice(0,1) === "-") {
            if(str_length === 8) {
                str_value = str_value.slice(0,2) + "," + str_value.slice(2,str_length);
            }
            if(str_length === 9) {
                str_value = str_value.slice(0,3) + "," + str_value.slice(3,str_length);
            }
            if(str_length === 10) {
                str_value = str_value.slice(0,2) + "," + str_value.slice(2,4) + "," + str_value.slice(4,str_length);
            }
        }else {
            if(str_length === 7) {
                str_value = str_value.slice(0,1) + "," + str_value.slice(1,str_length);
            }
            if(str_length === 8) {
                str_value = str_value.slice(0,2) + "," + str_value.slice(2,str_length);
            }
            if(str_length === 9) {
                str_value = str_value.slice(0,1) + "," + str_value.slice(1,3) + "," + str_value.slice(3,str_length);
            }
        }
    
    return str_value;
}




//US invoice
const generateUSInvoice = (invoice) => {
    // console.log('invoice data', invoice)
    const bill =  invoice.bill_to_address;
    const ship = invoice.ship_to_address;
    // console.log('bill to',invoice.bill_to_address);
    // console.log('bill to',invoice.ship_to_address);
    var doc = new jsPDF('p', 'mm','a4');
    doc.addImage(headerUsLogo,90,15,40,22)
    doc.setFont('Times','italic');
    doc.setTextColor(55,55,55);
    doc.setFontSize(20);
    doc.text('INVOICE',11,50);
    doc.line(11,53,200,53);
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text('BILL TO',11,61);
    doc.text('SHIP TO',76,61);
    doc.setTextColor(128,128,128);
    doc.setFont('Times','normal');
    let billPos = 67;
    if(bill.billing_name) {
        doc.text(bill.billing_name?bill.billing_name:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street) {
        doc.text(bill.billing_street?bill.billing_street:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street2) {
        doc.text(bill.billing_street2?bill.billing_street2:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_state) {
        doc.text(bill.billing_state?bill.billing_state:"",11,billPos)
        billPos = billPos + 5;
    }
    const bill_city = bill.billing_city ? bill.billing_city : "";
    const bill_code = bill.billing_code ? bill.billing_code:"";
    let bill_line4 = '';

    if(bill_city && bill_code) {
        bill_line4 = bill_city + ", " + bill_code;
    }
    else {
        bill_line4 = bill_city + bill_code;
    }

    if(bill_line4) {
        doc.text(bill_line4,11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_country) {
        doc.text(bill.billing_country?bill.billing_country:"",11,billPos)
    }
    let shipPos = 67;
    if(ship.shipping_name) {
        doc.text(ship.shipping_name?ship.shipping_name:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street) {
        doc.text(ship.shipping_street?ship.shipping_street:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street2) {
        doc.text(ship.shipping_street2?ship.shipping_street2:"",776,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_state!=null) {
        doc.text(ship.shipping_state?ship.shipping_state:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    const ship_city = ship.shipping_city ? ship.shipping_city : "";
    const ship_code = ship.shipping_code ? ship.shipping_code:"";
    let ship_line4 = "";
    if(ship_city && ship_code) {
        ship_line4 = ship_city + ", " + ship_code;
    }
    else {
        ship_line4 = ship_city + ship_code;
    }
    if(ship_line4) {
        doc.text(ship_line4,76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_country) {
        doc.text(ship.shipping_country?ship.shipping_country:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_company) {
        doc.text(ship.shipping_company?ship.shipping_company:"",76,shipPos)
    }

    doc.text("Delivery Contact Number: " + (invoice.deliver_phone ? invoice.deliver_phone : '-'),136,67)
    doc.text("Account: "+ (invoice.account_number ? '(' + invoice.account_number + ')': '-'),136,72)
    doc.text("Invoice No: " + (invoice.invoice_number ? '(' + invoice.invoice_number + ')' : '-'),136,77)
    doc.text("Date: "+ (invoice.invoice_date ? invoice.invoice_date : '-'),136,82)
    doc.text("Due Date: " + (invoice.due_date ? invoice.due_date : '-'),136,87)
    doc.text("Storage Acc: " + (invoice.storage_account ? '(' + invoice.storage_account + ')' : '-'),136,92)
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.setTextColor(0,0,0);
    doc.addImage(footerUS,10,280,200,13);
    doc.setTextColor(128,128,128);
    //table here
    // console.log(invoice.wines.length)
    if(invoice.wines && invoice.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 106, 190, 4.8, 'FD'); //Fill and Border
        doc.setFontSize(10);
        doc.setFont('Times','normal');
        doc.setTextColor(255,255,255);
        doc.text(" Year      Wine                                                                                                               Size            Quantity          Price           Net Price",10,109.5);
    }
    doc.setTextColor(128,128,128);
    let yPos = 118;
    if(invoice.wines && invoice.wines.length > 0) {
        invoice.wines.map((value)=>{
            doc.setFontSize(10);
            doc.text(value.Year ? value.Year : '-',11,yPos)
            doc.text(value.Wine ? value.Wine : '-',23,yPos);
            doc.text(value.Size ? value.Size : '-',133,yPos,{align:'center'})
            doc.text(value.Qty ? value.Qty.toString() : '-',151,yPos,{align:'center'})
            doc.text(value.Price ? value.Price : '-',177,yPos,{align:'right'})
            doc.text(value.Total ? value.Total : '-',197,yPos,{align:'right'})
            yPos = yPos + 5; //225
            if(yPos > 235) {
                yPos = 60;
                doc.addPage();
                doc.addImage(headerUsLogo,90,15,40,22)
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 190, 4.8, 'FD'); //Fill and Border
                doc.setFontSize(10);
                doc.setFont('Times','normal');
                doc.setTextColor(255,255,255);
                doc.text(" Year      Wine                                                                                                               Size            Quantity          Price           Net Price",10,50.5);
                addUSFooter(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }

    //amount
    doc.line(11,235,200,235)
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.setTextColor(55,55,55); 
    doc.text('PLEASE PAY',11,241)
    doc.setFont('Times','normal');
    doc.text('Westgarth Wines',11,246)
    doc.text('475 Washington Blvd. ',11,251)
    doc.text('Marina Del Rey, CA 90292',11,256)
    doc.text('Account No: 206 983 264 ',11,261)
    doc.text('ABA No: 322271724',11,266)
    doc.text("Citi Bank: 787 W 5th St, Los Angeles CA 90071",11,271)

    doc.setFont('Times','bold');
    doc.text("Wine Total",136,241)
    doc.text("Shipping",136,246)
    doc.text("Promotion",136,251)
    doc.text("State Tax",136,256)
    doc.text("County Tax",136,261)
    doc.text("Invoice Total",136,266)

    doc.text(invoice.wine_total ? invoice.wine_total : "0" ,199,241,{align:'right'})
    doc.text(invoice.insurance_fee ? invoice.insurance_fee : "0" ,199,246,{align:'right'})
    doc.text(invoice.shipping_fee ? invoice.shipping_fee : "0",199,251,{align:'right'})
    doc.text(invoice.credit_card_fee ? invoice.credit_card_fee : "0",199,256,{align:'right'})
    doc.text(invoice.vat ? invoice.vat : "0",199,261,{align:'right'})
    doc.text(invoice.grand_total ? (invoice.currency ? invoice.currency:"") +" "+ invoice.grand_total : "0",199,266,{align:'right'})

    doc.line(11,274.4,200,274.4);
    let fname = invoice.first_name ? invoice.first_name:""
    let lname = invoice.last_name ? invoice.last_name:""
    let invoiceNumber = invoice.invoice_number ? invoice.invoice_number:""
    let pdf_name = fname+"_"+lname+"_"+"invoice_"+invoiceNumber;
    doc.save(pdf_name+'.pdf');
}
//US SHIPPING STATEMENT
const generateCRMShippingStatements = (statement) => {

    // console.log("statements data",statement)
    var doc = new jsPDF('p', 'mm','a4');
    doc.addImage(headerUsLogo,90,15,40,22)
    doc.setFont('Times','italic');
    doc.setTextColor(128,128,128);
    doc.setFontSize(20);
    let height = doc.internal.pageSize.height; //297
    doc.text('SHIPMENT STATEMENT',10,50);
    doc.line(10,53,200,53);
    doc.setFontSize(10);
    doc.setFont('Times','normal');
    doc.text("Account: " + (statement.account ? statement.account : ''),11.8,60)
    doc.text("Storage: " + (statement.storage ? statement.storage : ''),11.8,65)
    doc.text("Date: " + (statement.date ? statement.date : ''),11.8,70)
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.addImage(footerUS,10,280,200,13);
    //table here
    if(statement.wines && statement.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 82, 190, 4.8, 'FD'); //Fill and Border
        doc.setFontSize(8);
        doc.setFont('Times','normal');
        doc.setTextColor(255, 255, 255);
        doc.text("    Ref#      Wine                                                                                                                                            Year          Size         Qty         Paid        Delivered      Shipped",10,85.5);
    }

    doc.setTextColor(128, 128, 128);
    let yPos = 95;
    if(statement.wines && statement.wines.length > 0) {
        statement.wines.map((value)=>{
            doc.text(value.Ref?value.Ref:"-",11.8,yPos);
            doc.text(value.Wine?value.Wine:"-",23,yPos);
            doc.text(value.Year?value.Year:"-",130,yPos,{align:'center'})
            doc.text(value.Size?value.Size:"-",142.5,yPos, {align:'center'})
            doc.text(value.Qty? value.Qty.toString():"-",153,yPos, {align:'center'})
            doc.text(value.Paid?value.Paid.toString():"-",164,yPos,{align:'center'})
            doc.text(value.Delivered?value.Delivered.toString():"0",178,yPos,{align:'center'})
            doc.text(value.Shipped?value.Shipped.toString():"0",192,yPos,{align:'center'})
            yPos = yPos + 5;
            if(yPos > 245 ) {
                yPos = 60;
                doc.addPage();
                doc.addImage(headerUsLogo,90,15,40,22)
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 190, 4.8, 'FD'); //Fill and Border
                doc.setFontSize(8);
                doc.setFont('Times','normal');
                doc.setTextColor(255, 255, 255);
                doc.text("    Ref#      Wine                                                                                                                                            Year          Size         Qty         Paid        Delivered      Shipped",10,50);
                addUSFooter(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }
    //amount
    
    doc.line(10,245,200,245);
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text("Total Purchased",148,250);
    doc.text("Total Paid",148,255);
    doc.text("Total Delivered",148,260);
    doc.text("Total Shipped",148,265);
    let total_shipped = statement.total_shipped?statement.total_shipped:"";
    // console.log('total shipped',statement.total_shipped)
    doc.text(statement.total_puchased ? statement.total_puchased.toString() : "0" ,194,250, {align:'right'});
    doc.text(statement.total_paid ? statement.total_paid.toString() : "0",194,255, {align:'right'});
    doc.text(statement.total_delivered ? statement.total_delivered.toString() : "0",194,260, {align:'right'});
    doc.text(total_shipped ? total_shipped.toString():"0",194,265, {align:'right'});
    doc.setFont('Times','normal');
    doc.line(10,270,200,270); //254.5

    let fname = statement.first_name ? statement.first_name:"";
    let lname = statement.last_name ? statement.last_name:"";
    let pdf_name = fname+"_"+lname+"_Shipment_Statement";
    doc.save(pdf_name+'.pdf');
}
//UK GENERAL INVOICE
const generateUKGeneralInvoice = (invoice) => {
    // console.log('invoice data', invoice)
    const bill =  invoice.bill_to_address;
    const ship = invoice.ship_to_address;
    // console.log('bill to',invoice.bill_to_address);
    // console.log('bill to',invoice.ship_to_address);
    var doc = new jsPDF('p', 'mm','letter');
    doc.addImage(headerLogo,80,15,50,28);
    doc.setFont('Times','italic');
    doc.setTextColor(55,55,55);
    doc.setFontSize(20);
    doc.text('INVOICE',11,50);
    doc.line(11,53,205,53);
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text('BILL TO',11,61);
    doc.text('SHIP TO',76,61);
    doc.setTextColor(128,128,128);
    doc.setFont('Times','normal');
    let billPos = 67;
    if(bill.billing_name) {
        doc.text(bill.billing_name?bill.billing_name:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street) {
        doc.text(bill.billing_street?bill.billing_street:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street2) {
        doc.text(bill.billing_street2?bill.billing_street2:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_state) {
        doc.text(bill.billing_state?bill.billing_state:"",11,billPos)
        billPos = billPos + 5;
    }
    const bill_city = bill.billing_city ? bill.billing_city : "";
    const bill_code = bill.billing_code ? bill.billing_code:"";
    let bill_line4 = '';

    if(bill_city && bill_code) {
         bill_line4 = bill_city + ", " + bill_code;
    }
    else {
         bill_line4 = bill_city + bill_code;
    }

    if(bill_line4) {
        doc.text(bill_line4,11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_country) {
        doc.text(bill.billing_country?bill.billing_country:"",11,billPos)
    }
    let shipPos = 67;
    if(ship.shipping_name) {
        doc.text(ship.shipping_name?ship.shipping_name:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street) {
        doc.text(ship.shipping_street?ship.shipping_street:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street2) {
        doc.text(ship.shipping_street2?ship.shipping_street2:"",776,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_state!=null) {
        doc.text(ship.shipping_state?ship.shipping_state:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    const ship_city = ship.shipping_city ? ship.shipping_city : "";
    const ship_code = ship.shipping_code ? ship.shipping_code:"";
    let ship_line4 = "";
    if(ship_city && ship_code) {
        ship_line4 = ship_city + ", " + ship_code;
    }
    else {
        ship_line4 = ship_city + ship_code;
    }
    if(ship_line4) {
        doc.text(ship_line4,76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_country) {
        doc.text(ship.shipping_country?ship.shipping_country:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_company) {
        doc.text(ship.shipping_company?ship.shipping_company:"",76,shipPos)
    }

    doc.text("Delivery Contact Number: " + (invoice.deliver_phone ? invoice.deliver_phone : '-'),136,67)
    doc.text("Account: "+ (invoice.account_number ? '(' + invoice.account_number + ')': '-'),136,72)
    doc.text("Invoice No: " + (invoice.invoice_number ? '(' + invoice.invoice_number + ')' : '-'),136,77)
    doc.text("Date: "+ (invoice.invoice_date ? invoice.invoice_date : '-'),136,82)
    doc.text("Due Date: " + (invoice.due_date ? invoice.due_date : '-'),136,87)
    doc.text("Storage Acc: " + (invoice.storage_account ? '(' + invoice.storage_account + ')' : '-'),136,92)
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.setTextColor(0,0,0);
    doc.addImage(footerImg,0,255,218,30);
    doc.setTextColor(128,128,128);
    //table here
    // console.log(invoice.wines.length)
    if(invoice.wines && invoice.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 107, 194, 5, 'FD'); //Fill and Border
        doc.setFontSize(10);
        doc.setFont('Times','normal');
        doc.setTextColor(255,255,255);
        doc.text(" Wine                                                                                                              Year         Size           Qty       Price            Net Price       VAT",10,110.5);
    }
    doc.setTextColor(128,128,128);
    let yPos = 120;
    if(invoice.wines && invoice.wines.length > 0) {
        invoice.wines.map((value)=>{
            doc.setFontSize(10);
            doc.text(value.Wine ? value.Wine : '-',11.5,yPos);
            doc.text(value.Year ? value.Year : '-',123,yPos,{align:'right'})
            doc.text(value.Size ? value.Size : '-',135,yPos,{align:'center'})
            doc.text(value.Qty ? value.Qty.toString() : '-',149,yPos,{align:'center'})
            doc.text(value.Price ? value.Price : '-',168,yPos,{align:'right'})
            doc.text(value.Total ? value.Total : '-',189,yPos,{align:'right'})
            doc.text(value.VAT ? value.VAT : '-',201,yPos,{align:'right'})
            yPos = yPos + 5; //225
            if(yPos > 215) {//215
                yPos = 60;
                doc.addPage();
                doc.addImage(headerLogo,80,15,50,28);
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 194, 5, 'FD'); //Fill and Border
                doc.setFontSize(10);
                doc.setFont('Times','normal');
                doc.setTextColor(255, 255, 255);
                doc.text(" Wine                                                                                                              Year         Size           Qty       Price            Net Price       VAT",10,50.5);
                addFooterUKInvoice(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }

    //amount
    doc.line(11,219,205,219)
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    // doc.text('PLEASE PAY',10,232)
    // doc.setFont('Times','bold');
    // doc.text('Westgarth Wines Ltd',10,237)
    // doc.text('Account No: 7310 8554',10,242)
    // doc.text('Sort Code: 20-36-98',10,247)
    // doc.text('SWIFT/BIC:BUKBGB22',10,252)
    // doc.text('IBAN:GB43 BUKB 2036 9873 1085 54',10,257)
    // doc.text("Barclays Bank: 10 North St, Bishop's Stortford CM23 2LH, UK",10,262)
    doc.setTextColor(55,55,55);
    doc.setFont('Times','bold');
    doc.text("Wine Total",137,225) //diff 6
    doc.text("Insurance",137,230)
    doc.text("Shipping",137,235)
    doc.text("Credit Card Fee",137,240)
    doc.text("VAT",137,245)
    doc.text("Invoice Total",137,250)

    doc.text(invoice.wine_total ? invoice.wine_total : "0" ,201,225,{align:'right'})
    doc.text(invoice.insurance_fee ? invoice.insurance_fee : "0" ,201,230,{align:'right'})
    doc.text(invoice.shipping_fee ? invoice.shipping_fee : "0",201,235,{align:'right'})
    doc.text(invoice.credit_card_fee ? invoice.credit_card_fee : "0",201,240,{align:'right'})
    doc.text(invoice.vat ? invoice.vat : "0",201,245,{align:'right'})
    doc.text(invoice.grand_total ? (invoice.currency ? invoice.currency:"") +" "+ invoice.grand_total : "0",201,250,{align:'right'})

    doc.line(11,255,205,255);
    let fname = invoice.first_name ? invoice.first_name:""
    let lname = invoice.last_name ? invoice.last_name:""
    let invoiceNumber = invoice.invoice_number ? invoice.invoice_number:""
    let pdf_name = fname+"_"+lname+"_"+"invoice_"+invoiceNumber;
    doc.save(pdf_name+'.pdf');
}
//UK INVESTMENT INVOICE
const generateUKInvestmentInvoice = (invoice) => {
    // console.log('invoice data', invoice)
    const bill =  invoice.bill_to_address;
    const ship = invoice.ship_to_address;
    // console.log('bill to',invoice.bill_to_address);
    // console.log('bill to',invoice.ship_to_address);
    var doc = new jsPDF('p', 'mm','letter');
    doc.addImage(headerInvestmentInvoiceUK,80,15,50,28);
    doc.setFont('Times','italic');
    doc.setTextColor(55,55,55);
    doc.setFontSize(20);
    doc.text('INVOICE',11,50);
    doc.line(11,53,205,53);
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text('BILL TO',11,61);
    doc.text('SHIP TO',76,61);
    doc.setTextColor(128,128,128);
    doc.setFont('Times','normal');
    let billPos = 67;
    if(bill.billing_name) {
        doc.text(bill.billing_name?bill.billing_name:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street) {
        doc.text(bill.billing_street?bill.billing_street:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street2) {
        doc.text(bill.billing_street2?bill.billing_street2:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_state) {
        doc.text(bill.billing_state?bill.billing_state:"",11,billPos)
        billPos = billPos + 5;
    }
    const bill_city = bill.billing_city ? bill.billing_city : "";
    const bill_code = bill.billing_code ? bill.billing_code:"";
    let bill_line4 = '';

    if(bill_city && bill_code) {
         bill_line4 = bill_city + ", " + bill_code;
    }
    else {
         bill_line4 = bill_city + bill_code;
    }

    if(bill_line4) {
        doc.text(bill_line4,11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_country) {
        doc.text(bill.billing_country?bill.billing_country:"",11,billPos)
    }
    let shipPos = 67;
    if(ship.shipping_name) {
        doc.text(ship.shipping_name?ship.shipping_name:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street) {
        doc.text(ship.shipping_street?ship.shipping_street:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street2) {
        doc.text(ship.shipping_street2?ship.shipping_street2:"",776,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_state!=null) {
        doc.text(ship.shipping_state?ship.shipping_state:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    const ship_city = ship.shipping_city ? ship.shipping_city : "";
    const ship_code = ship.shipping_code ? ship.shipping_code:"";
    let ship_line4 = "";
    if(ship_city && ship_code) {
        ship_line4 = ship_city + ", " + ship_code;
    }
    else {
        ship_line4 = ship_city + ship_code;
    }
    if(ship_line4) {
        doc.text(ship_line4,76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_country) {
        doc.text(ship.shipping_country?ship.shipping_country:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_company) {
        doc.text(ship.shipping_company?ship.shipping_company:"",76,shipPos)
    }

    doc.text("Delivery Contact Number: " + (invoice.deliver_phone ? invoice.deliver_phone : '-'),136,67)
    doc.text("Account: "+ (invoice.account_number ? '(' + invoice.account_number + ')': '-'),136,72)
    doc.text("Invoice No: " + (invoice.invoice_number ? '(' + invoice.invoice_number + ')' : '-'),136,77)
    doc.text("Date: "+ (invoice.invoice_date ? invoice.invoice_date : '-'),136,82)
    doc.text("Due Date: " + (invoice.due_date ? invoice.due_date : '-'),136,87)
    doc.text("Storage Acc: " + (invoice.storage_account ? '(' + invoice.storage_account + ')' : '-'),136,92)
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.setTextColor(0,0,0);
    doc.addImage(footerImg,0,255,218,30);
    doc.setTextColor(128,128,128);
    //table here
    // console.log(invoice.wines.length)
    if(invoice.wines && invoice.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 107, 194, 5, 'FD'); //Fill and Border
        doc.setFontSize(10);
        doc.setFont('Times','normal');
        doc.setTextColor(255,255,255);
        doc.text(" Wine                                                                                                                             Year         Size           Qty       Price            Net Price",10,110.5);
    }
    doc.setTextColor(128,128,128);
    let yPos = 120;
    if(invoice.wines && invoice.wines.length > 0) {
        invoice.wines.map((value)=>{
            doc.setFontSize(10);
            doc.text(value.Wine ? value.Wine : '-',11.5,yPos);
            doc.text(value.Year ? value.Year : '-',136,yPos,{align:'right'})
            doc.text(value.Size ? value.Size : '-',148,yPos,{align:'center'})
            doc.text(value.Qty ? value.Qty.toString() : '-',163,yPos,{align:'center'})
            doc.text(value.Price ? value.Price : '-',181,yPos,{align:'right'})
            doc.text(value.Total ? value.Total : '-',203,yPos,{align:'right'})
            // doc.text(value.VAT ? value.VAT : '-',201,yPos,{align:'right'})
            yPos = yPos + 5; //225
            if(yPos > 215) {
                yPos = 60;
                doc.addPage();
                doc.addImage(headerInvestmentInvoiceUK,80,15,50,28);
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 194, 5, 'FD'); //Fill and Border
                doc.setFontSize(10);
                doc.setFont('Times','normal');
                doc.setTextColor(255, 255, 255);
                doc.text(" Wine                                                                                                                             Year         Size           Qty       Price            Net Price",10,50.5);
                addFooterUKInvoice(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }

    //amount
    doc.line(11,215,205,215)
    doc.setFontSize(10);
    doc.setTextColor(55,55,55);
    doc.setFont('Times','bold');
    doc.text('PLEASE PAY',11,221)
    doc.setFont('Times','normal');
    doc.text('Westgarth Wines Ltd',11,226)
    doc.text('Account No: 7310 8554',11,231)
    doc.text('Sort Code: 20-36-98',11,236)
    doc.text('SWIFT/BIC:BUKBGB22',11,241)
    doc.text('IBAN:GB43 BUKB 2036 9873 1085 54',11,246)
    doc.text("Barclays Bank: 10 North St, Bishop's Stortford CM23 2LH, UK",11,251)
    doc.setTextColor(55,55,55);
    doc.setFont('Times','bold');
    doc.text("Total",137,221) //diff 6
    doc.text("Insurance",137,226)
    doc.text("Storage",137,231)
    doc.text("Management Fee",137,236)
    doc.text("VAT",137,241)
    doc.text("Invoice Total",137,246)

    doc.text(invoice.wine_total ? invoice.wine_total : "0" ,201,221,{align:'right'})
    doc.text(invoice.insurance_fee ? invoice.insurance_fee : "0" ,201,226,{align:'right'})
    doc.text(invoice.shipping_fee ? invoice.shipping_fee : "0",201,231,{align:'right'})
    doc.text(invoice.credit_card_fee ? invoice.credit_card_fee : "0",201,236,{align:'right'})
    doc.text(invoice.vat ? invoice.vat : "0",201,241,{align:'right'})
    doc.text(invoice.grand_total ? (invoice.currency ? invoice.currency:"") +" "+ invoice.grand_total : "0",201,246,{align:'right'})

    doc.line(10,255,205,255);
    let fname = invoice.first_name ? invoice.first_name:""
    let lname = invoice.last_name ? invoice.last_name:""
    let invoiceNumber = invoice.invoice_number ? invoice.invoice_number:""
    let pdf_name = fname+"_"+lname+"_"+"invoice_"+invoiceNumber;
    doc.save(pdf_name+'.pdf');
}
//UK PO 
const generateUKPurchaseOrder = (invoice) => {
    // console.log('invoice data', invoice)
    const bill =  invoice.bill_to_address;
    const ship = invoice.ship_to_address;
    // console.log('bill to',invoice.bill_to_address);
    // console.log('bill to',invoice.ship_to_address);
    var doc = new jsPDF('p', 'mm','letter');
    doc.addImage(headerLogo,80,15,50,28);
    doc.setFont('Times','italic');
    doc.setTextColor(55,55,55);
    doc.setFontSize(20);
    doc.text('PURCHASE',11,50);
    doc.text('ORDER',11,57);
    doc.line(11,62,205,62);
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text('SUPPLIER ADDRESS:',11,69);
    doc.text('DELIVERY ADDRESS:',76,69);
    doc.setTextColor(128,128,128);
    doc.setFont('Times','normal');
    let billPos = 74;
    if(bill.billing_name) {
        doc.text(bill.billing_name?bill.billing_name:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street) {
        doc.text(bill.billing_street?bill.billing_street:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street2) {
        doc.text(bill.billing_street2?bill.billing_street2:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_state) {
        doc.text(bill.billing_state?bill.billing_state:"",11,billPos)
        billPos = billPos + 5;
    }
    const bill_city = bill.billing_city ? bill.billing_city : "";
    const bill_code = bill.billing_code ? bill.billing_code:"";
    let bill_line4 = '';

    if(bill_city && bill_code) {
         bill_line4 = bill_city + ", " + bill_code;
    }
    else {
         bill_line4 = bill_city + bill_code;
    }

    if(bill_line4) {
        doc.text(bill_line4,11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_country) {
        doc.text(bill.billing_country?bill.billing_country:"",11,billPos)
    }

    //shipping
    let shipPos = 74;
    if(ship.shipping_name) {
        doc.text(ship.shipping_name?ship.shipping_name:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street) {
        doc.text(ship.shipping_street?ship.shipping_street:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street2) {
        doc.text(ship.shipping_street2?ship.shipping_street2:"",776,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_state!=null) {
        doc.text(ship.shipping_state?ship.shipping_state:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    const ship_city = ship.shipping_city ? ship.shipping_city : "";
    const ship_code = ship.shipping_code ? ship.shipping_code:"";
    let ship_line4 = "";
    if(ship_city && ship_code) {
        ship_line4 = ship_city + ", " + ship_code;
    }
    else {
        ship_line4 = ship_city + ship_code;
    }
    if(ship_line4) {
        doc.text(ship_line4,76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_country) {
        doc.text(ship.shipping_country?ship.shipping_country:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_company) {
        doc.text(ship.shipping_company?ship.shipping_company:"",76,shipPos)
    }

    doc.text("Account: " + (invoice.deliver_phone ? invoice.deliver_phone : '-'),136,74)
    doc.text("PO: "+ (invoice.account_number ? '(' + invoice.account_number + ')': '-'),136,79)
    doc.text("Purchase Date: " + (invoice.invoice_number ? '(' + invoice.invoice_number + ')' : '-'),136,84)
    doc.text("Delivery Date: "+ (invoice.invoice_date ? invoice.invoice_date : '-'),136,89)
    doc.text("Contact Name: " + (invoice.due_date ? invoice.due_date : '-'),136,94)
    doc.text("Contact Phone: " + (invoice.storage_account ? '(' + invoice.storage_account + ')' : '-'),136,99)
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.setTextColor(0,0,0);
    doc.addImage(footerImg,0,255,218,30);
    doc.setTextColor(128,128,128);
    //table here
    // console.log(invoice.wines.length)
    if(invoice.wines && invoice.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 115, 194, 5, 'FD'); //Fill and Border
        doc.setFontSize(10);
        doc.setFont('Times','normal');
        doc.setTextColor(255,255,255);
        doc.text(" Wine                                                                                                           Year         Size           Qty    Price            VAT         Total",10,118.5);
    }
    doc.setTextColor(128,128,128);
    let yPos = 128;
    if(invoice.wines && invoice.wines.length > 0) {
        invoice.wines.map((value)=>{
            doc.setFontSize(10);
            doc.text(value.Wine ? value.Wine : '-',11.5,yPos);
            doc.text(value.Year ? value.Year : '-',120,yPos,{align:'right'})
            doc.text(value.Size ? value.Size : '-',133,yPos,{align:'center'})
            doc.text(value.Qty ? value.Qty.toString() : '-',147,yPos,{align:'center'})
            doc.text(value.Price ? value.Price : '-',163,yPos,{align:'right'})
            doc.text(value.VAT ? value.VAT : '-',176,yPos,{align:'right'})
            doc.text(value.Total ? value.Total : '-',195,yPos,{align:'right'})
            yPos = yPos + 5; //225
            if(yPos > 225) {
                yPos = 60;
                doc.addPage();
                doc.addImage(headerLogo,80,15,50,28);
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 194, 5, 'FD'); //Fill and Border
                doc.setFontSize(10);
                doc.setFont('Times','normal');
                doc.setTextColor(255, 255, 255);
                doc.text(" Wine                                                                                                           Year         Size           Qty    Price            VAT         Total",10,50.5);
                addFooterUKInvoice(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }

    //amount
    doc.line(11,229,205,229)
    doc.setFontSize(10);
    doc.setTextColor(55,55,55);
    doc.setFont('Times','bold');
    // doc.text('PLEASE PAY',11,221)
    // doc.setFont('Times','normal');
    // doc.text('Westgarth Wines Ltd',11,226)
    // doc.text('Account No: 7310 8554',11,231)
    // doc.text('Sort Code: 20-36-98',11,236)
    // doc.text('SWIFT/BIC:BUKBGB22',11,241)
    // doc.text('IBAN:GB43 BUKB 2036 9873 1085 54',11,246)
    // doc.text("Barclays Bank: 10 North St, Bishop's Stortford CM23 2LH, UK",11,251)
    doc.setTextColor(55,55,55);
    doc.setFont('Times','bold');
    doc.text("Subtotal",137,234) //diff 6
    doc.text("Delivery Cost",137,239)
    doc.text("VAT",137,244)
    doc.text("Grand Total",137,249)
    // doc.text("VAT",137,241)
    // doc.text("Invoice Total",137,246)

    doc.text(invoice.wine_total ? invoice.wine_total : "0" ,201,234,{align:'right'})
    doc.text(invoice.insurance_fee ? invoice.insurance_fee : "0" ,201,239,{align:'right'})
    doc.text(invoice.shipping_fee ? invoice.shipping_fee : "0",201,244,{align:'right'})
    doc.text(invoice.credit_card_fee ? invoice.credit_card_fee : "0",201,249,{align:'right'})
    // doc.text(invoice.vat ? invoice.vat : "0",201,241,{align:'right'})
    // doc.text(invoice.grand_total ? (invoice.currency ? invoice.currency:"") +" "+ invoice.grand_total : "0",201,246,{align:'right'})

    doc.line(10,253,205,253);

    let fname = invoice.first_name ? invoice.first_name:""
    let lname = invoice.last_name ? invoice.last_name:""
    let poNumber = invoice.po_number ? invoice.po_number:""
    let pdf_name = fname+"_"+lname+"_"+"po_"+poNumber;
    doc.save(pdf_name+'.pdf');
}

//US PO
const generateUSPurchaseOrder = (invoice) => {
    // console.log('invoice data', invoice)
    const bill =  invoice.bill_to_address;
    const ship = invoice.ship_to_address;
    // console.log('bill to',invoice.bill_to_address);
    // console.log('bill to',invoice.ship_to_address);
    var doc = new jsPDF('p', 'mm','a4');
    doc.addImage(headerUsLogo,90,15,40,22);
    doc.setFont('Times','italic');
    doc.setTextColor(55,55,55);
    doc.setFontSize(20);
    doc.text('PURCHASE',11,50);
    doc.text('ORDER',11,57);
    doc.line(11,62,205,62);
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text('SUPPLIER ADDRESS:',11,69);
    doc.text('DELIVERY ADDRESS:',76,69);
    doc.setTextColor(128,128,128);
    doc.setFont('Times','normal');
    let billPos = 74;
    if(bill.billing_name) {
        doc.text(bill.billing_name?bill.billing_name:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street) {
        doc.text(bill.billing_street?bill.billing_street:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_street2) {
        doc.text(bill.billing_street2?bill.billing_street2:"",11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_state) {
        doc.text(bill.billing_state?bill.billing_state:"",11,billPos)
        billPos = billPos + 5;
    }
    const bill_city = bill.billing_city ? bill.billing_city : "";
    const bill_code = bill.billing_code ? bill.billing_code:"";
    let bill_line4 = '';

    if(bill_city && bill_code) {
         bill_line4 = bill_city + ", " + bill_code;
    }
    else {
         bill_line4 = bill_city + bill_code;
    }

    if(bill_line4) {
        doc.text(bill_line4,11,billPos)
        billPos = billPos + 5;
    }
    if(bill.billing_country) {
        doc.text(bill.billing_country?bill.billing_country:"",11,billPos)
    }

    //shipping
    let shipPos = 74;
    if(ship.shipping_name) {
        doc.text(ship.shipping_name?ship.shipping_name:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street) {
        doc.text(ship.shipping_street?ship.shipping_street:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_street2) {
        doc.text(ship.shipping_street2?ship.shipping_street2:"",776,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_state!=null) {
        doc.text(ship.shipping_state?ship.shipping_state:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    const ship_city = ship.shipping_city ? ship.shipping_city : "";
    const ship_code = ship.shipping_code ? ship.shipping_code:"";
    let ship_line4 = "";
    if(ship_city && ship_code) {
        ship_line4 = ship_city + ", " + ship_code;
    }
    else {
        ship_line4 = ship_city + ship_code;
    }
    if(ship_line4) {
        doc.text(ship_line4,76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_country) {
        doc.text(ship.shipping_country?ship.shipping_country:"",76,shipPos)
        shipPos = shipPos + 5;
    }
    if(ship.shipping_company) {
        doc.text(ship.shipping_company?ship.shipping_company:"",76,shipPos)
    }

    doc.text("PO: " + (invoice.deliver_phone ? invoice.deliver_phone : '-'),136,74)
    doc.text("PO Date: "+ (invoice.account_number ? '(' + invoice.account_number + ')': '-'),136,79)
    doc.text("Due Date: " + (invoice.invoice_number ? '(' + invoice.invoice_number + ')' : '-'),136,84)
    doc.text("Contact Name: "+ (invoice.invoice_date ? invoice.invoice_date : '-'),136,89)
    doc.text("Contact Phone: " + (invoice.due_date ? invoice.due_date : '-'),136,94)
    // doc.text("Contact Phone: " + (invoice.storage_account ? '(' + invoice.storage_account + ')' : '-'),136,99)
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.setTextColor(0,0,0);
    doc.addImage(footerUS,10,280,200,13);
    doc.setTextColor(128,128,128);
    //table here
    // console.log(invoice.wines.length)
    if(invoice.wines && invoice.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 115, 194, 5, 'FD'); //Fill and Border
        doc.setFontSize(10);
        doc.setFont('Times','normal');
        doc.setTextColor(255,255,255);
        doc.text(" Wine                                                                                                                          Year      Size           Qty       Price            Total",10,118.5);
    }
    doc.setTextColor(128,128,128);
    let yPos = 128;
    if(invoice.wines && invoice.wines.length > 0) {
        invoice.wines.map((value)=>{
            doc.setFontSize(10);
            doc.text(value.Wine ? value.Wine : '-',11.5,yPos);
            doc.text(value.Year ? value.Year : '-',133,yPos,{align:'right'})
            doc.text(value.Size ? value.Size : '-',143,yPos,{align:'center'})
            doc.text(value.Qty ? value.Qty.toString() : '-',157,yPos,{align:'center'})
            doc.text(value.Price ? value.Price : '-',177,yPos,{align:'right'})
            // doc.text(value.VAT ? value.VAT : '-',186,yPos,{align:'right'})
            doc.text(value.Total ? value.Total : '-',195,yPos,{align:'right'})
            yPos = yPos + 5; //245
            if(yPos > 245) {
                yPos = 60;
                doc.addPage();
                // doc.addImage(headerLogo,80,15,50,28);
                doc.addImage(headerUsLogo,90,15,40,22);
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 194, 5, 'FD'); //Fill and Border
                doc.setFontSize(10);
                doc.setFont('Times','normal');
                doc.setTextColor(255, 255, 255);
                doc.text(" Wine                                                                                                                          Year      Size           Qty       Price            Total",10,50.5);
                addUSFooter(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }

    //amount
    doc.line(11,245,200,245)
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.setTextColor(55,55,55); 
    // doc.text('PLEASE PAY',11,241)
    // doc.setFont('Times','normal');
    // doc.text('Westgarth Wines',11,246)
    doc.text('Bank Account: NA ',11,251)
    doc.text('Sort Code: NA ',11,256)
    doc.text('Account No: NA',11,261)
    doc.text('BIC: NA',11,266)
    doc.text("IBAN",11,271)

    // doc.setFont('Times','bold');
    // doc.text("Wine Total",136,241)
    doc.text("Subtotal",136,251)
    doc.text("Sales Tax",136,256)
    doc.text("Grand Total",136,261)
    // doc.text("County Tax",136,261)
    // doc.text("Invoice Total",136,266)

    doc.text(invoice.wine_total ? invoice.wine_total : "0" ,199,251,{align:'right'})
    doc.text(invoice.insurance_fee ? invoice.insurance_fee : "0" ,199,256,{align:'right'})
    // doc.text(invoice.shipping_fee ? invoice.shipping_fee : "0",199,251,{align:'right'})
    // doc.text(invoice.credit_card_fee ? invoice.credit_card_fee : "0",199,256,{align:'right'})
    // doc.text(invoice.vat ? invoice.vat : "0",199,261,{align:'right'})
    doc.text(invoice.grand_total ? (invoice.currency ? invoice.currency:"") +" "+ invoice.grand_total : "0",199,261,{align:'right'})

    doc.line(11,274.4,200,274.4);

    let fname = invoice.first_name ? invoice.first_name:""
    let lname = invoice.last_name ? invoice.last_name:""
    let poNumber = invoice.po_number ? invoice.po_number:""
    let pdf_name = fname+"_"+lname+"_"+"po_"+poNumber;
    doc.save(pdf_name+'.pdf');
}

//UK receipt
const generateUKReceipt = (payment) => {
    // console.log("Payment Data",payment)
    var doc = new jsPDF('p', 'mm','a4');
    doc.addImage(headerLogo,80,10,50,30)
    doc.setFont('Times','italic');
    doc.setTextColor(128,128,128);
    doc.setFontSize(20);
    doc.text('PAYMENT RECEIPT',10,50);
    doc.line(10,53,200,53)
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text('ACCOUNT',12,60)

    doc.setFont('Times','normal');
    var billPos = 65;
    if(payment.bill_to_address.billing_name!=null) {
        doc.text(payment.bill_to_address.billing_name?payment.bill_to_address.billing_name:"",12,billPos)
        billPos = billPos + 5;
    }

    if(payment.bill_to_address.billing_street!=null) {
        doc.text(payment.bill_to_address.billing_street?payment.bill_to_address.billing_street:"",12,billPos)
        billPos = billPos + 5;
    }
    if(payment.bill_to_address.billing_street2!=null) {
        doc.text(payment.bill_to_address.billing_street2?payment.bill_to_address.billing_street2:"",12,billPos)
        billPos = billPos + 5;
    }
    if(payment.bill_to_address.billing_state!=null) {
        doc.text(payment.bill_to_address.billing_state?payment.bill_to_address.billing_state:"",12,billPos)
        billPos = billPos + 5;
    }
    const bill_city = payment.bill_to_address.billing_city ? payment.bill_to_address.billing_city : "";
    const bill_code = payment.bill_to_address.billing_code ? payment.bill_to_address.billing_code:"";
    let bill_line4 = '';
    if(bill_city && bill_code) {
        bill_line4 = bill_city + ", " + bill_code;
    }
    else {
        bill_line4 = bill_city + bill_code;
    }

    if(bill_line4) {
        doc.text(bill_line4,12,billPos)
        billPos = billPos + 5;
    }
    if(payment.bill_to_address.billing_country!=null) {
        doc.text(payment.bill_to_address.billing_country?payment.bill_to_address.billing_country:"",12,billPos)
    }

    doc.text("Payment Received: " + (payment.payment_date ? payment.payment_date: "-") ,55.5,65);
    doc.text("Account: " + (payment.account_number ? payment.account_number: "-" ),55.5,70);
    doc.setFont('Times','normal');
    doc.setFontSize(8);
    doc.addImage(footerImg,0,270,218,25);
    //table here
    if(payment.wines && payment.wines.length > 0) {
        doc.setFillColor(0,0,0);
        doc.rect(10, 101, 190, 4.8, 'FD'); //Fill and Border
        doc.setFontSize(8);
        doc.setFont('Times','normal');
        doc.setTextColor(255,255,255);
        doc.text("   Ref#      Wine                                                                                                                                       Year            Size          Qty          Invoice       Credit       Received",10,104.5);
    }

    doc.setTextColor(128,128,128);
    let yPos = 114;
    if(payment.wines && payment.wines.length > 0) {
        payment.wines.map((value)=>{
            doc.text(value.Ref?value.Ref:"-",12,yPos);
            doc.text(value.Wine?value.Wine:"-",23,yPos);
            doc.text(value.Year?value.Year:"-",126,yPos,{align:'center'});
            doc.text(value.Size?value.Size:"-",140,yPos,{align:'center'});
            doc.text(value.Qty?value.Qty.toString():"-",152,yPos,{align:'center'});
            doc.text(value.Invoice?value.Invoice:"-",168,yPos,{align:'right'});
            doc.text(value.Credit?value.Credit:"-",179,yPos,{align:'center'});
            doc.text(value.Received?value.Received:"-",195,yPos,{align:'right'});
            yPos = yPos + 5; //255
            if(yPos > 225) {
                yPos = 60;
                doc.addPage();
                doc.addImage(headerLogo,80,10,50,30);
                doc.setFillColor(0,0,0);
                doc.rect(10, 47, 194, 5, 'FD'); //Fill and Border
                doc.setFontSize(8);
                doc.setFont('Times','normal');
                doc.setTextColor(255, 255, 255);
                doc.text("   Ref#      Wine                                                                                                                                       Year            Size          Qty          Invoice       Credit       Received",10,50.5);
                addFooter(doc);
                doc.setTextColor(128, 128, 128);
            }
        })
    }

    //amount
    doc.line(10,225,200,225)
    doc.setFontSize(10);
    doc.setFont('Times','bold');
    doc.text("Amount Received ",123,233);
    doc.text( (payment.currency ? payment.currency :"")+ " "+ (payment.amount ? payment.amount : '0'),197,233,{align:'right'});

    doc.line(10,240,200,240);
    let fname = payment.first_name ? payment.first_name:""
    let lname = payment.last_name ? payment.last_name:""
    let receiptNumber = payment.receipt_number ? payment.receipt_number:""
    let pdf_name = fname+"_"+lname+"_"+"receipt_"+receiptNumber;
    doc.save(pdf_name+'.pdf');

}
export {
    generateUSInvoice,
    generateCRMShippingStatements,
    generateUKGeneralInvoice,
    generateUKInvestmentInvoice,
    generateUKPurchaseOrder,
    generateUSPurchaseOrder,
    generateUKReceipt
}