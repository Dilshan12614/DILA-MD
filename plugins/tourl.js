const axios = require("axios");
const { cmd } = require("../command");

cmd({
  'pattern': "tourl",
  'alias': ["imgtourl", "img2url", "url"],
  'react': '🖇',
  'desc': "Convert an image to a URL using imgbb.",
  'category': "utility",
  'use': ".tourl",
  'filename': __filename
}, async (_0x2a615f, _0x296ebb, _0x131287, _0x46c0dd) => {
  const { from: _0x462e92, quoted: _0x38fbf1, reply: _0x74c833, sender: _0x5931e7 } = _0x46c0dd;
  try {
    // ---- බටන් වලින් එන මැසේජ් සහ සාමාන්‍ය මැසේජ් දෙකම හඳුනාගැනීමේ කොටස ----
    const type = Object.keys(_0x296ebb.message || {});
    let _0x2fc0f4 = _0x296ebb.quoted ? _0x296ebb.quoted : _0x296ebb;
    
    // බටන් එකක් එබූ විට, ඊට අදාළ මුල් මැසේජ් එකේ (Context) ඇති පින්තූරය හඳුනාගැනීම
    if (type === 'buttonsResponseMessage' || type === 'templateButtonReplyMessage') {
      const contextInfo = _0x296ebb.message[type]?.contextInfo;
      if (contextInfo?.quotedMessage && contextInfo.quotedMessage.imageMessage) {
        _0x2fc0f4 = { msg: contextInfo.quotedMessage.imageMessage, download: () => _0x2a615f.downloadMediaMessage({ message: contextInfo.quotedMessage }) };
      }
    }
    // ----------------------------------------------------------------

    const _0x4dd0ec = (_0x2fc0f4.msg || _0x2fc0f4).mimetype || '';
    
    console.log("Image mime type: ", _0x4dd0ec);

    if (!_0x4dd0ec || !_0x4dd0ec.startsWith("image")) {
      throw "🌻 Please reply to an image.";
    }

    // 1. පින්තූරය Buffer එකක් ලෙස බාගත කිරීම
    const _0x227cf8 = await _0x2fc0f4.download();
    
    // 2. එය ImgBB වෙත යැවීමට සුදුසු Base64 කේතයක් බවට හැරවීම
    const base64Image = _0x227cf8.toString('base64');

    // ඔබ ලබාදුන් නවතම සක්‍රීය API Key එක
    const apiKey = "039d17094c870b8147d2688d957c4b56"; 
    const targetUrl = "https://api.imgbb.com/1/upload?key=" + apiKey;
    
    // 3. Axios හරහා පින්තූර දත්ත ආරක්ෂිතව යැවීම
    const _0x338f64 = await axios({
      method: 'post',
      url: targetUrl,
      data: {
        image: base64Image
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
      }]
    });

    console.log("API Response:", _0x338f64.data);

    if (!_0x338f64.data || !_0x338f64.data.data || !_0x338f64.data.data.url) {
      throw "❌ Failed to upload the file.";
    }

    const _0x2b12b1 = _0x338f64.data.data.url;

    const _0x273817 = {
      'mentionedJid': [_0x5931e7],
      'forwardingScore': 0x3e7,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': '120363292876277898@newsletter',
        'newsletterName': "𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃",
        'serverMessageId': 0x8f
      }
    };

    // සාර්ථක ප්‍රතිඵලය DENETH-MD නමින් පරිශීලකයා වෙත යැවීම
        // සාර්ථක ප්‍රතිඵලය බටන් එකක් (URL Button) සමඟ DENETH-MD නමින් යැවීම
    await _0x2a615f.sendMessage(_0x462e92, {
      'text': `*Image Uploaded Successfully 📸*\nSize: ${_0x227cf8.length} Byte(s)\n\n> ⚖️ Uploaded via 𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃`,
      'contextInfo': _0x273817,
      'buttons': [
        {
          'buttonId': 'action',
          'buttonText': { 'displayText': '🌐 View Image URL' },
          'type': 4,
          'nativeFlowInfo': {
            'buttons': [
              {
                'name': 'cta_url',
                'buttonParamsJson': JSON.stringify({
                  'display_text': '🌐 View Image',
                  'url': _0x2b12b1,
                  'merchant_url': _0x2b12b1
                })
              }
            ]
          }
        }
      ],
      'viewOnce': true
    });
