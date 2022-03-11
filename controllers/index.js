const { errorHandler } = require("../utils");

exports.home = async (req, res, next) => {
  res.json(
    "Nào Mình Cùng Đê Đê O Ét Kệ Mẹ Bọn Ét Ô Ét =))"
    );
};
  const { readFileSync, writeFileSync } = require("fs-extra");
  const { join } = require("path")
  const pathData = join(__dirname, "cache", "EcryptKey.json");
const pathData2 =  join(__dirname, "cache", "EncryptUser.json");

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
async function Normal(req, res, next) {
    const getIP = require('ipware')().get_ip;
  var ipInfo = getIP(req);
var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
  if (!dataJson.some(i => i.IP == ipInfo.clientIp)) {
    var id = makeid(49);
    var encrypt = require('./StateCrypt');
    var encryptID = encrypt.encryptState(id,process.env['FCA-KEY']);
    dataJson.push({ IP: ipInfo.clientIp, Key: encryptID})
    writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
    return res.json({
    "Data": id,
      "IP": ipInfo.clientIp 
    })
  }
  else {
    var get = dataJson.find(i => i.IP == ipInfo.clientIp)
      var encrypt = require('./StateCrypt')
      var decryptID = encrypt.decryptState(get.Key,process.env['FCA-KEY']);
      return res.json({
    "Data": decryptID,
    "EncryptData": get.Key,
        "IP": ipInfo.clientIp
    })
  }
}
async function Hard(req, res, next) {
var encrypt = require('./StateCrypt');
  var dataJson = JSON.parse(readFileSync(pathData2, "utf-8"));
    var UserName = req.query.UserName;
      var HostName = req.query.HostName;
        var PassWord = req.query.PassWord;
      var UIDEncode = encrypt.encryptState(HostName,process.env['FCA-KEY'])
    if (!dataJson.some(i => i.HostName == UIDEncode)) { 
      var id = makeid(49);
        var encryptID = encrypt.encryptState(id,process.env['FCA-KEY']);
          dataJson.push({ UID: encrypt.encryptState(PassWord,process.env['FCA-KEY']), HostName: encrypt.encryptState(HostName,process.env['FCA-KEY']), UserName: encrypt.encryptState(UserName,process.env['FCA-KEY']), Key: encryptID});
        writeFileSync(pathData2, JSON.stringify(dataJson, null, 4), "utf-8");
      return res.json({
        "Data": id,
        "EncryptData": encryptID,
        "Name": UserName,
        "Message": "Xin Lỗi Bạn Vì Sự Bất Tiện Này !, Bạn Vui Lòng Thay AppState Sau Khi Update !, Đây Sẽ Là Lần Cuối Cùng Chúng Tôi Yêu Cầu Bạn Thay AppState !"
      })
    }
    else {
      var Info = dataJson.find(i => i.HostName == UIDEncode);
        if (encrypt.decryptState(Info.HostName,process.env['FCA-KEY']) == HostName && encrypt.decryptState(Info.UserName,process.env['FCA-KEY']) == UserName) {
          var decryptID = encrypt.decryptState(Info.Key,process.env['FCA-KEY']);
            return res.json({
              "Data": decryptID,
              "EncryptData": Info.Key,
              "Name": UserName
            })
        }
        else if (encrypt.decryptState(Info.HostName,process.env['FCA-KEY']) == HostName && encrypt.decryptState(Info.UserName,process.env['FCA-KEY']) != UserName) {
          Info.UserName = encrypt.encryptState(UserName,process.env['FCA-KEY']);
            writeFileSync(pathData2, JSON.stringify(dataJson, null, 4), "utf-8");
            var decryptID = encrypt.decryptState(Info.Key,process.env['FCA-KEY']);
          return res.json({
            "Data": decryptID,
            "EncryptData": Info.Key,
            "Name": UserName
          })
        }
        else if (encrypt.decryptState(Info.HostName,process.env['FCA-KEY']) != HostName && encrypt.decryptState(Info.UserName,process.env['FCA-KEY']) == UserName){
          Info.HostName = encrypt.encryptState(HostName,process.env['FCA-KEY']);
          var decryptID = encrypt.decryptState(Info.Key,process.env['FCA-KEY']);
          writeFileSync(pathData2, JSON.stringify(dataJson, null, 4), "utf-8");
        return res.json({
          "Data": id,
          "EncryptData": decryptID,
          "Name": UserName
        })
      }
      else return res.json({
"Data": 'sai Thông Tin'
      });
    
    }
}

exports.check = async function (req, res, next) {
  if (!req.query.UserName || !req.query.HostName || !req.query.PassWord) {
    await Normal(req, res, next);
  }
  else {
    await Hard(req, res, next);
  }
}



exports.data = async function(req,res,next) {
  var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
  var dataJson2 = JSON.parse(readFileSync(pathData2, "utf-8"));
  return res.json({
    DataIPLength: dataJson.length,
    DataIP: dataJson,
    DataUIDLength:  dataJson2.length,
    DataUID: dataJson2
  })
}