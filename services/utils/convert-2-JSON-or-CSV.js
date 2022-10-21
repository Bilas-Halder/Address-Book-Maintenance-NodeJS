const json2csv = require("json2csv").parse;
const csv2json = require("csvtojson");
const fs = require("fs");

const convertJson2Csv = ({data = [], fields = [], path = "./fileName.csv"}) => {
    const csv = json2csv(data, {fields: fields});
    fs.writeFileSync(path, csv);

    return path;
};

const convertCsv2Json = async (path) => {
    const jsonArray = await csv2json().fromFile(path);
    return jsonArray;
};

module.exports = {
    convertJson2Csv,
    convertCsv2Json,
};
